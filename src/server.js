const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors({
    origin: '*',
    methods: 'GET, POST, PATCH, DELETE',
    credentials: true
}));

// Base route for the app
app.get("/", (request, response) => {

    response.json({
        message: "Welcome to Three Beans Cafe!"
    });
});

// Router middleware to access app routes
const userRouter = require('./controllers/UserRouter.js');
app.use("/users", userRouter);

const menuRouter = require('./controllers/MenuRouter.js');
app.use("/menu", menuRouter);

const orderRouter = require('./controllers/OrderRouter.js');
app.use("/orders", orderRouter);

const favouriteRouter = require('./controllers/FavouriteRouter.js');
app.use("/favourites", favouriteRouter);


// Not found middleware for all other routes
app.get("*", (request, response, next) => {
    response.status(404).json({
        message:"404 Page not found"
    });
});


// Internal server error middleware
app.use((error, request, response, next) => {
    response.status(error.status || 500).json({
        message:"Error Occured!",
        error: error.message
    });
});

module.exports = {
    app
}