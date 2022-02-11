const express = require('express');
const router = express.Router();
 
const mysqlConnection = require('../database');

// get my first route if the conection is ok returns the products
router.get('/', (req, res) => {
    // sql query with a left join to get the products with the categories
    mysqlConnection.query('SELECT p.id, p.name, url_image, price, discount, c.name AS category FROM product AS p LEFT JOIN category AS c ON p.category = c.id', (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});



module.exports = router;