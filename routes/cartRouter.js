const router = require('express').Router()
const Cart = require('../models/cartModel')

router.route('/')
.get(async(req, res, next) => {
    try {
        const cart = await Cart.find();
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(cart);
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
  })

.post(async(req, res, next) => {
    try {
        const {item, customerName, count, amount} = req.body;
        if(!count){
            return res.status(400).json({msg: "No Item added"});
        }
        const newCart = new Cart({
            title: title.toLowerCase(), item, customerName, count, amount
        })
        await newCart.save()
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg : "Item(s) added to Cart"});
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
})

router.route('/:id')
.put(async(req, res, next) => {
    try {
        const {item, customerName, count, amount} = req.body
        if(!count){
            return res.status(400).json({msg: "No Item added"});
        }
        await Cart.findOneAndUpdate({_id: req.params.id},{
            title: title.toLowerCase(), item, customerName, count, amount
        })
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Cart updated successfully"}); 
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
})
.delete(async(req, res, next) => {
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Item(s) deleted successfully"})
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
})



module.exports = router