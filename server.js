const fs = require("fs");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const PAY_HEADER = "x-payment-proof";
const PAY_VALUE = "mock-usdc-123";

function logPayment(entry) {
  fs.appendFileSync("payments.json", JSON.stringify(entry) + "\n", "utf8");
}

app.get("/data", (req, res) => {
  const proof = req.headers[PAY_HEADER];

  if (!proof) {
    return res.status(402).json({
      address: "0x123...",
      amount: "0.001",
      token: "USDC",
      hint: `Retry with header ${PAY_HEADER}: ${PAY_VALUE}`
    });
  }

  if (proof !== PAY_VALUE) {
    return res.status(403).json({ error: "Invalid payment proof" });
  }

  logPayment({
    ts: new Date().toISOString(),
    amount: "0.001",
    token: "USDC",
    network: "Base",
    path: "/data",
    txid: proof
  });

  return res.json({ data: "Agent marketplace access granted" });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
