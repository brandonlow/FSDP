const express = require('express');
const { route } = require('./main');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');
const alertMessage = require('../helpers/messenger');
const { session } = require('passport');
const Admin = require('../models/Admin');

router.get('/showprofilesuccess', (req, res) => {
	res.render('/user/profile')
});

// Login Form POST => /user/login
router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/success',
		failureRedirect: '/showLogin',					// Route to /login URL
		failureFlash: true
		/*
		* Setting the failureFlash option to true instructs Passport to flash an  error message
		* using the message given by the strategy's verify callback, if any. When a failure occurs
		* passport passes the message object as error
		* */
	})(req, res, next);
});

router.post('/register', (req, res) => {
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
		User.findOne({
			where: { email }
		})
			.then(user => {
				if (user) {
					// If user is found, that means email given has already been registered
					//req.flash('error_msg', user.name + ' already registered');
					res.render('user/register', {
						error: user.email + ' already registered',
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
							User.create({
								name,
								email,
								password
							})
								.then(user => {
									alertMessage(res, 'success', user.name + ' added. Please login', 'fas fa-sign-in-alt', true);
									res.redirect('/showLogin');
								})
								.catch(err => console.log(err));
						})
					});

				}
			});
		
	}
});
router.post('/update', (req, res) => {
	let errors = [];
	let { name, email, password, password1, password2 } = req.body;
	// var pass = false;
	// if (pass) {
	// 	bcrypt.compare(password, req.user.password, (err, isMatch) => {
	// 		if (err) throw err;
	// 		if (isMatch) {
	// 			pass = true;
	// 			console.log(pass);
	// 		} else {
	// 			pass = false;
	// 			console.log(pass);
	// 		}
	// 	})
	// }
	// if (pass == false) {
	// 	errors.push({ text: 'Wrong current password' });
	// }
	// if (password1 != password2) {
	// 	errors.push({ text: 'password do not match' });
	// }
	if (errors.length > 0) {
		res.render('user/Profile', {
			User,
			errors,
			name,
			email,
			password,
			password1,
			password2
		});
	}
	else {
		// console.log(pass)
		User.findOne({
			where: { id: req.user.id }
		})
			.then(user => {
				if (user && user.email!=email) {
					res.render('user/Profile', {
						error: user.email + ' already used!',
						name,
						email,
						password,
						password1,
						password2
					});
				}

				else {
					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(password1, salt, (err, hash) => {
							if (err) throw err;
							password1 = hash;
							User.update({
								name: name,
								email: email,
								password: password1
							}, {
								where: {
									id: req.user.id
								}
							}).then(() => {
								alertMessage(res, 'success', user.name + ' updated successfully', 'ti-reload  ', true)
								res.redirect('/account');
							}).catch(err => console.log(err));
						})
					});
				}
			});
	}
});
router.get('/showadmin', (req, res) => {
	res.render('')
});

module.exports = router;
