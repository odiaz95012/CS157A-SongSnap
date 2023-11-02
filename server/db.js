const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'db', // Using the service name from the docker-compose file
    user: 'root',
    password: '1234',
    database: 'songsnapdb',
    port: 3306, // The internal MySQL port within the container
});

module.exports = connection;
