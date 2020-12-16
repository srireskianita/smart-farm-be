const express = require("express");
const petaniRouter = express.Router();

const Petani = require("../models/petaniModel");

petaniRouter
  .route("/")
  .get(async (req, res, next) => {
    if(req.user.accountType === 'Petani'){
      try {
        const petanis = await Petani.find();
        res.json(petanis);
      } catch (error) {
        const err = new Error(error);
        next(err);
      }
    }else {
      res.status(400).json({ error: "Token is not valid" });
    }
   
  })
  .post(async (req, res, next) => {
    if(req.user.accountType === 'Petani'){
      try {
        const petani = await Petani.findOne({ email: req.body.email });
        if (petani) {
          const err = new Error("Email already in use.");
          err.status = 400;
          next(err);
        }
        const newPetani = new Petani(req.body);
        await newPetani.save();
        res
          .status(200)
          .json({ message: "Petani registered successfully!", data: req.body });
      } catch (error) {
        const err = new Error(error);
        next(err);
      }
    } else {
      res.status(400).json({ error: "Token is not valid" });
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
    if(req.user.accountType === 'Petani'){
    try {
      const petani = await Petani.findById(req.params.id);
      res.json(petani);
    } catch (error) {
      const err = new Error("Petani not found.");
      err.status = 404;
      next(err);
    }
   } else {
    res.status(400).json({ error: "Token is not valid" });
   }
  })
  .post((req, res, next) => {
    const err = new Error("POST method is not allowed.");
    err.status = 405;
    next(err);
  })
  .put(async (req, res, next) => {
    if(req.user.accountType === 'Petani'){
      try {
        const petani = await Petani.findOne({ email: req.body.email });
        if (petani) {
          const err = new Error("Email already in use.");
          err.status = 400;
          next(err);
        }
        const data = await Petani.findOneAndUpdate(
          { _id: req.params.id },
          req.body
        );
        res.json({ message: "Petani updated sucessfully!", data: req.body });
      } catch (error) {
        const err = new Error(error);
        next(err);
      }
    } else {
      res.status(400).json({ error: "Token is not valid" });
    }
   
  })
  .delete(async (req, res, next) => {
    if(req.user.accountType === 'Petani'){
    try {
      await Petani.findByIdAndDelete(req.params.id);
      res.json({ message: "Petani deleted successfully." });
    } catch (error) {
      const err = new Error(error);
      next(err);
    }
  } else {
    res.status(400).json({ error: "Token is not valid" });
  }
  });

module.exports = petaniRouter;
