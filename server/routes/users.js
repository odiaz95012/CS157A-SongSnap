var express = require('express');
var router = express.Router();
const connection = require('../db');
const multer = require('multer');
const upload = multer();
const fs = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: 'ACCESS_KEY',
  secretAccessKey: 'SECRET_KEY',
  region: 'us-west-1'
});



router.post('/upload-profile-picture', upload.single('profilePicture'), (req, res) => {
  const profilePic = req.file;
  const username = req.body.username;

  if (!profilePic || !username) {
    return res.status(400).json({ error: 'Missing data' });
  }

  const fileExtension = profilePic.originalname.split('.').pop(); // Get file extension

  const params = {
    Bucket: 'songsnap-profile-pictures',
    Key: `${username}.${fileExtension}`, // Use a dynamic key based on user ID and file extension
    Body: profilePic.buffer,
    ContentType: profilePic.mimetype
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Error uploading image to S3:', err);
      res.status(500).json({ error: 'Error uploading image' });
    } else {
      console.log('Image uploaded successfully:', data.Location);
      res.status(200).json({ imageUrl: data.Location });
    }
  });
});

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
router.get('/id', (req, res) => {
  const id = req.query.id; // Retrieve the 'id' parameter from the query string
  if (!id) {
    return res.status(400).send('No ID provided');
  }

  const query = `SELECT * FROM users WHERE ID = ${id}`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing the query: ' + err);
      res.status(500).send('Error retrieving data');
    } else {
      res.json(results[0]);
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
        // Set the cookie with serialized JSON data
        res.cookie('login', JSON.stringify({ username: results[0].Username, id: results[0].ID, date: new Date() }), { secure: true, httpOnly: true });
        res.json({ message: 'Login successful', username: results[0].Username, id: results[0].ID, date: new Date() });
      } else {
        // User not found or invalid credentials
        res.clearCookie('login');
        res.status(401).json({ message: `Incorrect password, please try again.` });
      }
    }
  });
});

