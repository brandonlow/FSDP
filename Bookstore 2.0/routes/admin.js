const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const admin = require('../models/Admin');
const Product = require('../models/Product');
const alertMessage = require('../helpers/messenger');
const { error } = require('flash-messenger/Alert');

router.post('/add', (req, res) => {
	let errors = [];

	// Retrieves fields from register page from request body
	let { name, email, password, password2 } = req.body;
	// Checks if both passwords entered are the same
	if (password !== password2) {
		errors.push({ text: 'Passwords do not match' });
	}

	// Checks that password length is more than 4
	if (password.length < 4) {
		errors.push({ text: 'Password must be at least 4 characters' });
	}

	/*
	 If there is any error with password mismatch or size, then there must be
	 more than one error message in the errors array, hence its length must be more than one.
	 In that case, render register.handlebars with error messages.
	 */
	if (errors.length > 0) {
		res.render('user/register', {
			errors,
			name,
			email,
			password,
			password2
		});
	} else {
		Admin.findOne({
			where: { email }
		})
			.then(admin => {
				if (admin) {
					// If user is found, that means email given has already been registered
					//req.flash('error_msg', user.name + ' already registered');
					res.render('admin/add', {
						error: admin.email + ' already registered',
						name,
						email,
						password,
						password2
					});
				} else {

					// Generate salt hashed password
					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(password, salt, (err, hash) => {
							if (err) throw err;
							password = hash;
							// Create new user record
							Admin.create({
								name,
								email,
								password
							})
								.then(admin => {
									alertMessage(res, 'success', admin.name + ' added successfully', 'fas fa-sign-in-alt', true);
									res.redirect('/showadminlogin');
								})
								.catch(err => console.log(err));
						})
					});

				}
			});

	}
});
router.post('/login', (req, res) => {
	let {email,password}=req.body
    Admin.findOne({ where: { email: email } })
            .then(admin => {
                if (!admin) {
					res.render('admin/login', {
						error: 'Incorrect email or password',
						email,
						password
					});
                }
                // Match password
                bcrypt.compare(password, admin.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        res.redirect('/index');
                    } else {
						alertMessage(res, 'danger', 'Incorrect password!', 'fas fa-sign-in-alt', true);
                        res.redirect('/showadminlogin');
}
})
            })
});
router.get('/index', (req, res) => {
	User.findAll({
	}).then((users) => {
		res.render('', {
			layout: 'dashboard',
			users: users
		});
	}).catch(err => console.log(err));
});

router.get('/userinfo', (req, res) => {
	res.render('', { layout: "userinfo" })
});
router.get('/tablelist', (req, res) => {
	User.findAll({
		raw: true
	}).then((users) => {
		res.render('', {
			layout: "usertable",
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


