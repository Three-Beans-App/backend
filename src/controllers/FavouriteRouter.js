const express = require('express');
const { FavouriteModel } = require('../models/FavouriteModel');
const { ItemModel } = require('../models/ItemModel');
const { verifyJwt, validateObjectId } = require('../utils/middleware');
const router = express.Router();


/* == POST == */


// Route to add a new favourite
// eg. POST localhost:3001/favourites/
router.post(
    "/",
    verifyJwt,
    async (request, response, next) => {
        // Retrieve the user ID and item Id from the request body
        const { userId, itemId } = request.body;

        try{
            // Search the database for the item
            const item = await ItemModel.findById(itemId);

            // If no item is found respond with a 404 status
            if (!item) {
                return response.status(404).json({
                    message: "Item not found."
                });
            }
            // Check to make sure the favourite does not already exist 
            const existingFavourite = await FavouriteModel.findOne({
                user: userId,
                "item.itemId": itemId
            });
            // If the favourite exists respond with a 400 status
            if (existingFavourite) {
                return response.status(400).json({
                    message: "Item is already in your favourites."
                });
            }

            // Create a new favourite document and save it to the database
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

            // Respond with confirmation and the new favourite
            response.status(201).json({
                message: "Favourite added successfully.",
                favourite: newFavourite
            });
        } catch (error) {
            next(error);
        }
});


/* == GET == */


// Route for users to view their favourites
// eg. GET localhost:3001/favourites/66b09e3ebd25c7965350a9bc/
router.get(
    "/:id",
    validateObjectId,
    verifyJwt,
    async (request, response, next) => {
        // Retrieve the user ID from the request params
        const { id } = request.params;
        try {
            // Search the database for favourites matching the user ID
            const result = await FavouriteModel.find({
                user: id
            }).exec();
            
            // Respond with the search result
            response.status(200).json({ result });
        } catch (error) {
            next(error);
        }
});


/* == PATCH == */


// Route to update existing favourite
// eg. PATCH localhost:3001/favourites/66b09e40bd25c7965350a9ed/
router.patch(
    "/:id",
    validateObjectId,
    verifyJwt,
    async (request, response, next) => {
        // Retrieve the user ID from the request params
        // Retrieve the item ID from the request body
        const { id } = request.params;
        const { itemId } = request.body;

        try {
            // Search the database for the item 
            const item = await ItemModel.findById(itemId);

            // If no item is found respond with a 404 status
            if (!item) {
                return response.status(404).json({
                    message: "Item not found."
                });
            }
            // Search the database for the order and update it
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

            // If no favourite is found respond with a 404 status 
            if (!updatedFavourite) {
                return response.status(404).json({
                    message: "Favourite not found."
                });
            }
            // Respond with confirmation and the updated favourite
            response.status(200).json({
                message: "Favourite updated successfully.",
                favourite: updatedFavourite
            });
        } catch (error) {
            next(error);
        }
});


/* == DELETE == */


// Route to delete favourite
// eg. DELETE localhost:3001/favourites/66b09e40bd25c7965350a9ed/
router.delete(
    "/:id",
    validateObjectId,
    verifyJwt,
    async (request, response, next) => {
        // Retrieve the favourite ID from the request params
        const { id } = request.params;
        try {
            // Search the database for the favourite and delete it
            const favourite = await FavouriteModel.findByIdAndDelete(id).exec();

            // If no favourite is found respond with a 404 status
            if (!favourite) {
                return response.status(404).json({
                    message: "Favourite not found."
                });
            }
            // Respond with confirmation
            response.status(200).json({
                message: "Favourite deleted successfully."
            });
        } catch (error) {
            next(error)
        } 
});


module.exports = router;


