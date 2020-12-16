const express = require("express");
const farmRouter = express.Router();
const Farm = require("../models/farmModel");
const fetch = require("node-fetch");

farmRouter
  .route("/")
  .get(async (req, res, next) => {
    if(req.user.accountType === 'Petani'){
      try {
        const farms = await Farm.find();
        res.json(farms);
      } catch (error) {
        const err = new Error(error);
        next(err);
      }
    } else{
      res.status(400).json({ error: "Token is not valid" });
    }
  })
  .post(async (req, res, next) => {
    if(req.user.accountType === 'Petani'){
      try {
        const farm = await Farm.findOne({ name: req.body.name });
        if (farm) {
          const err = new Error("Farm already exists.");
          err.status = 400;
          next(err);
        }
        const newFarm = new Farm(req.body);
        await newFarm.save();
        res.status(200).json({ message: "Farm registered successfully!" });
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

farmRouter
  .route("/:id")
  .get(async (req, res, next) => {
    if(req.user.accountType === 'Petani'){
      try {
        const farm = await Farm.findById(req.params.id);
        res.json(farm);
      } catch (error) {
        const err = new Error("Farm not found.");
        err.status = 404;
        next(err);
      }
    }
    else {
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
        const data = await Farm.findOneAndUpdate(
          { _id: req.params.id },
          req.body
        );
  
        res.json({ message: "Farm updated sucessfully!", data: req.body });
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
        await Farm.findByIdAndDelete(req.params.id);
        res.json({ message: "Farm deleted successfully." });
      } catch (error) {
        const err = new Error(error);
        next(err);
      }
    } else {
      res.status(400).json({ error: "Token is not valid" });
    }
   
  });

farmRouter
  .route("/:id/condition")
  .get(async (req, res, next) => {
    if(req.user.accountType === 'Petani'){
      const farm = await Farm.findById(req.params.id);

    Promise.all([
      fetch(
        `https://api.ambeedata.com/weather/latest/by-lat-lng?lat=${farm.location.coordinates[1]}&lng=${farm.location.coordinates[0]}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "udhGS4H0r4lE7oDMTwZG2BGU5CbXOhz5f1FAKDyf",
          },
        }
      ),
      fetch(
        `https://api.ambeedata.com/soil/latest/by-lat-lng?lat=${farm.location.coordinates[1]}&lng=${farm.location.coordinates[0]}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.AMBIDATA_API,
          },
        }
      ),
    ])
      .then(async (response) => {
        const data = {
          cuaca: await response[0].json(),
          tanah: await response[1].json(),
        };
        res.json(data);
      })
      .catch((error) => {
        const err = new Error(error);
        next(err);
      });
    } else {
      res.status(400).json({ error: "Token is not valid" });
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
  .delete((req, res, next) => {
    const err = new Error("DELETE method is not allowed.");
    err.status = 405;
    next(err);
  });

module.exports = farmRouter;
