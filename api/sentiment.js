export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // --- FIX: MANUAL JSON PARSING ---
  let body = "";
  for await (const chunk of req) {
    body += chunk;
  }

  try {
    if (body) {
      req.body = JSON.parse(body);
    } else {
      req.body = {};
    }
  } catch (err) {
    return res.status(400).json({ error: "Invalid JSON" });
  }
  // --------------------------------

  const text = req.body.text;

  if (!text) {
    return res.status(400).json({ error: "Missing 'text' field in request body" });
  }

  return res.status(200).json({ received: text, message: "JSON parsing working!" });
}
