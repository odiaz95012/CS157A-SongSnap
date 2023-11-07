var express = require('express');
var router = express.Router();
const connection = require('../db');

//get all prompts
router.get('/', (req, res) => {
    const query = "SELECT * FROM prompts";
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error executing the query: ' + err);
        res.status(500).send('Error retrieving data');
      } else {
        res.json(results);
      }
    });
  });

router.post('/submit', (req, res) => {
    const text = req.body.text;
    const theme = req.body.theme;
    const cookieData = req.cookies && req.cookies.login;

    if (cookieData) {
        // Cookie data exists
        const id = cookieData.id;

        const query = `INSERT INTO prompt_submissions (UserID, PromptText, Theme, DateCreated) VALUES (?, ?, ?, ?)`;
        const values = [id, text, theme, new Date()];

        connection.query(query, values, (err, results) => {
            if (err) {
                console.error('Error executing the query: ' + err);
                res.status(500).send('Error inserting data');
            } else {
                // Check if the insertion was successful
                if (results.affectedRows === 1) {
                    // Insertion successful, set the cookie with the user's data
                    res.json({ message: 'Prompt submission successful' });
                } else {
                    // Insertion failed
                    res.status(500).json({ message: 'Failed to insert the prompt' });
                }
            }
        });

    } else {
        // No cookie data found
        res.status(401).json({ message: 'OOOPS! Something happened' });
    }
});

router.get('/all', (req, res) => {
    const id = req.query.id;

    if (id) {
        const query = `
          SELECT PromptText, Theme, DateCreated
          FROM prompt_submissions
          WHERE UserID = ?
          ORDER BY DateCreated DESC
    `;
        connection.query(query, [id], (err, results) => {
            if (err) {
                console.log("Error executing the query: " + err);
                return res.status(500).json({ error: "OO0OPS! Something happened :(" });
            } else {
                if (results.length > 0) {
                    return res.status(200).json(results);
                } else {
                    return res.status(404).json({ message: 'No submissions sent' });
                }
            }
        });
    } else {
        return res.status(400).json({ error: 'Invalid data format' });
    }
});

module.exports = router;