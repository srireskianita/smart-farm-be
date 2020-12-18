const mongoose = require('mongoose')

const goodsSchema = new mongoose.Schema({
    id_customer: {
        type: String,
        required: true,
        trim: true
    },
    id_item: {
        type: String,
        required: true,
        trim: true
    },
    purchased_stock: {
        type: Number,
        required: true,
        default: 0
    },
    cart: {
        type: Array,
        default: []
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Goods', goodsSchema)
