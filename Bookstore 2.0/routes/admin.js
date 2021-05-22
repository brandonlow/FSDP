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
router.get('/producttable',(req,res)=>{
    res.render('', {layout: "producttable"})
});
router.get('/addproduct',(req,res)=>{
    res.render('', {layout: "addproduct"})
});





module.exports=router;


