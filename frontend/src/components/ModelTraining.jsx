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
    <div className="card p-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Algorithm
          </label>
          <select
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            className="input-field"
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
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Test Size
            </label>
            <span className="text-sm font-semibold text-blue-600">
              {(testSize * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="0.5"
            step="0.05"
            value={testSize}
            onChange={(e) => setTestSize(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            disabled={training}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>10%</span>
            <span>30%</span>
            <span>50%</span>
          </div>
        </div>

        <button
          onClick={handleTrain}
          disabled={training || !dataUploaded}
          className="w-full btn-primary flex items-center justify-center space-x-2"
        >
          {training ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Training Model...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>Train Model</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-6">
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl flex items-center space-x-3">
            <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-green-800 font-medium">{result.message}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">R² Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {result.metrics.r2_score.toFixed(4)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
              <p className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">MAE</p>
              <p className="text-2xl font-bold text-gray-900">
                {result.metrics.mae.toFixed(2)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
              <p className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-1">RMSE</p>
              <p className="text-2xl font-bold text-gray-900">
                {result.metrics.rmse.toFixed(2)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
              <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {result.training_time.toFixed(2)}s
              </p>
            </div>
          </div>

          {result.feature_importance && (
            <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-sm font-semibold mb-4 text-gray-900">Feature Importance</h3>
              <div className="space-y-3">
                {Object.entries(result.feature_importance).map(([feature, importance]) => (
                  <div key={feature} className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 w-32">{feature}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 mx-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${importance * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-12 text-right">
                      {(importance * 100).toFixed(1)}%
                    </span>
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
