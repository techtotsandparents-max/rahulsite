const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function test() {
  console.log("Connecting to:", process.env.COSMOS_DB_CONNECTION_STRING.split('@')[1]); // Hide password
  try {
    await mongoose.connect(process.env.COSMOS_DB_CONNECTION_STRING, { serverSelectionTimeoutMS: 5000 });
    console.log("SUCCESS: Connected to Cosmos DB locally!");
    process.exit(0);
  } catch (err) {
    console.error("FAILED to connect locally:");
    console.error(err.message);
    process.exit(1);
  }
}
test();
