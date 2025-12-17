// MongoDB Health Check Script
// Usage: mongo mongodb://admin:password123@localhost:27018/LIAM?authSource=admin health-check.js

print('=== MongoDB Health Check ===');

try {
  // Test basic connection
  const admin = db.getSiblingDB('admin');
  const result = admin.runCommand({ ping: 1 });

  if (result.ok === 1) {
    print('✓ Connection successful');
  } else {
    throw new Error('Connection failed');
  }

  // Test LIAM database access
  const liam = db.getSiblingDB('LIAM');

  // Check if collections exist
  const collections = liam.listCollections().toArray();
  print('\n=== Collections ===');
  collections.forEach(collection => {
    print(`✓ ${collection.name}`);
  });

  // Check indexes
  const userIndexes = liam.users.getIndexes();
  print('\n=== Users Collection Indexes ===');
  userIndexes.forEach(index => {
    print(`✓ ${index.name}: ${JSON.stringify(index.key)}`);
  });

  // Test document operations
  const testDoc = {
    email: 'test@example.com',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const insertResult = liam.users.insertOne(testDoc);
  if (insertResult.acknowledged) {
    print('\n✓ Write operation successful');
  }

  const findResult = liam.users.findOne({ _id: insertResult.insertedId });
  if (findResult) {
    print('✓ Read operation successful');
  }

  // Cleanup test document
  liam.users.deleteOne({ _id: insertResult.insertedId });
  print('✓ Cleanup successful');

  // Server status
  const serverStatus = admin.runCommand({ serverStatus: 1 });
  print('\n=== Server Information ===');
  print(`Version: ${serverStatus.version}`);
  print(`Uptime: ${Math.floor(serverStatus.uptime / 60)} minutes`);
  print(`Connections: ${serverStatus.connections.current}`);
  print(`Memory Usage: ${Math.round(serverStatus.mem.resident / 1024 / 1024)} MB`);

  print('\n✅ All health checks passed!');

} catch (error) {
  print('\n❌ Health check failed:');
  print(error.message);
  exit(1);
}