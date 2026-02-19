const express = require("express");
const app = express();
app.use(express.json());

const SECRET = process.env.PROXY_SECRET;

app.post("/order", async (req, res) => {
  if (req.headers["x-proxy-secret"] !== SECRET) {
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
    res.status(resp.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(process.env.PORT || 3000, () =>
  console.log("CLOB Proxy ready on port", process.env.PORT || 3000)
);

// Endpoint debug — voir l'IP externe du serveur Render
app.get("/debug-ip", async (req, res) => {
  const r = await fetch("https://ipinfo.io/json");
  res.json(await r.json());
});
