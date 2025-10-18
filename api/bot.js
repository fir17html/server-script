// api/bot.js
import https from "https";
import crypto from "crypto";

export default async function handler(req, res) {
  // 1. Cek API key
  const allowedKeys = "#xmdgacorbosz";
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || !allowedKeys.includes(apiKey)) {
    res.status(403).json({ error: "Invalid or missing API key" });
    return;
  }

  // 2. Ambil bot.js dari sumber (GitHub raw atau private URL)
  const remoteUrl = "https://raw.githubusercontent.com/fir17html/scriptbot/refs/heads/main/Kyzz.js";
  if (!remoteUrl) {
    res.status(500).json({ error: "BOT_SOURCE_URL not configured" });
    return;
  }

  try {
    const code = await fetchRemote(remoteUrl);
    const hash = crypto.createHash("sha256").update(code).digest("hex");

    res.setHeader("Content-Type", "application/javascript");
    res.setHeader("X-Bot-Hash", hash);
    res.send(code);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

function fetchRemote(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      let data = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}
