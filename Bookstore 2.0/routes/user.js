const express = require('express');
const { route } = require('./main');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');
const alertMessage = require('../helpers/messenger');
const { session } = require('passport');
const contact = require('../models/contact');
const Feedback = require('../models/Feedback');
const Admin = require('../models/Admin');
const sgMail = require('@sendgrid/mail');
var otpGenerator = require('otp-generator');

const newotp = otpGenerator.generate(6, { upperCase: false, specialChars: false });


router.get('/showprofilesuccess', (req, res) => {
	res.render('/user/profile')
});
router.post('/forget', (req, res) => {
	let { email } = req.body;
	const sgMailApiKey = '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';
	sgMail.setApiKey(sgMailApiKey);
	User.findOne({ where: { email: email } }).then(user => {
		if (user) {
			sgMail.send({
				to: email,
				from: 'bookstorehelpline@gmail.com',
				subject: 'Reset password bookstore',
				text: 'Dear Sir/Madam <br> Your email Otp:<b>' + newotp + '</b><br> please Enter this otp to reset your password.',
				html: '<p>Dear Sir/Madam <br><br> Your email Otp:<b>' + newotp + '</b><br> Please enter this otp to reset your password.</p>',
			}).then(() => {
				alertMessage(res, 'success', 'Email' + ' sent. Please check your email for otp', 'fas fa-sign-in-alt', true);
				res.render('otp', { forgetuser: user });
			})
				.catch((error) => {
					console.error(error)
				})
		}
		else {
			alertMessage(res, 'danger', '' + 'Email Not Found!', 'fas fa-sign-in-alt', true);
			res.redirect('/showforget');
		}
	});
});
router.post('/forget/:id', async (req, res) => {
	let { otp } = req.body;
	var forgetuser = await User.findOne({ where: { id: req.params.id } });
	if (otp == newotp) {
		alertMessage(res, 'success', '' + 'Success! Change your password here.', 'fas fa-sign-in-alt', true);
		res.render('changepassword', { forgetuser: forgetuser });
	}
	else {
		alertMessage(res, 'danger', '' + 'Wrong OTP Entered', 'fas fa-sign-in-alt', true);
		res.render('otp', { forgetuser: forgetuser });
	}
});
router.post('/forget/change/:id', async (req, res) => {
	let { password, password2 } = req.body;
	var forgetuser = await User.findOne({ where: { id: req.params.id } });
	if (password == password2) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(password, salt, (err, hash) => {
				if (err) throw err;
				password = hash;
				User.update({
					password: password
				}, {
					where: { id: req.params.id }
				}).then(() => {
					alertMessage(res, 'success', 'Updated' + ' new password.Please try to log in again.', 'fas fa-sign-in-alt', true);
					res.redirect('/showLogin');
				})
					.catch(err => console.log(err));
			})
		});
	}
	else {
		alertMessage(res, 'danger', '' + 'Password do not match', 'fas fa-sign-in-alt', true);
		res.render('changepassword', { forgetuser: forgetuser });
	}
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

	if (password !== password2) {
		errors.push({ text: 'Passwords do not match' });
	}

	if (password.length < 4) {
		errors.push({ text: 'Password must be at least 4 characters' });
	}
	if (errors.length > 0) {
		res.render('user/register', {
			errors
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
						error: user.email + ' already registered'
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
	let { name, email, password, password1, password2 } = req.body;
	var currentuser = User.findOne({ where: { id: req.user.id } });
	User.findOne({
		where: { email }
	}).then(user => {
		if (user && currentuser.email != email) {
			res.render('user/Profile', {
				error: user.email + ' already used!'
			});
		}
		else {
			bcrypt.compare(password, req.user.password, (err, isMatch) => {
				if (!isMatch) {
					res.render('user/profile', { error: 'Wrong current password' })
				}
				else {
					if (password1 != password2) {
						res.render('user/profile', { error: "New password and confirm password must be the same" })
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
				}

			})

		}
	})
});
router.get('/showadmin', (req, res) => {
	res.render('')
});

router.post('/contact',(req, res) => {

	let { name, subject, email, phone, message } = req.body;
	const sgMailApiKey = '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';
	sgMail.setApiKey(sgMailApiKey);
	try {
		contact.create({
			name,
			subject,
			email,
			phone,
			message
		})
		// var nodemailer = require('nodemailer');

		sgMail.send({
			to: email,
			from: 'bookstorehelpline@gmail.com',
			subject: 'Recieved contact',
			text: 'Reviewing  item you want to contact us about ',
			html: "Hello,<br> thank you for contacting us, we will reply to you shortly.<br> Sincerely: Bookstore admin staff",
		})
		alertMessage(res, 'success', "Sucessfully sent.", " ", false);
	}
	catch {
		alertMessage(res, 'danger', "System failure, please try again", " ", false);

	}

	res.redirect('/showcontact')

});
router.post('/feedback', (req, res) => {
	let errors = []
    let { name, feedback, options} = req.body;
	if (!(4 < name.length < 20)) {
		errors.push({ text: 'Name must be between 4 - 20 characters' });
	}
	if (!(8 < name.length < 50)) {
		errors.push({ text: 'Feedback must be between 8 - 50 characters' });
	}
	if (errors.length > 0) {
		res.render('/showfeedback', {
			errors
		});
	} else {
	n =  new Date();
	y = n.getFullYear();
	m = n.getMonth() + 1;
	d = n.getDate();
	date = m + "/" + d + "/" + y;
    Feedback.create({
        name,
        feedback,
        options,
		date
    });
    alertMessage(res, 'success', "We received your feedback. Thank you for your time!", " ", true);

	res.render('index')
	}
});

module.exports = router;
