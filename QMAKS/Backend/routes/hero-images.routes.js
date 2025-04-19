const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const fs = require("fs")
// const { authenticateToken } = require("../middleware/auth.middleware")
const pool = require("../database")

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/hero-images")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, "hero-image-" + uniqueSuffix + ext)
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed"), false)
    }
  },
})

// Get all hero images
router.get("/",  async (req, res) => {
  try {
    const [heroImages] = await pool.query("SELECT * FROM hero_images ORDER BY display_order ASC")

    // Add full URL path to image paths
    const baseUrl = `${req.protocol}://${req.get("host")}`
    heroImages.forEach((image) => {
      if (image.image_path && !image.image_path.startsWith("http")) {
        image.imagePath = `${baseUrl}/${image.image_path.replace(/\\/g, "/")}`
      } else {
        image.imagePath = image.image_path
      }
    })

    res.json(heroImages)
  } catch (error) {
    console.error("Error fetching hero images:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get a single hero image by ID
router.get("/:id",  async (req, res) => {
  try {
    const [heroImages] = await pool.query("SELECT * FROM hero_images WHERE id = ?", [req.params.id])

    if (heroImages.length === 0) {
      return res.status(404).json({ message: "Hero image not found" })
    }

    const heroImage = heroImages[0]

    // Add full URL path to image path
    const baseUrl = `${req.protocol}://${req.get("host")}`
    if (heroImage.image_path && !heroImage.image_path.startsWith("http")) {
      heroImage.imagePath = `${baseUrl}/${heroImage.image_path.replace(/\\/g, "/")}`
    } else {
      heroImage.imagePath = heroImage.image_path
    }

    res.json(heroImage)
  } catch (error) {
    console.error("Error fetching hero image:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Add a new hero image
router.post("/",  upload.single("image"), async (req, res) => {
  try {
    const { title, subtitle, description, displayOrder } = req.body

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" })
    }

    // Get the relative path to the uploaded file
    // const imagePath = req.file.path.replace(/\\/g, "/").replace("server/", "")
    const imagePath = path.relative(path.join(__dirname, '../'), req.file.path).replace(/\\/g, '/');

    // Insert hero image
    const [result] = await pool.query(
      "INSERT INTO hero_images (title, subtitle, description, image_path, display_order) VALUES (?, ?, ?, ?, ?)",
      [title, subtitle, description, imagePath, displayOrder],
    )

    // Log activity
    await pool.query("INSERT INTO activities (user_id, type, item, timestamp) VALUES (?, ?, ?, NOW())", [
      req.user.id,
      "upload",
      "New hero image",
      new Date(),
    ])

    // Get the newly created hero image
    const [heroImages] = await pool.query("SELECT * FROM hero_images WHERE id = ?", [result.insertId])

    // Add full URL path to image path
    const baseUrl = `${req.protocol}://${req.get("host")}`
    const heroImage = heroImages[0]
    heroImage.imagePath = `${baseUrl}/${imagePath}`

    res.status(201).json(heroImage)
  } catch (error) {
    console.error("Error adding hero image:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update a hero image
router.put("/:id",  upload.single("image"), async (req, res) => {
  try {
    const { title, subtitle, description, displayOrder } = req.body
    const heroImageId = req.params.id

    // Check if hero image exists
    const [existingImages] = await pool.query("SELECT * FROM hero_images WHERE id = ?", [heroImageId])

    if (existingImages.length === 0) {
      return res.status(404).json({ message: "Hero image not found" })
    }

    const existingImage = existingImages[0]

    // Prepare update query
    let imagePath = existingImage.image_path
    let updateQuery = "UPDATE hero_images SET title = ?, subtitle = ?, description = ?, display_order = ?"
    const queryParams = [title, subtitle, description, displayOrder]

    // If a new image was uploaded, update the image path
    if (req.file) {
      // Delete the old image file if it exists
      if (existingImage.image_path) {
        const oldImagePath = path.join(__dirname, "..", existingImage.image_path)
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath)
        }
      }

      // Get the relative path to the new uploaded file
      imagePath = req.file.path.replace(/\\/g, "/").replace("server/", "")
      updateQuery += ", image_path = ?"
      queryParams.push(imagePath)
    }

    // Complete the query
    updateQuery += " WHERE id = ?"
    queryParams.push(heroImageId)

    // Update hero image
    await pool.query(updateQuery, queryParams)

    // Log activity
    await pool.query("INSERT INTO activities (user_id, type, item, timestamp) VALUES (?, ?, ?, NOW())", [
      req.user.id,
      "edit",
      `Hero image: ${title}`,
      new Date(),
    ])

    // Get the updated hero image
    const [updatedImages] = await pool.query("SELECT * FROM hero_images WHERE id = ?", [heroImageId])

    // Add full URL path to image path
    const baseUrl = `${req.protocol}://${req.get("host")}`
    const updatedImage = updatedImages[0]
    updatedImage.imagePath = `${baseUrl}/${imagePath}`

    res.json(updatedImage)
  } catch (error) {
    console.error("Error updating hero image:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete a hero image
router.delete("/:id",  async (req, res) => {
  try {
    const heroImageId = req.params.id

    // Check if hero image exists
    const [existingImages] = await pool.query("SELECT * FROM hero_images WHERE id = ?", [heroImageId])

    if (existingImages.length === 0) {
      return res.status(404).json({ message: "Hero image not found" })
    }

    const existingImage = existingImages[0]

    // Delete the image file if it exists
    if (existingImage.image_path) {
      const imagePath = path.join(__dirname, "..", existingImage.image_path)
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
    }

    // Delete hero image from database
    await pool.query("DELETE FROM hero_images WHERE id = ?", [heroImageId])

    // Log activity
    await pool.query("INSERT INTO activities (user_id, type, item, timestamp) VALUES (?, ?, ?, NOW())", [
      req.user.id,
      "delete",
      `Hero image: ${existingImage.title}`,
      new Date(),
    ])

    res.json({ message: "Hero image deleted successfully" })
  } catch (error) {
    console.error("Error deleting hero image:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router

