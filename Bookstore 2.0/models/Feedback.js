const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const User = db.define('feedback', {
    name: {
        type: Sequelize.STRING
    },
    feedback: {
        type: Sequelize.STRING
    },
    phone: {
        type: Sequelize.STRING
    },
    option: {
        type: Sequelize.STRING
    },
    
});
module.exports = User;