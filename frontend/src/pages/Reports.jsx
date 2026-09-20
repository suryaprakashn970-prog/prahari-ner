import React, { useState, useEffect, useCallback } from "react";
import PageLayout from "../components/PageLayout";
import FieldReports from "../components/FieldReports";
import api, { API_URL } from "../services/api";
import LoadingState from "../components/LoadingState";
import { useLanguage } from "../context/LanguageContext";

// ── NER State → District map ─────────────────────────────────
const STATE_DISTRICTS = {
  "Arunachal Pradesh": [
    "Anjaw","Capital Complex Itanagar","Changlang","Dibang Valley","East Kameng",
    "East Siang","Kamle","Kra Daadi","Kurung Kumey","Lepa Rada","Lohit",
    "Longding","Lower Dibang Valley","Lower Siang","Lower Subansiri","Namsai",
    "Pakke-Kessang","Papum Pare","Shi-Yomi","Siang","Tawang","Tirap",
    "Upper Siang","Upper Subansiri","West Kameng","West Siang",
  ],
  "Assam": [
    "Baksa","Barpeta","Biswanath","Bongaigaon","Cachar","Charaideo","Chirang",
    "Darrang","Dhemaji","Dhubri","Dibrugarh","Dima Hasao","Goalpara","Golaghat",
    "Hailakandi","Hojai","Jorhat","Kamrup","Kamrup Metropolitan","Karbi Anglong",
    "Karimganj","Kokrajhar","Lakhimpur","Majuli","Morigaon","Nagaon","Nalbari",
    "Sivasagar","Sonitpur","South Salmara-Mankachar","Tinsukia","Udalguri",
    "West Karbi Anglong",
  ],
  "Manipur": [
    "Bishnupur","Chandel","Churachandpur","Imphal East","Imphal West","Jiribam",
    "Kakching","Kamjong","Kangpokpi","Noney","Pherzawl","Senapati","Tamenglong",
    "Tengnoupal","Thoubal","Ukhrul",
  ],
  "Meghalaya": [
    "East Garo Hills","East Jaintia Hills","East Khasi Hills",
    "Eastern West Khasi Hills","North Garo Hills","Ri Bhoi","South Garo Hills",
    "South West Garo Hills","South West Khasi Hills","West Garo Hills",
    "West Jaintia Hills","West Khasi Hills",
  ],
  "Mizoram": [
    "Aizawl","Champhai","Hnahthial","Khawzawl","Kolasib","Lawngtlai",
    "Lunglei","Mamit","Saiha","Saitual","Serchhip",
  ],
  "Nagaland": [
    "Chumoukedima","Dimapur","Kiphire","Kohima","Longleng","Mokokchung",
    "Mon","Niuland","Noklak","Peren","Phek","Shamator","Tseminyu",
    "Tuensang","Wokha","Zunheboto",
  ],
  "Sikkim": [
    "East Sikkim","North Sikkim","Pakyong","Soreng","South Sikkim","West Sikkim",
  ],
  "Tripura": [
    "Dhalai","Gomati","Khowai","North Tripura","Sepahijala",
    "South Tripura","Unakoti","West Tripura",
  ],
};
const STATES = Object.keys(STATE_DISTRICTS);

function format422Detail(detail) {
  if (!detail) return "Validation failed.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((e) => `${(e.loc || []).filter((l) => l !== "body").join(".")}: ${e.msg}`)
      .join(" | ");
  }
  return JSON.stringify(detail);
}

function FieldError({ msg }) {
  if (!msg) return null;
  return <p style={{ color: "#dc2626", fontSize: 12, marginTop: 3 }}>{msg}</p>;
}

// ── GPS status indicator ─────────────────────────────────────
function GpsStatus({ status, coords, t }) {
  if (status === "acquired")
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 10px", borderRadius: 6, background: "#d1fae5", border: "1px solid #6ee7b7", fontSize: 12, color: "#065f46", marginTop: 6 }}>
        <span>📍</span>
        <span>{t('reports.gpsAcquired', 'GPS acquired — coordinates will be stored for mapping')} ({coords.lat?.toFixed(4)}, {coords.lng?.toFixed(4)})</span>
      </div>
    );
  if (status === "denied")
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 10px", borderRadius: 6, background: "#fef9c3", border: "1px solid #fde047", fontSize: 12, color: "#854d0e", marginTop: 6 }}>
        <span>⚠️</span>
        <span>{t('reports.gpsDenied', 'Location permission denied — report will still be submitted using State + District.')}</span>
      </div>
    );
  if (status === "loading")
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 10px", borderRadius: 6, background: "#eff6ff", border: "1px solid #bfdbfe", fontSize: 12, color: "#1e40af", marginTop: 6 }}>
        <span>⏳</span>
        <span>{t('reports.detectingLocation', 'Detecting your location…')}</span>
      </div>
    );
  return null;
}

