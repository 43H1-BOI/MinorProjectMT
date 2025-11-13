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
      <div className="card p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p className="text-gray-600">Upload data to view insights</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card p-8 text-center">
        <div className="mx-auto w-12 h-12">
          <svg className="animate-spin text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="mt-4 text-gray-600">Loading insights...</p>
      </div>
    );
  }

  if (error && !insights) {
    return (
      <div className="card p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        {insights && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">Average Salary</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${insights.average_salary.toFixed(2)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-2">Median Salary</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${insights.median_salary.toFixed(2)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <p className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-2">Total Employees</p>
                <p className="text-3xl font-bold text-gray-900">
                  {insights.total_employees}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-sm font-semibold mb-5 text-gray-900">Salary Percentiles</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Object.entries(insights.percentiles).map(([percentile, value]) => (
                  <div key={percentile} className="text-center">
                    <p className="text-xs text-gray-600 mb-1">{percentile} Percentile</p>
                    <p className="text-xl font-bold text-gray-900">${value.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {insights.salary_by_experience && Object.keys(insights.salary_by_experience).length > 0 && (
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-sm font-semibold mb-5 text-gray-900">
                  Average Salary by Experience Level
                </h3>
                <div className="space-y-4">
                  {Object.entries(insights.salary_by_experience).map(([exp, salary]) => (
                    <div key={exp} className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 w-36">{exp}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-3 mx-4">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${(salary / Math.max(...Object.values(insights.salary_by_experience))) * 100}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-24 text-right">
                        ${salary.toFixed(0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="card p-6">
        <h3 className="text-sm font-semibold mb-4 text-gray-900">Salary Benchmark</h3>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="number"
            step="0.1"
            min="0"
            value={benchmarkExp}
            onChange={(e) => setBenchmarkExp(e.target.value)}
            className="flex-1 input-field"
            placeholder="Enter years of experience"
          />
          <button
            onClick={handleBenchmark}
            className="btn-primary whitespace-nowrap"
          >
            Get Benchmark
          </button>
        </div>

        {benchmark && (
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
            <h4 className="text-sm font-semibold mb-4 text-gray-900">
              Benchmark for {benchmark.experience} years of experience
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Average</p>
                <p className="text-lg font-bold text-gray-900">
                  ${benchmark.average_salary.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Median</p>
                <p className="text-lg font-bold text-gray-900">
                  ${benchmark.median_salary.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Min</p>
                <p className="text-lg font-bold text-gray-900">
                  ${benchmark.min_salary.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Max</p>
                <p className="text-lg font-bold text-gray-900">
                  ${benchmark.max_salary.toFixed(2)}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-4">
              Based on {benchmark.sample_size} employees
            </p>
          </div>
        )}
      </div>

      <div className="card p-6">
        <h3 className="text-sm font-semibold mb-4 text-gray-900">Export & Download</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportReportCSV}
            className="btn-secondary flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export CSV</span>
          </button>
          <button
            onClick={exportReportExcel}
            className="btn-secondary flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export Excel</span>
          </button>
          <button
            onClick={downloadModel}
            className="btn-secondary flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download Model</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Insights;
