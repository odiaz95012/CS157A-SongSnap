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

//post a user prompt submission to the prompt_submissions table
router.post('/post/userSubmission', (req, res) => {
    const promptText = req.body.promptText;
    const theme = req.body.theme;
    const userID = req.body.userID;

    if (promptText && theme && userID) {
        const query = `
        INSERT INTO prompt_submissions (UserID, PromptText, Theme, DateCreated)
        VALUES (?, ?, ?, ?)`;
        const values = [userID, promptText, theme, new Date()];

        connection.query(query, values, (err, results) => {
            if (err) {
                console.error('Error executing the query: ' + err);
                res.status(500).send('Error inserting the prompt submission data');
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
        res.status(400).send('The prompt text, theme, or user ID was not provided.');
    }
})

//get all user prompt submissions that are not already in the daily prompts rotation
router.get('/all/userSubmissions', (_, res) => {

    const query = `
    SELECT ps.*, users.Username 
    FROM prompt_submissions ps
    JOIN users ON ps.UserID = users.ID
    LEFT JOIN prompts p ON ps.PromptText = p.PromptText
    WHERE p.PromptText IS NULL`;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error executing the query: ' + err);
            res.status(500).send('Error retrieving all of the user prompt submissions.');
        } else {
            res.json(results);
        }
    });
});


//add user prompt submission to daily prompts rotation
router.post('/add', (req, res) => {
    const promptID = req.body.promptID;
    if(promptID) {
        const query = `
        SELECT * FROM prompt_submissions WHERE PromptID = ?`;
        connection.query(query, [promptID], (err, results) => {
            if (err) {
                console.error('Error executing the query: ' + err);
                res.status(500).send('Error adding user prompt submission to daily prompts rotation.');
            } else {
                const promptDetails = results[0];
                const insertPromptQuery = `INSERT INTO prompts (PromptText, Theme) VALUES (?, ?)`;
                const insertPromptValues = [promptDetails.PromptText, promptDetails.Theme];
                connection.query(insertPromptQuery, insertPromptValues, (err, results) => {
                    if (err) {
                        console.error('Error executing the query: ' + err);
                        res.status(500).send('Error adding user prompt submission to daily prompts rotation.');
                    } else {
                        // Check if the insertion was successful
                        if (results.affectedRows === 1) {
                            const promptData = {
                                PromptID: promptID,
                                PromptText: promptDetails.PromptText,
                                Theme: promptDetails.Theme
                            };
                            res.json({ message: 'Prompt submission successful',  promptData: promptData});
                        } else {
                            // Insertion failed
                            res.status(500).json({ message: 'Failed to insert the prompt' });
                        }
                    }
                });
            }
        });


    }else {
        res.status(400).send('The prompt ID of the user prompt submission was not provided.');
    }
});

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
router.get('/prompt-of-the-day', (_, res) => {
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