const mongoose = require('mongoose');

const dbName = process.env.DB_NAME;
const dbCotainer = process.env.MONGO_DB_CONTAINER;
// Test editing
// MongoDB connection URI
const mongoURI = `mongodb://${dbCotainer}:27017`;

async function dbConnect() {
    mongoose.connection.on('connected', () => {
        console.log('Connected: ', dbName);
    });
    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
        dbName,
    });
}

module.exports = dbConnect;
