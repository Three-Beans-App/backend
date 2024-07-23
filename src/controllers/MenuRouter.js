const express = require('express');
const { ItemModel } = require('../models/ItemModel');
const router = express.Router();


// Base route to get all items
router.get("/", async (request, response, next) => {
    // query database to find all item documents
    let items = await ItemModel.find({}).exec();

    response.json({
        // respond with each item
        result: items
    });
});


// Route to get a single item by ID
router.get("/:id", async (request, response, next) => {
    try {
        // include itemID in the search params
        const itemId = request.params.id;
        // query database to find matching item for the ID
        const item = await ItemModel.findById(itemId).exec();

        if (!item) {
            // return a 404 if no item with the ID exists
            return response.status(404).json({
                message: "Item not found"
            });
        }

        response.json({
            // respond with the matching item
            result: item
        });
    } catch (error) {
        next(error);
    }
});


module.exports = router;
