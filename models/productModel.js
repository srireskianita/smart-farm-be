const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: Number,
        trim: true,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 1
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: Object,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ["Sayuran", "Buah"]
    },
    //Minimal pembelian 
    minimum: {
        type: Number,
        default: 1,
        require: true
    },
    //Satuan minimal pembelian
    unit: {
        type: String,
        required: true
    }
})
    



module.exports = mongoose.model("Products", productSchema)