const router = require('express').Router();
const Customer = require('../models/customerModel');

router.route('/')
.get(async(req, res, next) => {
    try {
        const customers = await Customer.find();
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(customers)
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
  })
.post(async(req, res, next) => {
    try {
        const {customer_id, name, email, password, address, phoneNumber, accountType} = req.body;
   
        const customer = await Customer.findOne({customer_id});
        if(customer){
            return res.status(400).json({msg: "Customer has exists"}); 
        }
        const newCustomer= new Customer({
            customer_id, name, email, password, address, phoneNumber, accountType
        })
        await newCustomer.save()
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg : "Created a Customer success"});
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
  })


router.route('/:id')
.put(async(req, res, next) => {
    try {
        const{name, email, password, address, phoneNumber, accountType} = req.body
        await Customer.findOneAndUpdate({_id: req.params.id},{
            name, email, password, address, phoneNumber, accountType
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
        await Customer.findByIdAndDelete(req.params.id)
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Delete a customer is success"})
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
})
.get((req,res,next) => {
    Customer.findById(req.params.id).then((dish) => {
        res.status = 200 ;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    });
})


module.exports = router