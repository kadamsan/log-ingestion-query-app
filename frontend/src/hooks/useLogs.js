import { useState, useEffect, useCallback } from 'react';
import { logAPI } from '../services/api';

export const useLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    level: '',
    resourceId: '',
    startDate: '',
    endDate: '',
    search: '',
    sortBy: 'timestamp',
    sortOrder: 'desc',
  });

  // Fetch logs with current filters and pagination
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      };

      const response = await logAPI.getLogs(params);
      
      if (response.success) {
        setLogs(response.data);
        setPagination(prev => ({
          ...prev,
          ...response.pagination,
        }));
      } else {
        setError('Failed to fetch logs');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  // Update filters and reset to first page
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Update pagination
  const updatePagination = useCallback((newPagination) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  }, []);

  // Go to specific page
  const goToPage = useCallback((page) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      level: '',
      resourceId: '',
      startDate: '',
      endDate: '',
      search: '',
      sortBy: 'timestamp',
      sortOrder: 'desc',
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Fetch logs when filters or pagination changes
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    loading,
    error,
    pagination,
    filters,
    fetchLogs,
    updateFilters,
    updatePagination,
    goToPage,
    clearFilters,
  };
};
