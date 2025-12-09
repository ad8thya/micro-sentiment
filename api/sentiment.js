// api/sentiment.js -- parse probe
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  let body = "";
  for await (const chunk of req) body += chunk;
  try {
    req.body = body ? JSON.parse(body) : {};
  } catch (err) {
    return res.status(400).json({ error: "Invalid JSON" });
  }
  return res.status(200).json({ received: req.body });
}
