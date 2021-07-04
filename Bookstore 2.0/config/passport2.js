// const LocalStrategy = require('passport-local').Strategy;

// const bcrypt = require('bcryptjs');
// // Load user model
// const Admin = require('../models/Admin');
// function localStrategy(passport) {
//     passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password,
//         done) => {
//         Admin.findOne({ where: { email: email } })
//             .then(admin => {
//                 if (!admin) {
//                     return done(null, false, { message: 'Incorrect username or password!' });
//                 }
//                 // Match password
//                 bcrypt.compare(password, admin.password, (err, isMatch) => {
//                     if (err) throw err;
//                     if (isMatch) {
//                         return done(null, admin);
//                     } else {
//                         return done(null, false, {
//                             message: 'Password incorrect'});
// }
// })
//             })
//     }));
//     // Serializes (stores) user id into session upon successful
//     // authentication
//     passport.serializeUser((admin, done) => {
//         done(null, admin.id); // user.id is used to identify authenticated user
//     });
//     // User object is retrieved by userId from session and
//     // put into req.user
//     passport.deserializeUser((adminID, done) => {
//         Admin.findByPk(adminID)
//             .then((admin) => {
//                 done(null, admin); // user object saved in req.session
//             })
//             .catch((done) => { // No user found, not stored in req.session
//                 console.log(done);
//             });
//     });
// }
// module.exports = { localStrategy };