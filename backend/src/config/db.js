import { Sequelize } from 'sequelize';

// Create a connection to MySQL server first
const rootSequelize = new Sequelize('', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

// Test connection and set up database
const connectDB = async () => {
  try {
    // First connect to MySQL server
    await rootSequelize.authenticate();
    console.log('Connected to MySQL server.');

    // Create database if it doesn't exist
    await rootSequelize.query('CREATE DATABASE IF NOT EXISTS ath_pfe;');
    
    // Create actual connection to our database
    const sequelize = new Sequelize('ath_pfe', 'root', '', {
      host: 'localhost',
      dialect: 'mysql',
      logging: false,
    });

    // Test connection to our database
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized successfully.');

    return sequelize;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Export an async function that ensures database connection
export const getSequelize = async () => {
  const sequelize = await connectDB();
  return sequelize;
};

// For backward compatibility
export default await connectDB();
