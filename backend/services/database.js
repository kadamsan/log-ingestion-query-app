const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class JsonDatabase {
  constructor(dbPath = 'data/logs.json') {
    this.dbPath = path.resolve(dbPath);
    this.ensureDataDirectory();
  }

  // Ensure data directory exists
  async ensureDataDirectory() {
    const dir = path.dirname(this.dbPath);
    try {
      await fs.access(dir);
    } catch (error) {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  // Read all logs from JSON file
  async readLogs() {
    try {
      await fs.access(this.dbPath);
      const data = await fs.readFile(this.dbPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return empty array
        return [];
      }
      throw new Error(`Failed to read database: ${error.message}`);
    }
  }

  // Write logs to JSON file
  async writeLogs(logs) {
    try {
      await this.ensureDataDirectory();
      await fs.writeFile(this.dbPath, JSON.stringify(logs, null, 2), 'utf8');
    } catch (error) {
      throw new Error(`Failed to write database: ${error.message}`);
    }
  }

  // Add a new log entry
  async addLog(logData) {
    try {
      const logs = await this.readLogs();
      const newLog = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        ...logData
      };
      
      logs.push(newLog);
      await this.writeLogs(logs);
      return newLog;
    } catch (error) {
      throw new Error(`Failed to add log: ${error.message}`);
    }
  }

  // Get all logs with optional filtering
  async getLogs(filters = {}) {
    try {
      let logs = await this.readLogs();
      
      // Apply filters
      if (filters.level) {
        logs = logs.filter(log => log.level === filters.level);
      }
      
      if (filters.resourceId) {
        const resourceIdTerm = filters.resourceId.toLowerCase();
        logs = logs.filter(log => 
          log.resourceId.toLowerCase().includes(resourceIdTerm)
        );
      }
      
      if (filters.startDate) {
        logs = logs.filter(log => new Date(log.timestamp) >= new Date(filters.startDate));
      }
      
      if (filters.endDate) {
        logs = logs.filter(log => new Date(log.timestamp) <= new Date(filters.endDate));
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        logs = logs.filter(log => 
          log.message.toLowerCase().includes(searchTerm)
        );
      }

      // Apply sorting
      const sortBy = filters.sortBy || 'timestamp';
      const sortOrder = filters.sortOrder || 'desc';
      
      logs.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        
        if (sortBy === 'timestamp') {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        }
        
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });

      // Apply pagination
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 50;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      const paginatedLogs = logs.slice(startIndex, endIndex);
      
      return {
        logs: paginatedLogs,
        pagination: {
          page,
          limit,
          total: logs.length,
          totalPages: Math.ceil(logs.length / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to get logs: ${error.message}`);
    }
  }

  // Get a single log by ID
  async getLogById(id) {
    try {
      const logs = await this.readLogs();
      const log = logs.find(log => log.id === id);
      
      if (!log) {
        throw new Error('Log not found');
      }
      
      return log;
    } catch (error) {
      throw new Error(`Failed to get log: ${error.message}`);
    }
  }

  // Update a log entry
  async updateLog(id, updateData) {
    try {
      const logs = await this.readLogs();
      const logIndex = logs.findIndex(log => log.id === id);
      
      if (logIndex === -1) {
        throw new Error('Log not found');
      }
      
      logs[logIndex] = {
        ...logs[logIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      await this.writeLogs(logs);
      return logs[logIndex];
    } catch (error) {
      throw new Error(`Failed to update log: ${error.message}`);
    }
  }

  // Delete a log entry
  async deleteLog(id) {
    try {
      const logs = await this.readLogs();
      const logIndex = logs.findIndex(log => log.id === id);
      
      if (logIndex === -1) {
        throw new Error('Log not found');
      }
      
      const deletedLog = logs.splice(logIndex, 1)[0];
      await this.writeLogs(logs);
      
      return deletedLog;
    } catch (error) {
      throw new Error(`Failed to delete log: ${error.message}`);
    }
  }

  // Get log statistics
  async getStats() {
    try {
      const logs = await this.readLogs();
      
      const stats = {
        total: logs.length,
        byLevel: {},
        byService: {},
        recentActivity: {
          last24h: 0,
          last7d: 0,
          last30d: 0
        }
      };

      const now = new Date();
      const oneDay = 24 * 60 * 60 * 1000;
      const oneWeek = 7 * oneDay;
      const oneMonth = 30 * oneDay;

      logs.forEach(log => {
        const logDate = new Date(log.timestamp);
        
        // Count by level
        stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;
        
        // Count by service
        if (log.service) {
          stats.byService[log.service] = (stats.byService[log.service] || 0) + 1;
        }
        
        // Count recent activity
        const timeDiff = now - logDate;
        if (timeDiff <= oneDay) stats.recentActivity.last24h++;
        if (timeDiff <= oneWeek) stats.recentActivity.last7d++;
        if (timeDiff <= oneMonth) stats.recentActivity.last30d++;
      });

      return stats;
    } catch (error) {
      throw new Error(`Failed to get stats: ${error.message}`);
    }
  }

  // Bulk insert logs
  async bulkInsert(logsData) {
    try {
      const existingLogs = await this.readLogs();
      const newLogs = logsData.map(logData => ({
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        ...logData
      }));
      
      const allLogs = [...existingLogs, ...newLogs];
      await this.writeLogs(allLogs);
      
      return {
        inserted: newLogs.length,
        total: allLogs.length
      };
    } catch (error) {
      throw new Error(`Failed to bulk insert: ${error.message}`);
    }
  }
}

module.exports = JsonDatabase;
