const express = require("express");
const checkoutRouter = express.Router();
const Checkout = require("../models/checkoutModel");

checkoutRouter
  .route("/")
  .get(async (req, res, next) => {
    try {
      const checkout = await Checkout.find();
      res.json(checkout);
    } catch (error) {
      const err = new Error(error);
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const { alamat, total, metode, kurir, durasi } = req.body;
      const newCheckout = new Checkout({
        alamat,
        total,
        metode,
        kurir,
        durasi,
      });
      await newCheckout.save();
      res.status(200).json({ message: "Checkout successfully!" });
    } catch (error) {
      const err = new Error(error);
      next(err);
    }
  })
  .put((req, res, next) => {
    const err = new Error("PUT method is not allowed.");
    err.status = 405;
    next(err);
  })
  .delete((req, res, next) => {
    const err = new Error("DELETE method is not allowed.");
    err.status = 405;
    next(err);
  });

checkoutRouter
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const checkout = await Checkout.findById(req.params.id);
      res.json(checkout);
    } catch (error) {
      const err = new Error("Checkout not found.");
      err.status = 404;
      next(err);
    }
  })
  .post((req, res, next) => {
    const err = new Error("POST method is not allowed.");
    err.status = 405;
    next(err);
  })
  .put((req, res, next) => {
    const err = new Error("PUT method is not allowed.");
    err.status = 405;
    next(err);
  })
  .delete(async (req, res, next) => {
    try {
      await Checkout.findByIdAndDelete(req.params.id);
      res.json({ message: "Checkout deleted successfully." });
    } catch (error) {
      const err = new Error(error);
      next(err);
    }
  });

module.exports = checkoutRouter;
