const router = require("express").Router()

const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middleware/auth.middleware")

router.get("/google", authController.googleLogin)
router.get("/google/callback", authController.googleCallback)

router.get("/me", authMiddleware, authController.me)
router.post("/logout", authController.logout)

module.exports = router