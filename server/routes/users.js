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

router.get('/findUser', (req, res) => {
  const searchTerm = req.query.searchTerm;

  if (searchTerm) {
    const query = `
      SELECT name, username, email
      FROM users
      WHERE username = ? OR email = ?
    `;

    connection.query(query, [searchTerm, searchTerm], (err, results) => {
      if (err) {
        console.log("Error executing the query: " + err);
        return res.status(500).json({ error: "Error fetching users" });
      } else {
        if (results.length > 0) {
          return res.status(200).json(results);
        } else {
          return res.status(404).json({ message: 'No users found matching the search term' });
        }
      }
    });
  } else {
    return res.status(400).json({ error: 'Invalid search term' });
  }
});


router.post('/createRequest', (req, res) => {
  const requestData = req.body;
  if (requestData.user1 && requestData.user2) {
    const query = "INSERT INTO friends (User1ID, User2ID, Status, Date) VALUES (?, ?, ?, ?)";
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format the date

    connection.query(query, [requestData.user1, requestData.user2, 'Pending', currentDate], (err, results) => {
      if (err) {
        console.log("Error executing the query: " + err);
        return res.status(500).json({ error: "Error creating friend request" });
      } else {
        return res.status(200).json({ message: "Friend request created successfully" });
      }
    });
  } else {
    return res.status(400).json({ error: 'Invalid data format' });
  }
});

router.get('/friendRequests', (req, res) => {
  const id = req.query.id;

  if (id) {
    const query = `
      SELECT User1ID, Status, Date
      FROM friends
      WHERE User2ID = ?
    `;

    connection.query(query, [id], (err, results) => {
      if (err) {
        console.log("Error executing the query: " + err);
        return res.status(500).json({ error: "Error fetching requests" });
      } else {
        if (results.length > 0) {
          return res.status(200).json(results);
        } else {
          return res.status(404).json({ message: 'No friend requests at this time' });
        }
      }
    });
  } else {
    return res.status(400).json({ error: 'Invalid search term' });
  }
});

module.exports = router;
