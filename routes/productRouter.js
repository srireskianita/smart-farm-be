const router = require('express').Router()
const Products = require('../models/productModel')

router.route('/')
.get(async(req, res, next) => {
    try {
        const products = await Products.find();
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(products)
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
  })
.post(async(req, res, next) => {
    try {
        const {title, price, images, stock, description, category, minimum, unit} = req.body;
        if(!images){
            return res.status(400).json({msg: "No images upload"});
        }
        //const product = await Products.findOne({product_id});
        // if(product){
        //     return res.status(400).json({msg: "Product has exists"}); 
        // }
        const newProduct = new Products({
            title: title.toLowerCase(), price, images, stock, description, category, minimum, unit
        })
        await newProduct.save()
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg : "Created a Product success"});
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
  })


router.route('/:id')
.put(async(req, res, next) => {
    try {
        const{title, price, images, stock, description, category, minimum, unit} = req.body
        if(!images){
            return res.status(400).json({msg: "No images upload"});
        }
        await Products.findOneAndUpdate({_id: req.params.id},{
            title: title.toLowerCase(), price, images, stock, description, category, minimum, unit
        })
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Update a Product"}); 
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
})
.delete(async(req, res, next) => {
    try {
        await Products.findByIdAndDelete(req.params.id)
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Delete a product is success"})
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
})


module.exports = router