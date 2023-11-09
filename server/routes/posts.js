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