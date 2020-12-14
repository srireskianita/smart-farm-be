const express = require("express");
const petaniRouter = express.Router();

const Petani = require("../models/petaniModel");

petaniRouter
  .route("/")
  .get(async (req, res, next) => {
    try {
      const petanis = await Petani.find();
      res.json(petanis);
    } catch (error) {
      const err = new Error(error);
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const {
        name,
        email,
        password,
        address,
        phoneNumber,
        accountType,
      } = req.body;

      const petani = await Petani.findOne({ email });
      if (petani) {
        const err = new Error("Petani already exists.");
        err.status = 400;
        next(err);
      }
      const newPetani = new Petani({
        name,
        email,
        password,
        address,
        phoneNumber,
        accountType,
      });
      await newPetani.save();
      res.status(200).json({ message: "Petani registered successfully!" });
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

petaniRouter
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const petani = await Petani.findById(req.params.id);
      res.json(petani);
    } catch (error) {
      const err = new Error("Petani not found.");
      err.status = 404;
      next(err);
    }
  })
  .post((req, res, next) => {
    const err = new Error("POST method is not allowed.");
    err.status = 405;
    next(err);
  })
  .put(async (req, res, next) => {
    try {
      const {
        name,
        email,
        password,
        address,
        phoneNumber,
        accountType,
      } = req.body;
      await Petani.findOneAndUpdate(
        { _id: req.params.id },
        {
          name,
          email,
          password,
          address,
          phoneNumber,
          accountType,
        }
      );

      res.json({ message: "Petani updated sucessfully!" });
    } catch (error) {
      const err = new Error(error);
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await Petani.findByIdAndDelete(req.params.id);
      res.json({ message: "Petani deleted successfully." });
    } catch (error) {
      const err = new Error(error);
      next(err);
    }
  });

module.exports = petaniRouter;
