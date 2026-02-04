const mongoose = require('mongoose');
const Item = require('./item.model').schema;

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,   // Foreign key UserId
        ref: 'User',
        required: true,
    },
    items: [
        {
            item: {
                type: Item, // Holds an item object
                ref: 'Item',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
        },
    ],
    discount: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['in-progress', 'delivered', 'cancelled'],
        default: 'in-progress',
    },
    delivery_slot: {    // Delivery hour chosen by the user
        type: Number,
        required: true,
    },
    delivery_date: {
        type: Date,
        required: true,
    },
    total_price: {
        type: Number,
    },
});


module.exports = mongoose.model('Order', orderSchema);