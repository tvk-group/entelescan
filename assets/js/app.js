/* EnteleSCAN homepage: galaxy, SOVRA briefings, live explorer */
(function () {
  const { ENK_CONTRACT, short, formatAmount, escape } = window.ENTELESCAN;

  const GALAXY_MODULES = [
    { id: "entelekron", name: "ENTELΞKRON", desc: "Sovereign genesis chain — blocks, state, governance, and the full module constellation.", tag: "Core Chain", x: 0.5, y: 0.5, core: true },
    { id: "sovra", name: "SOVRA", desc: "AI diagnostic core — anomaly detection, health briefings, and ecosystem intelligence.", tag: "AI Core", x: 0.5, y: 0.12, primary: true },
    { id: "graphvault", name: "GraphVAULT", desc: "Semantic knowledge graph linking events, proofs, and ecosystem context.", tag: "Graph Layer", x: 0.28, y: 0.28 },
    { id: "chronoseal", name: "ChronoSeal", desc: "Timestamp proofs and immutable verification records.", tag: "Proof Layer", x: 0.72, y: 0.28 },
    { id: "enm", name: "ENM", desc: "EnergieMIND token intelligence — energy and compute layer.", tag: "Energy", x: 0.14, y: 0.5 },
    { id: "entelelink", name: "EnteleLINK", desc: "Cross-chain bridge routes, message passing, and liquidity movement.", tag: "Bridge", x: 0.86, y: 0.5 },
    { id: "entelewallet", name: "EnteleWallet", desc: "Sovereign wallet infrastructure for the ecosystem stack.", tag: "Wallet", x: 0.32, y: 0.72 },
    { id: "qpresence", name: "Q-Presence", desc: "Identity, credentials, and presence verification events.", tag: "Identity", x: 0.68, y: 0.72 },
    { id: "entelescan", name: "EnteleSCAN", desc: "This observatory — explorer, intelligence center, and mission control.", tag: "Observatory", x: 0.5, y: 0.88 },
    { id: "entelevault", name: "EnteleVAULT", desc: "Secure storage and archival layer for ecosystem assets.", tag: "Storage", x: 0.08, y: 0.35 },
    { id: "enteleledger", name: "EnteleLEDGER", desc: "Ledger services and accounting infrastructure.", tag: "Ledger", x: 0.92, y: 0.35 },
    { id: "cerebthra", name: "Cerebthra", desc: "Cognitive processing module for AI-chain operations.", tag: "Cognitive", x: 0.08, y: 0.65 },
    { id: "sentient", name: "Sentient Signals", desc: "Signal processing and network awareness layer.", tag: "Signals", x: 0.92, y: 0.65 },
    { id: "alvina", name: "ALVINA", desc: "ALVINA-linked ecosystem services and token layer.", tag: "Module", x: 0.5, y: 0.04 },
    { id: "tvk", name: "TVK CyberLab", desc: "Security research and cyber infrastructure lab.", tag: "Security", x: 0.2, y: 0.15 },
    { id: "ava", name: "Ava Santé", desc: "Health and wellness ecosystem module.", tag: "Life", x: 0.8, y: 0.15 },
  ];

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
      "Q-Presence handles identity, credentials, and presence verification. It connects wallet activity to verified identity events, enabling access control and governance participation tracking.",
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
    cerebthra:
      "Cerebthra is the cognitive intelligence layer — Proof of Thought, memory synapse, and MindDAO governance pathways connected through the SOVRA intelligence core.",
    sentient:
      "Sentient Signals processes network awareness data — anomaly patterns, validator health signals, and cross-module event streams for SOVRA diagnostics.",
    alvina:
      "ALVINA is an ecosystem services module within the TVK portfolio, connecting lifestyle, wellness, and digital experience layers to the broader ENTELΞKRON stack.",
    tvk:
      "TVK CyberLab is the security research division of TVK Labs. It hardens wallet defense, incident response, and audit pipelines across the ecosystem.",
    ava:
      "Ava Santé is the digital health and wellness module — a SOVRA-powered digital human concept for health intelligence within the TVK ecosystem.",
  };

  function showBriefing(moduleId, title) {
    const titleEl = document.getElementById("sovraBriefingTitle");
    const textEl = document.getElementById("sovraBriefingText");
    if (titleEl) titleEl.textContent = title || moduleId;
    if (textEl)
      textEl.textContent =
        SOVRA_BRIEFINGS[moduleId] || "SOVRA intelligence briefing unavailable for this module.";
  }

  function initGalaxy() {
    const stage = document.getElementById("galaxyStage");
    const canvas = document.getElementById("galaxyCanvas");
    const linksSvg = document.getElementById("galaxyLinks");
    const infoTitle = document.getElementById("galaxyInfoTitle");
    const infoText = document.getElementById("galaxyInfoText");
    const infoTag = document.getElementById("galaxyInfoTag");
    if (!stage || !canvas) return;

    const ctx = canvas.getContext("2d");
    const nodes = [];
    let activeId = null;
    let particles = [];
    let animId;

    const orbitModules = GALAXY_MODULES.filter((m) => !m.core);

    function resize() {
      const rect = stage.getBoundingClientRect();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      nodes.forEach((node) => {
        node.el.style.left = node.x * 100 + "%";
        node.el.style.top = node.y * 100 + "%";
      });
      drawLinks(rect);
    }

    function drawLinks(rect) {
      if (!linksSvg) return;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      linksSvg.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);
      linksSvg.innerHTML = orbitModules
        .map((m) => {
          const x = m.x * rect.width;
          const y = m.y * rect.height;
          return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/>`;
        })
        .join("");
    }

    function animate() {
      const rect = stage.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      if (Math.random() < 0.4) {
        particles.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          life: 1,
          size: Math.random() * 2 + 1,
        });
        if (particles.length > 120) particles.shift();
      }
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.008;
        if (p.life <= 0) {
          p.x = Math.random() * rect.width;
          p.y = Math.random() * rect.height;
          p.life = 1;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6,182,212,${p.life * 0.35})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    }

    function setActive(mod) {
      activeId = mod.id;
      nodes.forEach((n) => n.el.classList.toggle("active", n.id === mod.id));
      if (infoTitle) infoTitle.textContent = mod.name;
      if (infoText) infoText.textContent = mod.desc;
      if (infoTag) infoTag.textContent = mod.tag;
    }

    orbitModules.forEach((mod) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "galaxy-node" + (mod.primary ? " primary" : "");
      el.setAttribute("aria-label", mod.name);
      el.innerHTML = `<span class="galaxy-node-btn"><span class="galaxy-node-dot"></span>${mod.name}</span>`;
      el.addEventListener("mouseenter", () => setActive(mod));
      el.addEventListener("focus", () => setActive(mod));
      el.addEventListener("click", () => {
        setActive(mod);
        document.getElementById("sovra-intelligence")?.scrollIntoView({ behavior: "smooth" });
        const card = document.querySelector(`[data-sovra="${mod.id}"]`);
        if (card) {
          document.querySelectorAll("[data-sovra]").forEach((c) => c.classList.remove("active"));
          card.classList.add("active");
        }
        showBriefing(mod.id, mod.name);
      });
      stage.appendChild(el);
      nodes.push({ id: mod.id, x: mod.x, y: mod.y, el });
    });

    window.addEventListener("resize", resize);
    resize();
    animate();
  }

  function initSovraCards() {
    document.querySelectorAll("[data-sovra]").forEach((card) => {
      card.addEventListener("click", () => {
        document.querySelectorAll("[data-sovra]").forEach((c) => c.classList.remove("active"));
        card.classList.add("active");
        const key = card.getAttribute("data-sovra");
        const label = card.querySelector("strong")?.textContent || "SOVRA Briefing";
        showBriefing(key, label.replace("What is ", "").replace("?", ""));
      });
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
    const type = escape(data.type === "contract" ? "Contract" : data.type === "transaction" ? "Transaction" : "Wallet");
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

  initGalaxy();
  initSovraCards();
  refresh();
})();
