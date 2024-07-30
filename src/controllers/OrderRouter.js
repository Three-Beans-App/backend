const express = require('express');
const { OrderModel } = require('../models/OrderModel');
const { verifyJwt, validateObjectId, verifyAdmin } = require('../utils/middleware');
const { ItemModel } = require('../models/ItemModel');
const router = express.Router();

async function calculateTotalPrice(items) {
    let totalPrice = 0;
    for (let item of items) {
        let itemQuantity = item.quantity || 1;
        let itemTotal = item.price * itemQuantity;
        totalPrice += itemTotal;
    }
    return totalPrice;
}


// Route for users to view order history
router.get(
    "/user/:id",
    validateObjectId,
    verifyJwt,
    async (request, response, next) => {
        try {
            const { id } = request.params;
            const result = await OrderModel.find({
                user: id
            }).sort({
                date: -1
            }).exec();
            response.status(200).json({ result });
        } catch (error) {
            next(error);
        }
});


// Route for admins to view all orders
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
router.get(
    "/status/:status",
    verifyJwt,
    verifyAdmin,
    async (request, response, next) => {
        try {
            const { status } = request.params;
            const result = await OrderModel.find({
                status 
            }).sort({
                date: -1
            }).exec();
            response.status(200).json({ result });
        } catch (error) {
            next(error);
        }
});


// Route to view all ongoing orders
router.get(
    "/active",
    verifyJwt,
    verifyAdmin,
    async (request, response, next) => {
        try {
            const orders = await OrderModel.find({
                status: {
                    $nin: ['completed', 'cancelled']
                }
            }).sort({
                date: 1
            }).exec();
            response.status(200).json({ orders });
        } catch (error) {
            next(error);
        }
});


// Route for users to create orders
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


// Route to update order status
router.patch(
    "/status/:id",
    validateObjectId,
    verifyJwt,
    verifyAdmin,
    async (request, response, next) => {
        try {
            const { id } = request.params;
            const { status } = request.body;

            const validStatuses = ["pending", "preparing", "ready", "completed", "cancelled"];
            if (!validStatuses.includes(status)) {
                return response.status(400).json({
                    message: "Invalid status."
                });
            }
            const order = await OrderModel.findByIdAndUpdate(
                id,
                { status },
                { new: true }
            );

            if (!order) {
                return response.status(404).json({
                    message: "Order not found.",
                });
            }

            response.status(200).json({
                message: "Order status updated successfully.",
                status
            });
        } catch (error) {
            next(error);
        }
});


// Route to delete an order
router.delete(
    "/deleteOrder/:id",
    validateObjectId,
    verifyJwt,
    verifyAdmin,
    async (request, response, next) => {
        const { id } = request.params;
        try {
            const order = await OrderModel.findByIdAndDelete(id).exec();
            if (!order) {
                return response.status(404).json({
                    message: "Order not found."
                });
            }
            response.status(200).json({
                message: "Order deleted succesfully."
            });
        } catch (error) {
            next(error)
        } 
});


module.exports = router;