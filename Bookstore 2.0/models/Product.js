const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const Product = db.define('product', {
    title: {
        type: Sequelize.STRING
    },
    author: {
        type: Sequelize.STRING
    },
    category:{
        type:Sequelize.STRING()
    },
    price: {
        type: Sequelize.DECIMAL(10,2)
    },
    url: {
		type: Sequelize.STRING(512),
	},
});
module.exports = Product;