// api/sentiment.js -- raw body debug probe
export default async function handler(req, res) {
  // Accept any method for debugging
  let raw = "";
  try {
    for await (const chunk of req) raw += chunk;
  } catch (err) {
    // if reading stream fails
    return res.status(500).json({ error: "stream error", detail: String(err) });
  }

  // return everything so we can see what actually arrived
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({
    ok: true,
    method: req.method || null,
    headers: req.headers || null,
    rawBody: raw,
    length: raw ? raw.length : 0
  });
}
