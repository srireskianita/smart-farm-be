const router = require('express').Router()
const Sorting = require('../models/productModel');

router.route('/title') //ascending
    .get(async (req, res, next) => {
        try {
            const sortings = await Sorting.find().sort({
                title: 1,
            });
            res.status = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(sortings);
        } catch (err) {
            return res.status(500).json({
                msg: err.msg
            });
        }
    })

router.route('/price') //ascending
    .get(async (req, res, next) => {
        try {
            const sortings = await Sorting.find().sort({
                price: 1,
            });
            res.status = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(sortings);
        } catch (err) {
            return res.status(500).json({
                msg: err.msg
            });
        }
    })

router.route('/stock') //ascending
    .get(async (req, res, next) => {
        try {
            const sortings = await Sorting.find().sort({
                stock: 1,
            });
            res.status = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(sortings);
        } catch (err) {
            return res.status(500).json({
                msg: err.msg
            });
        }
    })

router.route('/titled') //descending
    .get(async (req, res, next) => {
        try {
            const sortings = await Sorting.find().sort({
                title: -1,
            });
            res.status = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(sortings);
        } catch (err) {
            return res.status(500).json({
                msg: err.msg
            });
        }
    })

router.route('/priced') //descending
    .get(async (req, res, next) => {
        try {
            const sortings = await Sorting.find().sort({
                price: -1,
            });
            res.status = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(sortings);
        } catch (err) {
            return res.status(500).json({
                msg: err.msg
            });
        }
    })

router.route('/stockd') //descending
    .get(async (req, res, next) => {
        try {
            const sortings = await Sorting.find().sort({
                stock: -1,
            });
            res.status = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(sortings);
        } catch (err) {
            return res.status(500).json({
                msg: err.msg
            });
        }
    })


module.exports = router