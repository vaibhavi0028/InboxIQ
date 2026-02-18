const { google } = require("googleapis")
const oauth2Client = require("../config/googleAuth")

const getClient = (user) => {
  oauth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  })

  return google.gmail({ version: "v1", auth: oauth2Client })
}

exports.getEmails = async (user, max = 10) => {
  const gmail = getClient(user)

  const res = await gmail.users.messages.list({
    userId: "me",
    maxResults: max,
  })

  if (!res.data.messages) return []

  const messages = await Promise.all(
    res.data.messages.map(async (m) => {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: m.id,
      })

      const headers = msg.data.payload.headers

      const getHeader = (name) =>
        headers.find((h) => h.name === name)?.value || ""

      return {
        id: m.id,
        subject: getHeader("Subject"),
        from: getHeader("From"),
        date: getHeader("Date"),
        snippet: msg.data.snippet,
      }
    })
  )

  return messages
}

exports.sendEmail = async (user, { to, subject, body }) => {
  const gmail = getClient(user)

  const message = [
    `To: ${to}`,
    "Content-Type: text/html; charset=utf-8",
    "MIME-Version: 1.0",
    `Subject: ${subject}`,
    "",
    body,
  ].join("\n")

  const encoded = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encoded,
    },
  })

  return res.data
}

exports.addLabel = async (user, messageId, labelName) => {
  const gmail = getClient(user)

  const safeLabel = `InboxIQ/${labelName}`

  const labelsRes = await gmail.users.labels.list({ userId: "me" })

  let label = labelsRes.data.labels.find(l => l.name === safeLabel)

  if (!label) {
    const created = await gmail.users.labels.create({
      userId: "me",
      requestBody: {
        name: safeLabel,
        labelListVisibility: "labelShow",
        messageListVisibility: "show"
      }
    })

    label = created.data
  }

  await gmail.users.messages.modify({
    userId: "me",
    id: messageId,
    requestBody: {
      addLabelIds: [label.id]
    }
  })
}