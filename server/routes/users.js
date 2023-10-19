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

//Logs user into system
router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Use a parameterized query to avoid SQL injection
  const query = 'SELECT * FROM users WHERE Username = ? AND Password = ?';
  connection.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error executing the query: ' + err);
      res.status(500).send('Error retrieving data');
    } else {
      if (results.length === 1) {
        // User is authenticated
        res.cookie('login', { username: results[0].Username, id: results[0].ID, date: new Date()}, { secure: true, httpOnly: true });
        res.json({ message: 'Login successful', username: results[0].Username, id: results[0].ID, date: new Date() });
      } else {
        // User not found or invalid credentials
        res.clearCookie('login');
        res.status(401).json({ message: `OOOPS! Something happened` });
      }
    }
  });
});

router.post('/createAccount', (req, res) => {
  const accountData = req.body;
  if (
    accountData.name &&
    accountData.username &&
    accountData.email &&
    accountData.password
  ) {
    const query = "INSERT INTO users(name, username, email, password) " +
      `VALUES('${accountData.name}','${accountData.username}','${accountData.email}','${accountData.password}')`

    connection.query(query, (err) => {
      if (err) {
        console.log("Error executing the query:" + err);
        res.status(500).send("Error creating the user");
      }else{
        res.status(200).json(accountData);
      }
    })
  } else {
    res.status(400).json({ error: 'Invalid data format' });
  }
})


module.exports = router;
