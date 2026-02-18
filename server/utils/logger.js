const fs = require("fs")
const path = require("path")

const logDir = path.join(__dirname, "../logs")

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

const file = path.join(logDir, "app.log")

const write = (level, message) => {
  const time = new Date().toISOString()
  const line = `[${time}] [${level}] ${message}\n`

  fs.appendFileSync(file, line)
  console.log(line.trim())
}

exports.info = (msg) => write("INFO", msg)
exports.error = (msg) => write("ERROR", msg)
exports.warn = (msg) => write("WARN", msg)