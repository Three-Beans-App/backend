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


module.exports = router;
