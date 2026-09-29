const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: 'Z'
});

// Helper function to test DB connection on server startup
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`[MySQL] Successfully connected to database: ${process.env.DB_NAME || 'ecommerce'}`);
    connection.release();
    return true;
  } catch (error) {
    console.warn(`[MySQL Warning] Could not connect to MySQL database (${error.message}). Ensure MySQL service is running.`);
    return false;
  }
};

module.exports = {
  pool,
  testConnection
};
