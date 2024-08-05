const mongoose = require('mongoose');
const { UserModel } = require('./UserModel.js');
const { ItemModel, CategoryModel } = require('./ItemModel.js');

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
});


const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    guestUser: {
        name: {
            type: String,
            required: false
        },
        contact: {
            type: String,
            required: false
        }
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
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    }
});

const OrderModel = mongoose.model('Order', orderSchema);

module.exports = {
    OrderModel
}