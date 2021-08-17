const express = require('express');
const ensureAuthenticated = require('../helpers/auth');
const router = express.Router();
const alertMessage = require('../helpers/messenger');
const Cart = require('../models/cart');
const Order = require('../models/Order');
const Product = require('../models/Product');
router.get('/add-to-cart/:id', ensureAuthenticated, (req, res) => {
    var productid = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {})
    Product.findOne({ where: { id: productid } }).then((product) => {
        if (product == null) {
            console.log('not found')
            return res.redirect('/showproduct')
        }
        else {
            cart.add(product, productid)
            req.session.cart = cart;
            alertMessage(res, 'success', product.title + 'added to cart.', 'fas fa-sign-in-alt', false);
            res.redirect('/showproduct');
            console.log(cart);
        }
    }).catch(err => console.log(err));
});
router.get('/shopping-cart', ensureAuthenticated, (req, res) => {
    if (!req.session.cart) {
        return res.render('cart', { products: null });
    }
    var cart = new Cart(req.session.cart);
    res.render('cart', { products: cart.output(), totalprice: cart.totalPrice })

})
router.get('/checkout', ensureAuthenticated, (req, res) => {
    if (!req.session.cart) {
        alertMessage(res, 'danger', '' + 'No item in cart', 'fas fa-sign-in-alt', false);
        return res.redirect('/cart/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    res.render('checkout', { total: cart.totalPrice });
});
router.post('/checkout', (req, res) => {
    let { name, address, postalcode, cardholder, cc, em, cvc } = req.body
    if (!req.session.cart) {
        alertMessage(res, 'danger', '' + 'No item in cart', 'fas fa-sign-in-alt', false);
        return res.redirect('/cart/shopping-cart');
    }
    var datetime = new Date();
    var cart = new Cart(req.session.cart);
    Order.create({
        name,
        address,
        postalcode,
        cart,
        datetime
    }).then(() => {
        alertMessage(res, 'success', '' + 'Order successful!', 'fas fa-sign-in-alt', false);
        req.session.cart==null
        res.redirect('/success');
    })

});

module.exports = router;