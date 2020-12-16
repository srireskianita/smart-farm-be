const mongoose = require("mongoose");
const geocoder = require("../utils/geocoder");
const farmSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    petani: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Petani",
    },
    address: {
      type: String,
      required: [true, "Please add an address."],
    },
    location: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAddress: String,
    },
  },
  {
    timestamps: true,
  }
);

farmSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.address);
  if (loc[0]) {
    this.location = {
      type: "Point",
      coordinates: [loc[0].longitude, loc[0].latitude],
      formattedAddress: loc[0].formattedAddress,
    };
  } else {
    this.location = {
      type: "Point",
      coordinates: null,
      formattedAddress: "Alamat tidak ditemukan.",
    };
  }
  this.address = undefined;
});

farmSchema.pre("findOneAndUpdate", async function (next) {
  const loc = await geocoder.geocode(this.getUpdate().address);
  if (loc[0]) {
    this.getUpdate().location = {
      type: "Point",
      coordinates: [loc[0].longitude, loc[0].latitude],
      formattedAddress: loc[0].formattedAddress,
    };
  } else {
    this.getUpdate().location = {
      type: "Point",
      coordinates: [],
      formattedAddress: "Alamat tidak ditemukan.",
    };
  }
  delete this.getUpdate().address;
});

module.exports = mongoose.model("Farm", farmSchema);
