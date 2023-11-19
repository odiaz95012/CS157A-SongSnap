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
  }

  // Get the user's ID
  const userID = storyData.userID;
  if (userID) {
    const storyInsertQuery = "INSERT INTO stories (SongID, Visibility, Duration, Caption, UserID) VALUES (?, ?, ?, ?, ?)";
    const storyValues = [storyData.songID, storyData.visibility, storyData.duration, storyData.caption, userID];

    connection.query(storyInsertQuery, storyValues, (err) => {
      if (err) {
        console.log("Error executing the query:" + err);
        return res.status(500).send("Error creating the story");
      }

      const postsInsertQuery = "INSERT INTO posts (SongID, Visibility, Caption, UserID) VALUES (?, ?, ?, ?)";
      const postsInsertValues = [storyData.songID, storyData.visibility, storyData.caption, userID];

      connection.query(postsInsertQuery, postsInsertValues, (err) => {
        if (err) {
          console.log("Error executing the query:" + err);
          return res.status(500).send("Error posting the story to the posts table.");
        }

        return res.status(200).json(storyData);
      });
    });
  } else {
    return res.status(500).send("The user ID was not provided");
  }
});


//Retrieve all songs snaps from the db for the main feed
router.get('/get/songSnaps', (_, res) => {
  const query = `SELECT ss.*, u.Username, u.name, u.ProfilePicture
                FROM songsnaps ss, users u
                WHERE ss.UserID = u.ID
                ORDER BY ss.Date DESC;`;
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
    SELECT ss.*, u.Username, u.name, u.ProfilePicture
    FROM songsnaps ss
    JOIN friends f ON ss.UserID = f.User2ID
    JOIN users u ON ss.UserID = u.ID
    WHERE f.User1ID = ? AND f.Status = 'Accepted'
    ORDER BY ss.Date DESC;`;

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

  const query = "SELECT * FROM songsnaps WHERE UserID = ? ORDER BY Date DESC";
  connection.query(query, [userID], (err, results) => {
    if (err) {
      console.log("Error executing the query:" + err);
      res.status(500).send("Error retrieving song snaps");
    } else {
      res.status(200).json(results);
    }
  });
});

//Like a post
router.post('/like', (req, res) => {
  const likeData = req.body;
  if (!likeData) {
    return res.status(400).send('No like data provided');
  }
  const likeInsertQuery = "INSERT INTO likes (PostID, UserID) VALUES (?, ?)";
  const likeValues = [likeData.postID, likeData.userID];

  connection.query(likeInsertQuery, likeValues, (err) => {
    if (err) {
      console.log("Error executing the query:" + err);
      return res.status(500).send("Error liking the post");
    }
    return res.status(200).json(likeData);
  });
});

//Unlike a post
router.post('/unlike', (req, res) => {
  const likeData = req.body;
  if (!likeData) {
    return res.status(400).send('No like data provided');
  }
  const likeDeleteQuery = "DELETE FROM likes WHERE PostID = ? AND UserID = ?";
  const likeValues = [likeData.postID, likeData.userID];

  connection.query(likeDeleteQuery, likeValues, (err) => {
    if (err) {
      console.log("Error executing the query:" + err);
      return res.status(500).send("Error unliking the post");
    }
    return res.status(200).json(likeData);
  });

});

// Get the likes for a post
router.get('/get/likes', (req, res) => {
  const postID = req.query.postID;
  const userID = req.query.userID;
  const query = `
    SELECT COUNT(PostID) AS likeCount
    FROM likes 
    WHERE PostID = ?
    GROUP BY PostID;
  `;
  connection.query(query, [postID], (err, likesResults) => {
    if (err) {
      console.log("Error executing the query:" + err);
      res.status(500).send("Error retrieving likes");
    } else {
      // Check if the given userID is in the results
      const userIDsQuery = "SELECT UserID FROM likes WHERE PostID = ?";
      connection.query(userIDsQuery, [postID], (err, userIDresults) => {
        if (err) {
          console.log("Error executing the query:" + err);
          res.status(500).send("Error retrieving the user ids for likes");
        } else {
          const isLikedByCallingUser = userIDresults.some(result => result.UserID === parseInt(userID));
          const response = {
            likeCount: likesResults.length > 0 ? likesResults[0].likeCount : 0,
            isLiked: isLikedByCallingUser
          };

          res.status(200).send(response);
        }
      })
    }
  });
});

//get all comments for a post
router.get('/get/comments', (req, res) => {
  const postID = req.query.postID;
  const query = `
    SELECT c.*, u.Username, u.ProfilePicture
    FROM comments c, users u
    WHERE c.UserID = u.ID AND c.PostID = ?
    ORDER BY c.Date DESC;
  `;
  connection.query(query, [postID], (err, results) => {
    if (err) {
      console.log("Error executing the query:" + err);
      res.status(500).send("Error retrieving comments");
    } else {
      res.status(200).json(results);
    }
  });
});

//publish comment
router.post('/publish/comment', (req, res) => {
  const commentData = req.body;
  if (!commentData.userID || !commentData.postID || !commentData.text) {
    return res.status(400).send('Data provided is not valid');
  }

  const commentInsertQuery = "INSERT INTO comments (PostID, UserID, Text) VALUES (?, ?, ?)";
  const commentValues = [commentData.postID, commentData.userID, commentData.text];

  connection.query(commentInsertQuery, commentValues, (err, result) => {
    if (err) {
      console.log("Error executing the query:" + err);
      return res.status(500).send("Error commenting on the post");
    }
    // Send the inserted comment data along with the ID
    const commentId = result.insertId; // Retrieve the comment ID using insertId

    // Send the inserted comment data along with the ID
    const commentWithId = {
      ...commentData,
      commentID: commentId
    };
    return res.status(200).json(commentWithId);
  });
});

//delete comment
router.post('/delete/comment', (req, res) => {
  const { commentID} = req.body;
  if (!commentID) {
    return res.status(400).send('Please provide the comment ID.');
  }
  const deleteQuery = "DELETE FROM comments WHERE ID = ?";
  connection.query(deleteQuery, [commentID], (deleteErr) => {
    if (deleteErr) {
      console.log("Error deleting comment:", deleteErr);
      return res.status(500).send("Error deleting comment");
    }
    return res.status(200).send("Comment deleted successfully");
  });
});

//favorite a post
router.post('/favorite', (req, res) => {
  const favoriteData = req.body;
  if (!favoriteData.userID || !favoriteData.songSnapID) {
    return res.status(400).send('Please provide all the required data.');
  }
  const favoriteInsertQuery = "INSERT INTO pinned(UserID, SongSnapID) VALUES (?, ?)";
  const favoriteValues = [favoriteData.userID, favoriteData.songSnapID];

  connection.query(favoriteInsertQuery, favoriteValues, (err) => {
    if (err) {
      console.log("Error executing the query:" + err);
      return res.status(500).send("Error favoriting the post");
    }
    return res.status(200).json(favoriteData);
  });
});

//unfavorite a post
router.post('/unfavorite', (req, res) => {
  const favoriteData = req.body;
  if (!favoriteData.userID || !favoriteData.songSnapID) {
    return res.status(400).send('Please provide all the required data.');
  }
  const favoriteDeleteQuery = "DELETE FROM pinned WHERE UserID = ? AND SongSnapID = ?";
  const favoriteValues = [favoriteData.userID, favoriteData.songSnapID];

  connection.query(favoriteDeleteQuery, favoriteValues, (err) => {
    if (err) {
      console.log("Error executing the query:" + err);
      return res.status(500).send("Error unfavoriting the post");
    }
    return res.status(200).json(favoriteData);
  });
});



module.exports = router;