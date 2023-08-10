const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = process.env.CONNECTION_STRING; // Access the CONNECTION_STRING from process.env
const pool = new Pool({
  connectionString: connectionString,
});

// Function to execute the user.sql file
async function executeUserSQLFile() {
  try {
    // Read the contents of the user.sql file
    const sqlFilePath = path.join(__dirname, 'User.sql'); 
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    // Execute the SQL file using the PostgreSQL pool
    await pool.query(sqlContent);

    console.log('Database schema initialized successfully.');
  } catch (error) {
    console.error('Error initializing database schema:', error);
  }
}

// Call the function to execute the user.sql file after connecting to the database
pool.connect()
  .then(() => {
    console.log('Connected to the PostgreSQL database.');
    executeUserSQLFile(); // Execute the SQL queries after connecting
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });