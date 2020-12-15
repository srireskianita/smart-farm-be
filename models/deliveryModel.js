const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
    courierId: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    courierName: {
        type: String,
        trim: true,
        required: true
    },
    duration: {
        type: String,
        trim: true,
        required: true
    },
    destination: {
        type: String,
        trim: true,
        required: true
    },
    cost: {
        type: Number,
        trim: true,
        required: true
    }
},{
    timestamps: true
}
)

module.exports = mongoose.model("Delivery", deliverySchema)