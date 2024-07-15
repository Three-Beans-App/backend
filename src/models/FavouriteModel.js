const mongoose = require('mongoose');
const { UserModel } = require('./UserModel.js');
const { ItemModel, CustomisationModel, CategoryModel } = require('./ItemModel.js');


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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    customizations: {
        size: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customisation',
            required: false
        },
        milk: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customisation',
            required: false
        },
        sugar: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customisation',
            required: false
        },
        extra: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customisation',
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