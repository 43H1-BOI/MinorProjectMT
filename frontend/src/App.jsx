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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleUploadSuccess = (data) => {
    setUploadedData(data);
    setActiveTab('visualize');
  };

  const handleTrainSuccess = (result) => {
    setModelTrained(true);
    setActiveTab('predict');
  };

  const navigation = [
    { 
      id: 'upload', 
      name: 'Upload Data',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      )
    },
    { 
      id: 'visualize', 
      name: 'Visualizations',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      disabled: !uploadedData 
    },
    { 
      id: 'train', 
      name: 'Train Model',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      disabled: !uploadedData 
    },
    { 
      id: 'predict', 
      name: 'Predictions',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      disabled: !modelTrained 
    },
    { 
      id: 'insights', 
      name: 'Insights',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      disabled: !uploadedData 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">
              Salary Predictor
            </h1>
            <p className="text-sm text-gray-500 mt-1">ML-Powered Analytics</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => !item.disabled && setActiveTab(item.id)}
                disabled={item.disabled}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : item.disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className={activeTab === item.id ? 'text-blue-700' : 'text-gray-400'}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
                {item.disabled && (
                  <svg className="w-4 h-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </button>
            ))}
          </nav>

          {/* Footer Info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>FastAPI + React + ML</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 lg:hidden">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Salary Predictor</h1>
                  <p className="text-sm text-gray-500 mt-1">ML-Powered Analytics</p>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (!item.disabled) {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }
                    }}
                    disabled={item.disabled}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-700'
                        : item.disabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Salary Predictor</h1>
            <div className="w-6"></div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {navigation.find(n => n.id === activeTab)?.name}
              </h2>
              <p className="text-sm text-gray-600">
                {activeTab === 'upload' && 'Upload your CSV data to begin the analysis'}
                {activeTab === 'visualize' && 'Explore data visualizations and patterns'}
                {activeTab === 'train' && 'Train machine learning models on your data'}
                {activeTab === 'predict' && 'Make salary predictions using trained models'}
                {activeTab === 'insights' && 'View comprehensive HR analytics and insights'}
              </p>
            </div>

            {/* Content Area */}
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
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-4 py-4">
          <div className="max-w-7xl mx-auto text-center text-xs text-gray-500">
            <p>© 2025 Employee Salary Prediction System</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
