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
      <div className="w-full bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">Upload data to view visualizations</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg shadow-md p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Generating visualizations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-lg shadow-md p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
        <button
          onClick={loadVisualizations}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
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
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Data Visualizations</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visualizations.scatter && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Scatter Plot</h3>
            <img
              src={visualizations.scatter}
              alt="Scatter Plot"
              className="w-full rounded-lg"
            />
          </div>
        )}

        {visualizations.boxplot && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Box Plot</h3>
            <img
              src={visualizations.boxplot}
              alt="Box Plot"
              className="w-full rounded-lg"
            />
          </div>
        )}

        {visualizations.histogram && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Histogram</h3>
            <img
              src={visualizations.histogram}
              alt="Histogram"
              className="w-full rounded-lg"
            />
          </div>
        )}

        {visualizations.heatmap && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Correlation Heatmap</h3>
            <img
              src={visualizations.heatmap}
              alt="Heatmap"
              className="w-full rounded-lg"
            />
          </div>
        )}
      </div>

      <button
        onClick={loadVisualizations}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Refresh Visualizations
      </button>
    </div>
  );
};

export default Visualizations;
