const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');
const Product = require('../models/Product');

router.post('/',(req,res)=>{
    let{search}=req.body
    console.log(search);
    res.render('product');
});

module.exports = router;