import React, { useState, useEffect } from 'react';
import { getInsightsSummary, getSalaryBenchmark, exportReportCSV, exportReportExcel, downloadModel } from '../services/api';

const Insights = ({ dataUploaded }) => {
  const [insights, setInsights] = useState(null);
  const [benchmark, setBenchmark] = useState(null);
  const [benchmarkExp, setBenchmarkExp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (dataUploaded) {
      loadInsights();
    }
  }, [dataUploaded]);

  const loadInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getInsightsSummary();
      setInsights(response);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error loading insights');
    } finally {
      setLoading(false);
    }
  };

  const handleBenchmark = async () => {
    if (!benchmarkExp) {
      return;
    }

    try {
      const response = await getSalaryBenchmark(benchmarkExp);
      setBenchmark(response);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error getting benchmark');
    }
  };

  if (!dataUploaded) {
    return (
      <div className="w-full bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">Upload data to view insights</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg shadow-md p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading insights...</p>
      </div>
    );
  }

  if (error && !insights) {
    return (
      <div className="w-full bg-white rounded-lg shadow-md p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">HR Insights</h2>

        {insights && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Average Salary</p>
                <p className="text-3xl font-bold text-blue-600">
                  ${insights.average_salary.toFixed(2)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Median Salary</p>
                <p className="text-3xl font-bold text-green-600">
                  ${insights.median_salary.toFixed(2)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Employees</p>
                <p className="text-3xl font-bold text-purple-600">
                  {insights.total_employees}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Salary Percentiles</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(insights.percentiles).map(([percentile, value]) => (
                  <div key={percentile} className="text-center">
                    <p className="text-sm text-gray-600">{percentile} Percentile</p>
                    <p className="text-xl font-bold text-gray-800">${value.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {insights.salary_by_experience && Object.keys(insights.salary_by_experience).length > 0 && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Average Salary by Experience
                </h3>
                <div className="space-y-3">
                  {Object.entries(insights.salary_by_experience).map(([exp, salary]) => (
                    <div key={exp} className="flex items-center">
                      <span className="text-sm text-gray-700 w-32">{exp}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-6 mx-3">
                        <div
                          className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                          style={{
                            width: `${(salary / Math.max(...Object.values(insights.salary_by_experience))) * 100}%`
                          }}
                        >
                          <span className="text-xs text-white font-semibold">
                            ${salary.toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Salary Benchmark</h3>
        <div className="flex space-x-2 mb-4">
          <input
            type="number"
            step="0.1"
            min="0"
            value={benchmarkExp}
            onChange={(e) => setBenchmarkExp(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter years of experience"
          />
          <button
            onClick={handleBenchmark}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Benchmark
          </button>
        </div>

        {benchmark && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
            <h4 className="font-semibold mb-3 text-gray-800">
              Benchmark for {benchmark.experience} years of experience
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-600">Average</p>
                <p className="text-lg font-bold text-purple-600">
                  ${benchmark.average_salary.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Median</p>
                <p className="text-lg font-bold text-purple-600">
                  ${benchmark.median_salary.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Min</p>
                <p className="text-lg font-bold text-purple-600">
                  ${benchmark.min_salary.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Max</p>
                <p className="text-lg font-bold text-purple-600">
                  ${benchmark.max_salary.toFixed(2)}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-3">
              Based on {benchmark.sample_size} employees
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Export & Download</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportReportCSV}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            📄 Export Report (CSV)
          </button>
          <button
            onClick={exportReportExcel}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            📊 Export Report (Excel)
          </button>
          <button
            onClick={downloadModel}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            🤖 Download Model
          </button>
        </div>
      </div>
    </div>
  );
};

export default Insights;
