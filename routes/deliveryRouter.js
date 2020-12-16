const router = require('express').Router()
const Delivery = require('../models/deliveryModel')

router.route('/')
.get(async(req, res, next) => {
    if(req.user.accountType === 'Petani'){
        try {
            const delivery = await Delivery.find();
            res.status = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(delivery);
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
            const {courierId, courierName, duration, destination, cost} = req.body;
            if(!destination){
                return res.status(400).json({msg: "No Delivery were set"});
            }
            const newDelivery = new Delivery({
                title: title.toLowerCase(), courierId, courierName, duration, destination, cost
            })
            await newDelivery.save()
            res.status = 200;
            res.setHeader('Content-type', 'application/json');
            res.json({msg : "Delivery set successfully"});
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
            const{courierId, courierName, duration, destination, cost} = req.body
            if(!destination){
                return res.status(400).json({msg: "No Delivery were set"});
            }
            await Destination.findOneAndUpdate({_id: req.params.id},{
                title: title.toLowerCase(), courierId, courierName, duration, destination, cost
            })
            res.status = 200;
            res.setHeader('Content-type', 'application/json');
            res.json({msg: "Delivery updated successfully"}); 
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
            await Delivery.findByIdAndDelete(req.params.id)
            res.status = 200;
            res.setHeader('Content-type', 'application/json');
            res.json({msg: "Delivery deleted successfully"})
        } catch (err) {
            return res.status(500).json({msg: err.msg});
        }
    } else {
        res.status(400).json({ error: "Token is not valid" });
    }
})



module.exports = router