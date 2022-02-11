const mysql = require('mysql');
// import of the module mysql

// config my sql connection
const mysqlConnection = mysql.createConnection({
    host: 'mdb-test.c6vunyturrl6.us-west-1.rds.amazonaws.com',
    user: 'bsale_test',
    password: 'bsale_test',
    database: 'bsale_test'
})

// checks my connection
mysqlConnection.connect(function (err) {
    if (err) {
        console.log(err);
        return;
    }else {
        console.log('Db is connected');
    }
});

module.exports = mysqlConnection;