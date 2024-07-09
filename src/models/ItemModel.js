const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        enum: ["coffee", "tea", "milkshake", "food"],
        required: true 
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    }
});

const ItemModel = mongoose.model("Item", itemSchema);

module.exports = {
    ItemModel
}