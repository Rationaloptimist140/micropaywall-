async function getJSON(url, headers = {}) {
  const res = await fetch(url, { headers });
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text; }
  return { status: res.status, body };
}

(async () => {
  const url = "http://localhost:3000/data";

  console.log("1) First call (no payment)...");
  const first = await getJSON(url);
  console.log(first.status, first.body);

  console.log("\n2) Retry with mock payment header...");
  const second = await getJSON(url, { "X-Payment-Proof": "mock-usdc-123" });
  console.log(second.status, second.body);
})();
