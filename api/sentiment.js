// api/sentiment.js -- debug probe
export default function handler(req, res) {
  // Immediately respond so we can confirm the function executes.
  res.status(200).json({ ok: true, method: req.method || null });
}
