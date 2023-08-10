require('dotenv').config();
const { Pool } = require('pg');
const { CONNECTION_STRING } = process.env;
const Sequelize = require('sequelize');

const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

// PostgreSQL database configuration using connection string
const connectionString = process.env.CONNECTION_STRING;
const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false, // Disable SSL
  },
});

module.exports = {
  initializeDatabase: async () => {
    try {
      const client = await pool.connect();

      // Check if Users table exists
      const usersTableCheck = await client.query(`
        SELECT EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_name = 'users_table_info'
        );
      `);

      if (!usersTableCheck.rows[0].exists) {
        // Create Users table
        await client.query(`
          CREATE TABLE Users_Table_Info (
            userId SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
          );
        `);

        // Create Quiz table
        await client.query(`
          CREATE TABLE Quiz_Table_Info (
            ResponseID SERIAL NOT NULL UNIQUE,
            UserID INTEGER NOT NULL,
            Timestamp TIMESTAMP NOT NULL,
            Response VARCHAR(255) NOT NULL,
            PRIMARY KEY (ResponseID),
            CONSTRAINT Quiz_fk0 FOREIGN KEY (UserID) REFERENCES Users_Table_Info (UserId)
          );
        `);

        // Create Hairstyles table
        await client.query(`
          CREATE TABLE Hairstyles_Table_Info (
            Hairstyle_ID SERIAL NOT NULL UNIQUE,
            Hairstyle_name VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL,
            PRIMARY KEY (Hairstyle_ID)
          );
        `);

        // Create Likes table
        await client.query(`
          CREATE TABLE Likes_Table_Info (
            LikeID SERIAL NOT NULL,
            userID INTEGER NOT NULL,
            HairstylesID INTEGER NOT NULL,
            PRIMARY KEY (LikeID),
            CONSTRAINT Likes_fk0 FOREIGN KEY (userID) REFERENCES Users_Table_Info (UserId),
            CONSTRAINT Likes_fk1 FOREIGN KEY (HairstylesID) REFERENCES Hairstyles_Table_Info (Hairstyle_ID)
          );
        `);

        // Create Favorites table
        await client.query(`
          CREATE TABLE Favorites_Table_Info (
            FavoriteID SERIAL NOT NULL,
            UserID INTEGER NOT NULL,
            HairstylesID INTEGER NOT NULL,
            PRIMARY KEY (FavoriteID),
            CONSTRAINT Favorites_fk0 FOREIGN KEY (UserID) REFERENCES Users_Table_Info (UserId),
            CONSTRAINT Favorites_fk1 FOREIGN KEY (HairstylesID) REFERENCES Hairstyles_Table_Info (Hairstyle_ID)
          );
        `);

        console.log('Database schema initialized successfully.');
      } else {
        console.log('Database schema already initialized.');
      }

      client.release();
    } catch (error) {
      console.error('Error initializing database schema:', error);
    }
  },
};
