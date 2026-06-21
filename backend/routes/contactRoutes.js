const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

// Setup email transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL || "your-email@gmail.com",
    pass: process.env.GMAIL_PASSWORD || "your-app-password",
  },
});

// Submit contact form
router.post("/submit", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res
        .status(400)
        .json({ error: "Name, email, subject, and message are required" });
    }

    // Create contact entry
    const contact = new Contact({
      name,
      email,
      phone: phone || "",
      subject,
      message,
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: "Thank you! We have received your message.",
      contactId: contact._id,
    });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({ error: "Failed to submit contact form" });
  }
});

const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// Get all contacts (admin only)
router.get("/all", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ contacts, total: contacts.length });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

// Get contact by ID
router.get("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    // Mark as read
    if (contact.status === "pending") {
      contact.status = "read";
      await contact.save();
    }

    res.status(200).json(contact);
  } catch (error) {
    console.error("Error fetching contact:", error);
    res.status(500).json({ error: "Failed to fetch contact" });
  }
});

// Reply to contact message
router.post("/:id/reply", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: "Reply message is required" });
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    // Add reply to database
    contact.replies.push({
      message: message.trim(),
      sentAt: new Date(),
      from: "admin@cardiogaurd.com",
    });

    // Update status to responded
    contact.status = "responded";
    await contact.save();

    // Send email to user
    try {
      await transporter.sendMail({
        from: process.env.GMAIL_EMAIL || "support@cardiogaurd.com",
        to: contact.email,
        subject: `Re: ${contact.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h2 style="color: #dc2626;">CardioGuard Response</h2>
            <p>Hi <strong>${contact.name}</strong>,</p>
            <p>Thank you for contacting us. Here's our response to your inquiry:</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <p><strong>Your Message:</strong></p>
              <p>"${contact.message}"</p>
              
              <p style="margin-top: 20px;"><strong>Our Reply:</strong></p>
              <p>"${message}"</p>
            </div>
            
            <p>If you have any further questions, please feel free to reach out to us.</p>
            
            <p>Best regards,<br><strong>CardioGuard Support Team</strong><br>
            📧 support@cardiogaurd.com<br>
            📞 +1 (555) 123-4567</p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 12px;">This email contains confidential information. If you are not the intended recipient, please delete this email.</p>
          </div>
        `,
      });
      console.log("Email sent to", contact.email);
    } catch (emailError) {
      console.warn("Email sending failed (proceeding without email):", emailError.message);
    }

    res.status(200).json({
      success: true,
      message: "Reply sent successfully",
      contact,
    });
  } catch (error) {
    console.error("Error sending reply:", error);
    res.status(500).json({ error: "Failed to send reply" });
  }
});

// Update contact status
router.put("/:id/status", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "read", "responded"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.status(200).json({ success: true, contact });
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ error: "Failed to update contact" });
  }
});

// Delete contact
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.status(200).json({ success: true, message: "Contact deleted" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ error: "Failed to delete contact" });
  }
});

module.exports = router;
