const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const alertMessage = require('../helpers/messenger');
const { error } = require('flash-messenger/Alert');
const Contact = require('../models/Contact');
const alertMessage2 = require('../helpers/messenger2');
const Product = require('../models/Product');
const Feedback = require('../models/Feedback');
const { helpers } = require('handlebars');
const admin = require('../models/Admin');

const sgMail = require('@sendgrid/mail');
const sgMailApiKey='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';
sgMail.setApiKey(sgMailApiKey);


var newname='dl'
var newemail='superadmin@gmail.com'
var newpassword='1234'
var newrole='superadmin'
bcrypt.genSalt(10, (err, salt) => {
	bcrypt.hash(newpassword, salt, (err, hash) => {
		if (err) throw err;
		newpassword = hash;
		Admin.create({
			name: newname,
			email: newemail,
			password:newpassword,
			role:newrole
		})
	})
});
router.get('/',(req,res)=>{
	Admin.findOne({
		where: { id: req.session.admin }
	}).then((admin) => {
		res.render('index', {
			admin: admin
		});
	}).catch(err => console.log(err));
});

router.post('/login', (req, res) => {
	let { email, password } = req.body
	Admin.findOne({ where: { email: email } })
		.then(admins => {
			if (!admins) {
				res.render('admin/login', {
					error: 'Only admin account allowed'
				});
			}
			bcrypt.compare(password, admins.password, (err, isMatch) => {
				if (err) throw err;
				if (isMatch) {
					req.session.admin = admins.id
					res.redirect('/admin/dashboard');
				} else {
					alertMessage(res, 'danger', 'Incorrect password!', 'fas fa-sign-in-alt', true);
					res.redirect('/showadminlogin');
				}
			})
		})

});

// function sendEmail(email){ 
//     sgMail.setApiKey('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');

// 	//to person using this code, please change the sendgridkey according to your own one! this helps  with consistancy !
// 	//mykey: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
//      const message = { 
//      to: email, 
//      from: 'bookstorehelpline@gmail.com', 
//      subject: 'Verify Video Jotter Account', 
//      text: 'Video Jotter Email Verification',
//      html:"Hello,<br> thank you for contacting us, we will reply to you shortly.<br> Sincerely: Bookstore admin staff"
//         };
//      return new Promise((resolve, reject) => { 
//         sgMail.send(message).then(msg => {
//             resolve(msg)
//             console.log(msg)
//         }).catch(err => {
//             reject(err)
//             console.log(err.response.body)
//         });
//      });

// }
// sendEmail(email).then(msg=> {

// }).catch(err => {


// });
router.get('/showproduct', (req, res) => {
	Admin.findOne({
		where: { id: req.session.admin }
	}).then((admin) => {
		res.render('product', {
			admin: admin
		});
	}).catch(err => console.log(err));
});
router.get('/showcontact', (req, res) => {
	Admin.findOne({
		where: { id: req.session.admin }
	}).then((admin) => {
		res.render('contact', {
			admin: admin
		});
	}).catch(err => console.log(err));
});
router.get('/showcart', (req, res) => {
	Admin.findOne({
		where: { id: req.session.admin }
	}).then((admin) => {
		res.render('cart', {
			admin: admin
		});
	}).catch(err => console.log(err));
});

router.get('/showcheckout', (req, res) => {
	Admin.findOne({
		where: { id: req.session.admin }
	}).then((admin) => {
		res.render('checkout', {
			admin: admin
		});
	}).catch(err => console.log(err));
});

router.get('/showfeedback', (req, res) => {
	Admin.findOne({
		where: { id: req.session.admin }
	}).then((admin) => {
		res.render('feedback', {
			admin: admin
		});
	}).catch(err => console.log(err));
});


router.get('/showreviews', (req, res) => {
	Admin.findOne({
		where: { id: req.session.admin }
	}).then((admin) => {
		res.render('reviews', {
			admin: admin
		});
	}).catch(err => console.log(err));
});

router.get('/showabout', (req, res) => {
	Admin.findOne({
		where: { id: req.session.admin }
	}).then((admin) => {
		res.render('about', {
			admin: admin
		});
	}).catch(err => console.log(err));
});

router.get('/dashboard', (req, res) => {
	Admin.findOne({
		where: { id: req.session.admin }
	}).then((admin) => {
		User.findAll({
			raw: true
		}).then((users) => {
			res.render('', {
				layout: 'dashboard',
				admin: admin,
				users: users
			})
		});
	}).catch(err => console.log(err));
});

