const router = require("express").Router()

const emailController = require("../controllers/email.controller")
const authMiddleware = require("../middleware/auth.middleware")

router.get("/", authMiddleware, emailController.getEmails)

router.get("/classified", authMiddleware, emailController.getClassifiedEmails)

router.post("/summarize", authMiddleware, emailController.summarizeEmail)

router.post("/reply", authMiddleware, emailController.generateReply)

router.post("/send", authMiddleware, emailController.sendEmail)

router.post("/label", authMiddleware, emailController.addLabel)

module.exports = router