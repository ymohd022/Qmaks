const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const path = require("path")
// const { authenticateToken } = require("./middleware/auth.middleware")

// Import routes
// const authRoutes = require("./routes/auth.routes")
// const dashboardRoutes = require("./routes/dashboard.routes")
// const projectRoutes = require("./routes/project.routes")
// const galleryRoutes = require("./routes/gallery.routes")
// const brochureRoutes = require("./routes/brochure.routes")
const heroImageRoutes = require("./routes/hero-images.routes")

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
app.use("/api/auth", authRoutes)
app.use("/api/dashboard", authenticateToken, dashboardRoutes)
app.use("/api/projects", authenticateToken, projectRoutes)
app.use("/api/gallery", authenticateToken, galleryRoutes)
app.use("/api/brochures", authenticateToken, brochureRoutes)
app.use("/api/home/hero-images", heroImageRoutes)

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

