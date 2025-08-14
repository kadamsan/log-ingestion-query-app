import React from 'react';
import { format } from 'date-fns';

const LogEntry = ({ log }) => {
  const formatTimestamp = (timestamp) => {
    try {
      return format(new Date(timestamp), 'MMM dd, yyyy HH:mm:ss');
    } catch (error) {
      return timestamp;
    }
  };

  const formatMetadata = (metadata) => {
    if (!metadata || typeof metadata !== 'object') {
      return 'N/A';
    }
    return JSON.stringify(metadata, null, 2);
  };

  return (
    <div className={`log-entry ${log.level}`}>
      <div className="log-header">
        <div className="log-level-container">
          <span className={`log-level ${log.level}`}>
            {log.level.toUpperCase()}
          </span>
        </div>
        <div className="log-timestamp">
          {formatTimestamp(log.timestamp)}
        </div>
      </div>
      
      <div className="log-message">
        {log.message}
      </div>
      
      <div className="log-details">
        <div className="log-detail">
          <span className="log-detail-label">Resource ID:</span>
          <span className="log-detail-value">{log.resourceId || 'N/A'}</span>
        </div>
        
        <div className="log-detail">
          <span className="log-detail-label">Trace ID:</span>
          <span className="log-detail-value">{log.traceId || 'N/A'}</span>
        </div>
        
        <div className="log-detail">
          <span className="log-detail-label">Span ID:</span>
          <span className="log-detail-value">{log.spanId || 'N/A'}</span>
        </div>
        
        <div className="log-detail">
          <span className="log-detail-label">Commit:</span>
          <span className="log-detail-value">{log.commit || 'N/A'}</span>
        </div>
        
        <div className="log-detail">
          <span className="log-detail-label">ID:</span>
          <span className="log-detail-value">{log.id}</span>
        </div>
        
        {log.metadata && (
          <div className="log-detail" style={{ gridColumn: '1 / -1' }}>
            <span className="log-detail-label">Metadata:</span>
            <pre className="log-detail-value" style={{ 
              margin: '5px 0 0 0',
              padding: '8px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              fontSize: '0.8rem',
              overflow: 'auto',
              maxHeight: '100px'
            }}>
              {formatMetadata(log.metadata)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogEntry;
