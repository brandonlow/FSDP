const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Admin=require('../models/Admin');
const bcrypt = require('bcryptjs');
const admin = require('../models/Admin');
const Product = require('../models/Product');

router.get('/index',(req,res)=>{
    User.findAll({
	}).then((users) => {
		res.render('', {
            layout:'dashboard',
			users:users
		});
	}).catch(err => console.log(err));
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
	Product.findAll({
		raw: true
	}).then((products) => {
		res.render('', {
            layout:"producttable",
			products: products
		});
	}).catch(err => console.log(err));
});
router.get('/showaddproduct',(req,res)=>{
    res.render('', {layout: "addproduct"})
});
router.post('/addproduct',(req,res)=>{
	let { title, author, price, url } = req.body;
	let dateAdded = new Date();
	Product.create({
		title,
		author,
		price,
		dateAdded,
		url
	})
	res.redirect('./producttable');
});
router.get('/showupdateproduct/:id',(req,res)=>{
	Product.findOne({
		where: {
		id: req.params.id
		}
		}).then((product) => {
			res.render('', {
				layout:"updateproduct",
				product: product
			});
	}).catch(err => console.log(err));
});
router.put('/updateproduct/:id', (req, res) => {
	let { title, author, price, url } = req.body;
	Product.update({
		title: title,
		author: author,
		price: price,
		url: url
	}, {
	where: {
	id: req.params.id
	}
	}).then(() => {
	// After saving, redirect to router.get(/listVideos...) to retrieve all updated
	// videos
	res.redirect('../producttable');
	}).catch(err => console.log(err));
});
router.get('/deleteproduct/:id', (req, res) => {
	Product.destroy({
		where: {
			id: req.params.id
		}
	}).then(() => {
		res.redirect('../producttable');
	}).catch(err => console.log(err));
});
module.exports=router;


