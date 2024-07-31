const express = require('express');
const { FavouriteModel } = require('../models/FavouriteModel');
const { ItemModel } = require('../models/ItemModel');
const { verifyJwt, validateObjectId } = require('../utils/middleware');
const router = express.Router();


// Route for users to view their favourites
router.get(
    "/:id",
    validateObjectId,
    verifyJwt,
    async (request, response, next) => {
        try {
            const { id } = request.params;
            const result = await FavouriteModel.find({
                user: id
            }).exec();
            response.status(200).json({ result });
        } catch (error) {
            next(error);
        }
});


// Route to add a new favourite
router.post(
    "/",
    verifyJwt,
    async (request, response, next) => {
        const { userId, itemId } = request.body;

        try{
            const item = await ItemModel.findById(itemId);
            if (!item) {
                return response.status(404).json({
                    message: "Item not found."
                });
            }

            const existingFavourite = await FavouriteModel.findOne({
                user: userId,
                "item.itemId": itemId
            });
            if (existingFavourite) {
                return response.status(400).json({
                    message: "Item is already in your favourites."
                });
            }

            const newFavourite = new FavouriteModel({
                user: userId,
                item: {
                    itemId: item._id,
                    name: item.name,
                    category: item.category,
                    price: item.price
                }
            });

            await newFavourite.save();
            response.status(201).json({
                message: "Favourite added successfully.",
                favourite: newFavourite
            });
        } catch (error) {
            next(error);
        }
});


// Route to update existing favourite
router.patch(
    "/:id",
    validateObjectId,
    verifyJwt,
    async (request, response, next) => {
        const { id } = request.params;
        const { itemId } = request.body;

        try {
            const item = await ItemModel.findById(itemId);
            if (!item) {
                return response.status(404).json({
                    message: "Item not found."
                });
            }

            const updatedFavourite = await FavouriteModel.findByIdAndUpdate(
                id,
                {
                    item: {
                        itemId: item._id,
                        name: item.name,
                        category: item.category,
                        price: item.price
                    }
                },
                { new: true }
            ).exec();

            if (!updatedFavourite) {
                return response(404).json({
                    message: "Favourite not found."
                });
            }

            response.status(200).json({
                message: "Favourite updated successfully.",
                favourite: updatedFavourite
            });
        } catch (error) {
            next(error);
        }
});


module.exports = router;


