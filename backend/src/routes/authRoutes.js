const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);

// Delete current authenticated user's account
router.delete("/", auth, authController.deleteAccount);

module.exports = router;