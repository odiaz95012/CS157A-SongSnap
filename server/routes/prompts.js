var express = require('express');
var router = express.Router();
const connection = require('../db');

//get all prompts
router.get('/', (req, res) => {
    const query = "SELECT * FROM prompts";
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