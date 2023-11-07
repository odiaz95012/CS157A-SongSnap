var express = require('express');
const connection = require('../db');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Get all themes in the database
router.get('/themes', function(req, res, next) {
  const query = "SELECT Theme FROM songsnaps";
  connection.query(query, (err, results) => {
    if (err) {
      console.log("Error executing the query:" + err);
      res.status(500).send("Error fetching themes");
    }else{
      res.status(200).json(results);
    }
  });
});

module.exports = router;
