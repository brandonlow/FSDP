const express = require('express');
const { session } = require('passport');
const passport = require('passport');
const { database } = require('../config/db');
const router = express.Router();
const alertMessage = require('../helpers/messenger');
// const Admin = require('../models/admin');
const User = require('../models/User');
const Feedback = require('../models/Feedback');


router.get('/', (req, res) => {
	res.render('index') // renders views/index.handlebars
});
router.get('/showlogin', (req, res) => {
	res.render('user/login');
});
router.get('/showprofile',(req,res)=>{
	let error_msg = 'PLease login to your account';
	res.render('index',{error_msg:error_msg})
});

router.get('/account',(req,res)=>{
	User.findOne({
		where:{id:req.user.id}
	}).then(() => {
		res.render('user/profile', {
		});
	}).catch(err => console.log(err));
});

router.get('/showregister', (req, res) => {
	res.render('user/register')
});
router.get('/showforget',(req,res) => {
	res.render('user/forget')
});
// Logout User
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

router.get('/showproduct', (req, res) => {
	res.render('product');
})
router.get('/showcontact',(req,res)=>{
	res.render('contact')
});
router.get('/showcart',(req,res)=>{
	res.render('cart')
});

router.get('/showcheckout',(req,res)=>{
	res.render('checkout')
});
router.get('/about', (req, res) => {
	let error="This is an error in erros.handlebars";
	const author = 'Denzel Washington';
	let success_msg = 'Success message';
	let error_msg = 'Error message using error_msg';
	alertMessage(res, 'success',
		'This is an important message', 'fas fa-sign-in-alt', true);
	alertMessage(res, 'danger',
		'Unauthorised access', 'fas fa-exclamation-circle', false);
	//first way
	let errors=[];
	errors.push({text:"First error message"},{text:"Second error message"});
	//seond way
	//let erros=[{text:"first error message"},{text:"second error message"}];
	res.render('about', {
		author: author,
		success_msg:  success_msg,
		error_msg:error_msg,
		error:error,
		errors:errors
	})
});

router.get('/showfeedback',(req,res)=>{
	res.render('feedback')
});

router.get('/showreviews',(req,res)=>{
	res.render('reviews')
});
router.get('/showabout',(req,res)=>{
	res.render('about')
});

router.get('/success', (req, res) => {
	User.findOne({
		where:{id:req.user.id}
	}).then(() => {
		res.render('index', {
		});
	}).catch(err => console.log(err));
});

router.get('/showadd', (req, res) => {
	res.render('admin/add');
});
router.get('/showadminlogin', (req, res) => {
	res.render('admin/login');
});
module.exports = router;