// ── Main component ───────────────────────────────────────────
export default function Reports() {
  const { t } = useLanguage();
  const [reports, setReports]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Location fields
  const [state, setState]       = useState("");
  const [district, setDistrict] = useState("");
  const [location, setLocation] = useState("");

  // GPS (optional — never shown as a text input to user)
  const [gpsCoords, setGpsCoords] = useState(null);   // {lat, lng} or null
  const [gpsStatus, setGpsStatus] = useState("idle"); // idle | loading | acquired | denied

  // Report fields
  const [reportType, setReportType]   = useState("Landslide");
  const [description, setDescription] = useState("");
  const [image, setImage]             = useState(""); // base64 string
  const [reporterId, setReporterId]   = useState("field_agent");

  // Districts update when state changes
  const districts = state ? STATE_DISTRICTS[state] || [] : [];

  function handleStateChange(e) {
    setState(e.target.value);
    setDistrict(""); // reset district when state changes
  }

  // ── Geolocation ──────────────────────────────────────────
  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsStatus("denied");
      return;
    }
    setGpsStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsStatus("acquired");
      },
      (_err) => {
        setGpsCoords(null);
        setGpsStatus("denied");
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  // ── Data fetching ────────────────────────────────────────
  const fetchReports = useCallback(() => {
    setLoading(true);
    api.getReports()
      .then((res) => setReports(res))
      .catch((err) => console.error("Failed to fetch reports", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  // ── Validation ───────────────────────────────────────────
  const validateForm = () => {
    const errors = {};
    if (!state)               errors.state       = t('reports.validation.stateRequired', "State is required.");
    if (!district)            errors.district    = t('reports.validation.districtRequired', "District is required.");
    if (!location.trim())     errors.location    = t('reports.validation.locationRequired', "Location / Village / Road name is required.");
    if (!reportType.trim())  errors.report_type = t('reports.validation.reportTypeRequired', "Report type is required.");
    if (!reporterId.trim())  errors.reporter_id = t('reports.validation.reporterIdRequired', "Reporter ID is required.");
    return errors;
  };

  // ── Submit ───────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess(false);

    const errors = validateForm();
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    setFieldErrors({});

    const payload = {
      state,
      district,
      location:    location.trim(),
      latitude:    gpsCoords ? gpsCoords.lat : null,
      longitude:   gpsCoords ? gpsCoords.lng : null,
      report_type: reportType,
      description: description.trim(),
      image:       image || null,
      reporter_id: reporterId.trim(),
    };

    setSubmitting(true);
    try {
      await api.createReport(payload);
      setSubmitSuccess(true);
      setState(""); setDistrict(""); setLocation("");
      setGpsCoords(null); setGpsStatus("idle");
      setReportType("Landslide"); setDescription(""); setImage(""); setReporterId("field_agent");
      fetchReports();
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error("Report submission error:", err);
      if (err.response) {
        const { status, data } = err.response;
        const detail = data?.detail;
        if (status === 422) setSubmitError(`Validation failed: ${format422Detail(detail)}`);
        else if (status === 500) setSubmitError("Server error (500). Check FastAPI logs.");
        else setSubmitError(`Submission failed (HTTP ${status}): ${format422Detail(detail)}`);
      } else if (err.request) {
        setSubmitError(t('errors.backendUnavailable', `Cannot reach backend at ${API_URL}. Please ensure the server is online.`));
      } else {
        setSubmitError(`Unexpected error: ${err.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImage("");
    }
  };

  return (
    <PageLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Form ─────────────────────────────────────────── */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-1">
            {t('reports.submitFieldReport', 'Submit Field Report')}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {t('reports.submitSub', 'Report a landslide, road blockage, or hazard. No technical knowledge required.')}
          </p>

          {submitSuccess && (
            <div style={{ background: "#d1fae5", border: "1px solid #6ee7b7", borderRadius: 6, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#065f46", fontWeight: 600 }}>
              {t('reports.submittedSuccessfully', '✓ Report submitted and saved successfully. It will appear in the list below.')}
            </div>
          )}
          {submitError && (
            <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 6, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#991b1b" }}>
              ⚠ {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* ── State ────────────────────────────────────── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reports.state', 'State')} <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <select value={state} onChange={handleStateChange} className={inputCls}>
                <option value="">{t('reports.selectState', '— Select State —')}</option>
                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <FieldError msg={fieldErrors.state} />
            </div>

            {/* ── District ─────────────────────────────────── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reports.district', 'District')} <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <select value={district} onChange={(e) => setDistrict(e.target.value)} className={inputCls} disabled={!state}>
                <option value="">
                  {state ? t('reports.selectDistrict', '— Select District —') : t('reports.selectStateFirst', '— Select a state first —')}
                </option>
                {districts.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <FieldError msg={fieldErrors.district} />
            </div>

            {/* ── Location / Village / Road ─────────────────── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reports.location', 'Location / Village / Road Name')} <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={inputCls}
                placeholder={t('reports.locationPlaceholder', 'e.g. NH-15 near Bomdila')}
              />
              <FieldError msg={fieldErrors.location} />
            </div>

            {/* ── GPS (optional) ────────────────────────────── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reports.gpsCoordinates', 'GPS Coordinates')}{" "}
                <span style={{ fontWeight: 400, color: "#6b7280", fontSize: 11 }}>
                  {t('reports.gpsOptional', '(optional — improves map accuracy)')}
                </span>
              </label>
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={gpsStatus === "loading" || gpsStatus === "acquired"}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600,
                  cursor: gpsStatus === "loading" || gpsStatus === "acquired" ? "not-allowed" : "pointer",
                  opacity: gpsStatus === "acquired" ? 0.7 : 1,
                  background: gpsStatus === "acquired" ? "#d1fae5" : "#eff6ff",
                  border: gpsStatus === "acquired" ? "1px solid #6ee7b7" : "1px solid #bfdbfe",
                  color: gpsStatus === "acquired" ? "#065f46" : "#1d4ed8",
                }}
              >
                {gpsStatus === "loading"
                  ? t('reports.detectingLocation', '⏳ Detecting…')
                  : gpsStatus === "acquired"
                  ? t('reports.locationAcquired', '📍 Location Acquired')
                  : t('reports.useMyLocation', '📍 Use My Location')}
              </button>
              <GpsStatus status={gpsStatus} coords={gpsCoords || {}} t={t} />
            </div>

            {/* ── Report Type ───────────────────────────────── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reports.hazardType', 'Type of Hazard')} <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <select value={reportType} onChange={(e) => setReportType(e.target.value)} className={inputCls}>
                <option value="Landslide">{t('reports.hazards.landslide', '🏔 Landslide')}</option>
                <option value="Road Blockage">{t('reports.hazards.roadBlockage', '🚧 Road Blockage')}</option>
                <option value="Crack">{t('reports.hazards.crack', '🪨 Slope / Ground Crack')}</option>
                <option value="Flooding">{t('reports.hazards.flooding', '🌊 Flooding')}</option>
                <option value="Debris Flow">{t('reports.hazards.debrisFlow', '⚠️ Debris / Mud Flow')}</option>
                <option value="Other">{t('reports.hazards.other', '📋 Other')}</option>
              </select>
              <FieldError msg={fieldErrors.report_type} />
            </div>

            {/* ── Description ──────────────────────────────── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reports.description', 'What did you observe?')} <span style={{ fontWeight: 400, color: "#6b7280", fontSize: 11 }}>(optional)</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={inputCls}
                placeholder={t('reports.descriptionPlaceholder', 'Describe what you saw — e.g. large cracks on slope above NH-13, soil movement, trees tilting, road partially blocked...')}
              />
              <FieldError msg={fieldErrors.description} />
            </div>

            {/* ── Image (optional) ─────────────────────────── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reports.image', 'Photo / Image')} <span style={{ fontWeight: 400, color: "#6b7280", fontSize: 11 }}>(optional)</span>
              </label>
              <input
                type="file"
                accept="image/jpeg, image/png, image/webp"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {image && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">{t('reports.imagePreview', 'Preview:')}</p>
                  <img src={image} alt="Preview" className="h-32 object-cover rounded border border-gray-200" />
                </div>
              )}
            </div>

            {/* ── Reporter ID ───────────────────────────────── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reports.reporterId', 'Your Name / Officer ID')} <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                type="text"
                value={reporterId}
                onChange={(e) => setReporterId(e.target.value)}
                className={inputCls}
                placeholder={t('reports.reporterIdPlaceholder', 'e.g. Rajan Tashi or officer_arunachal_04')}
              />
              <FieldError msg={fieldErrors.reporter_id} />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded hover:bg-blue-700 disabled:opacity-50 text-sm cursor-pointer shadow-xs transition-colors"
            >
              {submitting ? t('reports.submittingReport', 'Submitting Report…') : t('reports.submitReport', 'Submit Report')}
            </button>

          </form>
        </div>

        {/* ── Reports List ─────────────────────────────────── */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            {t('reports.submittedReportsTitle', 'Submitted Reports')}
            <span style={{ fontSize: 13, fontWeight: 400, color: "#6b7280", marginLeft: 8 }}>
              ({reports.length} {t('reports.total', 'total')})
            </span>
          </h2>
          {loading ? <LoadingState message={t('loading.reports', 'Loading reports...')} /> : <FieldReports reports={reports} />}
        </div>

      </div>
    </PageLayout>
  );
}
