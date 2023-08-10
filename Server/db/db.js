const Sequelize = require('sequelize')
require("dotenv").config()
const { CONNECTION_STRING } = process.env;

console.log('CONNECTION_STRING:', CONNECTION_STRING);
console.log('url.parse argument:', CONNECTION_STRING); 

const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: 'postgres',
  dialectOptions : {
    rejectUnauthorized:false 
  }
});

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const User = require('./User.sql'); 

User.hasMany(Quiz);

// Synchronize the models with the database
(async () => {
  try {
    await sequelize.sync();
    console.log('Database models synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing database models:', error);
  }
})();


// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


// Export the database connection (sequelize) and the function to execute the user.sql file
module.exports == sequelize;