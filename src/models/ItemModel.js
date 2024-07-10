const mongoose = require('mongoose');


const itemSchema = new mongoose.Schema({
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
    quantity: {
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


const inventorySchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ["milk", "sugar", "size"],
        equired: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    quantity: {
        type: Number,
        required: true
    }
})


const ItemModel = mongoose.model("Item", itemSchema);
const InventoryModel = mongoose.model("Inventory", inventorySchema);

module.exports = {
    ItemModel,
    InventoryModel
}