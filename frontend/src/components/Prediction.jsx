import React, { useState } from 'react';
import { predictSingle, predictBatch } from '../services/api';

const Prediction = ({ modelTrained }) => {
  const [mode, setMode] = useState('single'); // 'single' or 'batch'
  const [singleExperience, setSingleExperience] = useState('');
  const [batchExperiences, setBatchExperiences] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSinglePredict = async () => {
    if (!singleExperience) {
      setError('Please enter years of experience');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await predictSingle(singleExperience);
      setResult({ type: 'single', data: response });
    } catch (err) {
      setError(err.response?.data?.detail || 'Error making prediction');
    } finally {
      setLoading(false);
    }
  };

  const handleBatchPredict = async () => {
    if (!batchExperiences) {
      setError('Please enter experience values');
      return;
    }

    const experiences = batchExperiences
      .split(',')
      .map((exp) => exp.trim())
      .filter((exp) => exp !== '');

    if (experiences.length === 0) {
      setError('Please enter valid experience values');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await predictBatch(experiences);
      setResult({ type: 'batch', data: response });
    } catch (err) {
      setError(err.response?.data?.detail || 'Error making predictions');
    } finally {
      setLoading(false);
    }
  };

  if (!modelTrained) {
    return (
      <div className="w-full bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">Train a model first to make predictions</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Salary Prediction</h2>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setMode('single')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            mode === 'single'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Single Prediction
        </button>
        <button
          onClick={() => setMode('batch')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            mode === 'batch'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Batch Prediction
        </button>
      </div>

      {mode === 'single' ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of Experience
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={singleExperience}
              onChange={(e) => setSingleExperience(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 5.5"
            />
          </div>
          <button
            onClick={handleSinglePredict}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {loading ? 'Predicting...' : 'Predict Salary'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of Experience (comma-separated)
            </label>
            <textarea
              value={batchExperiences}
              onChange={(e) => setBatchExperiences(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              placeholder="e.g., 1, 2.5, 5, 7.5, 10"
            />
          </div>
          <button
            onClick={handleBatchPredict}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {loading ? 'Predicting...' : 'Predict Salaries'}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {result && result.type === 'single' && (
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Prediction Result</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Experience</p>
              <p className="text-2xl font-bold text-blue-600">
                {result.data.experience} years
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Predicted Salary</p>
              <p className="text-2xl font-bold text-green-600">
                ${result.data.predicted_salary.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {result && result.type === 'batch' && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Batch Prediction Results</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Experience (years)
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Predicted Salary
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.data.predictions.map((pred, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                      {pred.experience}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-green-600 font-semibold">
                      ${pred.predicted_salary.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prediction;
