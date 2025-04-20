const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const pool = require("../database")

// Configure multer for image uploads
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/properties")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, "property-" + uniqueSuffix + ext)
  },
})

// Configure multer for brochure uploads
const brochureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/brochures")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, "brochure-" + uniqueSuffix + ext)
  },
})

// Image upload middleware
const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed"), false)
    }
  },
})

// Brochure upload middleware
const uploadBrochure = multer({
  storage: brochureStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true)
    } else {
      cb(new Error("Only PDF files are allowed"), false)
    }
  },
})

// Add to featured-properties.routes.js
router.get("/:id/brochure", async (req, res) => {
  try {
    const [properties] = await pool.query(
      "SELECT brochure_path FROM featured_properties WHERE id = ?",
      [req.params.id]
    );

    if (properties.length === 0 || !properties[0].brochure_path) {
      return res.status(404).json({ message: "Brochure not found" });
    }

    const brochurePath = path.join(__dirname, "../", properties[0].brochure_path);
    res.download(brochurePath);
  } catch (error) {
    console.error("Error downloading brochure:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all featured properties
router.get("/", async (req, res) => {
  try {
    const [properties] = await pool.query("SELECT * FROM featured_properties ORDER BY id DESC")

    // Add full URL path to image and brochure paths
    const baseUrl = `${req.protocol}://${req.get("host")}`
    properties.forEach((property) => {
      if (property.image_path && !property.image_path.startsWith("http")) {
        property.imagePath = `${baseUrl}/${property.image_path.replace(/\\/g, "/")}`
      } else {
        property.imagePath = property.image_path
      }

      if (property.brochure_path && !property.brochure_path.startsWith("http")) {
        property.brochurePath = `${baseUrl}/${property.brochure_path.replace(/\\/g, "/")}`
      } else {
        property.brochurePath = property.brochure_path
      }
    })

    res.json(properties)
  } catch (error) {
    console.error("Error fetching featured properties:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get a single featured property by ID
router.get("/:id", async (req, res) => {
  try {
    const [properties] = await pool.query("SELECT * FROM featured_properties WHERE id = ?", [req.params.id])

    if (properties.length === 0) {
      return res.status(404).json({ message: "Property not found" })
    }

    const property = properties[0]

    // Add full URL path to image and brochure paths
    const baseUrl = `${req.protocol}://${req.get("host")}`
    if (property.image_path && !property.image_path.startsWith("http")) {
      property.imagePath = `${baseUrl}/${property.image_path.replace(/\\/g, "/")}`
    } else {
      property.imagePath = property.image_path
    }

    if (property.brochure_path && !property.brochure_path.startsWith("http")) {
      property.brochurePath = `${baseUrl}/${property.brochure_path.replace(/\\/g, "/")}`
    } else {
      property.brochurePath = property.brochure_path
    }

    res.json(property)
  } catch (error) {
    console.error("Error fetching property:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Add a new featured property
router.post("/", uploadImage.single("image"), async (req, res) => {
  try {
    const { name, location, type, status, completion, description } = req.body

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" })
    }

    // Get the relative path to the uploaded file
    // const imagePath = req.file.path.replace(/\\/g, "/").replace("server/", "")
    const imagePath = path.relative(path.join(__dirname, '../'), req.file.path).replace(/\\/g, '/');

    // Insert property
    const [result] = await pool.query(
      "INSERT INTO featured_properties (name, location, type, status, completion, description, image_path) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, location, type, status, completion, description, imagePath],
    )

    // Get the newly created property
    const [properties] = await pool.query("SELECT * FROM featured_properties WHERE id = ?", [result.insertId])

    // Add full URL path to image path
    const baseUrl = `${req.protocol}://${req.get("host")}`
    const property = properties[0]
    property.imagePath = `${baseUrl}/${imagePath}`

    res.status(201).json(property)
  } catch (error) {
    console.error("Error adding property:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update a featured property
router.put("/:id", uploadImage.single("image"), async (req, res) => {
  try {
    const { name, location, type, status, completion, description } = req.body
    const propertyId = req.params.id

    // Check if property exists
    const [existingProperties] = await pool.query("SELECT * FROM featured_properties WHERE id = ?", [propertyId])

    if (existingProperties.length === 0) {
      return res.status(404).json({ message: "Property not found" })
    }

    const existingProperty = existingProperties[0]

    // Prepare update query
    let imagePath = existingProperty.image_path
    let updateQuery =
      "UPDATE featured_properties SET name = ?, location = ?, type = ?, status = ?, completion = ?, description = ?"
    const queryParams = [name, location, type, status, completion, description]

    // If a new image was uploaded, update the image path
    if (req.file) {
      // Delete the old image file if it exists
      if (existingProperty.image_path) {
        const oldImagePath = path.join(__dirname, "..", existingProperty.image_path)
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath)
        }
      }

      // Get the relative path to the new uploaded file
      const imagePath = path.relative(path.join(__dirname, '../'), req.file.path)
  .replace(/\\/g, '/')
  .replace('server/', ''); // Add this line if needed
      updateQuery += ", image_path = ?"
      queryParams.push(imagePath)
    }

    // Complete the query
    updateQuery += " WHERE id = ?"
    queryParams.push(propertyId)

    // Update property
    await pool.query(updateQuery, queryParams)

    // Get the updated property
    const [updatedProperties] = await pool.query("SELECT * FROM featured_properties WHERE id = ?", [propertyId])

    // Add full URL path to image path
    const baseUrl = `${req.protocol}://${req.get("host")}`
    const updatedProperty = updatedProperties[0]
    if (updatedProperty.image_path && !updatedProperty.image_path.startsWith("http")) {
      updatedProperty.imagePath = `${baseUrl}/${updatedProperty.image_path.replace(/\\/g, "/")}`
    } else {
      updatedProperty.imagePath = updatedProperty.image_path
    }

    if (updatedProperty.brochure_path && !updatedProperty.brochure_path.startsWith("http")) {
      updatedProperty.brochurePath = `${baseUrl}/${updatedProperty.brochure_path.replace(/\\/g, "/")}`
    } else {
      updatedProperty.brochurePath = updatedProperty.brochure_path
    }

    res.json(updatedProperty)
  } catch (error) {
    console.error("Error updating property:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete a featured property
router.delete("/:id", async (req, res) => {
  try {
    const propertyId = req.params.id

    // Check if property exists
    const [existingProperties] = await pool.query("SELECT * FROM featured_properties WHERE id = ?", [propertyId])

    if (existingProperties.length === 0) {
      return res.status(404).json({ message: "Property not found" })
    }

    const existingProperty = existingProperties[0]

    // Delete the image file if it exists
    if (existingProperty.image_path) {
      const imagePath = path.join(__dirname, "..", existingProperty.image_path)
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
    }

    // Delete the brochure file if it exists
    if (existingProperty.brochure_path) {
      const brochurePath = path.join(__dirname, "..", existingProperty.brochure_path)
      if (fs.existsSync(brochurePath)) {
        fs.unlinkSync(brochurePath)
      }
    }

    // Delete property from database
    await pool.query("DELETE FROM featured_properties WHERE id = ?", [propertyId])

    res.json({ message: "Property deleted successfully" })
  } catch (error) {
    console.error("Error deleting property:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Upload brochure for a property
router.post("/:id/brochure", uploadBrochure.single("brochure"), async (req, res) => {
  try {
    const { title } = req.body
    const propertyId = req.params.id

    if (!req.file) {
      return res.status(400).json({ message: "Brochure file is required" })
    }

    // Check if property exists
    const [existingProperties] = await pool.query("SELECT * FROM featured_properties WHERE id = ?", [propertyId])

    if (existingProperties.length === 0) {
      return res.status(404).json({ message: "Property not found" })
    }

    const existingProperty = existingProperties[0]

    // Delete the old brochure file if it exists
    if (existingProperty.brochure_path) {
      const oldBrochurePath = path.join(__dirname, "..", existingProperty.brochure_path)
      if (fs.existsSync(oldBrochurePath)) {
        fs.unlinkSync(oldBrochurePath)
      }
    }

    // Get the relative path to the uploaded brochure
    const brochurePath = path.relative(path.join(__dirname, '../'), req.file.path).replace(/\\/g, '/');

    // Update property with brochure info
    await pool.query("UPDATE featured_properties SET brochure_path = ?, brochure_title = ? WHERE id = ?", [
      brochurePath,
      title,
      propertyId,
    ])

    // Get the updated property
    const [updatedProperties] = await pool.query("SELECT * FROM featured_properties WHERE id = ?", [propertyId])

    // Add full URL path to brochure path
    const baseUrl = `${req.protocol}://${req.get("host")}`
    const updatedProperty = updatedProperties[0]
    updatedProperty.brochurePath = `${baseUrl}/${brochurePath}`

    res.json(updatedProperty)
  } catch (error) {
    console.error("Error uploading brochure:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
