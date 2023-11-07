var express = require('express');
var router = express.Router();
const connection = require('../db');

router.post('/create/songSnap', (req, res) => {
    const songSnapData = req.body;
    if (!songSnapData) {
        return res.status(400).send('No song snap data provided');
    }
    const query = "INSERT INTO songsnaps (PromptID, SongID, Visibility, Theme, Caption, UserID) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [songSnapData.promptID, songSnapData.songID, songSnapData.visibility, songSnapData.theme, songSnapData.userID];
    connection.query(query, values, (err) => {
        if (err) {
          console.log("Error executing the query:" + err);
          res.status(500).send("Error creating the songsnap");
        } else {
          res.status(200).json(songSnapData);
        }
      });
});

module.exports = router;