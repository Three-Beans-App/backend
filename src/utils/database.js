const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();

// Function to connect the database at application start
async function databaseConnect() {
    let databaseURL = process.env.DATABASE_URL || "mongodb://localhost:27017/three-beans-db";

    await mongoose.connect(databaseURL);
    console.log("Database connecting completed!")
}

// Function to close database connection 
async function databaseClose() {
    await mongoose.connection.close();
    console.log("Database is disconnected");
}

// Function to drop database data
async function databaseClear() {
    await mongoose.connection.db.dropDatabase()
}

module.exports = {
    databaseConnect,
    databaseClose,
    databaseClear
}