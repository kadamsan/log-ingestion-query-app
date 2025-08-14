const express = require('express');
const JsonDatabase = require('../services/database');

const router = express.Router();
const db = new JsonDatabase();

// POST /api/logs - Ingest a new log
router.post('/', async (req, res) => {
  try {
    const { level, message, service, metadata, tags, source, duration, ip, userAgent, environment } = req.body;

    // Validate required fields
    if (!level || !message) {
      return res.status(400).json({
        error: 'Missing required fields: level and message are required'
      });
    }

    // Validate log level
    const validLevels = ['error', 'warn', 'info', 'debug', 'trace'];
    if (!validLevels.includes(level)) {
      return res.status(400).json({
        error: `Invalid log level. Must be one of: ${validLevels.join(', ')}`
      });
    }

    const logData = {
      level,
      message,
      service,
      metadata,
      tags,
      source,
      duration,
      ip,
      userAgent,
      environment
    };

    const newLog = await db.addLog(logData);
    
    res.status(201).json({
      success: true,
      data: newLog
    });
  } catch (error) {
    console.error('Error ingesting log:', error);
    res.status(500).json({
      error: 'Failed to ingest log',
      message: error.message
    });
  }
});

// GET /api/logs - Get logs with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      level,
      service,
      startDate,
      endDate,
      search,
      sortBy = 'timestamp',
      sortOrder = 'desc',
      page = 1,
      limit = 50
    } = req.query;

    const filters = {
      level,
      service,
      startDate,
      endDate,
      search,
      sortBy,
      sortOrder,
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const result = await db.getLogs(filters);
    
    res.json({
      success: true,
      data: result.logs,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({
      error: 'Failed to fetch logs',
      message: error.message
    });
  }
});

// GET /api/logs/:id - Get a specific log by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const log = await db.getLogById(id);
    
    res.json({
      success: true,
      data: log
    });
  } catch (error) {
    if (error.message === 'Log not found') {
      return res.status(404).json({
        error: 'Log not found'
      });
    }
    
    console.error('Error fetching log:', error);
    res.status(500).json({
      error: 'Failed to fetch log',
      message: error.message
    });
  }
});

// PUT /api/logs/:id - Update a log
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated
    delete updateData.id;
    delete updateData.timestamp;

    const updatedLog = await db.updateLog(id, updateData);
    
    res.json({
      success: true,
      data: updatedLog
    });
  } catch (error) {
    if (error.message === 'Log not found') {
      return res.status(404).json({
        error: 'Log not found'
      });
    }
    
    console.error('Error updating log:', error);
    res.status(500).json({
      error: 'Failed to update log',
      message: error.message
    });
  }
});

// DELETE /api/logs/:id - Delete a log
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLog = await db.deleteLog(id);
    
    res.json({
      success: true,
      message: 'Log deleted successfully',
      data: deletedLog
    });
  } catch (error) {
    if (error.message === 'Log not found') {
      return res.status(404).json({
        error: 'Log not found'
      });
    }
    
    console.error('Error deleting log:', error);
    res.status(500).json({
      error: 'Failed to delete log',
      message: error.message
    });
  }
});

// GET /api/logs/stats/overview - Get log statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await db.getStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

// POST /api/logs/bulk - Bulk insert logs
router.post('/bulk', async (req, res) => {
  try {
    const { logs } = req.body;

    if (!Array.isArray(logs)) {
      return res.status(400).json({
        error: 'Logs must be an array'
      });
    }

    if (logs.length === 0) {
      return res.status(400).json({
        error: 'Logs array cannot be empty'
      });
    }

    // Validate each log entry
    const validLevels = ['error', 'warn', 'info', 'debug', 'trace'];
    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];
      if (!log.level || !log.message) {
        return res.status(400).json({
          error: `Log at index ${i} is missing required fields: level and message are required`
        });
      }
      
      if (!validLevels.includes(log.level)) {
        return res.status(400).json({
          error: `Log at index ${i} has invalid log level. Must be one of: ${validLevels.join(', ')}`
        });
      }
    }

    const result = await db.bulkInsert(logs);
    
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error bulk inserting logs:', error);
    res.status(500).json({
      error: 'Failed to bulk insert logs',
      message: error.message
    });
  }
});

module.exports = router;
