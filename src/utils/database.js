const mongoose = require("mongoose");

async function databaseConnect() {
    let databaseURL = process.env.DATABASE_URL || "mongodb://localhost:27017/three-beans-db";

    await mongoose.connect(databaseURL);
    console.log("Database connecting completed!")
}

async function databaseClose() {
    await mongoose.connection.close();
    console.log("Database is disconnected");
}

async function databaseClear() {
    await mongoose.connection.db.dropDatabase()
}

module.exports = {
    databaseConnect,
    databaseClose,
    databaseClear
}