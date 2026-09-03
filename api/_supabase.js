const SUPABASE_URL = process.env.SUPABASE_URL || "https://kgxfbuxfpreoomcubaxd.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || "";

async function insert(table, row, opts = {}) {
  const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=minimal,resolution=ignore-duplicates",
  };
  let url = `${SUPABASE_URL}/rest/v1/${table}`;
  if (opts.onConflict) {
    url += `?on_conflict=${encodeURIComponent(opts.onConflict)}`;
  }
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase insert failed (${res.status}): ${text}`);
  }
  return res;
}

module.exports = { SUPABASE_URL, SUPABASE_KEY, insert };
