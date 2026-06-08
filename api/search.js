const ENK_CONTRACT = "0xC95343B3f8A5af57a9b3B1acFf3D2a7654Fa28F6";
const KNOWN_CONTRACTS = new Set([ENK_CONTRACT.toLowerCase()]);
const CHAIN_ID = 1;
const ETHERSCAN_BASE = "https://api.etherscan.io/v2/api";
const ETHERSCAN_WEB = "https://etherscan.io";

function json(res, status, body) {
  res.status(status).json(body);
}

function isAddress(value) {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

function isTransactionHash(value) {
  return /^0x[a-fA-F0-9]{64}$/.test(value);
}

function toExplorerUrl(type, value) {
  if (type === "transaction") return `${ETHERSCAN_WEB}/tx/${value}`;
  if (type === "contract") return `${ETHERSCAN_WEB}/address/${value}#code`;
  return `${ETHERSCAN_WEB}/address/${value}`;
}

function etherscanUrl(apiKey, params) {
  const query = new URLSearchParams({
    chainid: String(CHAIN_ID),
    ...params,
    apikey: apiKey,
  });
  return `${ETHERSCAN_BASE}?${query.toString()}`;
}

async function fetchEtherscan(apiKey, params) {
  const response = await fetch(etherscanUrl(apiKey, params));
  if (!response.ok) {
    throw new Error(`Etherscan request failed with ${response.status}`);
  }
  return response.json();
}

async function safeEtherscan(apiKey, params) {
  try {
    return await fetchEtherscan(apiKey, params);
  } catch (error) {
    return { error: error.message };
  }
}

function hexToNumber(hex) {
  if (!hex || typeof hex !== "string" || !hex.startsWith("0x")) return null;
  return Number.parseInt(hex, 16);
}

function baseRecognition(type, query, confidence = "pattern") {
  return {
    query,
    type,
    confidence,
    chain: "Ethereum",
    chainId: CHAIN_ID,
    explorerUrl: toExplorerUrl(type, query),
  };
}

async function recognizeTransaction(apiKey, query) {
  const recognition = baseRecognition("transaction", query);

  if (!apiKey) {
    return {
      ...recognition,
      status: "recognized",
      message: "Transaction hash recognized. Add ETHERSCAN_API_KEY for live transaction details.",
    };
  }

  const [tx, receipt] = await Promise.all([
    safeEtherscan(apiKey, {
      module: "proxy",
      action: "eth_getTransactionByHash",
      txhash: query,
    }),
    safeEtherscan(apiKey, {
      module: "proxy",
      action: "eth_getTransactionReceipt",
      txhash: query,
    }),
  ]);

  const txResult = tx && tx.result && typeof tx.result === "object" ? tx.result : null;
  const receiptResult =
    receipt && receipt.result && typeof receipt.result === "object" ? receipt.result : null;

  return {
    ...recognition,
    confidence: txResult ? "live" : "pattern",
    status: txResult ? "found" : "recognized",
    blockNumber: hexToNumber(txResult?.blockNumber || receiptResult?.blockNumber),
    from: txResult?.from || receiptResult?.from || null,
    to: txResult?.to || receiptResult?.to || null,
    valueWei: txResult?.value || null,
    gasUsed: receiptResult?.gasUsed ? hexToNumber(receiptResult.gasUsed) : null,
    success: receiptResult?.status ? receiptResult.status === "0x1" : null,
    message: txResult
      ? "Live transaction recognized and resolved through EnteleSCAN search."
      : "Transaction hash format recognized. Live details are not available yet.",
  };
}

async function recognizeAddress(apiKey, query) {
  if (KNOWN_CONTRACTS.has(query.toLowerCase())) {
    return {
      ...baseRecognition("contract", query, "known-contract"),
      status: "recognized",
      message: "EnteleKRON contract recognized from EnteleSCAN's verified ecosystem registry.",
    };
  }

  const fallback = {
    ...baseRecognition("wallet", query),
    status: "recognized",
    message: "Address recognized. Add ETHERSCAN_API_KEY for wallet versus contract verification.",
  };

  if (!apiKey) return fallback;

  const [code, balance, txs] = await Promise.all([
    safeEtherscan(apiKey, {
      module: "proxy",
      action: "eth_getCode",
      address: query,
      tag: "latest",
    }),
    safeEtherscan(apiKey, {
      module: "account",
      action: "balance",
      address: query,
      tag: "latest",
    }),
    safeEtherscan(apiKey, {
      module: "account",
      action: "txlist",
      address: query,
      startblock: "0",
      endblock: "99999999",
      page: "1",
      offset: "5",
      sort: "desc",
    }),
  ]);

  const hasContractCode =
    typeof code?.result === "string" && code.result !== "0x" && code.result.length > 2;
  const type = hasContractCode ? "contract" : "wallet";

  return {
    ...baseRecognition(type, query, "live"),
    status: "found",
    balanceWei: typeof balance?.result === "string" ? balance.result : null,
    recentTransactions: Array.isArray(txs?.result) ? txs.result.slice(0, 5) : [],
    message: hasContractCode
      ? "Contract address recognized with deployed bytecode on Ethereum."
      : "Wallet address recognized with no deployed bytecode at latest block.",
  };
}

async function networkStats(apiKey) {
  if (!apiKey) {
    return {
      status: "limited",
      chain: "Ethereum",
      chainId: CHAIN_ID,
      indexedAsset: "ENK",
      indexedContract: ENK_CONTRACT,
      searchModes: ["wallet", "contract", "transaction"],
      message: "Network statistics need ETHERSCAN_API_KEY for live values.",
    };
  }

  const [block, gas, supply, transfers] = await Promise.all([
    safeEtherscan(apiKey, {
      module: "proxy",
      action: "eth_blockNumber",
    }),
    safeEtherscan(apiKey, {
      module: "gastracker",
      action: "gasoracle",
    }),
    safeEtherscan(apiKey, {
      module: "stats",
      action: "tokensupply",
      contractaddress: ENK_CONTRACT,
    }),
    safeEtherscan(apiKey, {
      module: "account",
      action: "tokentx",
      contractaddress: ENK_CONTRACT,
      page: "1",
      offset: "1",
      sort: "desc",
    }),
  ]);

  const latestTransfer =
    Array.isArray(transfers?.result) && transfers.result.length > 0 ? transfers.result[0] : null;

  return {
    status: "live",
    chain: "Ethereum",
    chainId: CHAIN_ID,
    indexedAsset: "ENK",
    indexedContract: ENK_CONTRACT,
    latestBlock: hexToNumber(block?.result),
    safeGasGwei: gas?.result?.SafeGasPrice || null,
    proposedGasGwei: gas?.result?.ProposeGasPrice || null,
    fastGasGwei: gas?.result?.FastGasPrice || null,
    enkSupply: supply?.result || null,
    latestEnkTransferBlock: latestTransfer?.blockNumber || null,
    searchModes: ["wallet", "contract", "transaction"],
    message: "Live network statistics resolved through EnteleSCAN search API.",
  };
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return json(res, 405, { error: "Method not allowed" });
  }

  const apiKey = process.env.ETHERSCAN_API_KEY;
  const action = String(req.query.action || "search").toLowerCase();

  try {
    if (action === "stats") {
      return json(res, 200, await networkStats(apiKey));
    }

    const query = String(req.query.q || "").trim();

    if (!query) {
      return json(res, 400, {
        error: "Missing search query",
        accepted: ["wallet address", "contract address", "transaction hash"],
      });
    }

    if (isTransactionHash(query)) {
      return json(res, 200, await recognizeTransaction(apiKey, query));
    }

    if (isAddress(query)) {
      return json(res, 200, await recognizeAddress(apiKey, query));
    }

    return json(res, 400, {
      error: "Unsupported search format",
      query,
      accepted: ["0x wallet address", "0x contract address", "0x transaction hash"],
    });
  } catch (error) {
    return json(res, 500, {
      error: "Failed to search EnteleSCAN data",
      message: error.message,
    });
  }
}
