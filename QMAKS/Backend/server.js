const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const path = require("path")
// const { authenticateToken } = require("./middleware/auth.middleware")

// Import routes
// const authRoutes = require("./routes/auth.routes")
const heroImageRoutes = require("./routes/hero-images.routes")
const featuredPropertyRoutes = require("./routes/featured-properties.routes")
const galleryRoutes = require("./routes/gallery.routes")
const projectRoutes = require("./routes/projects.routes")

// Create Express app
const app = express()
const PORT = process.env.PORT || 3000

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

// Serve Angular app in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../dist")))

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"))
  })
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app

