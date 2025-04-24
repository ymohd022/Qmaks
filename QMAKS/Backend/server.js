const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const mysql = require("mysql2/promise")
const path = require("path")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
// const { authenticateToken } = require("./middleware/auth.middleware")
// const authRoutes = require("./routes/auth.routes")
const heroImageRoutes = require("./routes/hero-images.routes")
const featuredPropertyRoutes = require("./routes/featured-properties.routes")
const galleryRoutes = require("./routes/gallery.routes")
const projectRoutes = require("./routes/projects.routes")
const contactRoutes = require("./routes/contact.routes")

// Create Express app
const app = express()
const PORT = process.env.PORT || 3000


// Database connection
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "qmaks_admin",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}
const pool = mysql.createPool(dbConfig)
const JWT_SECRET = process.env.JWT_SECRET || "qmaks-secret-key"
// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// API routes
// app.use("/api/auth", authRoutes)
app.use("/api/home/hero-images", heroImageRoutes)
app.use("/api/home/featured-properties", featuredPropertyRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/gallery",  galleryRoutes)
app.use("/api/contact",  contactRoutes)

// Authentication middleware
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers["authorization"]
//   const token = authHeader && authHeader.split(" ")[1]

//   if (!token) {
//     return res.status(401).json({ message: "Authentication required" })
//   }

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) {
//       return res.status(403).json({ message: "Invalid or expired token" })
//     }
//     req.user = user
//     next()
//   })
// }

// Serve Angular app in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../dist")))

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"))
  })
}
// Auth routes
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    // Get user from database
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email])
    const user = users[0]

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "24h" })

    // Return user info and token
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Dashboard routes
app.get("/api/dashboard/stats", async (req, res) => {
  try {
    // Get project stats
    const [projectStats] = await pool.query(`
      SELECT 
        COUNT(*) as totalProjects,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completedProjects,
        SUM(CASE WHEN status = 'Ongoing' THEN 1 ELSE 0 END) as ongoingProjects,
        SUM(CASE WHEN status = 'Upcoming' THEN 1 ELSE 0 END) as upcomingProjects
      FROM projects
    `)

    // Get gallery stats
    const [galleryStats] = await pool.query("SELECT COUNT(*) as totalGalleryItems FROM gallery_images")

    // Get brochure stats
    // const [brochureStats] = await pool.query("SELECT COUNT(*) as totalBrochures FROM brochures")

    // Get recent activities
    // const [recentActivities] = await pool.query(`
    //   SELECT * FROM activities
    //   ORDER BY timestamp DESC
    //   LIMIT 5
    // `)

    // Get projects by type
    const [projectsByType] = await pool.query(`
      SELECT type, COUNT(*) as count
      FROM projects
      GROUP BY type
    `)

    // Get uploads by month (last 6 months)
    // const [uploadsByMonth] = await pool.query(`
    //   SELECT 
    //     DATE_FORMAT(upload_date, '%b') as month,
    //     SUM(CASE WHEN file_type = 'image' THEN 1 ELSE 0 END) as images,
    //     SUM(CASE WHEN file_type = 'video' THEN 1 ELSE 0 END) as videos,
    //     SUM(CASE WHEN file_type = 'brochure' THEN 1 ELSE 0 END) as brochures
    //   FROM uploads
    //   WHERE upload_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
    //   GROUP BY DATE_FORMAT(upload_date, '%b')
    //   ORDER BY upload_date
    // `)

    // Combine all stats
    res.json({
      stats: {
        totalProjects: projectStats[0].totalProjects,
        completedProjects: projectStats[0].completedProjects,
        ongoingProjects: projectStats[0].ongoingProjects,
        upcomingProjects: projectStats[0].upcomingProjects,
        totalGalleryItems: galleryStats[0].totalGalleryItems,
        // totalBrochures: brochureStats[0].totalBrochures,
      },
      // recentActivities,
      projectsByType,
      // uploadsByMonth,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    res.status(500).json({ message: "Server error" })
  }
})



// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app

