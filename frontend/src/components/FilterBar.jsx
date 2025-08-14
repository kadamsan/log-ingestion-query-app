import React from 'react';

const FilterBar = ({ filters, onFilterChange, onClearFilters }) => {
  const handleInputChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  const handleClearFilters = () => {
    onClearFilters();
  };

  return (
    <div className="filter-bar">
      <div className="filter-grid">
        {/* Search Input */}
        <div className="filter-group">
          <label htmlFor="search">Search Message</label>
          <input
            id="search"
            type="text"
            placeholder="Search in message..."
            value={filters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
          />
        </div>

        {/* Level Filter */}
        <div className="filter-group">
          <label htmlFor="level">Log Level</label>
          <select
            id="level"
            value={filters.level}
            onChange={(e) => handleInputChange('level', e.target.value)}
          >
            <option value="">All Levels</option>
            <option value="error">Error</option>
            <option value="warn">Warning</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
            <option value="trace">Trace</option>
          </select>
        </div>

        {/* Resource ID Filter */}
        <div className="filter-group">
          <label htmlFor="resourceId">Resource ID</label>
          <input
            id="resourceId"
            type="text"
            placeholder="Filter by resource ID..."
            value={filters.resourceId}
            onChange={(e) => handleInputChange('resourceId', e.target.value)}
          />
        </div>

        {/* Start Date Filter */}
        <div className="filter-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            id="startDate"
            type="datetime-local"
            value={filters.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
          />
        </div>

        {/* End Date Filter */}
        <div className="filter-group">
          <label htmlFor="endDate">End Date</label>
          <input
            id="endDate"
            type="datetime-local"
            value={filters.endDate}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
          />
        </div>

        {/* Sort By */}
        <div className="filter-group">
          <label htmlFor="sortBy">Sort By</label>
          <select
            id="sortBy"
            value={filters.sortBy}
            onChange={(e) => handleInputChange('sortBy', e.target.value)}
          >
            <option value="timestamp">Timestamp</option>
            <option value="level">Level</option>
            <option value="message">Message</option>
            <option value="resourceId">Resource ID</option>
          </select>
        </div>

        {/* Sort Order */}
        <div className="filter-group">
          <label htmlFor="sortOrder">Sort Order</label>
          <select
            id="sortOrder"
            value={filters.sortOrder}
            onChange={(e) => handleInputChange('sortOrder', e.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="filter-group">
          <label>&nbsp;</label>
          <button
            onClick={handleClearFilters}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
