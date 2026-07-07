/* EnteleSCAN homepage: ecosystem animation, SOVRA briefings, live explorer */
(function () {
  const { ENK_CONTRACT, short, formatAmount, escape } = window.ENTELESCAN;

  const CHIP_BRIEFING_MAP = {
    ENK: "entelekron",
    "SOVRA AI": "sovra",
    EnergieMIND: "enm",
    ENM: "enm",
    EnteleWALLET: "entelewallet",
    EnteleSCAN: "entelescan",
    EnteleLINK: "entelelink",
    EnteleLEDGER: "enteleledger",
    EnteleCLOS: "enteleclos",
    EnteleVAULT: "entelevault",
    "TVK ID": "qpresence",
    GraphVault: "graphvault",
    ChronoSeal: "chronoseal",
    "Q-Presence": "qpresence",
    Cerebthra: "cerebthra",
    Cognethra: "cognethra",
    SYNTHERRA: "syntherra",
    "Sentient Signals": "sentient",
    "TVK CyberLab": "tvk",
    "TVK Labs": "tvklabs",
    "TVK Group Türkiye": "tvk",
    "TVK Wallet": "entelewallet",
    "TVK Group": "tvk",
    ALVINA: "alvina",
    "Ava Sentient": "avasentient",
    "Ava Santé": "ava",
    PuppyKRON: "puppykron",
    "KRON Assets": "kronassets",
  };

  const SOVRA_BRIEFINGS = {
    entelekron:
      "EnteleKRON is the sovereign genesis chain of the ecosystem. It anchors blocks, state, governance, and the full module constellation. ENK (100B max supply, Ethereum ERC-20) coordinates access across modules. Protocol development is in progress — core architecture is defined, mainnet indexing is next.",
    sovra:
      "SOVRA is the AI intelligence core — Sovereign Operational Virtual Reasoning Architecture. It powers anomaly detection, readiness scoring, security recommendations, and the briefings on this page. This is what makes EnteleSCAN different from every other explorer.",
    chronoseal:
      "ChronoSeal provides timestamped proof records. Every governance decision, document anchor, and audit event can be verified on-chain. EnteleSCAN will surface proof verification directly in the explorer.",
    graphvault:
      "GraphVAULT maps semantic relationships across the ecosystem. Events, proofs, identities, and transactions connect into a living knowledge graph — the intelligence layer behind SOVRA diagnostics.",
    qpresence:
      "Q-Presence handles identity, credentials, and presence verification. TVK ID extends sovereign identity, credentials, and permissioned access across the ecosystem stack.",
    entelelink:
      "EnteleLINK is the cross-chain bridge layer. It routes messages, liquidity, and proof events between ENTELΞKRON and external chains including Ethereum ENK.",
    enm:
      "EnergieMIND (ENM) is the energy and compute intelligence layer. It links mining optimization, renewable infrastructure, and carbon efficiency tracking to the broader TVK energy systems division.",
    entelewallet:
      "EnteleWallet provides sovereign wallet infrastructure — key management, multi-chain support, and secure signing for the ENTELΞKRON ecosystem stack.",
    entelescan:
      "EnteleSCAN is the observability layer you are using now. It combines live Ethereum ENK data, ecosystem intelligence, validator diagnostics, and SOVRA briefings into one mission control interface.",
    entelevault:
      "EnteleVAULT is the secure storage and archival layer. It holds credentials, documents, and protected assets with cryptographic access control integrated with Q-Presence identity.",
    enteleledger:
      "EnteleLEDGER provides distributed ledger services and accounting infrastructure — settlement records, audit trails, and financial coordination across ecosystem modules.",
    enteleclos:
      "EnteleCLOS is the cyber closure and secure operations layer — incident response protocols, wallet defense, and operational security for ecosystem assets.",
    cerebthra:
      "Cerebthra is the cognitive intelligence layer — Proof of Thought, memory synapse, and MindDAO governance pathways connected through the SOVRA intelligence core.",
    cognethra:
      "Cognethra extends cognitive processing capabilities within the ecosystem — neural optimization and structured intelligence pathways for AI-chain operations.",
    syntherra:
      "SYNTHERRA is an advanced synthesis and coordination module within the TVK research pipeline — connecting multi-domain intelligence outputs.",
    sentient:
      "Sentient Signals processes network awareness data — anomaly patterns, validator health signals, and cross-module event streams for SOVRA diagnostics.",
    alvina:
      "ALVINA is an ecosystem services module within the TVK portfolio, connecting lifestyle, wellness, and digital experience layers to the broader ENTELΞKRON stack.",
    tvk:
      "TVK CyberLab is the security research division of TVK Labs. It hardens wallet defense, incident response, and audit pipelines across the ecosystem.",
    tvklabs:
      "TVK Labs & Technologies is the R&D engine of the ecosystem — researching, designing, and building the technologies that power ENTELΞKRON, SOVRA, and all module layers.",
    ava:
      "Ava Santé is the digital health and wellness module — a SOVRA-powered digital human concept for health intelligence within the TVK ecosystem.",
    avasentient:
      "Ava Sentient is the digital human presence layer — advanced AI interaction, emotional intelligence, and human-AI interface systems within the ecosystem.",
    puppykron:
      "PuppyKRON is part of the KRON Family culture rail — a community memecoin layer separate from EnteleKRON infrastructure. Not affiliated with ENK utility.",
    kronassets:
      "KRON Assets represents the broader KRON Family token and culture rail assets on Base — distinct from the EnteleKRON ENK infrastructure token.",
  };

  function showBriefing(moduleId, title) {
    const titleEl = document.getElementById("sovraBriefingTitle");
    const textEl = document.getElementById("sovraBriefingText");
    if (titleEl) titleEl.textContent = title || moduleId;
    if (textEl)
      textEl.textContent =
        SOVRA_BRIEFINGS[moduleId] || "SOVRA intelligence briefing unavailable for this module.";
  }

  function initSovraCards() {
    document.querySelectorAll("[data-sovra]").forEach((card) => {
      card.addEventListener("click", () => {
        document.querySelectorAll("[data-sovra]").forEach((c) => c.classList.remove("active"));
        card.classList.add("active");
        const key = card.getAttribute("data-sovra");
        const label = card.querySelector("strong")?.textContent || "SOVRA Briefing";
        showBriefing(key, label);
      });
    });
  }

  function initEcosystem() {
    const root = document.getElementById("ecosystemAnimationRoot");
    if (!root || typeof window.initEcosystemAnimation !== "function") return;

    window.initEcosystemAnimation(root, {
      onChipClick(chipName) {
        const briefingId = CHIP_BRIEFING_MAP[chipName];
        document.getElementById("sovra-intelligence")?.scrollIntoView({ behavior: "smooth" });
        if (briefingId) {
          const card = document.querySelector(`[data-sovra="${briefingId}"]`);
          if (card) {
            document.querySelectorAll("[data-sovra]").forEach((c) => c.classList.remove("active"));
            card.classList.add("active");
          }
          showBriefing(briefingId, chipName);
        } else {
          showBriefing(null, chipName);
          if (document.getElementById("sovraBriefingText"))
            document.getElementById("sovraBriefingText").textContent =
              `${chipName} is an official module in the ENTELΞKRON ecosystem constellation. Detailed briefing coming soon.`;
        }
      },
    });
  }

  function updateReadiness(stats) {
    const apiOnline = stats && stats.status === "live";
    function setGauge(id, val, pct, color, lbl) {
      const ring = document.getElementById(id);
      const valEl = document.getElementById("val" + id.replace("gauge", ""));
      const lblEl = document.getElementById("lbl" + id.replace("gauge", ""));
      if (ring) {
        ring.style.setProperty("--gauge-pct", pct);
        ring.style.setProperty("--gauge-color", color);
      }
      if (valEl) valEl.textContent = typeof val === "number" ? val + "%" : val;
      if (lblEl && lbl) lblEl.textContent = lbl;
    }
    setGauge(
      "gaugeExplorer",
      apiOnline ? "Operational" : "Limited",
      apiOnline ? 92 : 45,
      apiOnline ? "var(--emerald)" : "var(--amber)",
      apiOnline ? "Console operational" : "Limited mode"
    );
    setGauge(
      "gaugeApi",
      apiOnline ? "Online" : "Limited",
      apiOnline ? 96 : 45,
      apiOnline ? "var(--cyan)" : "var(--amber)",
      apiOnline ? "Etherscan v2 connected" : "API key required"
    );
    const gasEl = document.getElementById("gasPrice");
    if (gasEl && stats) {
      gasEl.textContent = stats.safeGasGwei ? stats.safeGasGwei + " Gwei" : "—";
    }
    const blockEl = document.getElementById("latestBlock");
    if (blockEl && stats && stats.latestBlock) {
      blockEl.textContent = "#" + stats.latestBlock;
    }
  }

  function renderSearchResult(data) {
    const type = escape(
      data.type === "contract" ? "Contract" : data.type === "transaction" ? "Transaction" : "Wallet"
    );
    const query = escape(data.query);
    const message = escape(data.message || "Recognized.");
    const details = [];
    if (data.type === "transaction") {
      if (data.blockNumber) details.push(`Block #${escape(data.blockNumber)}`);
      if (data.from) details.push(`From ${escape(short(data.from))}`);
      if (data.to) details.push(`To ${escape(short(data.to))}`);
    } else {
      if (data.balanceWei) details.push(`Balance ${escape(formatAmount(data.balanceWei, 18, 5))} ETH`);
      if (Array.isArray(data.recentTransactions))
        details.push(`${data.recentTransactions.length} recent txs`);
    }
    return `<div class="search-result-card"><span>${type}</span><strong>${query}</strong><p>${message}${details.length ? " · " + details.join(" · ") : ""}</p><a href="${escape(data.explorerUrl)}" target="_blank" rel="noopener">Open on Etherscan ↗</a></div>`;
  }

  async function loadExplorer() {
    const supplyEl = document.getElementById("enkSupply");
    const transfersEl = document.getElementById("enkTransfers");
    const blockEl = document.getElementById("enkLatestBlock");
    const refreshStateEl = document.getElementById("refreshState");
    if (!supplyEl || !transfersEl) return;

    supplyEl.textContent = "Loading...";
    if (refreshStateEl) refreshStateEl.textContent = "Syncing";
    transfersEl.innerHTML = '<div class="loading-line">Loading transfers...</div>';

    try {
      const supplyResponse = await fetch("/api/enk?action=supply");
      const supplyData = await supplyResponse.json();
      if (supplyData?.status === "1" && supplyData.result) {
        supplyEl.textContent = formatAmount(supplyData.result, 18, 0) + " ENK";
      } else {
        supplyEl.textContent = "Unavailable";
      }

      const transfersResponse = await fetch("/api/enk?action=transfers");
      const transfersData = await transfersResponse.json();
      if (!transfersData?.result?.length) {
        transfersEl.innerHTML = '<div class="loading-line">No recent transfers.</div>';
        if (blockEl) blockEl.textContent = "—";
        return;
      }
      const latest = transfersData.result[0];
      if (blockEl) blockEl.textContent = "#" + latest.blockNumber;
      if (refreshStateEl) refreshStateEl.textContent = "Synced";
      const rows = transfersData.result
        .slice(0, 8)
        .map(
          (tx) =>
            `<div class="transfer-row"><a href="https://etherscan.io/tx/${tx.hash}" target="_blank" rel="noopener">${short(tx.hash)}</a><span>${short(tx.from)} → ${short(tx.to)}</span><span class="amount-pill">${formatAmount(tx.value, tx.tokenDecimal, 4)} ${tx.tokenSymbol || "ENK"}</span><span>#${tx.blockNumber}</span></div>`
        )
        .join("");
      transfersEl.innerHTML = `<div class="transfer-row header"><span>TX</span><span>Route</span><span>Amount</span><span>Block</span></div>${rows}`;
    } catch (error) {
      console.error("EnteleSCAN explorer error:", error);
      supplyEl.textContent = "Unable to load";
      transfersEl.innerHTML = '<div class="loading-line">Unable to load transfers.</div>';
      if (blockEl) blockEl.textContent = "—";
      if (refreshStateEl) refreshStateEl.textContent = "Retry";
      updateReadiness({ status: "limited" });
    }
  }

  async function loadStats() {
    const networkSourceEl = document.getElementById("networkSource");
    const statRecognitionEl = document.getElementById("statRecognition");
    const refreshStateEl = document.getElementById("refreshState");
    try {
      const response = await fetch("/api/search?action=stats");
      const stats = await response.json();
      if (!response.ok) throw new Error(stats.error || "Stats unavailable");
      updateReadiness(stats);
      if (networkSourceEl) networkSourceEl.textContent = stats.chain || "Ethereum";
      if (refreshStateEl) refreshStateEl.textContent = stats.status === "live" ? "Synced" : "Limited";
      if (statRecognitionEl)
        statRecognitionEl.textContent = Array.isArray(stats.searchModes)
          ? String(stats.searchModes.length)
          : "3";
    } catch (error) {
      console.error("EnteleSCAN stats error:", error);
      updateReadiness({ status: "limited" });
      if (refreshStateEl) refreshStateEl.textContent = "Retry";
    }
  }

  async function runSearch() {
    const input = document.getElementById("entelescanSearch");
    const result = document.getElementById("entelescanSearchResult");
    if (!input) return;
    const value = input.value.trim();
    if (!value) {
      if (result) result.textContent = "Enter a wallet, contract, or transaction hash.";
      return;
    }
    if (result) result.textContent = "Scanning...";
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unsupported format");
      if (result) result.innerHTML = renderSearchResult(data);
    } catch (error) {
      if (result) result.textContent = `${error.message}. Use a 0x address or transaction hash.`;
    }
  }

  function refresh() {
    loadExplorer();
    loadStats();
  }

  document.querySelector("[data-entelescan-search]")?.addEventListener("click", runSearch);
  document.getElementById("entelescanSearch")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") runSearch();
  });
  document.querySelector("[data-refresh-explorer]")?.addEventListener("click", refresh);

  const contractEl = document.getElementById("enkContract");
  if (contractEl) contractEl.textContent = ENK_CONTRACT;

  initEcosystem();
  initSovraCards();
  refresh();
})();
