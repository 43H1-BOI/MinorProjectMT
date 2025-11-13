import React, { useState, useEffect } from 'react';
import { trainModel, getAlgorithms } from '../services/api';

const ModelTraining = ({ dataUploaded, onTrainSuccess }) => {
  const [algorithms, setAlgorithms] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('linear');
  const [testSize, setTestSize] = useState(0.2);
  const [training, setTraining] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadAlgorithms();
  }, []);

  const loadAlgorithms = async () => {
    try {
      const response = await getAlgorithms();
      setAlgorithms(response.algorithms);
    } catch (err) {
      console.error('Error loading algorithms:', err);
    }
  };

  const handleTrain = async () => {
    if (!dataUploaded) {
      setError('Please upload data first');
      return;
    }

    setTraining(true);
    setError(null);
    setResult(null);

    try {
      const response = await trainModel(selectedAlgorithm, testSize);
      setResult(response);
      onTrainSuccess(response);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error training model');
    } finally {
      setTraining(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Model Training</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Algorithm
          </label>
          <select
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={training}
          >
            {algorithms.map((algo) => (
              <option key={algo.id} value={algo.id}>
                {algo.name} - {algo.description}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Size: {testSize * 100}%
          </label>
          <input
            type="range"
            min="0.1"
            max="0.5"
            step="0.05"
            value={testSize}
            onChange={(e) => setTestSize(parseFloat(e.target.value))}
            className="w-full"
            disabled={training}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>10%</span>
            <span>50%</span>
          </div>
        </div>

        <button
          onClick={handleTrain}
          disabled={training || !dataUploaded}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {training ? 'Training...' : 'Train Model'}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-semibold">{result.message}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">R² Score</p>
              <p className="text-2xl font-bold text-blue-600">
                {result.metrics.r2_score.toFixed(4)}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">MAE</p>
              <p className="text-2xl font-bold text-purple-600">
                {result.metrics.mae.toFixed(2)}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">RMSE</p>
              <p className="text-2xl font-bold text-orange-600">
                {result.metrics.rmse.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Training Time</p>
              <p className="text-2xl font-bold text-green-600">
                {result.training_time.toFixed(2)}s
              </p>
            </div>
          </div>

          {result.feature_importance && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">Feature Importance</h3>
              <div className="space-y-2">
                {Object.entries(result.feature_importance).map(([feature, importance]) => (
                  <div key={feature} className="flex items-center">
                    <span className="text-sm text-gray-700 w-32">{feature}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 mx-2">
                      <div
                        className="bg-blue-600 h-4 rounded-full"
                        style={{ width: `${importance * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{(importance * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelTraining;
