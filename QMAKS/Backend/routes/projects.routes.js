const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const pool = require("../database")

// Configure multer for image uploads
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/projects")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, "project-" + uniqueSuffix + ext)
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

// Get all projects
router.get("/", async (req, res) => {
  try {
    const [projects] = await pool.query(`
      SELECT p.*, 
             (SELECT pm.path FROM project_media pm 
              WHERE pm.project_id = p.id AND pm.type = 'photo' 
              ORDER BY pm.display_order ASC LIMIT 1) as thumbnailImage
      FROM projects p
      ORDER BY p.created_at DESC
    `)

    // Add full URL path to image paths
    const baseUrl = `${req.protocol}://${req.get("host")}`
    projects.forEach((project) => {
      if (project.thumbnailImage && !project.thumbnailImage.startsWith("http")) {
        project.thumbnailImage = `${baseUrl}/${project.thumbnailImage.replace(/\\/g, "/")}`
      }

      if (project.brochure_path && !project.brochure_path.startsWith("http")) {
        project.brochurePath = `${baseUrl}/${project.brochure_path.replace(/\\/g, "/")}`
      } else {
        project.brochurePath = project.brochure_path
      }
    })

    res.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get featured projects
router.get("/featured", async (req, res) => {
  try {
    const [projects] = await pool.query(`
      SELECT p.*, 
             (SELECT pm.path FROM project_media pm 
              WHERE pm.project_id = p.id AND pm.type = 'photo' 
              ORDER BY pm.display_order ASC LIMIT 1) as thumbnailImage
      FROM projects p
      WHERE p.is_featured = 1
      ORDER BY p.created_at DESC
    `)

    // Add full URL path to image paths
    const baseUrl = `${req.protocol}://${req.get("host")}`
    projects.forEach((project) => {
      if (project.thumbnailImage && !project.thumbnailImage.startsWith("http")) {
        project.thumbnailImage = `${baseUrl}/${project.thumbnailImage.replace(/\\/g, "/")}`
      }

      if (project.brochure_path && !project.brochure_path.startsWith("http")) {
        project.brochurePath = `${baseUrl}/${project.brochure_path.replace(/\\/g, "/")}`
      } else {
        project.brochurePath = project.brochure_path
      }
    })

    res.json(projects)
  } catch (error) {
    console.error("Error fetching featured projects:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get a single project by ID
router.get("/:id", async (req, res) => {
  try {
    // Get project details
    const [projects] = await pool.query("SELECT * FROM projects WHERE id = ?", [req.params.id])

    if (projects.length === 0) {
      return res.status(404).json({ message: "Project not found" })
    }

    const project = projects[0]

    // Get project media
    const [media] = await pool.query("SELECT * FROM project_media WHERE project_id = ? ORDER BY type, display_order", [
      req.params.id,
    ])

    // Add full URL paths
    const baseUrl = `${req.protocol}://${req.get("host")}`

    // Process media by type
    const photos = []
    const floorPlans = []
    const renders = []

    media.forEach((item) => {
      const fullPath = `${baseUrl}/${item.path.replace(/\\/g, "/")}`

      if (item.type === "photo") {
        photos.push(fullPath)
      } else if (item.type === "floorPlan") {
        floorPlans.push(fullPath)
      } else if (item.type === "render") {
        renders.push(fullPath)
      }
    })

    // Add brochure path
    if (project.brochure_path && !project.brochure_path.startsWith("http")) {
      project.brochurePath = `${baseUrl}/${project.brochure_path.replace(/\\/g, "/")}`
    } else {
      project.brochurePath = project.brochure_path
    }

    // Parse specifications and features
    let specifications = {}
    let features = []

    try {
      if (project.specifications) {
        specifications = JSON.parse(project.specifications)
      }

      if (project.features) {
        features = JSON.parse(project.features)
      }
    } catch (e) {
      console.error("Error parsing JSON:", e)
    }

    // Construct response
    const response = {
      id: project.id,
      name: project.name,
      location: project.location,
      type: project.type,
      status: project.status,
      size: project.size,
      completion: project.completion,
      description: project.description,
      fullDescription: project.full_description,
      isFeatured: project.is_featured === 1,
      brochureTitle: project.brochure_title,
      brochurePath: project.brochurePath,
      gallery: photos,
      floorPlans: floorPlans,
      architecturalRenders: renders,
      specifications: specifications,
      features: features,
      createdAt: project.created_at,
      updatedAt: project.updated_at,
    }

    res.json(response)
  } catch (error) {
    console.error("Error fetching project:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Add a new project
router.post("/", uploadImage.single("image"), async (req, res) => {
  try {
    const {
      name,
      location,
      type,
      status,
      size,
      completion,
      description,
      fullDescription,
      isFeatured,
      specifications,
      features,
    } = req.body

    if (!req.file) {
      return res.status(400).json({ message: "Thumbnail image is required" })
    }

    // Get the relative path to the uploaded file
    // const imagePath = req.file.path.replace(/\\/g, "/").replace("server/", "")
    const imagePath = path.relative(path.join(__dirname, '../'), req.file.path).replace(/\\/g, '/');

    // Insert project
    const [result] = await pool.query(
      `INSERT INTO projects (
        name, location, type, status, size, completion, 
        description, full_description, is_featured, 
        specifications, features, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        name,
        location,
        type,
        status,
        size,
        completion,
        description,
        fullDescription,
        isFeatured === "true" ? 1 : 0,
        specifications,
        features,
      ],
    )

    const projectId = result.insertId

    // Add the thumbnail as the first photo
    await pool.query("INSERT INTO project_media (project_id, type, path, display_order) VALUES (?, ?, ?, ?)", [
      projectId,
      "photo",
      imagePath,
      0,
    ])

    // Get the newly created project
    const [projects] = await pool.query("SELECT * FROM projects WHERE id = ?", [projectId])

    // Add full URL path to image path
    const baseUrl = `${req.protocol}://${req.get("host")}`
    const project = projects[0]
    project.thumbnailImage = `${baseUrl}/${imagePath}`

    res.status(201).json(project)
  } catch (error) {
    console.error("Error adding project:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update a project
router.put("/:id", uploadImage.single("image"), async (req, res) => {
  try {
    const {
      name,
      location,
      type,
      status,
      size,
      completion,
      description,
      fullDescription,
      isFeatured,
      specifications,
      features,
    } = req.body
    const projectId = req.params.id

    // Check if project exists
    const [existingProjects] = await pool.query("SELECT * FROM projects WHERE id = ?", [projectId])

    if (existingProjects.length === 0) {
      return res.status(404).json({ message: "Project not found" })
    }

    // Update project
    await pool.query(
      `UPDATE projects SET 
        name = ?, location = ?, type = ?, status = ?, 
        size = ?, completion = ?, description = ?, 
        full_description = ?, is_featured = ?, 
        specifications = ?, features = ?, updated_at = NOW()
      WHERE id = ?`,
      [
        name,
        location,
        type,
        status,
        size,
        completion,
        description,
        fullDescription,
        isFeatured === "true" ? 1 : 0,
        specifications,
        features,
        projectId,
      ],
    )

    // If a new image was uploaded, add it as a new photo
    if (req.file) {
      const imagePath = req.file.path.replace(/\\/g, "/").replace("server/", "")

      // Get the current highest display order
      const [orderResult] = await pool.query(
        "SELECT MAX(display_order) as maxOrder FROM project_media WHERE project_id = ? AND type = 'photo'",
        [projectId],
      )

      const displayOrder = orderResult[0].maxOrder !== null ? orderResult[0].maxOrder + 1 : 0

      // Add the new photo
      await pool.query("INSERT INTO project_media (project_id, type, path, display_order) VALUES (?, ?, ?, ?)", [
        projectId,
        "photo",
        imagePath,
        displayOrder,
      ])
    }

    // Get the updated project
    const [updatedProjects] = await pool.query("SELECT * FROM projects WHERE id = ?", [projectId])

    // Get the first photo as thumbnail
    const [thumbnails] = await pool.query(
      "SELECT path FROM project_media WHERE project_id = ? AND type = 'photo' ORDER BY display_order ASC LIMIT 1",
      [projectId],
    )

    // Add full URL paths
    const baseUrl = `${req.protocol}://${req.get("host")}`
    const updatedProject = updatedProjects[0]

    if (thumbnails.length > 0) {
      updatedProject.thumbnailImage = `${baseUrl}/${thumbnails[0].path.replace(/\\/g, "/")}`
    }

    if (updatedProject.brochure_path) {
      updatedProject.brochurePath = `${baseUrl}/${updatedProject.brochure_path.replace(/\\/g, "/")}`
    }

    res.json(updatedProject)
  } catch (error) {
    console.error("Error updating project:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete a project
router.delete("/:id", async (req, res) => {
  try {
    const projectId = req.params.id

    // Check if project exists
    const [existingProjects] = await pool.query("SELECT * FROM projects WHERE id = ?", [projectId])

    if (existingProjects.length === 0) {
      return res.status(404).json({ message: "Project not found" })
    }

    // Get all media files to delete
    const [media] = await pool.query("SELECT path FROM project_media WHERE project_id = ?", [projectId])

    // Get brochure path
    const existingProject = existingProjects[0]

    // Delete media files
    for (const item of media) {
      const filePath = path.join(__dirname, "..", item.path)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }

    // Delete brochure file if exists
    if (existingProject.brochure_path) {
      const brochurePath = path.join(__dirname, "..", existingProject.brochure_path)
      if (fs.existsSync(brochurePath)) {
        fs.unlinkSync(brochurePath)
      }
    }

    // Delete project media from database
    await pool.query("DELETE FROM project_media WHERE project_id = ?", [projectId])

    // Delete project from database
    await pool.query("DELETE FROM projects WHERE id = ?", [projectId])

    res.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Error deleting project:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get project media
router.get("/:id/media", async (req, res) => {
  try {
    const projectId = req.params.id

    // Check if project exists
    const [projects] = await pool.query("SELECT * FROM projects WHERE id = ?", [projectId])

    if (projects.length === 0) {
      return res.status(404).json({ message: "Project not found" })
    }

    // Get project media
    const [media] = await pool.query("SELECT * FROM project_media WHERE project_id = ? ORDER BY type, display_order", [
      projectId,
    ])

    // Add full URL paths
    const baseUrl = `${req.protocol}://${req.get("host")}`
    media.forEach((item) => {
      item.path = `${baseUrl}/${item.path.replace(/\\/g, "/")}`
    })

    res.json(media)
  } catch (error) {
    console.error("Error fetching project media:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Add project media
router.post("/:id/media", uploadImage.single("media"), async (req, res) => {
  try {
    const projectId = req.params.id
    const { type, displayOrder } = req.body

    // Check if project exists
    const [projects] = await pool.query("SELECT * FROM projects WHERE id = ?", [projectId])

    if (projects.length === 0) {
      return res.status(404).json({ message: "Project not found" })
    }

    if (!req.file) {
      return res.status(400).json({ message: "Media file is required" })
    }

    // Get the relative path to the uploaded file
    const mediaPath = req.file.path.replace(/\\/g, "/").replace("server/", "")

    // Insert media
    const [result] = await pool.query(
      "INSERT INTO project_media (project_id, type, path, display_order) VALUES (?, ?, ?, ?)",
      [projectId, type, mediaPath, displayOrder || 0],
    )

    // Get the newly created media
    const [media] = await pool.query("SELECT * FROM project_media WHERE id = ?", [result.insertId])

    // Add full URL path
    const baseUrl = `${req.protocol}://${req.get("host")}`
    const mediaItem = media[0]
    mediaItem.path = `${baseUrl}/${mediaPath}`

    res.status(201).json(mediaItem)
  } catch (error) {
    console.error("Error adding project media:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete project media
router.delete("/:projectId/media/:mediaId", async (req, res) => {
  try {
    const { projectId, mediaId } = req.params

    // Check if media exists
    const [media] = await pool.query("SELECT * FROM project_media WHERE id = ? AND project_id = ?", [
      mediaId,
      projectId,
    ])

    if (media.length === 0) {
      return res.status(404).json({ message: "Media not found" })
    }

    // Delete the file
    const filePath = path.join(__dirname, "..", media[0].path)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    // Delete from database
    await pool.query("DELETE FROM project_media WHERE id = ?", [mediaId])

    res.json({ message: "Media deleted successfully" })
  } catch (error) {
    console.error("Error deleting project media:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update media order
router.put("/:id/media/order", async (req, res) => {
  try {
    const projectId = req.params.id
    const { mediaIds } = req.body

    if (!Array.isArray(mediaIds)) {
      return res.status(400).json({ message: "mediaIds must be an array" })
    }

    // Update display order for each media item
    for (let i = 0; i < mediaIds.length; i++) {
      await pool.query("UPDATE project_media SET display_order = ? WHERE id = ? AND project_id = ?", [
        i,
        mediaIds[i],
        projectId,
      ])
    }

    res.json({ message: "Media order updated successfully" })
  } catch (error) {
    console.error("Error updating media order:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Upload brochure
router.post("/:id/brochure", uploadBrochure.single("brochure"), async (req, res) => {
  try {
    const projectId = req.params.id
    const { title } = req.body

    // Check if project exists
    const [projects] = await pool.query("SELECT * FROM projects WHERE id = ?", [projectId])

    if (projects.length === 0) {
      return res.status(404).json({ message: "Project not found" })
    }

    if (!req.file) {
      return res.status(400).json({ message: "Brochure file is required" })
    }

    const project = projects[0]

    // Delete old brochure if exists
    if (project.brochure_path) {
      const oldBrochurePath = path.join(__dirname, "..", project.brochure_path)
      if (fs.existsSync(oldBrochurePath)) {
        fs.unlinkSync(oldBrochurePath)
      }
    }

    // Get the relative path to the uploaded brochure
    const brochurePath = req.file.path.replace(/\\/g, "/").replace("server/", "")

    // Update project with brochure info
    await pool.query("UPDATE projects SET brochure_path = ?, brochure_title = ? WHERE id = ?", [
      brochurePath,
      title,
      projectId,
    ])

    // Get the updated project
    const [updatedProjects] = await pool.query("SELECT * FROM projects WHERE id = ?", [projectId])

    // Add full URL path to brochure
    const baseUrl = `${req.protocol}://${req.get("host")}`
    const updatedProject = updatedProjects[0]
    updatedProject.brochurePath = `${baseUrl}/${brochurePath}`

    res.json({
      id: updatedProject.id,
      brochureTitle: updatedProject.brochure_title,
      brochurePath: updatedProject.brochurePath,
    })
  } catch (error) {
    console.error("Error uploading brochure:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete brochure
router.delete("/:id/brochure", async (req, res) => {
  try {
    const projectId = req.params.id

    // Check if project exists
    const [projects] = await pool.query("SELECT * FROM projects WHERE id = ?", [projectId])

    if (projects.length === 0) {
      return res.status(404).json({ message: "Project not found" })
    }

    const project = projects[0]

    // Delete brochure file if exists
    if (project.brochure_path) {
      const brochurePath = path.join(__dirname, "..", project.brochure_path)
      if (fs.existsSync(brochurePath)) {
        fs.unlinkSync(brochurePath)
      }

      // Update project to remove brochure info
      await pool.query("UPDATE projects SET brochure_path = NULL, brochure_title = NULL WHERE id = ?", [projectId])

      res.json({ message: "Brochure deleted successfully" })
    } else {
      res.status(404).json({ message: "No brochure found for this project" })
    }
  } catch (error) {
    console.error("Error deleting brochure:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
