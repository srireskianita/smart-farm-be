const mongoose = require("mongoose");

require("mongoose-currency").loadType(mongoose);
var Currency = mongoose.Types.Currency;

const checkoutSchema = new mongoose.Schema(
  {
    alamat: {
      type: String,
      required: true,
    },
    total: {
      type: Currency,
      required: true,
      min: 0,
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
    pembeli: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
      },
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      phoneNumber: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Checkout", checkoutSchema);
