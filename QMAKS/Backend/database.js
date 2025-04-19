const mysql = require("mysql2/promise")

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "qmaks_admin",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Create connection pool
const pool = mysql.createPool(dbConfig)

// Database initialization
const initDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    })

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`)

    // Use the database
    await connection.query(`USE ${dbConfig.database}`)

    // Create projects table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        location VARCHAR(100) NOT NULL,
        type VARCHAR(100) NOT NULL,
        status VARCHAR(20) NOT NULL,
        size VARCHAR(50) NOT NULL,
        completion VARCHAR(50),
        description TEXT NOT NULL,
        full_description TEXT NOT NULL,
        is_featured BOOLEAN DEFAULT 0,
        specifications TEXT,
        features TEXT,
        brochure_path VARCHAR(255),
        brochure_title VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // Create project_media table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS project_media (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        type ENUM('photo', 'floorPlan', 'render') NOT NULL,
        path VARCHAR(255) NOT NULL,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      )
    `)

    // Create hero_images table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS hero_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(100),
        subtitle VARCHAR(100),
        description TEXT,
        image_path VARCHAR(255) NOT NULL,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create featured_properties table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS featured_properties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        location VARCHAR(100) NOT NULL,
        type VARCHAR(100) NOT NULL,
        status VARCHAR(20) NOT NULL,
        completion VARCHAR(50),
        description TEXT NOT NULL,
        image_path VARCHAR(255) NOT NULL,
        brochure_path VARCHAR(255),
        brochure_title VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log("Database initialized successfully")
    await connection.end()
  } catch (error) {
    console.error("Database initialization error:", error)
  }
}

// Initialize database on startup
initDatabase()

module.exports = pool
