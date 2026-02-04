const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    allergenList: {
        type: [String],
        default: []
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String, // Thumbnail image in base64 string format
        default: ''
    },
    type: {
        type: String,
        enum: ['starter', 'main', 'dessert', 'side', 'drink'],
        default: 'main',
    },
    status:{
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
}, {
    timestamps: true
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;