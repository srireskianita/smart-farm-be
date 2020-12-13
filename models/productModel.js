const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_id: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
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
        required: true
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