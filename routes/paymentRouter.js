const router = require('express').Router()
const Payments = require('../models/paymentModel')
const Customers = require('../models/customerModel')

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
        const {cart, paymentID, address, user_id, name, email} = req.body;
        // const idpayment = req.body.paymentID;
        const customer = await Customers.findById({_id: user_id})
        const payment_id = await Payments.findOne({paymentID: paymentID})
        if(!customer){
            return res.status(500).json({msg: err.msg});
        }
        if(payment_id){
            return res.status(500).json({msg: err.msg});
        }
        const newPayment = new Payments({
            cart, paymentID, address, user_id, name, email
        })
        await newPayment.save()
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Payment Succes!"})
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
  })

  //Untuk keperluan history pembayaran oleh pembeli
  router.route('/:id')
  .get(async(req, res, next) => { 
    try {
        const history = await Payments.find({user_id: req.params.id})

        res.json(history) 
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
  })

  module.exports = router