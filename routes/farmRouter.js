const express = require("express");
const farmRouter = express.Router();
const Farm = require("../models/farmModel");

farmRouter
  .route("/")
  .get(async (req, res, next) => {
    try {
      const farms = await Farm.find();
      res.json(farms);
    } catch (error) {
      const err = new Error(error);
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const { name, petani } = req.body;

      const farm = await Farm.findOne({ name });
      if (farm) {
        const err = new Error("Farm already exists.");
        err.status = 400;
        next(err);
      }
      const newFarm = new Farm({
        name,
        petani,
      });
      await newFarm.save();
      res.status(200).json({ message: "Farm registered successfully!" });
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

farmRouter
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const farm = await Farm.findById(req.params.id);
      res.json(farm);
    } catch (error) {
      const err = new Error("Farm not found.");
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
      const { name, petani } = req.body;
      await Farm.findOneAndUpdate(
        { _id: req.params.id },
        {
          name,
          petani,
        }
      );

      res.json({ message: "Farm updated sucessfully!" });
    } catch (error) {
      const err = new Error(error);
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await Farm.findByIdAndDelete(req.params.id);
      res.json({ message: "Farm deleted successfully." });
    } catch (error) {
      const err = new Error(error);
      next(err);
    }
  });

module.exports = farmRouter;
