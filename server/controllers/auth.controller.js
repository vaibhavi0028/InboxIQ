const jwt = require("jsonwebtoken")
const { google } = require("googleapis")

const oauth2Client = require("../config/googleAuth")
const User = require("../models/user.model")

const scopes = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.modify",
  "profile",
  "email",
]

exports.googleLogin = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  })

  res.redirect(url)
}

exports.googleCallback = async (req, res) => {
  const { code } = req.query

  const { tokens } = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens)

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: "v2",
  })

  const { data } = await oauth2.userinfo.get()

  let user = await User.findOne({ email: data.email })

  if (!user) {
    user = await User.create({
      googleId: data.id,
      email: data.email,
      name: data.name,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    })
  } else {
    user.accessToken = tokens.access_token
    if (tokens.refresh_token) user.refreshToken = tokens.refresh_token
    await user.save()
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )

  res.cookie("token", token, { secure: true, sameSite: "none" })

  res.redirect(process.env.CLIENT_DASHBOARD_URL)
}

exports.me = async (req, res) => {
  const user = await User.findById(req.user.id)
  res.json(user)
}

exports.logout = (req, res) => {
  res.clearCookie("token")
  res.json({ message: "Logged out" })
}