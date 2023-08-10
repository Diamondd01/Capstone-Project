const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'QuizKey12';

const { SERVER_PORT } = process.env;
const dbSetup = require('./dbSetup'); 

const app = express();
const port = SERVER_PORT || 4500;

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// PostgreSQL database configuration using connection string
const connectionString = process.env.CONNECTION_STRING; // Access the CONNECTION_STRING from process.env
const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});
const bcrypt = require('bcrypt');
console.log('CONNECTION_STRING:', connectionString);


// Connect to the database and initialize schema
pool.connect()
  .then(() => {
    console.log('Connected to the PostgreSQL database.');
    return dbSetup.initializeDatabase();
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });

 app.get('/', function(req,res){
  res.send();
}); 

dbSetup.initializeDatabase();

let userResponsesData = [];
const users = [];


async function hashPassword(password) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password');
  }
}

app.post('/api/quiz/results', (req, res) => {
  try {
    // Assuming the user responses are sent in the request body as JSON
    const userResponses = req.body;

    // Process the user responses and get the selected options
    const selectedOptions = Object.values(userResponses).join(',');

    let suggestions = {
      "Natural,Winter,Last awhile,Long": ["Curly Afro", "Half up Half down", "Silk press"],
      "Protective,Winter,Long,Last awhile": ["Knotless Braids", "Faux Locs"],
    };

    // Get the suggested hairstyles based on the selected options
    const suggestedHairstyles = suggestions[selectedOptions] || [];

    // Return the suggested hairstyles as JSON in the response
    res.json({ suggestedHairstyles });
  } catch (error) {
    console.error('Error processing quiz results:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.get('/api/checkUser', (req, res) => {
 // Simulate user sign-up check
 const email = req.query.email;
 const isUserSignedUp = !!users.find(u => u.email === email);
 res.json({ isUserSignedUp });
});
// Function to process quiz responses (replace with your logic)
function processQuizResponses(quizResponses) {
  const suggestions = {
    "Natural,Winter,Last awhile,Long": ["Curly Afro", "Half up Half down", "Silk press"],
    "Protective,Winter,Long,Last awhile": ["Knotless Braids", "Faux Locs"],
  };
  
  const userKey = Object.values(quizResponses).join(',');

  // Look up the suggested hairstyles based on the user's responses
  const suggestedHairstyles = suggestions[userKey] || ['No suggestion available'];

  // You can return more detailed information if needed
  return {
    suggestedHairstyles,
  };
}

// Route to handle user registration
app.post('/api/users', async (req, res) => {
  const { username, email, password } = req.body;

  try {
   // Check if the user already exists in the database
   const existingUser = await pool.query('SELECT * FROM Users WHERE username = $1 OR email = $2', [username, email]);
   if (existingUser.rows.length > 0) {
     return res.status(400).json({ error: 'Username or email already exists' });
   }

   // Insert the new user into the database
    const query = 'INSERT INTO Users (username, email, password) VALUES ($1, $2, $3) RETURNING *';
    const newUser = await pool.query(query, [username, email, hashPassword]);

    // Generate a JWT token for the user
    const token = jwt.sign({ userId: newUser.rows[0].user_id }, SECRET_KEY, { expiresIn: '1h' });

    // Respond with success and include the token
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'An error occurred while registering user' });
  }
});

//get user info
app.get('/api/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user information from the Users table
    const query = 'SELECT user_id, username, email FROM Users WHERE user_id = $1';
    const result = await pool.query(query, [userId]);

    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user information:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
function verifyToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
//save quiz answers 
app.post('/api/users/:userId/quiz',  verifyToken, async (req, res)=> {
  try {
    const { userId } = req.params;
    const { answers } = req.body;

    // Insert the quiz answers into the QuizAnswers table
    const query = 'INSERT INTO QuizAnswers (user_id, answers) VALUES ($1, $2)';
    await pool.query(query, [userId, answers]);

    res.status(201).json({ message: 'Quiz answers saved successfully' });
  } catch (error) {
    console.error('Error saving quiz answers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//save liked hairstyles 
app.post('/api/users/:userId/liked-hairstyles', async (req, res) => {
  try {
    const { userId } = req.params;
    const { hairstyles } = req.body;

    // Insert the liked hairstyles into the LikedHairstyles table
    const query = 'INSERT INTO LikedHairstyles (user_id, hairstyles) VALUES ($1, $2)';
    await pool.query(query, [userId, hairstyles]);

    res.status(201).json({ message: 'Liked hairstyles saved successfully' });
  } catch (error) {
    console.error('Error saving liked hairstyles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint for liking a hairstyle
app.post('/api/hairstyles/:hairstyleId/like', async (req, res) => {
  console.log('Received a like request');
  try {
    const { hairstyleId } = req.params;
    // Assuming you have a logged-in user and can get the user ID from the request
    const { userId } = req.body;

    // Insert the like into the Likes table
    const query = 'INSERT INTO Likes (userID, HairstylesID) VALUES ($1, $2)';
    await pool.query(query, [userId, hairstyleId]);

    res.status(201).json({ message: 'Hairstyle liked successfully' });
  } catch (error) {
    console.error('Error liking hairstyle:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint for disliking a hairstyle
app.post('/api/hairstyles/:hairstyleId/dislike', async (req, res) => {
  try {
    const { hairstyleId } = req.params;
    // Assuming you have a logged-in user and can get the user ID from the request
    const { userId } = req.body;

    // Insert the dislike into the Dislikes table
    const query = 'INSERT INTO Dislikes (userID, HairstylesID) VALUES ($1, $2)';
    await pool.query(query, [userId, hairstyleId]);

    res.status(201).json({ message: 'Hairstyle disliked successfully' });
  } catch (error) {
    console.error('Error disliking hairstyle:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint for adding a hairstyle to favorites
app.post('/api/hairstyles/:hairstyleId/favorites', async (req, res) => {
  try {
    const { hairstyleId } = req.params;
    // Assuming you have a logged-in user and can get the user ID from the request
    const { userId } = req.body;

    // Insert the favorite into the Favorites table
    const query = 'INSERT INTO Favorites (userID, HairstylesID) VALUES ($1, $2)';
    await pool.query(query, [userId, hairstyleId]);

    res.status(201).json({ message: 'Hairstyle added to favorites successfully' });
  } catch (error) {
    console.error('Error adding hairstyle to favorites:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});