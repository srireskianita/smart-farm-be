const router = require('express').Router()
const Products = require('../models/productModel')
const Customers = require('../models/customerModel')
const Goods = require('../models/goodsModel');

router.route('/')
.post(async(req, res, next) => {
    try {
        
        const products = await Products.findById({_id: req.body.id});
        const customers = await Customers.findById({_id : req.body.id_user});
        if(!products || !customers){
            return res.status(500).json({msg: "1 error"})
        }else{
            if(products.stock === 0 || products.stock < req.body.purchased_stock){
                return res.status(500).json({msg: "Barang sudah habis atau tidak cukup"})
            }else{
                const newGoods = new Goods({
                    id_customer: req.body.id_user,
                    id_item: req.body.id,
                    purchased_stock: req.body.purchased_stock,
                    cart: req.body.cart
                })
                await newGoods.save()
                const stockItem = products.stock - req.body.purchased_stock
                await Products.findOneAndUpdate({_id: req.body.id},{
                    stock: stockItem
                })
                return res.json({msg: "Added to cart and Update stock Product"})
            }
        }
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
  })
.get(async(req, res, next) => {
        try {
            const goods = await Goods.find();
            res.status = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(goods)
        } catch (err) {
            return res.status(500).json({msg: err.msg});
        } 
  })

router.route('/:id')
.get(async(req, res, next) => {
    try {
        const goods = await Goods.find({id_user: req.params.id_user})
        res.json(goods) 
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
  })
.put(async(req, res, next) => {
    try {
        const goods = await Goods.findById({_id : req.params.id})
        const {purchased_stock, id_product} = req.body
        const products = await Products.findById(id_product)
        if(purchased_stock<0 || !goods){
            return res.status(500).json({msg: "Barang yang ingin diupdate tidak ada"})
        }
        
        const oldItem = goods.purchased_stock;
        if(oldItem < req.body.purchased_stock){
            const stockItem = products.stock + (oldItem - req.body.purchased_stock)
            await Products.findOneAndUpdate({_id: id_product},{
                stock: stockItem
            })
            await Goods.findOneAndUpdate({_id: req.params.id}, {
                purchased_stock: req.body.purchased_stock
            })
            res.status = 200;
            res.setHeader('Content-type', 'application/json');
            res.json({msg: "Cart updated successfully"}); 
            return res.json({msg: "Update stock item cart and Update stock Product"})
        }
        
        const stockItem = products.stock - purchased_stock + oldItem 
            await Products.findOneAndUpdate({_id: id_product},{
                stock: stockItem
            })
            await Goods.findOneAndUpdate({_id: req.params.id}, {
                purchased_stock: req.body.purchased_stock
            })
            res.status = 200;
            res.setHeader('Content-type', 'application/json');
            res.json({msg: "Cart updated successfully"}); 
            return res.json({msg: "Update stock item cart and Update stock Product"})
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
})
.delete(async(req, res, next) => {
        try {
            const goods = await Goods.findById({_id : req.params.id})
            const idItem = goods.id_item;
            const products = await Products.findById({_id : idItem})
            if(!goods || !products){
                return res.status(500).json({msg: err.msg});
            }
            const oldStock = goods.purchased_stock;
            const stockProduct = products.stock;
            const addStock = oldStock + stockProduct;
            await Products.findOneAndUpdate({_id: idItem},{
                stock: addStock
            })
            await Goods.findByIdAndDelete( req.params.id)
            res.status = 200;
            res.setHeader('Content-type', 'application/json');
            res.json({msg: "Delete a goods is success"})
        } catch (err) {
            return res.status(500).json({msg: err.msg});
        }
    
})

module.exports = router