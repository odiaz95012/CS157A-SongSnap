var express = require('express');
var router = express.Router();
const connection = require('../db');

router.post('/create/songSnap', (req, res) => {
  const songSnapData = req.body;
  if (!songSnapData) {
    return res.status(400).send('No song snap data provided');
  }

  // Get the user's ID
  const userID = songSnapData.userID;
  if (userID) {
    const songSnapInsertQuery = "INSERT INTO songsnaps (PromptID, SongID, Visibility, Theme, Caption, UserID) VALUES (?, ?, ?, ?, ?, ?)";
    const songSnapValues = [songSnapData.promptID, songSnapData.songID, songSnapData.visibility, songSnapData.theme, songSnapData.caption, userID];
    
    connection.query(songSnapInsertQuery, songSnapValues, (err) => {
      if (err) {
        console.log("Error executing the query:" + err);
        return res.status(500).send("Error creating the songsnap");
      }

      const postsInsertQuery = "INSERT INTO posts (SongID, Visibility, Caption, UserID) VALUES (?, ?, ?, ?)";
      const postsInsertValues = [songSnapData.songID, songSnapData.visibility, songSnapData.caption, userID];

      connection.query(postsInsertQuery, postsInsertValues, (err) => {
        if (err) {
          console.log("Error executing the query:" + err);
          return res.status(500).send("Error posting the songsnap to the posts table.");
        }

        return res.status(200).json(songSnapData);
      });
    });
  } else {
    return res.status(500).send("The user ID was not provided");
  }
});


//Retrieve all songs snaps from the db for the main feed
router.get('/get/songSnaps', (req, res) => {
  const query = "SELECT * FROM songsnaps";
  connection.query(query, (err, results) => {
    if (err) {
      console.log("Error executing the query:" + err);
      res.status(500).send("Error retrieving song snaps");
    } else {
      res.status(200).json(results);
    }
  });
});

router.get('/get/friendSongSnaps', (req, res) => {
  const userID = req.query.userID;

  // Get the user's friends' and the account owners song snaps
  const query = `
    SELECT ss.*
    FROM songsnaps ss
    JOIN friends f ON ss.UserID = f.User2ID
    WHERE f.User1ID = ? AND f.Status = 'Accepted';
  `;

  connection.query(query, [userID], (err, results) => {
    if (err) {
      console.log("Error executing the query: " + err);
      res.status(500).send("Error retrieving song snaps");
    } else {
      res.status(200).json(results);
    }
  });
});

//Get a user's song snaps
router.get('/get/userSongSnaps', (req, res) => {
  const userID = req.query.userID;

  const query = "SELECT * FROM songsnaps WHERE UserID = ?";
  connection.query(query, [userID], (err, results) => {
    if (err) {
      console.log("Error executing the query:" + err);
      res.status(500).send("Error retrieving song snaps");
    } else {
      res.status(200).json(results);
    }
  });
});


module.exports = router;