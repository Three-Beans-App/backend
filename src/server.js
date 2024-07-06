const express = require("express");
const app = express();

// Allow POST requests to have JSON body content
app.use(express.json());

// Home route
app.get("/", (request, response) => {

    response.json({
        message: "Welcome to Three Beans Cafe!"
    });
});

// Error handling 404
app.get("*", (request, response, next) => {
    response.status(404).json({
        message:"404 Page not found"
    });
});

// Error handling 
app.use((error, request, response, next) => {
    response.json({
        message:"Error Occured!",
        error: error.message
    });
});

module.exports = {
    app
}