router.get('/userinfo', (req, res) => {
	res.render('', {
		layout: "userinfo",

	});
});
router.get('/usertablelist', (req, res) => {
	Admin.findOne({
		where: { id: req.session.admin }
	}).then((admin) => {
		User.findAll({
			raw: true
		}).then((users) => {
			res.render('', {
				layout: "usertable",
				users: users,
				admin: admin
			})
		});
	}).catch(err => console.log(err));
});
router.get('/admintablelist', (req, res) => {
	Admin.findOne({
		where: { id: req.session.admin }
	}).then((admin) => {
		Admin.findAll({
			raw: true
		}).then((admins) => {
			if (admin.role=="superadmin") {
				res.render('', { layout: 'admintable', admin: admin, admins: admins, superadmin: admin })
			}
			else {
				res.render('', {
					layout: 'admintable',
					admins: admins,
					admin: admin
				})
			}
		});

	}).catch(err => console.log(err));
});
router.get('/showadd', (req, res) => {
	Admin.findOne({
		where: {
			id: req.session.admin
		}
	}).then((admin) => {
		res.render('', {
			layout: 'add',
			admin: admin, superadmin: admin
		});
	}).catch(err => console.log(err));

});
router.get('/producttable', (req, res) => {
	Admin.findOne({
		where: { id: req.session.admin }
	}).then((admin) => {
		Product.findAll({
			raw: true
		}).then((products) => {
			res.render('', {
				layout: "producttable",
				products: products,
				admin: admin
			});
		});
	}).catch(err => console.log(err));
});
router.get('/showaddproduct', (req, res) => {
	res.render('', { layout: "addproduct" })
});
router.post('/addproduct', (req, res) => {
	let { title, author,category,qty, price, url } = req.body;
	Product.create({
		title,
		author,
		category,
		qty,
		price,
		url
	})
	res.redirect('./producttable');
});
router.get('/showupdateproduct/:id', (req, res) => {
	Product.findOne({
		where: {
			id: req.params.id
		}
	}).then((product) => {
		res.render('', {
			layout: "updateproduct",
			product: product
		});
	}).catch(err => console.log(err));
});
router.put('/updateproduct/:id', (req, res) => {
	let { title, author,category,qty, price, url } = req.body;
	Product.update({
		title: title,
		author: author,
		category:category,
		qty:qty,
		price: price,
		url: url
	}, {
		where: {
			id: req.params.id
		}
	}).then(() => {
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
	User.destroy({
		where: { id: req.params.id }
	}).then(deleteuser => {
		alertMessage2(res, 'success', 'User deleted successfully!', 'ti-trash', true);
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
			layout: 'updateadmin',
			admin: admin
		});
	}).catch(err => console.log(err));

});
router.post('/admintablelist/update/:id', (req, res) => {
	let errors = [];
	let { name, email, password, password1, password2 } = req.body;

	bcrypt.compare(password, req.user.password, (err, isMatch) => {
		if (!isMatch) {
			res.render('updateadmin', { error: 'Wrong current password' })
		}
	})
	if (password1 != password2) {
		errors.push({ text: 'password do not match' });
	}
	if (errors.length > 0) {
		res.render('', {
			layout: 'updateadmin',
			errors
		});
	}
	else {
		Admin.findOne({
			where: { id: req.params.id }
		})
			.then(admin => {
				if (admin && admin.email == email) {
					res.render('', {
						layout: 'updateadmin',
						error: admin.email + ' already used!'
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
router.get('/deletecontacttable/:id', (req, res) => {
	Contact.destroy({
		where: {
			id: req.params.id
		}
	}).then(() => {
		res.redirect('../contacttable');
	}).catch(err => console.log(err));
});
	
	router.get('/respondcontacttable/:id', async(req, res) => {
		// try {
			var admin =await Admin.findOne({ where: {'id': req.session.admin}});
			console.log(req.session.admin);
		
			var contact = await Contact.findOne({ where: {'id' : req.params.id}});
		
			res.render('', {
				layout:"respondcontacttable",
				Contact:contact,
				admin:admin
			});	
		// } catch (error) {
		// 	console.log(error);
		// }
	});
	
	router.post('/responsecontacttable', async(req, res) => {
		// let title = req.body.title;
		let { email , name, subject, response } = req.body; 

		console.log(req.body);
		sgMail.send({
			to:email,
			from:'bookstorehelpline@gmail.com',
			subject:subject,
			text:response,
			
		}).then(()=>{
			alertMessage(res, 'success',  ' Email to ' +name+ ' , '+ email+ ' about ' +subject + ' has been sent sucessfully', 'fas fa-sign-in-alt', true);
			res.redirect('/admin/contacttable');
		})
		.catch((error) => {
		  console.error(error)
		})


	})
	
	router.get('/contacttable', async(req, res) => {
        try {
            var admin =await Admin.findOne({ where: {'id': req.session.admin}});
            console.log(req.session.admin);

            var contact = await Contact.findAll();

            res.render('', {
                layout:"contacttable",
                Contact:contact,
                admin:admin
            });
        } catch (error) {
            console.log(error);
        }
    })
	
router.get('/usertablelist/edit/:id', (req, res) => {
	Admin.findOne({
		where: { id: req.session.admin }
	}).then((admin) => {
		User.findOne({
			where: {
				id: req.params.id
			}
		}).then((user) => {
			res.render('', {
				layout: 'updateuser',
				user: user,
				admin: admin
			});
		});
	}).catch(err => console.log(err));

});
router.post('/usertablelist/update/:id', (req, res) => {
	let errors = [];
	let { name, email, password, password1, password2 } = req.body;

	if (password1 != password2) {
		errors.push({ text: 'password do not match' });
	}
	if (errors.length > 0) {
		res.render('', {
			layout: 'updateuser',
			errors
		});
	}
	else {
		User.findOne({
			where: { id: req.params.id }
		})
			.then(user => {
				bcrypt.compare(password, user.password, (err, isMatch) => {
					if (!isMatch) {
						res.render('', { layout: 'updateuser', error: 'Wrong current password' });
					}
				})
				if (user && user.email == email) {
					res.render('', {
						layout: 'updateuser',
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
									id: req.params.id
								}
							}).then(() => {
								alertMessage2(res, 'success', user.name + ' updated successfully', 'ti-reload  ', true)
								res.redirect('/admin/usertablelist');
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
		alertMessage2(res, 'success', 'Admin deleted successfully!', 'ti-trash', true);
		res.redirect('/admin/admintablelist');
	}).catch(err => console.log(err));
});
router.get('/feedbacktable', (req, res) => {
	Admin.findOne({
		where: { id: req.session.admin }
	}).then((admin) => {
		Feedback.findAll({
			raw: true
		}).then((feedbacks) => {
			res.render('', {
				layout: "feedbacktable",
				feedbacks: feedbacks,
				admin: admin
			});
		});
	}).catch(err => console.log(err));
});
router.get('/deletefeedbacktable/:id', (req, res) => {
	Feedback.destroy({
		where: {
			id: req.params.id
		}
	}).then(() => {
		res.redirect('../feedbacktable');
	}).catch(err => console.log(err));
});

router.post('/add', (req, res) => {
	let errors = [];
	let { name, email, password, password2,role} = req.body;
	if (password !== password2) {
		errors.push({ text: 'Passwords do not match' });
	}
	if (password.length < 4) {
		errors.push({ text: 'Password must be at least 4 characters' });
	}
	if (errors.length > 0) {
		res.render('', {
			layout: 'add',
			errors
		});
	} else {
		Admin.findOne({
			where: { email }
		})
			.then(admin => {
				if (admin) {
					res.render('', {
						layout: 'add',
						error: admin.email + ' already added',
					});
				} else {
					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(password, salt, (err, hash) => {
							if (err) throw err;
							password = hash;
							Admin.create({
								name,
								email,
								password,
								role
							})
								.then(admin => {
									alertMessage2(res, 'success', admin.name + ' added successfully', 'fas fa-sign-in-alt', true);
									res.redirect('/admin/admintablelist');
								})
								.catch(err => console.log(err));
						})
					});

				}
			});
	}
});
router.get('/success', (req, res) => {
	Admin.findOne({
		where: { id: req.session.admin }
	}).then((admin) => {
		res.render('index', {
			admin: admin
		});
	}).catch(err => console.log(err));
});

router.get('/logout', (req, res) => {
	req.session.destroy();
	res.redirect('/');
});

module.exports = router;


