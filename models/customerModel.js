const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        require: true
    },
    accountType: {
        type:String,
        require: true,
        enum: ["Petani", "Customer"]
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },

},{
    timestamps: true
});
module.exports = mongoose.model("Customer", customerSchema)