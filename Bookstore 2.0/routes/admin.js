const express = require('express');
const router = express.Router();

router.get('/index',(req,res)=>{
    res.render('', {layout: "admin"})
});
router.get('/userinfo',(req,res)=>{
    res.render('', {layout: "userinfo"})
});
router.get('/tablelist',(req,res)=>{
    res.render('', {layout: "table"})
});





module.exports=router;


