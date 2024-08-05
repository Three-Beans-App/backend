const { app } = require("./server.js");
const { databaseConnect } = require("./utils/database.js");

const PORT = process.env.PORT || 3001;

// Start up function to connect to the server and database
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    databaseConnect()
})