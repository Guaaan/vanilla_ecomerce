const express = require('express');
const router = express.Router();
 
const mysqlConnection = require('../database');

router.get('/api/v1/', (req, res) => {
    mysqlConnection.query('SELECT p.id, p.name, url_image, price, discount, c.name AS categ FROM product AS p LEFT JOIN category AS c ON p.category = c.id', (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

module.exports = router;