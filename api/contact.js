const { insert } = require("./_supabase");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  let body = {};
  try {
    body = typeof req.body === "object" && req.body ? req.body : JSON.parse(req.body || "{}");
  } catch {
    return res.status(400).json({ ok: false, error: "Invalid JSON" });
  }

  const { name = "", email = "", phone = "", service = "", message = "", subject = null } = body;
  const isNewsletter = subject === "Newsletter Signup" || (!name && !message);

  try {
    if (isNewsletter) {
      await insert("newsletter_subscribers", {
        email: (email || "").trim(),
        created_at: new Date().toISOString(),
      }, { onConflict: "email" });
    } else {
      await insert("contact_messages", {
        name: (name || "").trim(),
        email: (email || "").trim(),
        phone: (phone || "").trim(),
        service: (service || "").trim(),
        message: (message || "").trim(),
        created_at: new Date().toISOString(),
      });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("contact error:", e.message);
    return res.status(500).json({ ok: false, error: "Failed to save" });
  }
};
