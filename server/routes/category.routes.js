const router = require("express").Router()
const auth = require("../middleware/auth.middleware")
const controller = require("../controllers/category.controller")

router.get("/", auth, controller.getCategories)
router.post("/add", auth, controller.addCategory)
router.post("/priority", auth, controller.updatePriority)

module.exports = router