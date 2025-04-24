const express = require("express")
const router = express.Router()
const nodemailer = require("nodemailer")

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || "your-email",
    pass: process.env.EMAIL_PASS || "your-email-password",
  },
})

// Contact form submission route
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required" })
    }

    // Email content
    const mailOptions = {
      from: `"QMAKS Website" <${process.env.EMAIL_USER || "your-email"}>`,
      to: "",
      subject: subject || "New Contact Form Submission",
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    // Return success response
    res.status(200).json({ message: "Message sent successfully" })
  } catch (error) {
    console.error("Error sending email:", error)
    res.status(500).json({ message: "Failed to send message", error: error.message })
  }
})

// Project inquiry form submission route
router.post("/project-inquiry", async (req, res) => {
  try {
    const { name, email, phone, message, visitDate, preferredTime, projectId, projectName } = req.body

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: "Name, email, phone, and message are required" })
    }

    // Format visit date if provided
    const formattedDate = visitDate ? new Date(visitDate).toLocaleDateString() : "Not specified"

    // Email content
    const mailOptions = {
      from: `"QMAKS Website" <${process.env.EMAIL_USER || "your email"}>`,
      to: "",
      subject: `Project Inquiry: ${projectName || "Unknown Project"}`,
      html: `
        <h2>New Project Inquiry</h2>
        <p><strong>Project:</strong> ${projectName || "Unknown"} (ID: ${projectId || "N/A"})</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Preferred Visit Date:</strong> ${formattedDate}</p>
        <p><strong>Preferred Time:</strong> ${preferredTime || "Not specified"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    // Return success response
    res.status(200).json({ message: "Inquiry sent successfully" })
  } catch (error) {
    console.error("Error sending inquiry:", error)
    res.status(500).json({ message: "Failed to send inquiry", error: error.message })
  }
})

module.exports = router
