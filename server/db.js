const mysql = require('mysql2');

const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Oskie83195012))$',
        database: 'songsnapdb'
    }
)

module.exports = connection;