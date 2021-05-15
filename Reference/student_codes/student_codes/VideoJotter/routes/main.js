const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');


router.get('/', (req, res) => {
	const title = 'Video Jotter';
	res.render('index', { title: title }) // renders views/index.handlebars
});
router.get('/showlogin', (req, res) => {
	res.render('user/login');
});
router.get('/showregister', (req, res) => {
	res.render('user/register');
});
// Logout User
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});
// router.get('/about'),(req,res)=>{
// 	const author="koh lay yen"
// 	const version="1.0.1"

// }
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

module.exports = router;
