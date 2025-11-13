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
      <div className="card p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <p className="text-gray-600">Train a model first to make predictions</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex space-x-2 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setMode('single')}
          className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
            mode === 'single'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Single Prediction
        </button>
        <button
          onClick={() => setMode('batch')}
          className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
            mode === 'batch'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Batch Prediction
        </button>
      </div>

      {mode === 'single' ? (
        <div className="space-y-6">
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
              className="input-field"
              placeholder="e.g., 5.5"
            />
          </div>
          <button
            onClick={handleSinglePredict}
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Predicting...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Predict Salary</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of Experience (comma-separated)
            </label>
            <textarea
              value={batchExperiences}
              onChange={(e) => setBatchExperiences(e.target.value)}
              className="input-field resize-none"
              rows="4"
              placeholder="e.g., 1, 2.5, 5, 7.5, 10"
            />
          </div>
          <button
            onClick={handleBatchPredict}
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Predicting...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Predict Salaries</span>
              </>
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {result && result.type === 'single' && (
        <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <h3 className="text-sm font-semibold mb-4 text-gray-900">Prediction Result</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Experience</p>
              <p className="text-3xl font-bold text-gray-900">
                {result.data.experience} <span className="text-lg font-normal text-gray-600">years</span>
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Predicted Salary</p>
              <p className="text-3xl font-bold text-blue-600">
                ${result.data.predicted_salary.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {result && result.type === 'batch' && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-4 text-gray-900">Batch Prediction Results</h3>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Experience (years)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Predicted Salary
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {result.data.predictions.map((pred, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {pred.experience}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-blue-600">
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
