const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    item: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    customerName: {
        type: String,
        trim: true,
        required: true,
    },
    count: {
        type: Number,
        trim: true,
        required: true
    },
    amount: {
        type: Number,
        trim: true,
        required: true
    }
})

module.exports = mongoose.model("Cart", cartSchema)