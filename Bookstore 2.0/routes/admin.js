const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Admin=require('../models/Admin');
const bcrypt = require('bcryptjs');
const alertMessage = require('../helpers/messenger');
const { error } = require('flash-messenger/Alert');
const admin = require('../models/Admin');
const alertMessage2 = require('../helpers/messenger2');
const Product = require('../models/Product');
const Feedback=require('../models/Feedback');
// let password='1234'
// bcrypt.genSalt(10, (err, salt) => {
// 	bcrypt.hash(password, salt, (err, hash) => {
// 		if (err) throw err;
// 		password = hash;
// 		// Create new user record
// 		Admin.create({
// 			name:'admin',
// 			email:'admin2@gmail.com',
// 			password
			
// 		})
// 	})
// });
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
									res.redirect('/showadd');
								})
								.catch(err => console.log(err));
						})
					});

				}
			});

	}
});
router.post('/login', (req, res) => {
	let { email, password } = req.body
	Admin.findOne({ where: { email: email } })
		.then(admin => {
			if (!admin) {
				res.render('', {
					error: 'Incorrect email or password',
					email,
					password
				});
			}
			// Match password
			bcrypt.compare(password, admin.password, (err, isMatch) => {
				if (err) throw err;
				if (isMatch) {
					console.log(isMatch);
					res.render('index', { admin: admin, user: null });
				} else {
					alertMessage(res, 'danger', 'Incorrect password!', 'fas fa-sign-in-alt', true);
					res.redirect('/showadminlogin');
				}
			})
		})
});
router.get('/', (req, res) => {
	res.render('index')
});
router.get('/showproduct', (req, res) => {

	res.render('product')
});
router.get('/showreviews', (req, res) => {

	res.render('reviews')

});
router.get('/showcart', (req, res) => {

	res.render('index')
});
router.get('/showcheckout', (req, res) => {

	res.render('checkout',)
});
router.get('/showfeedback', (req, res) => {
	// Admin.findOne({
	// 	where: { id: req.params.id }
	// }).then(admin => {
	res.render('feedback')
	// });
});
router.get('/showabout', (req, res) => {

	res.render('about', { admin: admin, user: null })
});
router.get('/dashboard', (req, res) => {
	// Admin.findOne({
	// 	where: { id: req.params.id }
	// }).then(admin => {
	User.findAll({
	}).then((users) => {
		res.render('', {
			layout: 'dashboard',
			users: users
		})
	});
});
router.get('/userinfo', (req, res) => {
	res.render('', {
		layout: "userinfo",

	});
});
router.get('/usertablelist', (req, res) => {
	User.findAll({
		raw: true
	}).then((users) => {
		res.render('', {
            layout:"usertable",
			users: users
		})
	});
});
router.get('/admintablelist', (req, res) => {
	Admin.findAll({
		raw:true
	}).then((admins) => {
		res.render('', {
			layout: 'admintable',
			admins:admins
		})
	});
});
router.get('/producttable', (req, res) => {
	Product.findAll({
        raw: true
    }).then((products) => {
        res.render('', {
            layout:"producttable",
            products: products
        });
    }).catch(err => console.log(err));
});





// router.get('/:id', (req, res) => {
// 	Admin.findOne({
// 		where: { id: req.params.id }
// 	}).then(admin => {
// 		res.render('index', {admin:admin,user: null })
// 	});
// });
// router.get('/showproduct/:id', (req, res) => {
// 	Admin.findOne({
// 		where: { id: req.params.id }
// 	}).then(admin => {
// 		res.render('index', {admin:admin,user: null })
// 	});
// });
// router.get('/showreviews/:id', (req, res) => {
// 	Admin.findOne({
// 		where: { id: req.params.id }
// 	}).then(admin => {
// 		res.render('index', {admin:admin,user: null })
// 	});
// });
// router.get('/showcart/:id', (req, res) => {
// 	Admin.findOne({
// 		where: { id: req.params.id }
// 	}).then(admin => {
// 		res.render('index', {admin:admin,user: null })
// 	});
// });
// router.get('/showcheckout/:id', (req, res) => {
// 	Admin.findOne({
// 		where: { id: req.params.id }
// 	}).then(admin => {
// 		res.render('index', {admin:admin,user: null })
// 	});
// });
// router.get('/showfeedback/:id', (req, res) => {
// 	Admin.findOne({
// 		where: { id: req.params.id }
// 	}).then(admin => {
// 		res.render('index', {admin:admin,user: null })
// 	});
// });
// router.get('/showabout/:id', (req, res) => {
// 	Admin.findOne({
// 		where: { id: req.params.id }
// 	}).then(admin => {
// 		res.render('index', {admin:admin,user: null })
// 	});
// });
// router.get('/dashboard/:id', (req, res) => {
// 	Admin.findOne({
// 		where: { id: req.params.id }
// 	}).then(admin => {
// 	User.findAll({
// 	}).then((users) => {
// 		res.render('', {
// 			layout: 'dashboard',
// 			users: users,
// 			id:req.params.id,
// 			admin:admin
// 		});
// 	}).catch(err => console.log(err));
// });
// });
// router.get('/userinfo/:id', (req, res) => {
// 	Admin.findOne({
// 		where: { id: req.params.id }
// 	}).then(admin => {res.render('', {
// 		layout: "userinfo",
// 		admin:admin
// 	});
// });
// });
// router.get('/usertablelist/:id', (req, res) => {
// 	Admin.findOne({
// 		where: { id: req.params.id }
// 	}).then(admin => {
// 	User.findAll({
// 		raw: true
// 	}).then((users) => {

