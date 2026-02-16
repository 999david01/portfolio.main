const path = require("path");
const fs = require("fs");
const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadMessages() {
  try {
    const raw = fs.readFileSync(MESSAGES_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveMessages(messages) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), "utf8");
}

// Optional: send email via Nodemailer (if env is set)
async function sendContactEmail(payload) {
  const { name, email, message } = payload;
  const to = process.env.CONTACT_EMAIL;
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!to) return; // No email to send to
  if (!host || !user || !pass) return; // No SMTP configured

  try {
    const nodemailer = require("nodemailer");
    const transport = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass },
    });
    await transport.sendMail({
      from: process.env.SMTP_FROM || user,
      to,
      subject: `Portfolio contact: ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      replyTo: email,
    });
  } catch (err) {
    console.error("Email send failed:", err.message);
  }
}

app.use(express.json());
app.use(express.static(__dirname));

// CORS for same-origin is fine; add if you need to call from another domain
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

app.post("/api/contact", async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const { name, email, message, website } = req.body || {};

  // Honeypot
  if (website && String(website).trim()) {
    return res.status(200).json({ ok: true });
  }

  const n = String(name || "").trim();
  const e = String(email || "").trim();
  const m = String(message || "").trim();

  if (!n || !e || !m) {
    return res
      .status(400)
      .json({ ok: false, error: "Missing required fields" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(e)) {
    return res
      .status(400)
      .json({ ok: false, error: "Invalid email address" });
  }

  const payload = { name: n, email: e, message: m, at: new Date().toISOString() };

  try {
    const messages = loadMessages();
    messages.push(payload);
    saveMessages(messages);
  } catch (err) {
    console.error("Save messages error:", err);
    return res
      .status(500)
      .json({ ok: false, error: "Failed to save message" });
  }

  await sendContactEmail({ name: n, email: e, message: m });
  console.log("Contact saved:", e);

  return res.status(200).json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
