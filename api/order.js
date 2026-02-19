export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = req.headers["x-proxy-secret"];
  if (secret !== process.env.PROXY_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const resp = await fetch("https://clob.polymarket.com/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "POLY_ADDRESS": req.headers["poly_address"] || "",
        "POLY_SIGNATURE": req.headers["poly_signature"] || "",
        "POLY_TIMESTAMP": req.headers["poly_timestamp"] || "",
        "POLY_API_KEY": req.headers["poly_api_key"] || "",
        "POLY_PASSPHRASE": req.headers["poly_passphrase"] || "",
      },
      body: JSON.stringify(req.body),
    });
    const data = await resp.json();
    return res.status(resp.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