// 		res.render('', {
// 			layout: "usertable",
// 			users: users,
// 			admin:admin,
// 			newid:admin.id

// 		});
// 	}).catch(err => console.log(err));
// });
// });
// router.get('/admintablelist/:id', (req, res) => {
// 	Admin.findOne({
// 		where: { id: req.params.id }
// 	}).then(admin => {
// 	Admin.findAll({
// 		raw: true
// 	}).then((admins) => {
// 		res.render('', {
// 			layout: "admintable",
// 			admin:admin,
// 			admins:admins,
// 			newid:req.params.id
// 		});
// 	}).catch(err => console.log(err));
// });

// });
// router.get('/producttable/:id', (req, res) => {
// 	Admin.findOne({
// 		where: { id: req.params.id }
// 	}).then(admin => {
// 	res.render('', { layout: "producttable",admin:admin })
// });
// });
router.get('/showaddproduct', (req, res) => {
	res.render('', { layout: "addproduct" })
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
router.get('/usertablelist/delete/:id', (req, res) => {
	// Admin.findOne({
	// 	where: { id: adminid }
	// }).then(admin => {
	User.destroy({
		where: { id: req.params.id }
	}).then(deleteuser => {
		alertMessage2(res, 'success','User deleted successfully!', 'fas fa-trash', true);
		res.redirect('/admin/usertablelist');
	});
});

router.get('/admintablelist/edit/:id', (req, res) => {
		Admin.findOne({
			where: {
				id: req.params.id
			}
		}).then((admin) => {
			res.render('', {
				layout:'update', 
				admin:admin
			});
		}).catch(err => console.log(err)); 
	
});
router.post('/admintablelist/update/:id', (req, res) => {
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
		res.render('', {
			layout:'update',
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
		Admin.findOne({
			where: { id: req.params.id }
		})
			.then(admin => {
				if (admin && admin.email==email) {
					res.render('', {
						layout:'update',
						error: admin.email + ' already used!',
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
							Admin.update({
								name: name,
								email: email,
								password: password1
							}, {
								where: {
									id: req.params.id
								}
							}).then(() => {
								alertMessage2(res, 'success', admin.name + ' updated successfully', 'ti-reload  ', true)
								res.redirect('/admin/admintablelist');
							}).catch(err => console.log(err));
						})
					});
				}
			});
	}
});
router.get('/usertablelist/edit/:id', (req, res) => {
	User.findOne({
		where: {
			id: req.params.id
		}
	}).then((user) => {
		res.render('', {
			layout:'updateuser',
			user:user
		});
	}).catch(err => console.log(err)); 

});
router.post('/usertablelist/update/:id', (req, res) => {
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
		res.render('', {
			layout:'updateuser',
			errors,
			name,
			email,
			password,
			password1,
			password2
		});
	}
	else {
		
		User.findOne({
			where: { id: req.params.id }
		})
			.then(user => {
				if (user && user.email==email) {
					res.render('', {
						layout:'updateuser',
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
									id: req.params.id
								}
							}).then(() => {
								console.log(password);
								alertMessage2(res, 'success', user.name + ' updated successfully', 'ti-reload  ', true)
								res.redirect('/admin/usertablelist/:id');
							}).catch(err => console.log(err));
						})
					});
				}
			});
	}
});
router.get('/admintablelist/delete/:id1', (req, res) => {
	Admin.destroy({
		where: { id: req.params.id1 }
	}).then(deleteuser => {
		alertMessage2(res, 'success','Admin deleted successfully!', 'ti-trash', true);
		res.redirect('/admin/admintablelist');

	});
});
router.get('/feedbacktable', (req, res) => {
    Feedback.findAll({
        raw: true
    }).then((feedbacks) => {
        res.render('', {
            layout: "feedbacktable",
            feedbacks: feedbacks
        });
    }).catch(err => console.log(err));
});

module.exports = router;


