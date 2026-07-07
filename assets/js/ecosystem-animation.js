/* EnteleKRON ecosystem cyber-coin animation — shared TVK Group bundle */
(function () {
  const MODULES = [
    "ENK",
    "SOVRA AI",
    "EnergieMIND",
    "ENM",
    "EnteleWALLET",
    "EnteleSCAN",
    "EnteleLINK",
    "EnteleLEDGER",
    "EnteleCLOS",
    "EnteleVAULT",
    "TVK ID",
    "GraphVault",
    "ChronoSeal",
    "Q-Presence",
    "Cerebthra",
    "Cognethra",
    "SYNTHERRA",
    "Sentient Signals",
    "TVK CyberLab",
    "TVK Labs",
    "TVK Group Türkiye",
    "TVK Wallet",
    "TVK Group",
    "ALVINA",
    "Ava Sentient",
    "Ava Santé",
    "PuppyKRON",
    "KRON Assets",
  ];

  const COIN_EDGE_COUNT = 48;
  const HUB_W = 1200;
  const HUB_H = 360;
  const HUB_CX = HUB_W / 2;
  const HUB_CY = HUB_H / 2;
  const COIN_VIEWBOX_R = 103;
  const COIN_CLEARANCE = 28;

  const ASSET_BASE = "/ecosystem-animation";

  function layoutChipsOrganically(modules) {
    const golden = Math.PI * (3 - Math.sqrt(5));
    const minDist = COIN_VIEWBOX_R + COIN_CLEARANCE;
    const labelPadX = 68;
    const labelPadY = 14;
    const maxRx = HUB_CX - labelPadX;
    const maxRy = HUB_CY - labelPadY;

    return modules.map((name, i) => {
      const angle = i * golden - Math.PI / 2;
      const t = Math.sqrt((i + 0.5) / modules.length);
      const tier = t < 0.38 ? "inner" : t < 0.72 ? "mid" : "outer";
      const rx = minDist + t * (maxRx - minDist) * 0.98;
      const ry = minDist + t * (maxRy - minDist) * 0.92;
      const jitter = (((i * 17 + 5) % 13) - 6) * 1.4;
      let x = HUB_CX + Math.cos(angle) * rx + Math.cos(angle + 0.9) * jitter;
      let y = HUB_CY + Math.sin(angle) * ry + Math.sin(angle + 0.9) * jitter;
      x = Math.max(labelPadX, Math.min(HUB_W - labelPadX, x));
      y = Math.max(labelPadY, Math.min(HUB_H - labelPadY, y));
      const dx = x - HUB_CX;
      const dy = y - HUB_CY;
      const dist = Math.hypot(dx, dy);
      if (dist < minDist) {
        const scale = minDist / dist;
        x = HUB_CX + dx * scale;
        y = HUB_CY + dy * scale;
      }
      return { name, x, y, index: i, tier };
    });
  }

  function signalEndpoints(chip) {
    const dx = chip.x - HUB_CX;
    const dy = chip.y - HUB_CY;
    const dist = Math.hypot(dx, dy) || 1;
    return {
      x1: HUB_CX + (dx / dist) * COIN_VIEWBOX_R,
      y1: HUB_CY + (dy / dist) * COIN_VIEWBOX_R,
      x2: chip.x,
      y2: chip.y,
    };
  }

  function initEcosystemAnimation(root, options = {}) {
    if (!root) return;

    const chips = layoutChipsOrganically(MODULES);
    const onChipClick = typeof options.onChipClick === "function" ? options.onChipClick : null;

    const particles = Array.from({ length: 12 }, (_, i) =>
      `<span class="cyber-coin-particle absolute rounded-full bg-cyan-400/80" style="left:${8 + ((i * 29) % 84)}%;top:${18 + ((i * 37) % 64)}%;width:${1 + (i % 2)}px;height:${1 + (i % 2)}px;animation-delay:${(i * 0.41) % 4.5}s;animation-duration:${4.5 + (i % 3)}s"></span>`
    ).join("");

    const signalLines = chips
      .map((chip) => {
        const { x1, y1, x2, y2 } = signalEndpoints(chip);
        const delay = (chip.index * 0.14) % 3.2;
        return `<g>
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="cyber-signal-line" />
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="cyber-signal-pulse" style="animation-delay:${delay}s" />
        <circle r="2.5" fill="#67e8f9" class="cyber-signal-node">
          <animateMotion dur="${2.6 + (chip.index % 4) * 0.4}s" repeatCount="indefinite" path="M ${x1} ${y1} L ${x2} ${y2}" begin="${delay}s" />
        </circle>
      </g>`;
      })
      .join("");

    const chipNodes = chips
      .map((chip) => {
        const delay = (chip.index * 0.14) % 3.2;
        return `<button type="button" class="cyber-chip-slot cyber-chip-slot-${chip.tier}" data-eco-chip="${chip.name.replace(/"/g, "&quot;")}" style="left:${(chip.x / HUB_W) * 100}%;top:${(chip.y / HUB_H) * 100}%" aria-label="${chip.name}">
        <div class="cyber-orbit-chip">
          <span class="cyber-orbit-chip-label" style="animation-delay:${delay}s">${chip.name}</span>
          <span class="cyber-orbit-chip-ping" style="animation-delay:${delay}s"></span>
        </div>
      </button>`;
      })
      .join("");

    const edges = Array.from(
      { length: COIN_EDGE_COUNT },
      (_, i) => `<div class="cyber-coin-edge" style="--edge-angle:${(360 / COIN_EDGE_COUNT) * i}deg"></div>`
    ).join("");

    root.innerHTML = `
      <div class="ecosystem-cyber-coin relative mx-auto w-full" aria-hidden="false">
        <div class="cyber-coin-cloud cyber-coin-cloud-a absolute inset-0"></div>
        <div class="cyber-coin-cloud cyber-coin-cloud-b absolute inset-0"></div>
        <div class="cyber-coin-cloud cyber-coin-cloud-c absolute inset-0"></div>
        <div class="cyber-coin-edge-fade absolute inset-0"></div>
        ${particles}
        <div class="cyber-ecosystem-hub relative z-10 mx-auto h-full w-full">
          <svg class="cyber-signal-layer absolute inset-0 h-full w-full" viewBox="0 0 ${HUB_W} ${HUB_H}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <defs>
              <radialGradient id="signal-core-glow" cx="50%" cy="50%" r="38%">
                <stop offset="0%" stopColor="rgba(34,211,238,0.28)" />
                <stop offset="100%" stopColor="rgba(34,211,238,0)" />
              </radialGradient>
            </defs>
            <ellipse cx="${HUB_CX}" cy="${HUB_CY}" rx="${COIN_VIEWBOX_R + 12}" ry="${COIN_VIEWBOX_R + 8}" fill="url(#signal-core-glow)" />
            ${signalLines}
          </svg>
          <div class="cyber-coin-stage">
            <div class="cyber-coin-tilt">
              <div class="cyber-coin-spinner">
                <div class="cyber-coin-body">
                  <div class="cyber-coin-face cyber-coin-face-front">
                    <div class="cyber-coin-shine"></div>
                    <div class="cyber-coin-face-plate"></div>
                    <div class="cyber-coin-face-inner">
                      <img src="${ASSET_BASE}/brand/entelekron-coin-face.png" alt="" class="cyber-coin-logo-mark cyber-coin-logo-enk" draggable="false" />
                    </div>
                  </div>
                  <div class="cyber-coin-face cyber-coin-face-back">
                    <div class="cyber-coin-shine cyber-coin-shine-back"></div>
                    <div class="cyber-coin-face-inner cyber-coin-face-inner-tvk">
                      <img src="${ASSET_BASE}/brand/tvk-labs-logo-original-512.png" alt="" class="cyber-coin-logo-mark cyber-coin-logo-tvk" draggable="false" />
                    </div>
                  </div>
                  ${edges}
                </div>
              </div>
            </div>
            <div class="cyber-coin-halo"></div>
            <div class="cyber-coin-reflection"></div>
          </div>
          <div class="cyber-chip-field absolute inset-0">${chipNodes}</div>
        </div>
      </div>`;

    if (onChipClick) {
      root.querySelectorAll("[data-eco-chip]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const name = btn.getAttribute("data-eco-chip");
          root.querySelectorAll("[data-eco-chip]").forEach((b) => b.classList.remove("is-active"));
          btn.classList.add("is-active");
          onChipClick(name);
        });
      });
    }
  }

  window.initEcosystemAnimation = initEcosystemAnimation;
})();
