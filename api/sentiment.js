// api/sentiment.js
// Minimal Vercel serverless function that calls Hugging Face inference API.
// Uses global fetch available in Node 18+ (Vercel runtime).

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Optional API key protection
  const expectedKey = process.env.API_KEY;
  if (expectedKey) {
    const provided = req.headers["x-api-key"];
    if (!provided || provided !== expectedKey) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }

  const body = req.body || {};
  // Accept either JSON { text: "..." } or raw string
  const text = body.text || (typeof body === "string" ? body : null);
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return res.status(400).json({ error: "Request must include { text: string }" });
  }

  const HF_API = "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english";
  const HF_TOKEN = process.env.HF_TOKEN;
  if (!HF_TOKEN) {
    return res.status(500).json({ error: "HF_TOKEN not configured in environment" });
  }

  try {
    const resp = await fetch(HF_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    });

    if (!resp.ok) {
      const txt = await resp.text().catch(() => "");
      return res.status(502).json({ error: "Model inference error", detail: txt });
    }

    const data = await resp.json();
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(502).json({ error: "Unexpected model response", raw: data });
    }

    const result = data[0];
    return res.json({
      label: result.label,
      score: result.score,
      raw: result
    });
  } catch (err) {
    console.error("sentiment error", err);
    return res.status(500).json({ error: "Server error", detail: String(err) });
  }
}
