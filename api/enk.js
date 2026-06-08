const ENK_CONTRACT = "0xC95343B3f8A5af57a9b3B1acFf3D2a7654Fa28F6";
const CHAIN_ID = 1;

export default async function handler(req, res) {
  const apiKey = process.env.ETHERSCAN_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing ETHERSCAN_API_KEY" });
  }

  const action = req.query.action || "transfers";

  let url;

  if (action === "supply") {
    url =
      `https://api.etherscan.io/v2/api?chainid=${CHAIN_ID}` +
      `&module=stats&action=tokensupply` +
      `&contractaddress=${ENK_CONTRACT}` +
      `&apikey=${apiKey}`;
  } else {
    url =
      `https://api.etherscan.io/v2/api?chainid=${CHAIN_ID}` +
      `&module=account&action=tokentx` +
      `&contractaddress=${ENK_CONTRACT}` +
      `&page=1&offset=10&sort=desc` +
      `&apikey=${apiKey}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch ENK data" });
  }
}