const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const pool = require("../database")

// Configure multer for image uploads
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/gallery")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, "gallery-" + uniqueSuffix + ext)
  },
})

// Image upload middleware
const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image and video files are allowed"), false)
    }
  },
})

// Get all gallery images
router.get("/", async (req, res) => {
  try {
    const [images] = await pool.query(`
      SELECT * FROM gallery_images
      ORDER BY project_id, display_order
    `)

    // Add full URL path to image paths
    const baseUrl = `${req.protocol}://${req.get("host")}`
    images.forEach((image) => {
      if (image.url && !image.url.startsWith("http")) {
        image.url = `${baseUrl}/${image.url.replace(/\\/g, "/")}`
      }

      if (image.thumbnail_url && !image.thumbnail_url.startsWith("http")) {
        image.thumbnailUrl = `${baseUrl}/${image.thumbnail_url.replace(/\\/g, "/")}`
      }
    })

    // Convert to camelCase for frontend
    const formattedImages = images.map((image) => ({
      id: image.id,
      projectId: image.project_id,
      type: image.type,
      url: image.url,
      caption: image.caption,
      displayOrder: image.display_order,
      thumbnailUrl: image.thumbnail_url,
    }))

    res.json(formattedImages)
  } catch (error) {
    console.error("Error fetching gallery images:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get gallery images by project ID
router.get("/project/:projectId", async (req, res) => {
  try {
    const [images] = await pool.query(
      `
      SELECT * FROM gallery_images
      WHERE project_id = ?
      ORDER BY display_order
    `,
      [req.params.projectId],
    )

    // Add full URL path to image paths
    const baseUrl = `${req.protocol}://${req.get("host")}`
    images.forEach((image) => {
      if (image.url && !image.url.startsWith("http")) {
        image.url = `${baseUrl}/${image.url.replace(/\\/g, "/")}`
      }

      if (image.thumbnail_url && !image.thumbnail_url.startsWith("http")) {
        image.thumbnailUrl = `${baseUrl}/${image.thumbnail_url.replace(/\\/g, "/")}`
      }
    })

    // Convert to camelCase for frontend
    const formattedImages = images.map((image) => ({
      id: image.id,
      projectId: image.project_id,
      type: image.type,
      url: image.url,
      caption: image.caption,
      displayOrder: image.display_order,
      thumbnailUrl: image.thumbnail_url,
    }))

    res.json(formattedImages)
  } catch (error) {
    console.error("Error fetching gallery images:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Add a new gallery image
router.post("/", uploadImage.single("file"), async (req, res) => {
  try {
    const { projectId, type, caption, videoUrl } = req.body

    // Check if project exists
    const [projects] = await pool.query("SELECT * FROM projects WHERE id = ?", [projectId])

    if (projects.length === 0) {
      return res.status(404).json({ message: "Project not found" })
    }

    let url = null
    let thumbnailUrl = null

    if (type === "video") {
      // For videos, store the video URL
      url = videoUrl

      // Generate a thumbnail URL (this would typically be done by a video processing service)
      // For now, we'll just use a placeholder
      thumbnailUrl = "/placeholder.svg?height=200&width=300"
    } else if (req.file) {
      // For images, store the file path
      url = path.relative(path.join(__dirname, "../"), req.file.path).replace(/\\/g, "/")
    } else {
      return res.status(400).json({ message: "Image file is required for non-video types" })
    }

    // Get the current highest display order for this project
    const [orderResult] = await pool.query(
      "SELECT MAX(display_order) as maxOrder FROM gallery_images WHERE project_id = ?",
      [projectId],
    )

    const displayOrder = orderResult[0].maxOrder !== null ? orderResult[0].maxOrder + 1 : 0

    // Insert gallery image
    const [result] = await pool.query(
      `INSERT INTO gallery_images (
        project_id, type, url, caption, display_order, thumbnail_url, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [projectId, type, url, caption, displayOrder, thumbnailUrl],
    )

    // Get the newly created gallery image
    const [images] = await pool.query("SELECT * FROM gallery_images WHERE id = ?", [result.insertId])

    // Add full URL path
    const baseUrl = `${req.protocol}://${req.get("host")}`
    const image = images[0]

    if (image.url && !image.url.startsWith("http")) {
      image.url = `${baseUrl}/${image.url.replace(/\\/g, "/")}`
    }

    if (image.thumbnail_url && !image.thumbnail_url.startsWith("http")) {
      image.thumbnailUrl = `${baseUrl}/${image.thumbnail_url.replace(/\\/g, "/")}`
    }

    // Convert to camelCase for frontend
    const formattedImage = {
      id: image.id,
      projectId: image.project_id,
      type: image.type,
      url: image.url,
      caption: image.caption,
      displayOrder: image.display_order,
      thumbnailUrl: image.thumbnail_url,
    }

    res.status(201).json(formattedImage)
  } catch (error) {
    console.error("Error adding gallery image:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update a gallery image
router.put("/:id", uploadImage.single("file"), async (req, res) => {
  try {
    const { projectId, type, caption, videoUrl } = req.body
    const imageId = req.params.id

    // Check if gallery image exists
    const [existingImages] = await pool.query("SELECT * FROM gallery_images WHERE id = ?", [imageId])

    if (existingImages.length === 0) {
      return res.status(404).json({ message: "Gallery image not found" })
    }

    const existingImage = existingImages[0]
    let url = existingImage.url
    const thumbnailUrl = existingImage.thumbnail_url

    if (type === "video") {
      // For videos, update the video URL if provided
      if (videoUrl) {
        url = videoUrl
      }
    } else if (req.file) {
      // For images, update the file path if a new file is provided
      // Delete the old file if it exists and is not a video URL
      if (existingImage.type !== "video" && existingImage.url && !existingImage.url.startsWith("http")) {
        const oldFilePath = path.join(__dirname, "..", existingImage.url)
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath)
        }
      }

      url = path.relative(path.join(__dirname, "../"), req.file.path).replace(/\\/g, "/")
    }

    // Update gallery image
    await pool.query(
      `UPDATE gallery_images SET 
        project_id = ?, type = ?, url = ?, caption = ?, thumbnail_url = ?, updated_at = NOW()
      WHERE id = ?`,
      [projectId, type, url, caption, thumbnailUrl, imageId],
    )

    // Get the updated gallery image
    const [updatedImages] = await pool.query("SELECT * FROM gallery_images WHERE id = ?", [imageId])

    // Add full URL path
    const baseUrl = `${req.protocol}://${req.get("host")}`
    const updatedImage = updatedImages[0]

    if (updatedImage.url && !updatedImage.url.startsWith("http")) {
      updatedImage.url = `${baseUrl}/${updatedImage.url.replace(/\\/g, "/")}`
    }

    if (updatedImage.thumbnail_url && !updatedImage.thumbnail_url.startsWith("http")) {
      updatedImage.thumbnailUrl = `${baseUrl}/${updatedImage.thumbnail_url.replace(/\\/g, "/")}`
    }

    // Convert to camelCase for frontend
    const formattedImage = {
      id: updatedImage.id,
      projectId: updatedImage.project_id,
      type: updatedImage.type,
      url: updatedImage.url,
      caption: updatedImage.caption,
      displayOrder: updatedImage.display_order,
      thumbnailUrl: updatedImage.thumbnail_url,
    }

    res.json(formattedImage)
  } catch (error) {
    console.error("Error updating gallery image:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete a gallery image
router.delete("/:id", async (req, res) => {
  try {
    const imageId = req.params.id

    // Check if gallery image exists
    const [existingImages] = await pool.query("SELECT * FROM gallery_images WHERE id = ?", [imageId])

    if (existingImages.length === 0) {
      return res.status(404).json({ message: "Gallery image not found" })
    }

    const existingImage = existingImages[0]

    // Delete the file if it exists and is not a video URL
    if (existingImage.type !== "video" && existingImage.url && !existingImage.url.startsWith("http")) {
      const filePath = path.join(__dirname, "..", existingImage.url)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }

    // Delete from database
    await pool.query("DELETE FROM gallery_images WHERE id = ?", [imageId])

    res.json({ message: "Gallery image deleted successfully" })
  } catch (error) {
    console.error("Error deleting gallery image:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update display order of gallery images
router.put("/order", async (req, res) => {
  try {
    const { projectId, imageIds } = req.body

    if (!projectId || !Array.isArray(imageIds)) {
      return res.status(400).json({ message: "Project ID and image IDs array are required" })
    }

    // Update display order for each image
    for (let i = 0; i < imageIds.length; i++) {
      await pool.query("UPDATE gallery_images SET display_order = ? WHERE id = ? AND project_id = ?", [
        i,
        imageIds[i],
        projectId,
      ])
    }

    res.json({ message: "Gallery order updated successfully" })
  } catch (error) {
    console.error("Error updating gallery order:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
