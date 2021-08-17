const alertMessage = require('./messenger');

const ensureAuthenticated = (req, res, next) => {
	if(req.isAuthenticated()) {
		return next();
	}
	alertMessage(res, 'danger', 'Please create an account to continue.', 'fas fa-exclamation-circle', true);
	res.redirect('/');
};

module.exports = ensureAuthenticated;