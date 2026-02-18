const router = require("express").Router()

const controller = require("../controllers/automation.controller")
const auth = require("../middleware/auth.middleware")

router.post("/send", auth, controller.sendMail)

router.post("/reply", auth, controller.replyWithAI)

router.post("/auto-reply", auth, controller.autoReply)

router.post("/label", auth, controller.labelMail)

router.post("/summarize", auth, controller.summarize)

module.exports = router