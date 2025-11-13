import React from 'react';

const DataPreview = ({ data }) => {
  if (!data) return null;

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Data Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">Total Rows</p>
          <p className="text-3xl font-bold text-gray-900">{data.rows}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
          <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-2">Columns</p>
          <p className="text-3xl font-bold text-gray-900">{data.columns}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200">
          <p className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-2">Status</p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-xl font-semibold text-gray-900">Ready</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Dataset Columns</h4>
        <div className="flex flex-wrap gap-2">
          {data.column_names.map((col, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200"
            >
              {col}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Sample Data</h4>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {data.column_names.map((col, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.preview.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  {data.column_names.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className="px-4 py-3 text-sm text-gray-700"
                    >
                      {row[col] !== null && row[col] !== undefined ? row[col] : 'N/A'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataPreview;
