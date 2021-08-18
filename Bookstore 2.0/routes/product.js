const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');
const Product = require('../models/Product');



router.get('/adventure',(req,res)=>{
	Product.findAll({
		where:{category:'adventure'}
	}).then((adventure) => {
		res.render('product', {
            adventure:adventure
		});
	}).catch(err => console.log(err));
});
router.get('/fiction',(req,res)=>{
	Product.findAll({
		where:{category:'fiction'}
	}).then((fiction) => {
		res.render('product', {
            fiction:fiction
		});
	}).catch(err => console.log(err));
});
router.get('/horror',(req,res)=>{
	Product.findAll({
		where:{category:'horror'}
	}).then((horror) => {
		res.render('product', {
            horror:horror
		});
	}).catch(err => console.log(err));
});
router.get('/kids',(req,res)=>{
	Product.findAll({
		where:{category:'kids'}
	}).then((kids) => {
		res.render('product', {
            kids:kids
		});
	}).catch(err => console.log(err));
});
router.get('/nonfiction',(req,res)=>{
	Product.findAll({
		where:{category:'non-fiction'}
	}).then((nonfiction) => {
		res.render('product', {
            nonfiction:nonfiction
		});
	}).catch(err => console.log(err));
});
router.get('/popular',(req,res)=>{
	Product.findAll({
		where:{category:'popular'}
	}).then((popular) => {
		res.render('product', {
            popular:popular
		});
	}).catch(err => console.log(err));
});
router.get('/:id',(req,res)=>{
	Product.findOne({
		where:{id:req.params.id}
	}).then((product) => {
		res.render('product-details', {
            product:product
		});
	}).catch(err => console.log(err));
});

module.exports = router;