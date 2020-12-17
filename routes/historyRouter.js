const router = require('express').Router()
//const customers = require('../models/customerModel')
const userCart = require('../models/historyModel')
const Payments = require('../models/paymentModel')

router.route('/')
// .get(async(req, res, next) => {
//     //Keperluan History
//     req.user.id diambil saat customer telah login 
//     try {
//         const history = await Payments.find({user_id: req.user.id})

//         res.json(history) 
//     } catch (err) {
//         return res.status(500).json({msg: err.message})
//     }
//   })
.post(async(req, res, next) => {
    //Add Cart ke userCartModel
    try {
        //req.user.id diambil saat customer telah login 
        //const customer = await customers.findById(req.user.id)
        //if(!customer) return res.status(400).json({msg: "User does not exist."})
        
        //const {_id} = customer;

        // const newUserCart = new userCart({
        //     user_id: _id
        // })

        //test with postman
        const newUserCart = new userCart({
            user_id: req.body.id,
            cart: req.body.cart
        })

        await newUserCart.save()
        
        // await userCart.findOneAndUpdate({user_id: req.user.id}, {
        //     cart: req.body.cart
        // })
    
        return res.json({msg: "Added to cart"})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
  })
  
  //test with postman
  router.route('/:id')
  .get(async(req, res, next) => {
    //Keperluan History 
    try {
        const history = await Payments.find({user_id: req.params.id})

        res.json(history) 
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
  })

module.exports = router