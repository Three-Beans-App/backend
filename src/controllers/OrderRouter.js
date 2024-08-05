const express = require('express');
const { OrderModel } = require('../models/OrderModel');
const { ItemModel } = require('../models/ItemModel');
const { verifyJwt, validateObjectId, verifyAdmin } = require('../utils/middleware');
const router = express.Router();

// Function to calculate total price for creating orders
async function calculateTotalPrice(items) {
    // Set initial value for totalPrice
    let totalPrice = 0;

    // Loop through each item in the order
    for (let item of items) {

        // Check quantity then multiply by price
        let itemQuantity = item.quantity || 1;
        let itemTotal = item.price * itemQuantity;

        // Add itemTotal to the totalPrice value
        totalPrice += itemTotal;
    }
    return totalPrice;
}


/* == POST == */


// Route for users to create orders
// eg. POST localhost:3001/orders/
router.post("/", async (request, response, next) => {
    const {userId, guestUser, items } = request.body;

    try {
        const orderItems = await Promise.all(items.map(async item => {
            const itemDetails = await ItemModel.findById(item.itemId);
            if (!itemDetails) {
                return response.status(404).json({
                    message: `Item not found: ${item.itemId}`
                });
            }
            return {
                itemId: item.itemId,
                name: itemDetails.name,
                category: itemDetails.category,
                quantity: item.quantity,
                price: itemDetails.price,
                total: itemDetails.price * item.quantity
            };
        }));

        const totalPrice = await calculateTotalPrice(orderItems);

        const orderdata = {
            items: orderItems,
            totalPrice: totalPrice,
            status: 'pending'
        };

        if (userId) {
            orderdata.user = userId;
        } else if (guestUser) {
            orderdata.guestUser = guestUser;
        } else {
            return response.status(400).json({
                message: "User or guest information is required to place an order."
            });
        }

        const newOrder = new OrderModel(orderdata);
        await newOrder.save();

        response.status(201).json({
            message: "Order placed successfully.",
            order: newOrder
        });
    } catch (error) {
        next(error);
    }
});


/* == GET == */


// Route for users to view order history
// eg. GET localhost:3001/orders/user/66b09e3ebd25c7965350a9bc/
router.get(
    "/user/:id",
    validateObjectId,
    verifyJwt,
    async (request, response, next) => {
        try {
            // Retrieve user ID from request params 
            // Search the database for order documents matching the user ID
            const { id } = request.params;
            const result = await OrderModel.find({
                user: id
            }).sort({
                date: -1
            }).exec();
            // Return the search result as a response
            response.status(200).json({ result });
        } catch (error) {
            next(error);
        }
});


// Route for admins to view all orders
// eg. GET localhost:3001/orders/
router.get(
    "/",
    verifyJwt,
    verifyAdmin,
    async (request, response, next) => {
        try {
            const result = await OrderModel.find({}).sort({
                date: -1
            }).exec();
            response.status(200).json({ result });
        } catch (error) {
            next(error);
        }
});


// Route to view orders based on status
// eg. GET localhost:3001/orders/status/completed/
router.get(
    "/status/:status",
    verifyJwt,
    verifyAdmin,
    async (request, response, next) => {
        try {
            // Retrieve status from request params 
            // Search the database for orders with a matching status
            const { status } = request.params;
            const result = await OrderModel.find({
                status 
            }).sort({
                date: -1
            }).exec();
            // Return the search result as the response
            response.status(200).json({ result });
        } catch (error) {
            next(error);
        }
});


// Route to view all ongoing orders
// eg. GET localhost:3001/orders/active/
router.get(
    "/active",
    verifyJwt,
    verifyAdmin,
    async (request, response, next) => {
        try {
            // Search the database for all orders without completed or cancelled status
            const result = await OrderModel.find({
                status: {
                    $nin: ['completed', 'cancelled']
                }
            }).sort({
                date: 1
            }).exec();
            // Return the search result as the response
            response.status(200).json({ result });
        } catch (error) {
            next(error);
        }
});


/* == PATCH == */


// Route to update order status
// eg. PATCH localhost:3001/orders/status/66b09e40bd25c7965350a9e8/
router.patch(
    "/status/:id",
    validateObjectId,
    verifyJwt,
    verifyAdmin,
    async (request, response, next) => {
        try {
            // Retrieve order ID from the request params
            // Retrieve status update from the request body
            const { id } = request.params;
            const { status } = request.body;

            // Check for a valid status update
            // If the status is not valid return a 400 response
            const validStatuses = ["pending", "preparing", "ready", "completed", "cancelled"];
            if (!validStatuses.includes(status)) {
                return response.status(400).json({
                    message: "Invalid status."
                });
            }
            // Search the database for the order and update it
            const order = await OrderModel.findByIdAndUpdate(
                id,
                { status },
                { new: true }
            );
            // If no matching order is found return a 404 status
            if (!order) {
                return response.status(404).json({
                    message: "Order not found.",
                });
            }
            // Respond with confirmation and the updated status
            response.status(200).json({
                message: "Order status updated successfully.",
                status
            });
        } catch (error) {
            next(error);
        }
});


/* == DELETE == */


// Route to delete an order
// eg. DELETE localhost:3001/orders/delete/66b09e40bd25c7965350a9e8/
router.delete(
    "/delete/:id",
    validateObjectId,
    verifyJwt,
    verifyAdmin,
    async (request, response, next) => {
        // Retrieve the order ID from the request params
        const { id } = request.params;
        try {
            // Search the database for the order and delete it
            const order = await OrderModel.findByIdAndDelete(id).exec();

            // If no matching order is found return a 404 status
            if (!order) {
                return response.status(404).json({
                    message: "Order not found."
                });
            }
            // Respond with confirmation
            response.status(200).json({
                message: "Order deleted succesfully."
            });
        } catch (error) {
            next(error)
        } 
});


module.exports = router;