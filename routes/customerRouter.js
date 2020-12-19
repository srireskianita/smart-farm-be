const router = require('express').Router();
const Customer = require('../models/customerModel');
const bcrypt = require("bcryptjs");

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
    } catch (error) {
        const err = new Error("Error add Customer");
        err.status = 404;
        next(err);
    }
  })


router.route('/:id')
.put(async(req, res, next) => {
    try {
        let{name, email, password, address, phoneNumber, accountType} = req.body
        let salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        await Customer.findOneAndUpdate({_id: req.params.id},{
            name, email, password, address, phoneNumber, accountType
        })
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Update a Customer"}); 
    } catch (error) {
        const err = new Error(error);
        err.status = 400;
        next(err);
      }
})
.delete(async(req, res, next) => {
    try {
        await Customer.findByIdAndDelete(req.params.id)
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Delete a customer is success"})
    } catch (error) {
        const err = new Error(error);
        err.status = 400;
        next(err);
    }
})
.get((req,res,next) => {
    try {
        Customer.findById(req.params.id).then((customer) => {
            res.status = 200 ;
            res.setHeader('Content-Type', 'application/json');
            res.json(customer);
        });
    }catch (error) {
        const err = new Error('Customer not found');
        err.status = 404;
        next(err);
    }
});


module.exports = router