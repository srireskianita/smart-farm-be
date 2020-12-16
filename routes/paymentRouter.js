const router = require('express').Router()
const Payments = require('../models/paymentModel')
const customers = require('../models/customerModel')

router.route('/')
.get(async(req, res, next) => {
    try {
        //Mengambil semua data payment yang telah masuk
        const payments = await Payments.find()
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(payments)
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
  })
  .post(async(req, res, next) => {
        //Membuat data payment
        try {
            const customer = await customers.findById(req.user.id).select('name email')
        if(!customer) return res.status(400).json({msg: "User does not exist."})

        const {cart, paymentID, address} = req.body;

        const {_id, name, email} = customer;

        const newPayment = new Payments({
            user_id: _id, name, email, cart, paymentID, address
        })
        
        await newPayment.save()
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Payment Succes!"})
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
  })

  module.exports = router