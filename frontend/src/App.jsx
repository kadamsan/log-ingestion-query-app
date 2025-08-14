import React, { useState, useEffect } from 'react';
import { useLogs } from './hooks/useLogs';
import { healthCheck } from './services/api';
import FilterBar from './components/FilterBar';
import LogEntry from './components/LogEntry';
import Pagination from './components/Pagination';

function App() {
  const {
    logs,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    goToPage,
    clearFilters,
  } = useLogs();

  const [backendStatus, setBackendStatus] = useState('checking');

  // Check backend health on component mount
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        await healthCheck();
        setBackendStatus('connected');
      } catch (error) {
        setBackendStatus('disconnected');
        console.error('Backend health check failed:', error);
      }
    };

    checkBackendHealth();
  }, []);

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
  };

  const handlePageChange = (page) => {
    goToPage(page);
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <h1>Log Ingestion & Querying System</h1>
        <div style={{ 
          textAlign: 'center', 
          marginTop: '10px',
          fontSize: '0.9rem',
          opacity: 0.9
        }}>
          Backend Status: 
          <span style={{ 
            marginLeft: '5px',
            color: backendStatus === 'connected' ? '#28a745' : '#dc3545',
            fontWeight: 'bold'
          }}>
            {backendStatus === 'connected' ? '✓ Connected' : 
             backendStatus === 'disconnected' ? '✗ Disconnected' : '⏳ Checking...'}
          </span>
        </div>
      </header>

      <div className="container">
        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Logs Container */}
        <div className="logs-container">
          <div className="logs-header">
            <h2>Log Entries</h2>
            <div className="log-count">
              {loading ? 'Loading...' : `${pagination.total} total logs`}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="loading">
              <p>Loading logs...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && logs.length === 0 && !error && (
            <div className="empty-state">
              <h3>No logs found</h3>
              <p>Try adjusting your filters or check if logs have been ingested.</p>
            </div>
          )}

          {/* Log Entries */}
          {!loading && logs.length > 0 && (
            <>
              {logs.map((log) => (
                <LogEntry key={log.id} log={log} />
              ))}
              
              {/* Pagination */}
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>

        {/* Backend Connection Warning */}
        {backendStatus === 'disconnected' && (
          <div className="error-message" style={{ marginTop: '20px' }}>
            <strong>Warning:</strong> Cannot connect to the backend service. 
            Please ensure the backend server is running on http://localhost:3000
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
