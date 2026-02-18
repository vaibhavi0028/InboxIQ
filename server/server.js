require("dotenv").config()

const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")

const connectDB = require("./config/db")

const authRoutes = require("./routes/auth.routes")
const emailRoutes = require("./routes/email.routes")
const categoryRoutes = require("./routes/category.routes")
const automationRoutes = require("./routes/automation.routes")


const app = express()


connectDB()

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.use("/auth", authRoutes)
app.use("/emails", emailRoutes)
app.use("/categories", categoryRoutes)
app.use("/automation", automationRoutes)


app.get("/", (req, res) => {
  res.send("InboxIQ API running")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})