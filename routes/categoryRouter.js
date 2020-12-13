const router = require('express').Router()
const Category = require('../models/categoryModel') 


router.route('/')
.get(async(req, res, next) => {
    try {
        const categories = await Category.find()
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(categories)
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
  })
.post(async(req, res, next) => {
    try {
        const {name} = req.body
        const category = await Category.findOne({name})
            if(category){
                return res.status(400).json({msg: "This category is already exists"}) 
            }
        const newCategory = new Category({name})
        await newCategory.save()
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Create a category"})
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
  })

router.route('/:id')
.put(async(req, res, next) => {
    try {
        const {name} = req.body
        await Category.findOneAndUpdate({_id: req.params.id}, {
            name
        })
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Update a Category"})
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
})
.delete(async(req, res, next) => {
    try {
        await Category.findByIdAndDelete(req.params.id) 
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Deleted a category"}) 
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
})



module.exports = router