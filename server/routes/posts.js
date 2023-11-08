var express = require('express');
var router = express.Router();
const connection = require('../db');

router.post('/create/songSnap', (req, res) => {
    const songSnapData = req.body;
    if (!songSnapData) {
        return res.status(400).send('No song snap data provided');
    };

    //Get the user's ID
    const userIDQuery = "SELECT ID FROM users WHERE Username = ?"
    const username = [songSnapData.username];
    connection.query(userIDQuery, username, (err, results) => {
      if (err) {
        console.log("Error executing the query:" + err);
        res.status(500).send("Error retrieving the user's ID");
      } else {
        const userID = results[0].ID;
    
    
        // Create the song snap
        if (userID) {
          const query = "INSERT INTO songsnaps (PromptID, SongID, Visibility, Theme, Caption, UserID) VALUES (?, ?, ?, ?, ?, ?)";
          const values = [songSnapData.promptID, songSnapData.songID, songSnapData.visibility, songSnapData.theme, songSnapData.caption, userID];
          connection.query(query, values, (err) => {
            if (err) {
              console.log("Error executing the query:" + err);
              res.status(500).send("Error creating the songsnap");
            } else {
              res.status(200).json(songSnapData);
            }
          });
        } else {
          console.log("UserID not found");
        }
      }
    });
    

    
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

  // Get the user's friends' song snaps in a single query
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







module.exports = router;