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
const sgMailApiKey='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';
sgMail.setApiKey(sgMailApiKey);
var otpGenerator = require('otp-generator');
const newotp=otpGenerator.generate(6, { upperCase: false, specialChars: false });
router.get('/showprofilesuccess', (req, res) => {
	res.render('/user/profile')
});


router.post('/forget', (req, res) => {
	let {email}=req.body;
	User.findOne({where:{email:email}}).then(user=>{
		if (user){
			sgMail.send({
				to:email,
				from:'bookstorehelpline@gmail.com',
				subject:'Reset password bookstore',
				text:'Dear Sir/Madam <br> Your email Otp:<b>'+newotp+'</b><br> please Enter this otp to reset your password.',
				html:'<p>Dear Sir/Madam <br><br> Your email Otp:<b>'+newotp+'</b><br> Please enter this otp to reset your password.</p>',
			}).then(()=>{
			alertMessage(res, 'success', 'Email' + ' sent. Please check your email for otp', 'fas fa-sign-in-alt', true);
			res.render('otp',{forgetuser:user});
		})
		.catch((error) => {
		  console.error(error)
		})
	}
		else{
			alertMessage(res, 'danger', ''+'Email Not Found!', 'fas fa-sign-in-alt', true);
			res.redirect('/showforget');
		}
	});
});
router.post('/forget/:id',async(req,res)=>{
	let {otp}=req.body;
	var forgetuser=await User.findOne({where:{id:req.params.id}});
	if(otp==newotp){
		alertMessage(res, 'success', '' + 'Success! Change your password here.', 'fas fa-sign-in-alt', true);
		res.render('changepassword',{forgetuser:forgetuser});
	}
	else{
		alertMessage(res, 'danger', '' + 'Wrong OTP Entered', 'fas fa-sign-in-alt', true);
		res.render('otp',{forgetuser:forgetuser});
	}
});
router.post('/forget/change/:id',async(req,res)=>{
	let {password,password2}=req.body;
	var forgetuser=await User.findOne({where:{id:req.params.id}});
	if (password==password2){
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(password, salt, (err, hash) => {
				if (err) throw err;
				password = hash;
				User.update({
					password:password
				},{
					where:{id:req.params.id}
				}).then(() => {
						alertMessage(res, 'success', 'Updated' + ' new password.Please try to log in again.', 'fas fa-sign-in-alt', true);
						res.redirect('/showLogin');
					})
					.catch(err => console.log(err));
			})
		});
	}
	else{
		alertMessage(res, 'danger', '' + 'Password do not match', 'fas fa-sign-in-alt', true);
		res.render('changepassword',{forgetuser:forgetuser});
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
	let errors = [];
	let { name, email, password, password1, password2 } = req.body;

	bcrypt.compare(password, req.user.password, (err, isMatch) => {
		if (!isMatch) {
			res.render('user/profile',{error:'Wrong current password'})
		}
	})
	if (password1 != password2) {
		errors.push({ text: 'password do not match' });
	}
	if (errors.length > 0) {
		res.render('user/Profile', {
			User,
			errors,

		});
	}
	else {
		User.findOne({
			where: { id: req.user.id }
		})
			.then(user => {
				if (user.email == email) {
					res.render('user/Profile', {
						error: user.email + ' already used!'
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

router.post('/contact', (req, res) => {

	let { name, subject, email, phone, message } = req.body;
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
			to:email,
			from:'bookstorehelpline@gmail.com',
			subject:'Recieved contact',
			text: 'Reviewing  item you want to contact us about ',
     		html:"Hello,<br> thank you for contacting us, we will reply to you shortly.<br> Sincerely: Bookstore admin staff",
		})

		// var transporter = nodemailer.createTransport({
		// 	service: 'gmail',
		// 	auth: {
		// 		user: 'bookstoretestpage@gmail.com',
		// 		pass: 'Bookst0reTestPage11'
		// 	}
		// });


		// var mailOptions = {
		// 	from: 'bookstoretestpage@gmail.com',
		// 	to: email,
		// 	subject: 'Verification',
		// 	html: "Hello,<br> thank you for contacting us, we will reply to you shortly.<br> Sincerely: Bookstore admin staff"
		// };

		// transporter.sendMail(mailOptions, function (error, info) {
		// 	if (error) {
		// 		console.log(error);
		// 	} else {
		// 		console.log('Email sent: ' + info.response);
		// 	}
		// });
		alertMessage(res, 'success', "Sucessfully sent.", " ", false);

	}
	catch {
		alertMessage(res, 'danger', "System failure, please try again", " ", false);

	}

	res.redirect('/showcontact')

});
router.post('/feedback', (req, res) => {
    let { name, email, feedback, options } = req.body;
    Feedback.create({
        name,
        email,
        feedback,
        options
    });
    alertMessage(res, 'success', "Feedback sucessfully sent.", " ", true);

    res.render('index')
});

module.exports = router;
