const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Prediction = require("../models/Prediction");
const Contact = require("../models/Contact");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

router.get("/dashboard", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPredictions = await Prediction.countDocuments();
    const totalContacts = await Contact.countDocuments();
    const pendingContacts = await Contact.countDocuments({ status: "pending" });
    const respondedContacts = await Contact.countDocuments({ status: "responded" });

    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email subject status createdAt");

    const recentPredictions = await Prediction.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name age prediction probability createdAt");

    res.json({
      totalUsers,
      totalPredictions,
      totalContacts,
      pendingContacts,
      respondedContacts,
      recentContacts,
      recentPredictions,
    });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).json({ error: "Unable to load admin dashboard data" });
  }
});

// Get all users (admin only)
router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ users, total: users.length });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get user by ID (admin only)
router.get("/users/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Set user as admin (admin only)
router.put("/users/:id/set-admin", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { isAdmin } = req.body;

    if (typeof isAdmin !== "boolean") {
      return res.status(400).json({ error: "isAdmin must be a boolean" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isAdmin },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      message: `User ${isAdmin ? "promoted to admin" : "removed from admin"}`,
      user,
    });
  } catch (err) {
    console.error("Error updating user admin status:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Delete user (admin only)
router.delete("/users/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = router;