const mongoose = require('mongoose');
const { UserModel } = require('./UserModel.js');
const { ItemModel, CategoryModel, InventoryModel } = require('./ItemModel.js');

const orderItemSchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    customisations: {
        size: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Inventory',
            required: false
        },
        milk: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Inventory',
            required: false
        },
        sugar: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Inventory',
            required: false
        }
    }
});


const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema],
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "preparing", "ready", "completed", "cancelled"],
        default: "pending"
    }
});

const OrderModel = mongoose.model('Order', orderSchema);

module.exports = {
    OrderModel
}