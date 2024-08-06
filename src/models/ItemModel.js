const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

const CategoryModel = mongoose.model('Category', categorySchema);


const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
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
    available: {
        type: Boolean,
        default: true,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false,
        default: 'https://via.placeholder.com/250x250?text=No+Image'
    }
});


const ItemModel = mongoose.model("Item", itemSchema);

module.exports = {
    ItemModel,
    CategoryModel
}