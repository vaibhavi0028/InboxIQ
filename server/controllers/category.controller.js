const User = require("../models/user.model")

exports.getCategories = async (req, res) => {
  const user = await User.findById(req.user.id)
  res.json({
    categories: user.categories,
    priorityOrder: user.priorityOrder
  })
}

exports.addCategory = async (req, res) => {
  const user = await User.findById(req.user.id)

  const { category } = req.body

  if (!user.categories.includes(category)) {
    user.categories.push(category)
  }

  await user.save()

  res.json(user.categories)
}

exports.updatePriority = async (req, res) => {
  const user = await User.findById(req.user.id)

  user.priorityOrder = req.body.priorityOrder

  await user.save()

  res.json(user.priorityOrder)
}
