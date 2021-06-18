const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/index',(req,res)=>{
    res.render('', {layout: "dashboard"})
});
router.get('/userinfo',(req,res)=>{
    res.render('', {layout: "userinfo"})
});
router.get('/tablelist',(req,res)=>{
    User.findAll({
		raw: true
	}).then((users) => {
		res.render('', {
            layout:"usertable",
			users: users
		});
	}).catch(err => console.log(err));
});
router.get('/producttable',(req,res)=>{
    res.render('', {layout: "producttable"})
});
router.get('/addproduct',(req,res)=>{
    res.render('', {layout: "addproduct"})
});
module.exports=router;


