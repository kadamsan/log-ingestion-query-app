import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Log API functions
export const logAPI = {
  // Get logs with filters
  getLogs: async (filters = {}) => {
    const params = new URLSearchParams();
    
    // Add filters to query parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });

    const response = await api.get(`/logs?${params.toString()}`);
    return response.data;
  },

  // Get a specific log by ID
  getLog: async (id) => {
    const response = await api.get(`/logs/${id}`);
    return response.data;
  },

  // Create a new log
  createLog: async (logData) => {
    const response = await api.post('/logs', logData);
    return response.data;
  },

  // Update a log
  updateLog: async (id, updateData) => {
    const response = await api.put(`/logs/${id}`, updateData);
    return response.data;
  },

  // Delete a log
  deleteLog: async (id) => {
    const response = await api.delete(`/logs/${id}`);
    return response.data;
  },

  // Get log statistics
  getStats: async () => {
    const response = await api.get('/logs/stats/overview');
    return response.data;
  },

  // Bulk insert logs
  bulkInsert: async (logs) => {
    const response = await api.post('/logs/bulk', { logs });
    return response.data;
  },
};

// Health check function
export const healthCheck = async () => {
  try {
    const response = await axios.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Backend service is not available');
  }
};

export default api;
