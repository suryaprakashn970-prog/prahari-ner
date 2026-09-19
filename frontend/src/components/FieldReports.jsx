import React from 'react';
import { FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function FieldReports({ reports }) {
  if (!reports || reports.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Field Reports</h2>
        <div className="text-sm text-gray-500 text-center">No field reports available.</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-full">
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
        <FileText className="w-4 h-4 text-blue-500" />
        Recent Field Reports
      </h2>
      
      <div className="flex flex-col gap-3">
        {reports.slice(0, 5).map(report => (
          <div key={report.id} className="p-3 bg-gray-50 rounded border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-bold text-sm text-gray-800">{report.location}</div>
                <div className="text-xs text-gray-500">{new Date(report.created_at).toLocaleDateString()}</div>
              </div>
              <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                report.status === 'Verified' ? 'bg-green-100 text-green-700' :
                report.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {report.status === 'Verified' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                {report.status}
              </span>
            </div>
            
            <div className="text-xs font-semibold text-gray-700 mb-1">{report.report_type}</div>
            <p className="text-sm text-gray-600 line-clamp-2">{report.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
