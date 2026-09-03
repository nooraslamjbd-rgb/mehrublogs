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

  const email = (body.email || "").trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: "Invalid email" });
  }

  try {
    await insert("newsletter_subscribers", {
      email,
      created_at: new Date().toISOString(),
    }, { onConflict: "email" });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("newsletter error:", e.message);
    return res.status(500).json({ ok: false, error: "Failed to save" });
  }
};
