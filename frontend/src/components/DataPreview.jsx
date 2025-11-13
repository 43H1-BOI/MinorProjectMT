import React from 'react';

const DataPreview = ({ data }) => {
  if (!data) return null;

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Data Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Rows</p>
          <p className="text-3xl font-bold text-blue-600">{data.rows}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Columns</p>
          <p className="text-3xl font-bold text-green-600">{data.columns}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Status</p>
          <p className="text-xl font-bold text-purple-600">Ready</p>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Columns</h3>
        <div className="flex flex-wrap gap-2">
          {data.column_names.map((col, idx) => (
            <span
              key={idx}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              {col}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Data Preview</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {data.column_names.map((col, idx) => (
                  <th
                    key={idx}
                    className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.preview.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {data.column_names.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className="border border-gray-300 px-4 py-2 text-sm text-gray-600"
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
