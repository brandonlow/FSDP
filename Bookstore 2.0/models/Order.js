const Sequelize = require('sequelize');
const sequelize = require('../config/DBConfig');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const Order = db.define('order', {
    name: {
        type: Sequelize.STRING
    },
    address: {
        type: Sequelize.STRING
    },
    postalcode:{
        type:Sequelize.INTEGER(6)
    },
    product:{
        type:Sequelize.JSON
    },
    date:{
        type:Sequelize.DATE
    },
});
module.exports = Order;
