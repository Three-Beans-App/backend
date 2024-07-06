const { app } = require("./server.js");
const { databaseConnect } = require("./utils/database.js");

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log("Server successully started!");

    // After server succesfully starts, connect to the database
    databaseConnect()
})