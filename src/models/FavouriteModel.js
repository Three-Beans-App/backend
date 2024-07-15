const mongoose = require('mongoose');
const { UserModel } = require('./UserModel.js');
const { ItemModel } = require('./ItemModel.js');


const favouriteItemSchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    customisations: {
        size: {
            type: String,
            required: false
        },
        milk: {
            type: String,
            required: false
        },
        sugar: {
            type: String,
            required: false
        }
    }
});


const favouriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    item: favouriteItemSchema
});

const FavouriteModel = mongoose.model('Favourite', favouriteSchema);

module.exports = {
    FavouriteModel
}