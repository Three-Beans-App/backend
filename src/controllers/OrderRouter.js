const express = require('express');
const { OrderModel } = require('../models/OrderModel');
const { verifyJwt, validateObjectId, verifyAdmin } = require('../utils/middleware');
const { toNamespacedPath } = require('path');
const router = express.Router();


// Route for users to view order history
router.get(
    "/user/:id",
    validateObjectId,
    verifyJwt,
    async (request, response, next) => {
        try {
            const { id } = request.params;
            const orders = await OrderModel.find({
                user: id
            }).sort({
                date: -1
            }).exec();
            response.status(200).json({ orders });
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
            const orders = await OrderModel.find({}).sort({
                date: -1
            }).exec();
            response.status(200).json({ orders });
        } catch (error) {
            next(error);
        }
});
