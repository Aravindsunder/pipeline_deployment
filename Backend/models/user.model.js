const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Item = require('./item.model').schema;


// Scraped for simplicity
// const AddressesSchema = mongoose.Schema({
//     address: {
//         type: String,
//         required: [true, 'address field is required'],
//     },
// });
// const PhoneNumbersSchema = mongoose.Schema({
//     phone: {
//         type: String,
//         required: [true, 'phno field is required'],
//     },
// });


const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name field is required'],
    },
    email: {
        type: String,
        required: [true, 'email field is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'password field is required'],
    },

    address: {
        type: String,
        required: [true, 'address field is required'],
    },
    phone: {
        type: String,
        required: [true, 'phone field is required'],
    },
    cart: {
        type: [
            {
                item: {
                    type: Item,
                    required: [true, 'item field is required'],
                },
                quantity: {
                    type: Number,
                    required: [true, 'quantity field is required'],
                    min: [1, 'Quantity must be at least 1'],
                },
            },
        ],
        default: [],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
});



// Apply the uniqueValidator plugin to the schema
UserSchema.plugin(uniqueValidator, {
    message: '{VALUE} is already taken',
});

const User = mongoose.model('User', UserSchema);
module.exports = User;