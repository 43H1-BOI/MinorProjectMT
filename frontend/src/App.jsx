import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import DataPreview from './components/DataPreview';
import Visualizations from './components/Visualizations';
import ModelTraining from './components/ModelTraining';
import Prediction from './components/Prediction';
import Insights from './components/Insights';
import './App.css';

function App() {
  const [uploadedData, setUploadedData] = useState(null);
  const [modelTrained, setModelTrained] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');

  const handleUploadSuccess = (data) => {
    setUploadedData(data);
    setActiveTab('visualize');
  };

  const handleTrainSuccess = (result) => {
    setModelTrained(true);
    setActiveTab('predict');
  };

  const tabs = [
    { id: 'upload', name: 'Upload Data', icon: '📤' },
    { id: 'visualize', name: 'Visualize', icon: '📊', disabled: !uploadedData },
    { id: 'train', name: 'Train Model', icon: '🤖', disabled: !uploadedData },
    { id: 'predict', name: 'Predict', icon: '🎯', disabled: !modelTrained },
    { id: 'insights', name: 'Insights', icon: '💡', disabled: !uploadedData },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            💼 Employee Salary Prediction
          </h1>
          <p className="text-gray-600 text-lg">
            Upload data, train ML models, and get accurate salary predictions
          </p>
        </header>

        {/* Navigation Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max px-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : tab.disabled
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'upload' && (
            <>
              <FileUpload onUploadSuccess={handleUploadSuccess} />
              {uploadedData && <DataPreview data={uploadedData} />}
            </>
          )}

          {activeTab === 'visualize' && (
            <Visualizations dataUploaded={uploadedData !== null} />
          )}

          {activeTab === 'train' && (
            <ModelTraining
              dataUploaded={uploadedData !== null}
              onTrainSuccess={handleTrainSuccess}
            />
          )}

          {activeTab === 'predict' && (
            <Prediction modelTrained={modelTrained} />
          )}

          {activeTab === 'insights' && (
            <Insights dataUploaded={uploadedData !== null} />
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600 text-sm">
          <p>Built with FastAPI, React, and Machine Learning</p>
          <p className="mt-2">© 2025 Employee Salary Prediction System</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
