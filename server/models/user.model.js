const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    googleId: String,
    email: String,
    name: String,
    accessToken: String,
    refreshToken: String,

    categories: {
      type: [String],
      default: [
        "Important",
        "Work",
        "Personal",
        "Finance",
        "Promotions",
        "Social",
        "Updates",
        "Spam",
        "Travel",
        "Others"
      ]
    },

    priorityOrder: {
      type: [String],
      default: ["Important", "Work", "Personal"]
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("User", userSchema)
