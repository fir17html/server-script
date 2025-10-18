import https from "https";
import http from "http";
import crypto from "crypto";

export default async function handler(req, res) {
  const allowedKey = "#xmdgacorbosz";
  const apiKey = req.headers["x-api-key"];

  if (apiKey !== allowedKey) {
    res.status(403).json({ error: "Invalid or missing API key" });
    return;
  }

  const remoteUrl = "https://raw.githubusercontent.com/fir17html/scriptbot/refs/heads/main/Kyzz.js";

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
    const lib = url.startsWith("https") ? https : http;
    lib.get(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      let data = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}
