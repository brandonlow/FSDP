const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Admin=require('../models/Admin');
const bcrypt = require('bcryptjs');
const alertMessage = require('../helpers/messenger');
const { error } = require('flash-messenger/Alert');
const Contact = require('../models/Contact');
const alertMessage2 = require('../helpers/messenger2');
const Product = require('../models/Product');
const Feedback=require('../models/Feedback');
const { helpers } = require('handlebars');

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
					req.session.admin=admins.id
					res.redirect('/admin/dashboard');
				} else {
					alertMessage(res, 'danger', 'Incorrect password!', 'fas fa-sign-in-alt', true);
					res.redirect('/showadminlogin');
				}
			})
		})
		
});
router.get('/dashboard', (req, res) => {
	Admin.findOne({where:{id:req.session.admin}
	}).then((admin) => {
	User.findAll({
	}).then((users) => {
		res.render('', {
			layout: 'dashboard',
			admin:admin,
			users:users
		})
	});
});
});

router.get('/userinfo', (req, res) => {
	res.render('', {
		layout: "userinfo",

	});
});
router.get('/usertablelist', (req, res) => {
	Admin.findOne({where:{id:req.session.admin}
	}).then((admin) => {
	User.findAll({
		raw: true
	}).then((users) => {
		res.render('', {
            layout:"usertable",
			users: users,
			admin:admin
		})
	});
}).catch(err => console.log(err));
});
router.get('/admintablelist', (req, res) => {
	Admin.findOne({where:{id:req.session.admin}
	}).then((admin) => {
	Admin.findAll({
		raw:true
	}).then((admins) => {
		if (admin.email=='superadmin@gmail.com'){
			res.render('',{layout:'admintable',admins:admins,admin:admin,superadmin:admin})
		}
		else{
		res.render('', {
			layout: 'admintable',
			admins:admins,
			admin:admin
		})
	}
	});

}).catch(err => console.log(err));
});

router.get('/producttable', (req, res) => {
	Admin.findOne({where:{id:req.session.admin}
	}).then((admin) => {
	Product.findAll({
        raw: true
    }).then((products) => {
        res.render('', {
            layout:"producttable",
            products: products,
			admin:admin
        });
	});
    }).catch(err => console.log(err));
});

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

	bcrypt.compare(password, req.user.password, (err, isMatch) => {
		if (!isMatch) {
			res.render('update',{error:'Wrong current password'})
		}
	})
	if (password1 != password2) {
		errors.push({ text: 'password do not match' });
	}
	if (errors.length > 0) {
		res.render('', {
			layout:'update',
			errors
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
//router.get('/contacttable', (req, res) => {
	// 	Admin.findOne({where:req.session.admin
	// 	}).then((admin) => {
	// 	var Contact =  Contact.findAll({
	//         raw: true
	//     }).then((contact) => {
	//         res.render('', {
	//             layout:"contacttable",
	//             Contact:contact,
	// 			admin:admin
	//         });
	// 	});
	//     }).catch(err => console.log(err));
	// });
	router.get('/deletecontacttable/:id', (req, res) => {
		Contact.destroy({
			where: {
				id: req.params.id
			}
		}).then(() => {
			res.redirect('../contacttable');
	});
	
	// router.get('/respondcontacttable/:id', (req, res) => {
	// 	Contact.destroy({
	// 		where: {
	// 			id: req.params.id
	// 		}
	// 	}).then(() => {
	// 		res.redirect('../contacttable');
	// 	}).catch(err => console.log(err));
	// });

	
	
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

	
	// router.get('/producttable', (req, res) => {
	// 	Admin.findOne({where:{id:req.session.admin}
	// 	}).then((admin) => {
	// 	Product.findAll({
	// 		raw: true
	// 	}).then((products) => {
	// 		res.render('', {
	// 			layout:"producttable",
	// 			products: products,
	// 			admin:admin
	// 		});
	// 	});
	// 	}).catch(err => console.log(err));
	// });
	


router.get('/usertablelist/edit/:id', (req, res) => {
	Admin.findOne({where:{id:req.session.admin}
	}).then((admin) => {
	User.findOne({
		where: {
			id: req.params.id
		}
	}).then((user) => {
		res.render('', {
			layout:'updateuser',
			user:user,
			admin:admin
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
			layout:'updateuser',
			errors
		});
	}
	else {
		
		User.findOne({
			where: { id: req.params.id }
		})
			.then(user => {
				bcrypt.compare(password,user.password, (err, isMatch) => {
					if (!isMatch) {
						res.render('',{layout:'updateuser',error:'Wrong current password'});
					}
				})
				if (user && user.email==email) {
					res.render('', {
						layout:'updateuser',
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
		alertMessage2(res, 'success','Admin deleted successfully!', 'ti-trash', true);
		res.redirect('/admin/admintablelist');
	});
});
router.get('/feedbacktable', (req, res) => {
	Admin.findOne({where:{id:req.session.admin}
	}).then((admin) => {
    Feedback.findAll({
        raw: true
    }).then((feedbacks) => {
        res.render('', {
            layout: "feedbacktable",
            feedbacks: feedbacks,
			admin:admin
        });
	});
    }).catch(err => console.log(err));
});

module.exports = router;


