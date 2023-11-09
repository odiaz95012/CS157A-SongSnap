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
  console.log(username)
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

router.post('/create/story', (req, res) => {
  const storyData = req.body;
  if (!storyData) {
    return res.status(400).send('No story data provided');
  };

  //Get the user's ID
  const userIDQuery = "SELECT ID FROM users WHERE Username = ?"
  const username = [storyData.username];
  connection.query(userIDQuery, username, (err, results) => {
    if (err) {
      console.log("Error executing the query:" + err);
      res.status(500).send("Error retrieving the user's ID");
    } else {
      const userID = results[0].ID;


      // Create the story
      if (userID) {
        const query = "INSERT INTO stories (SongID, Visibility, Duration, Caption, UserID) VALUES (?, ?, ?, ?, ?)";
        const values = [storyData.songID, storyData.visibility, storyData.duration, storyData.caption, userID];
        connection.query(query, values, (err) => {
          if (err) {
            console.log("Error executing the query:" + err);
            res.status(500).send("Error creating the story");
          } else {
            res.status(200).json(storyData);
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

//Retrieve all active stories from the db
router.get('/get/activeStories', (req, res) => {
  const query = "SELECT * FROM stories WHERE TIMESTAMPADD(HOUR, duration, date) > NOW()";
  connection.query(query, (err, results) => {
    if (err) {
      console.log("Error executing the query:" + err);
      res.status(500).send("Error retrieving stories");
    } else {
      res.status(200).json(results);
    }
  });
});










module.exports = router;