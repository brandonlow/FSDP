const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const feedback = db.define('feedback', {
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    response: {
        type: Sequelize.STRING
    },
    option: {
        type: Sequelize.STRING
    },

});
module.exports = feedback;