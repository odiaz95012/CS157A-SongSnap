var express = require('express');
const cron = require('node-cron');
var router = express.Router();
const connection = require('../db');

//get all prompts
router.get('/', (_, res) => {
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

// get all of a user's prompt submissions
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

// //get a daily prompt
// router.get('/prompt-of-the-day', (_, res) => {
//     const query = "SELECT * FROM prompts ORDER BY RAND() LIMIT 1;"
//     connection.query(query, (err, results) => {
//         if (err) {
//             console.error('Error executing the query: ' + err);
//             res.status(500).send('Error retrieving data');
//         } else {
//             res.json(results);
//         }
//     });
// });

//get a random prompt from the db
const getRandomPrompt = (callback) => {
    //get total count of prompts in the db and generate a random number
    connection.query('SELECT COUNT(*) AS total FROM prompts', (err, result) => {
        if (err) {
            console.error('Error querying database:', err);
            callback(err, null);
            return;
        }
        const totalRows = result[0].total;
        const randomRow = Math.floor(Math.random() * totalRows);


        //get a random prompt
        connection.query('SELECT * FROM prompts LIMIT ?, 1', randomRow, (err, result) => {
            if (err) {
                console.error('Error retrieving random prompt:', err);
                callback(err, null);
                return;
            }
            const randomPrompt = result[0];
            callback(null, randomPrompt);
        });
    });
};

// Route to get the prompt of the day
router.get('/prompt-of-the-day', (req, res) => {
    getRandomPrompt((err, prompt) => {
        if (err || !prompt) {
            res.status(500).json({ error: 'Failed to fetch prompt of the day' });
        } else {
            res.status(200).json(prompt);
        }
    });
});

// Schedule the task to run at the start of every day (midnight)
cron.schedule('0 0 * * *', () => {
    console.log('Fetching random prompt for the day...');
    getRandomPrompt((err, prompt) => {
        if (!err && prompt) {
            console.log('Prompt of the day:', prompt);
        } else {
            console.error('Failed to fetch prompt of the day:', err);
        }
    });
}, {
    timezone: 'America/Los_Angeles',
});

module.exports = router;