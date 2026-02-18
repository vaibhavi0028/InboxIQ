const axios = require("axios")

const User = require("../models/user.model")
const gmailService = require("../services/gmail.service")
const logger = require("../utils/logger")

const FLASK_URL = process.env.FLASK_AI_URL


exports.sendMail = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    const result = await gmailService.sendEmail(user, req.body)

    logger.info(`Email sent by ${user.email}`)

    res.json(result)
  } catch (err) {
    logger.error(err.message)
    res.status(500).json({ error: err.message })
  }
}


exports.replyWithAI = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    const { to, subject, snippet } = req.body || {}

    const aiRes = await axios.post(
      `${FLASK_URL}/reply`,
      { subject, snippet }
    )

    const replyText = aiRes.data.reply

    const result = await gmailService.sendEmail(user, {
      to,
      subject: `Re: ${subject}`,
      body: replyText
    })

    logger.info(`AI reply sent for ${subject}`)

    res.json({
      reply: replyText,
      result
    })
  } catch (err) {
    logger.error(err.message)
    res.status(500).json({ error: err.message })
  }
}


exports.autoReply = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    const emails = await gmailService.getEmails(user, 5)

    const results = []

    for (const mail of emails) {
      const aiRes = await axios.post(
        `${FLASK_URL}/reply`,
        {
          subject: mail.subject,
          snippet: mail.snippet
        }
      )

      const replyText = aiRes.data.reply

      const sent = await gmailService.sendEmail(user, {
        to: mail.from,
        subject: `Re: ${mail.subject}`,
        body: replyText
      })

      results.push(sent)
    }

    logger.info(`Auto replies processed for ${user.email}`)

    res.json(results)
  } catch (err) {
    logger.error(err.message)
    res.status(500).json({ error: err.message })
  }
}


exports.labelMail = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    const { messageId, label } = req.body || {}

    await gmailService.addLabel(user, messageId, label)

    logger.info(`Label ${label} applied to ${messageId}`)

    res.json({ success: true })
  } catch (err) {
    logger.error(err.message)
    res.status(500).json({ error: err.message })
  }
}


exports.summarize = async (req, res) => {
  try {
    const { subject, snippet } = req.body || {}

    const aiRes = await axios.post(
      `${FLASK_URL}/summarize`,
      { subject, snippet }
    )

    logger.info(`Summarized email ${subject}`)

    res.json(aiRes.data)
  } catch (err) {
    logger.error(err.message)
    res.status(500).json({ error: err.message })
  }
}