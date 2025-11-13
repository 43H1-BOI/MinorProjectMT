import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadCSV = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/upload/csv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const getDataStats = async () => {
  const response = await api.get('/upload/stats');
  return response.data;
};

export const getVisualizations = async () => {
  const response = await api.get('/visualization/all');
  return response.data;
};

export const trainModel = async (algorithm, testSize = 0.2) => {
  const response = await api.post('/model/train', {
    algorithm,
    test_size: testSize,
  });
  return response.data;
};

export const getModelInfo = async () => {
  const response = await api.get('/model/info');
  return response.data;
};

export const getAlgorithms = async () => {
  const response = await api.get('/model/algorithms');
  return response.data;
};

export const predictSingle = async (experience) => {
  const response = await api.post('/prediction/single', {
    experience: parseFloat(experience),
  });
  return response.data;
};

export const predictBatch = async (predictions) => {
  const response = await api.post('/prediction/batch', {
    predictions: predictions.map(exp => ({ experience: parseFloat(exp) })),
  });
  return response.data;
};

export const getInsightsSummary = async () => {
  const response = await api.get('/insights/summary');
  return response.data;
};

export const getSalaryBenchmark = async (experience) => {
  const response = await api.get('/insights/benchmark', {
    params: { experience: parseFloat(experience) },
  });
  return response.data;
};

export const downloadModel = () => {
  window.open(`${API_BASE_URL}/model/download`, '_blank');
};

export const exportReportCSV = () => {
  window.open(`${API_BASE_URL}/insights/export/csv`, '_blank');
};

export const exportReportExcel = () => {
  window.open(`${API_BASE_URL}/insights/export/excel`, '_blank');
};

export default api;
