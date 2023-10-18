var express = require('express');
var router = express.Router();
const connection = require('../db');


//get all users
router.get('/', (req, res) => {
  const query = "SELECT * FROM users";
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing the query: ' + err);
      res.status(500).send('Error retrieving data');
    } else {
      res.json(results);
    }
  });
});

//get user by id
router.get('/id/:id', (req, res) => {
  const id = req.params.id; // Retrieve the 'id' parameter from the URL
  const query = `SELECT * FROM users WHERE ID = ${id}`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing the query: ' + err);
      res.status(500).send('Error retrieving data');
    } else {
      res.json(results);
    }
  });
});





module.exports = router;
