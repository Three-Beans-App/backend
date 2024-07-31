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


module.exports = router;


