const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const contact = db.define('contact', {
    name: {
        type: Sequelize.STRING
    },
    subject:{
        type: Sequelize.STRING
    },
    email:{
        type: Sequelize.STRING
    },

    phone: {
        type: Sequelize.STRING
    },
    message: {
        type: Sequelize.STRING
    }

});


module.exports = contact;