router.post('/createAccount', async (req, res) => {
  const accountData = req.body;

  try {
    if (
      accountData.name &&
      accountData.username &&
      accountData.email &&
      accountData.password
    ) {
      // Assign a default image if not provided
      if (!accountData.profilePicture) {
        // Retrieve the default image from S3
        const params = {
          Bucket: 'songsnap-profile-pictures',
          Key: 'profile_default.png'
        };

        const defaultImage = await s3.getObject(params).promise();

        // Set the profile picture to the default image data
        accountData.profilePicture = defaultImage.Body.toString('base64'); // Convert image buffer to base64 string
      }

      const query = "INSERT INTO users (name, Username, Email, Password, ProfilePicture) VALUES (?, ?, ?, ?, ?)";
      const values = [accountData.name, accountData.username, accountData.email, accountData.password, accountData.profilePicture];

      // Perform the database insertion
      connection.query(query, values, (err) => {
        if (err) {
          console.log("Error executing the query:" + err);
          return res.status(500).send("Error creating the user");
        }
        res.status(200).json(accountData);
      });
    } else {
      res.status(400).json({ error: 'Invalid data format' });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error creating the user");
  }
});




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


router.post('/friend-requests/create', (req, res) => {
  const requestData = req.body;
  if (requestData.user1 && requestData.user2) {
    const query = "INSERT INTO friends (User1ID, User2ID, Status, Date) VALUES (?, ?, ?, ?)";
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format the date

    connection.query(query, [requestData.user1, requestData.user2, 'Pending', currentDate], (err, results) => {
      if (err) {
        console.log("Error executing the query: " + err);
        return res.status(500).json({ error: "000PS! Something happened :(" });
      } else {
        return res.status(200).json({ message: "Friend request created successfully" });
      }
    });
  } else {
    return res.status(400).json({ error: 'Invalid data format' });
  }
});

router.get('/friend-requests/all', (req, res) => {
  const id = req.query.id;

  if (id) {
    const query = `
      SELECT friends.User1ID, friends.Date, users.name, users.username
      FROM friends, users
      WHERE friends.User1ID = users.id 
      AND friends.User2ID = ? 
      AND friends.Status = 'Pending'
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
    return res.status(400).json({ error: 'OOOPS! Something happened :(' });
  }
});

router.post('/friend-requests/respond', (req, res) => {
  const requestData = req.body;
  if (requestData.user1id && requestData.user2id && (requestData.decision === 'Accepted' || requestData.decision === 'Rejected')) {
    const query = "UPDATE friends SET Status = ? WHERE User1ID = ? AND User2ID = ? AND Status = 'Pending'";
    connection.query(query, [requestData.decision, requestData.user1id, requestData.user2id], (err, results) => {
      if (err) {
        console.log("Error executing the query: " + err);
        return res.status(500).json({ error: 'OO0OPS! Something happened :(' });
      } else {
        return res.status(200).json({ message: "Response submitted" });
      }
    });
  } else {
    return res.status(400).json({ error: 'Invalid data format' });
  }
});

router.post('/friends/remove', (req, res) => {
  const requestData = req.body;
  if (requestData.user1id && requestData.user2id) {
    const query = "UPDATE friends SET Status = 'Rejected' WHERE User1ID = ? AND User2ID = ? AND Status = 'Accepted'";
    connection.query(query, [requestData.user1id, requestData.user2id], (err, results) => {
      if (err) {
        console.log("Error executing the query: " + err);
        return res.status(500).json({ error: 'OO0OPS! Something happened :(' });
      } else {
        return res.status(200).json({ message: "Response submitted" });
      }
    });
  } else {
    return res.status(400).json({ error: 'Invalid data format' });
  }
});

router.get('/friends/all', (req, res) => {
  const id = req.query.id;

  if (id) {
    const query = `
      SELECT friends.User1ID, friends.Date, users.name, users.username
      FROM friends, users
      WHERE (friends.User1ID = ? OR friends.User2ID = ?)
      AND friends.Status = 'Accepted'
      AND (friends.User1ID = users.id OR friends.User2ID = users.id)
      AND users.id != ?
    `;
    connection.query(query, [id, id, id], (err, results) => {
      if (err) {
        console.log("Error executing the query: " + err);
        return res.status(500).json({ error: "OO0OPS! Something happened :(" });
      } else {
        if (results.length > 0) {
          return res.status(200).json(results);
        } else {
          return res.status(404).json({ message: 'No friends on songsnap!' });
        }
      }
    });
  } else {
    return res.status(400).json({ error: 'Invalid data format' });
  }
});

router.get('/blocked-users/all', (req, res) => {
  const id = req.query.id;

  if (id) {
    const query = `
      SELECT blocked.User2ID, users.name, users.username
      FROM blocked, users
      WHERE blocked.User1ID = ? AND blocked.User2ID = users.id;
    `;

    connection.query(query, [id], (err, results) => {
      if (err) {
        console.log("Error executing the query: " + err);
        return res.status(500).json({ error: "OO0OPS! Something happened :(" });
      } else {
        if (results.length > 0) {
          return res.status(200).json(results);
        } else {
          return res.status(404).json({ message: 'No blocked users' });
        }
      }
    });
  } else {
    return res.status(400).json({ error: 'Invalid data format' });
  }
});

router.post('/blocked-users/create', (req, res) => {
  const requestData = req.body;
  if (requestData.user1 && requestData.user2 && requestData.user1 !== requestData.user2) {
    const selectQuery = "SELECT * FROM blocked WHERE (User1ID = ? AND User2ID = ?) OR (User1ID = ? AND User2ID = ?)";
    const insertQuery = "INSERT INTO blocked (User1ID, User2ID) VALUES (?, ?)";

    connection.query(selectQuery, [requestData.user1, requestData.user2, requestData.user2, requestData.user1], (selectErr, selectResults) => {
      if (selectErr) {
        console.log("Error executing the select query: " + selectErr);
        return res.status(500).json({ error: "Oops! Something happened :(" });
      }

      if (selectResults.length > 0) {
        // Entry already exists, return a message or status
        return res.status(200).json({ message: "Entry already exists" });
      } else {
        // Entry does not exist, perform the INSERT operation
        connection.query(insertQuery, [requestData.user1, requestData.user2], (insertErr, insertResults) => {
          if (insertErr) {
            console.log("Error executing the insert query: " + insertErr);
            return res.status(500).json({ error: "Oops! Something happened :(" });
          } else {
            return res.status(200).json({ message: "User has been blocked" });
          }
        });
      }
    });
  } else {
    return res.status(400).json({ error: 'Invalid data format' });
  }
});



module.exports = router;
