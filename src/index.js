const { app } = require("./server.js");
const { databaseConnect } = require("./utils/database.js");

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log("Server listening on http://localhost:3000");

    // After server succesfully starts, connect to the database
    databaseConnect()
})