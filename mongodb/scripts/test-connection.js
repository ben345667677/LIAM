// Test MongoDB Connection Script
// Node.js version for application testing
// Run with: node test-connection.js

const { MongoClient } = require('mongodb');

const uri = 'mongodb://admin:password123@localhost:27018/LIAM?authSource=admin';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
  maxPoolSize: 10,
  minPoolSize: 1,
  maxIdleTimeMS: 30000,
  retryWrites: true,
  w: 'majority'
};

async function testConnection() {
  const client = new MongoClient(uri, options);

  try {
    console.log('🔄 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected successfully!');

    // Test database operations
    const database = client.db('LIAM');

    // List collections
    const collections = await database.listCollections().toArray();
    console.log('\n📁 Collections:');
    collections.forEach(col => console.log(`  - ${col.name}`));

    // Test write operation
    const testCollection = database.collection('connection_test');
    const testDoc = {
      test: true,
      timestamp: new Date(),
      message: 'Connection test'
    };

    const result = await testCollection.insertOne(testDoc);
    console.log('\n✅ Write test passed:', result.insertedId);

    // Test read operation
    const found = await testCollection.findOne({ _id: result.insertedId });
    console.log('✅ Read test passed:', found.message);

    // Cleanup
    await testCollection.deleteOne({ _id: result.insertedId });
    console.log('✅ Cleanup completed');

    // Test authentication
    const admin = client.db().admin();
    const authTest = await admin.ping();
    console.log('\n✅ Authentication test passed:', authTest.ok === 1);

    console.log('\n🎉 All tests passed! MongoDB is ready for use.');

  } catch (error) {
    console.error('\n❌ Connection test failed:');
    console.error('Error:', error.message);

    if (error.name === 'MongoNetworkError') {
      console.error('\n💡 Make sure MongoDB is running on port 27018');
    } else if (error.name === 'MongoAuthenticationError') {
      console.error('\n💡 Check your username/password in the connection string');
    }

    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Connection closed');
  }
}

// Test with alternative user (if needed)
async function testAppUser() {
  const appUri = 'mongodb://liam_app:liam_password_2024@localhost:27018/LIAM';
  const appClient = new MongoClient(appUri, options);

  try {
    console.log('\n🔄 Testing application user...');
    await appClient.connect();
    console.log('✅ Application user connected successfully!');

    const db = appClient.db('LIAM');
    const collections = await db.listCollections().toArray();
    console.log(`📁 Can access ${collections.length} collections`);

  } catch (error) {
    console.error('❌ Application user test failed:', error.message);
  } finally {
    await appClient.close();
  }
}

if (require.main === module) {
  testConnection()
    .then(() => testAppUser())
    .catch(console.error);
}

module.exports = { testConnection, testAppUser };