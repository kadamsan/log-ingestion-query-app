const JsonDatabase = require('./services/database');

async function testDatabase() {
  const db = new JsonDatabase();
  
  console.log('🧪 Testing JSON Database...\n');

  try {
    // Test 1: Add a single log
    console.log('1. Adding a single log...');
    const log1 = await db.addLog({
      level: 'info',
      message: 'Application started successfully',
      service: 'web-server',
      metadata: { port: 3000, environment: 'development' },
      tags: ['startup', 'web'],
      source: 'server.js',
      ip: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
      environment: 'development'
    });
    console.log('✅ Log added:', log1.id);

    // Test 2: Add another log
    console.log('\n2. Adding another log...');
    const log2 = await db.addLog({
      level: 'error',
      message: 'Database connection failed',
      service: 'database',
      metadata: { error: 'Connection timeout', retries: 3 },
      tags: ['database', 'error'],
      source: 'database.js',
      duration: 5000,
      ip: '127.0.0.1',
      environment: 'development'
    });
    console.log('✅ Log added:', log2.id);

    // Test 3: Add a warning log
    console.log('\n3. Adding a warning log...');
    const log3 = await db.addLog({
      level: 'warn',
      message: 'High memory usage detected',
      service: 'monitoring',
      metadata: { memoryUsage: '85%', threshold: '80%' },
      tags: ['monitoring', 'performance'],
      source: 'monitor.js',
      environment: 'production'
    });
    console.log('✅ Log added:', log3.id);

    // Test 4: Get all logs
    console.log('\n4. Fetching all logs...');
    const allLogs = await db.getLogs();
    console.log(`✅ Found ${allLogs.logs.length} logs`);
    console.log('Pagination:', allLogs.pagination);

    // Test 5: Filter logs by level
    console.log('\n5. Filtering logs by level (error)...');
    const errorLogs = await db.getLogs({ level: 'error' });
    console.log(`✅ Found ${errorLogs.logs.length} error logs`);

    // Test 6: Search logs
    console.log('\n6. Searching logs for "database"...');
    const searchResults = await db.getLogs({ search: 'database' });
    console.log(`✅ Found ${searchResults.logs.length} logs containing "database"`);

    // Test 7: Get statistics
    console.log('\n7. Getting log statistics...');
    const stats = await db.getStats();
    console.log('✅ Statistics:', JSON.stringify(stats, null, 2));

    // Test 8: Get specific log by ID
    console.log('\n8. Getting specific log by ID...');
    const specificLog = await db.getLogById(log1.id);
    console.log('✅ Retrieved log:', specificLog.message);

    // Test 9: Update a log
    console.log('\n9. Updating a log...');
    const updatedLog = await db.updateLog(log1.id, {
      message: 'Application started successfully (updated)',
      metadata: { port: 3000, environment: 'development', updated: true }
    });
    console.log('✅ Log updated:', updatedLog.message);

    // Test 10: Bulk insert
    console.log('\n10. Bulk inserting logs...');
    const bulkLogs = [
      {
        level: 'info',
        message: 'Bulk log 1',
        service: 'bulk-test',
        tags: ['bulk', 'test']
      },
      {
        level: 'debug',
        message: 'Bulk log 2',
        service: 'bulk-test',
        tags: ['bulk', 'test']
      }
    ];
    const bulkResult = await db.bulkInsert(bulkLogs);
    console.log('✅ Bulk insert result:', bulkResult);

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📁 Check the data/logs.json file to see the stored logs.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testDatabase();
}

module.exports = { testDatabase };
