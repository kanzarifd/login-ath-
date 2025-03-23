import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize('ath_pfe', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  logging: false,
  define: {
    timestamps: true,
    charset: 'utf8',
    collate: 'utf8_general_ci'
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test the connection and create database if it doesn't exist
const testConnection = async () => {
  try {
    // First, try to connect to MySQL without a specific database
    const tempDb = new Sequelize('mysql://root:@localhost:3306');
    
    // Create database if it doesn't exist
    await tempDb.query('CREATE DATABASE IF NOT EXISTS ath_pfe;');
    await tempDb.close();

    // Now connect to our database
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync all models
    await sequelize.sync();
    console.log('Database models synchronized successfully.');
    
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

// Test the connection
testConnection();

export default sequelize;
