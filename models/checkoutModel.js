const mongoose = require("mongoose");

const checkoutSchema = new mongoose.Schema(
  {
    alamat: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    metode: {
      type: String,
      required: true,
    },
    kurir: {
      type: String,
    },
    durasi: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Checkout", checkoutSchema);
