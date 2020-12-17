const router = require('express').Router()
const Products = require('../models/productModel')

router.route('/')
.get(async(req, res, next) => {
    if(req.user.accountType === 'Petani' || req.user.accountType === 'Customer' ){
        try {
            const products = await Products.find();
            res.status = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(products)
        } catch (err) {
            return res.status(500).json({msg: err.msg});
        }
    } else {
        res.status(400).json({ error: "Token is not valid" });
    }
    
  })
.post(async(req, res, next) => {
    if(req.user.accountType === 'Petani'){
        try {
            const {title, price, stock, description, images, category, minimum, unit} = req.body;
            if(!images){
                return res.status(400).json({msg: "No images upload"});
            }
            //const product = await Products.findOne({product_id});
            // if(product){
            //     return res.status(400).json({msg: "Product has exists"}); 
            // }
            const newProduct = new Products({
                title: title.toLowerCase(), price, stock, description, images, category, minimum, unit
            })
            await newProduct.save()
            res.status = 200;
            res.setHeader('Content-type', 'application/json');
            res.json({msg : "Created a Product success"});
        } catch (err) {
            return res.status(500).json({msg: err.msg});
        }
    } else {
        res.status(400).json({ error: "Token is not valid" });
    }
    
  })


router.route('/:id')
.put(async(req, res, next) => {
    if(req.user.accountType === 'Petani'){
    try {
        const{title, price, stock, description, images, category, minimum, unit} = req.body
        if(!images){
            return res.status(400).json({msg: "No images upload"});
        }
        await Products.findOneAndUpdate({_id: req.params.id},{
            title: title.toLowerCase(), price, stock, description, images, category, minimum, unit
        })
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Update a Product"}); 
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
   } else {
    res.status(400).json({ error: "Token is not valid" });
   }
})
.delete(async(req, res, next) => {
    if(req.user.accountType === 'Petani'){
        try {
            await Products.findByIdAndDelete(req.params.id)
            res.status = 200;
            res.setHeader('Content-type', 'application/json');
            res.json({msg: "Delete a product is success"})
        } catch (err) {
            return res.status(500).json({msg: err.msg});
        }
    } else {
        res.status(400).json({ error: "Token is not valid" });
    }
    
})


module.exports = router