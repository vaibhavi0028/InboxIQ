const axios = require("axios");
const User = require("../models/user.model");
const gmailService = require("../services/gmail.service");

const FLASK_URL = process.env.FLASK_AI_URL;
const MailComposer = require("nodemailer/lib/mail-composer")

exports.getEmails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const limit = parseInt(req.query.limit) || 50;
    const emails = await gmailService.getEmails(user, limit);
    res.json(emails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getClassifiedEmails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const limit = parseInt(req.query.limit) || 50;
    const emails = await gmailService.getEmails(user, limit);
    const aiRes = await axios.post(`${FLASK_URL}/classify`, {
      emails,
      categories: user.categories
    })

    const classifications = aiRes.data;

    const map = new Map();
    classifications.forEach((c) => map.set(c.id, c.category));

    for (const email of emails) {
      const category = map.get(email.id) || "Others";
      await gmailService.addLabel(user, email.id, category);
      email.category = category;
    }

    const priority = user.priorityOrder;

    emails.sort((a, b) => {
      const pa = priority.indexOf(a.category);
      const pb = priority.indexOf(b.category);

      if (pa === -1 && pb === -1) return 0;
      if (pa === -1) return 1;
      if (pb === -1) return -1;
      return pa - pb;
    });

    res.json(emails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.summarizeEmail = async (req, res) => {
  try {
    const { subject, snippet } = req.body;

    const response = await axios.post(`${FLASK_URL}/summarize`, {
      subject,
      snippet,
    });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({
      error: "Summarization failed",
      details: err.message,
    });
  }
};

exports.generateReply = async (req, res) => {
  try {
    const { subject, snippet } = req.body;

    const response = await axios.post(`${FLASK_URL}/reply`, {
      subject,
      snippet,
    });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({
      error: "Reply generation failed",
      details: err.message,
    });
  }
};

exports.sendEmail = async (user, { to, subject, body }) => {
  const gmail = getClient(user)
  console.log("EXACT BODY STRING:", JSON.stringify(body));
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#111;">
      ${body}
      <div style="margin-top:24px;font-size:12px;color:#888;border-top:1px solid #eee;padding-top:8px;">
        Sent via InboxIQ
      </div>
    </div>
  `

  const mail = new MailComposer({
    from: user.email,
    to,
    subject,
    text: body.replace(/<[^>]+>/g, ""),
    html: htmlBody,
  })

  const compiled = await new Promise((resolve, reject) => {
    mail.compile().build((err, message) => {
      if (err) reject(err)
      else resolve(message)
    })
  })

  const encodedMessage = compiled
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw: encodedMessage },
  })

  return res.data
}


exports.addLabel = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { messageId, label } = req.body;
    await gmailService.addLabel(user, messageId, label);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
