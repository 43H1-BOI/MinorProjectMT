import React, { useState, useEffect } from 'react';
import { getVisualizations } from '../services/api';

const Visualizations = ({ dataUploaded }) => {
  const [visualizations, setVisualizations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (dataUploaded) {
      loadVisualizations();
    }
  }, [dataUploaded]);

  const loadVisualizations = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getVisualizations();
      setVisualizations(response.visualizations);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error loading visualizations');
    } finally {
      setLoading(false);
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
        <p className="text-gray-600">Upload data to view visualizations</p>
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
        <p className="mt-4 text-gray-600">Generating visualizations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-700 flex-1">{error}</p>
        </div>
        <button
          onClick={loadVisualizations}
          className="mt-4 btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!visualizations) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {visualizations.scatter && (
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Scatter Plot</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <img
                src={visualizations.scatter}
                alt="Scatter Plot"
                className="w-full rounded-lg"
              />
            </div>
          </div>
        )}

        {visualizations.boxplot && (
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Box Plot</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <img
                src={visualizations.boxplot}
                alt="Box Plot"
                className="w-full rounded-lg"
              />
            </div>
          </div>
        )}

        {visualizations.histogram && (
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Histogram</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <img
                src={visualizations.histogram}
                alt="Histogram"
                className="w-full rounded-lg"
              />
            </div>
          </div>
        )}

        {visualizations.heatmap && (
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Correlation Heatmap</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <img
                src={visualizations.heatmap}
                alt="Heatmap"
                className="w-full rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={loadVisualizations}
          className="btn-secondary flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh Visualizations</span>
        </button>
      </div>
    </div>
  );
};

export default Visualizations;
