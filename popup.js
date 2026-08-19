// popup.js — HVAC & Hardscaping Company Finder UI v5.0
// Dual-mode detection: HVAC and Hardscaping engines are completely independent.
// Mode is persisted via chrome.storage.local.

"use strict";

// ── GLOBAL STATE ──────────────────────────────────────────────────────────────
let currentScanData = null;
let currentMode = "hvac"; // 'hvac' | 'hardscaping' — default, overridden on boot

// ══════════════════════════════════════════════════════════════════════════════
// CATEGORY DEFINITIONS
// ══════════════════════════════════════════════════════════════════════════════

// ── Hardscaping Categories (unchanged from v4.0) ──
const HS_CATEGORIES = [
  { id: "patios", label: "Patio & Paver Work", icon: "🧱", color: "#f59e0b" },
  { id: "walls", label: "Walls & Masonry", icon: "🪨", color: "#94a3b8" },
  {
    id: "outdoor_living",
    label: "Outdoor Living Spaces",
    icon: "🔥",
    color: "#f97316",
  },
  {
    id: "walkways_drives",
    label: "Walkways & Driveways",
    icon: "🛤️",
    color: "#60a5fa",
  },
  {
    id: "water_landscape",
    label: "Water & Lighting",
    icon: "💧",
    color: "#34d399",
  },
  { id: "site_work", label: "Site Work", icon: "🏗️", color: "#a78bfa" },
];

// ── HVAC Categories (new) ──
const HVAC_CATEGORIES = [
  { id: "heating", label: "Heating", icon: "🔥", color: "#ef4444" },
  { id: "cooling", label: "Air Conditioning", icon: "❄️", color: "#3b82f6" },
  { id: "heat_pumps", label: "Heat Pumps", icon: "♻️", color: "#8b5cf6" },
  {
    id: "indoor_air_quality",
    label: "Indoor Air Quality",
    icon: "🌬️",
    color: "#06b6d4",
  },
  { id: "ductwork", label: "Ductwork", icon: "🔧", color: "#f59e0b" },
  {
    id: "maintenance",
    label: "HVAC Maintenance",
    icon: "🛠️",
    color: "#10b981",
  },
  {
    id: "emergency",
    label: "Emergency Services",
    icon: "🚨",
    color: "#f97316",
  },
  {
    id: "commercial_hvac",
    label: "Commercial HVAC",
    icon: "🏢",
    color: "#64748b",
  },
  { id: "refrigeration", label: "Refrigeration", icon: "🧊", color: "#0ea5e9" },
];

// ── HVAC Highlight Legend Swatches ──
const HVAC_LEGEND_SWATCHES = [
  { label: "Heating", bg: "rgba(239,68,68,0.35)", border: "#dc2626" },
  { label: "Cooling", bg: "rgba(59,130,246,0.35)", border: "#2563eb" },
  { label: "Pumps", bg: "rgba(139,92,246,0.35)", border: "#7c3aed" },
  { label: "IAQ", bg: "rgba(6,182,212,0.35)", border: "#0891b2" },
  { label: "Ducts", bg: "rgba(245,158,11,0.35)", border: "#d97706" },
  { label: "Maint.", bg: "rgba(16,185,129,0.35)", border: "#059669" },
  { label: "Emerg.", bg: "rgba(249,115,22,0.35)", border: "#ea580c" },
];

// ── Hardscaping Highlight Legend Swatches ──
const HS_LEGEND_SWATCHES = [
  { label: "Patios", bg: "rgba(245,158,11,0.40)", border: "#d97706" },
  { label: "Walls", bg: "rgba(148,163,184,0.40)", border: "#64748b" },
  { label: "Living", bg: "rgba(249,115,22,0.40)", border: "#ea580c" },
  { label: "Walks", bg: "rgba(96,165,250,0.40)", border: "#2563eb" },
  { label: "Water", bg: "rgba(52,211,153,0.40)", border: "#059669" },
  { label: "Site", bg: "rgba(167,139,250,0.40)", border: "#7c3aed" },
];

const HS_CATEGORY_BY_ID = {};
for (const cat of HS_CATEGORIES) HS_CATEGORY_BY_ID[cat.id] = cat;
const HVAC_CATEGORY_BY_ID = {};
for (const cat of HVAC_CATEGORIES) HVAC_CATEGORY_BY_ID[cat.id] = cat;

// ── Scoring Constants ──
const HS_THRESHOLD = 420;
const HVAC_THRESHOLD = 420;
const NEGATIVE_PENALTY = 10;

// ── Deep Scan Page Lists ──
const HS_DEEP_SCAN_PAGES = [
  "/",
  "/services",
  "/hardscaping",
  "/hardscape",
  "/patios",
  "/patio",
  "/retaining-walls",
  "/walkways",
  "/driveways",
  "/outdoor-kitchens",
  "/outdoor-living",
  "/masonry",
  "/concrete",
  "/water-features",
  "/landscape-lighting",
  "/portfolio",
  "/gallery",
  "/projects",
  "/about",
  "/our-services",
  "/what-we-do",
];

const HVAC_DEEP_SCAN_PAGES = [
  "/",
  "/services",
  "/hvac",
  "/heating",
  "/cooling",
  "/air-conditioning",
  "/ac-repair",
  "/furnace",
  "/furnace-repair",
  "/furnace-installation",
  "/heat-pump",
  "/heat-pumps",
  "/ductwork",
  "/duct-cleaning",
  "/air-quality",
  "/indoor-air-quality",
  "/maintenance",
  "/hvac-maintenance",
  "/commercial",
  "/commercial-hvac",
  "/emergency",
  "/refrigeration",
  "/about",
  "/our-services",
  "/contact",
];

// ══════════════════════════════════════════════════════════════════════════════
// BOOT — Wire events and restore saved mode
// ══════════════════════════════════════════════════════════════════════════════

document.getElementById("scanBtn").addEventListener("click", quickScan);
document.getElementById("deepScanBtn").addEventListener("click", startDeepScan);
document
  .getElementById("copyPrimaryBtn")
  .addEventListener("click", copyPrimary);
document.getElementById("copyAllBtn").addEventListener("click", copyAll);
document
  .getElementById("debugToggleBtn")
  .addEventListener("click", toggleDebug);
document
  .getElementById("clearHighlightsBtn")
  .addEventListener("click", clearPageHighlights);
document
  .getElementById("modeHvacBtn")
  .addEventListener("click", () => setMode("hvac"));
document
  .getElementById("modeHsBtn")
  .addEventListener("click", () => setMode("hardscaping"));

// Restore persisted mode
chrome.storage.local.get("detectionMode", (result) => {
  setMode(result.detectionMode || "hvac", /* saveToStorage= */ false);
});

// Wire debug panel collapsible
(function wireDebugHeader() {
  const panel = document.getElementById("debugPanel");
  if (panel) makeCollapsible(panel);
})();

// ══════════════════════════════════════════════════════════════════════════════
// MODE MANAGEMENT
// ══════════════════════════════════════════════════════════════════════════════

function setMode(mode, saveToStorage = true) {
  currentMode = mode;
  currentScanData = null;

  const isHvac = mode === "hvac";

  // Toggle button appearance
  const hvacBtn = document.getElementById("modeHvacBtn");
  const hsBtn = document.getElementById("modeHsBtn");
  hvacBtn.className = "mode-btn" + (isHvac ? " active-hvac" : "");
  hsBtn.className = "mode-btn" + (!isHvac ? " active-hs" : "");

  // Header title
  const headerTitle = document.getElementById("headerTitle");
  const headerAccent = document.getElementById("headerAccent");
  if (isHvac) {
    headerTitle.childNodes[0].textContent = "🌡️ ";
    headerAccent.textContent = "HVAC";
    headerAccent.className = "accent-hvac";
    headerTitle.childNodes[2].textContent = " Finder";
  } else {
    headerTitle.childNodes[0].textContent = "🧱 ";
    headerAccent.textContent = "Hardscape";
    headerAccent.className = "accent-hs";
    headerTitle.childNodes[2].textContent = " Finder";
  }

  // Scan button appearance
  const scanBtn = document.getElementById("scanBtn");
  const deepScanBtn = document.getElementById("deepScanBtn");
  if (isHvac) {
    scanBtn.className = "btn-scan-primary hvac-mode";
    deepScanBtn.className = "btn-scan-secondary hvac-mode";
  } else {
    scanBtn.className = "btn-scan-primary";
    deepScanBtn.className = "btn-scan-secondary";
  }

  // Progress fill
  const fill = document.getElementById("progressFill");
  if (isHvac) {
    fill.classList.add("hvac-fill");
  } else {
    fill.classList.remove("hvac-fill");
  }

  // Reset UI state
  document.getElementById("resultContainer").innerHTML =
    `<div class="status-msg">Click <strong>Quick Scan</strong> to analyze this site for ${isHvac ? "HVAC" : "hardscaping"} services.</div>`;
  document.getElementById("copySection").classList.add("hidden");
  document.getElementById("clearHighlightsBtn").classList.add("hidden");
  document.getElementById("hlLegend").classList.add("hidden");

  // Update legend swatches
  renderLegendSwatches(isHvac ? HVAC_LEGEND_SWATCHES : HS_LEGEND_SWATCHES);

  if (saveToStorage) {
    chrome.storage.local.set({ detectionMode: mode });
  }
}

function renderLegendSwatches(swatches) {
  const container = document.getElementById("hlLegendSwatches");
  if (!container) return;
  container.innerHTML = swatches
    .map(
      (s) => `
    <span class="hl-swatch">
      <span class="hl-swatch-dot" style="background:${s.bg};border-color:${s.border};"></span>${s.label}
    </span>
  `,
    )
    .join("");
}

// ══════════════════════════════════════════════════════════════════════════════
// COLLAPSIBLE HELPERS
// ══════════════════════════════════════════════════════════════════════════════

function makeCollapsible(el) {
  const header = el.querySelector(".collapsible-header");
  const body = el.querySelector(".collapsible-body");
  if (!header || !body) return;
  header.addEventListener("click", () => {
    el.classList.toggle("open");
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// QUICK SCAN
// ══════════════════════════════════════════════════════════════════════════════

async function quickScan() {
  const btn = document.getElementById("scanBtn");
  btn.disabled = true;
  btn.textContent = "⏳ Scanning…";
  showProgress(true);
  setStatus("Scanning…");

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab || !tab.id) {
      showError("No active tab found.");
      return;
    }

    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
      });
    } catch (_) {
      /* Already injected — OK */
    }

    const response = await new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(
        tab.id,
        { action: "scanCurrentPage", mode: currentMode },
        (res) => {
          if (chrome.runtime.lastError)
            reject(new Error(chrome.runtime.lastError.message));
          else resolve(res);
        },
      );
    });

    if (response && Array.isArray(response.findings)) {
      const aggregated = aggregateFindings(response, currentMode);
      currentScanData = {
        ...aggregated,
        mode: currentMode,
        pages: [
          {
            url: response.pageUrl || tab.url,
            title: response.pageTitle || tab.title,
          },
        ],
        totalNodes: response.totalNodes || 0,
        totalText: response.totalText || 0,
        totalHits: response.totalHits || 0,
        debugLog: response.debugLog || [],
        scanTime: response.scanTime || "?",
      };
      renderDashboard(currentScanData);
      updateDebugPanel(currentScanData);
      document.getElementById("copySection").classList.remove("hidden");
      updateCopyButtons(currentMode);
      setStatus("Quick Scan");
      autoHighlight(tab.id, currentScanData, currentMode);
    } else if (response && response.error) {
      showError("Scan error: " + response.error);
    } else {
      showError(
        "No data returned. Try refreshing the page then scanning again.",
      );
    }
  } catch (e) {
    console.error("[Popup] quickScan error:", e);
    showError(
      `Could not connect to page. <small>${e.message}</small><br>` +
        `<small style="color:var(--text-dim)">Try: refresh → open extension → scan.</small>`,
    );
  } finally {
    btn.disabled = false;
    btn.textContent = "🔍 Quick Scan";
    showProgress(false);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// DEEP SCAN
// ══════════════════════════════════════════════════════════════════════════════

function startDeepScan() {
  const btn = document.getElementById("deepScanBtn");
  btn.disabled = true;
  btn.textContent = "⏳ Scanning…";
  showProgress(true);
  setStatus("Deep scan…");

  const pages =
    currentMode === "hvac" ? HVAC_DEEP_SCAN_PAGES : HS_DEEP_SCAN_PAGES;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || !tabs[0]) {
      showError("No active tab found.");
      btn.disabled = false;
      btn.textContent = "🌐 Deep Scan";
      showProgress(false);
      return;
    }

    const url = tabs[0].url;
    const mode = currentMode;

    chrome.runtime.sendMessage(
      { action: "startDeepScan", url, pages, mode },
      (response) => {
        if (chrome.runtime.lastError) {
          showError("Deep scan error: " + chrome.runtime.lastError.message);
          btn.disabled = false;
          btn.textContent = "🌐 Deep Scan";
          showProgress(false);
          return;
        }

        if (response && response.results) {
          const allFindings = [];
          const allNegativeHits = [];
          const allSecondary = new Set();
          const pageMeta = [];

          for (const r of response.results) {
            if (r.pageData && Array.isArray(r.pageData.findings)) {
              allFindings.push(...r.pageData.findings);
              pageMeta.push({
                url: r.url,
                title: r.pageData.pageTitle || r.url,
              });
              for (const neg of r.pageData.negativeHits || []) {
                if (!allNegativeHits.includes(neg)) allNegativeHits.push(neg);
              }
              for (const sec of r.pageData.secondaryServices || [])
                allSecondary.add(sec);
            }
          }

          const syntheticResponse = {
            findings: allFindings,
            negativeHits: allNegativeHits,
            secondaryServices: [...allSecondary],
          };

          const aggregated = aggregateFindings(syntheticResponse, mode);
          currentScanData = { ...aggregated, mode, pages: pageMeta };
          renderDashboard(currentScanData);
          updateDebugPanel(currentScanData);
          document.getElementById("copySection").classList.remove("hidden");
          updateCopyButtons(mode);
          setStatus(`Deep (${pageMeta.length}p)`);
        } else {
          showError(
            "Deep scan returned no data. The site may block automated scanning.",
          );
        }

        btn.disabled = false;
        btn.textContent = "🌐 Deep Scan";
        showProgress(false);
      },
    );
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// AGGREGATE FINDINGS — Routes to correct engine based on mode
// ══════════════════════════════════════════════════════════════════════════════

function aggregateFindings(response, mode) {
  return mode === "hvac"
    ? aggregateHvacFindings(response)
    : aggregateHardscapeFindings(response);
}

// ── Hardscaping Aggregation (v4.0 logic, preserved exactly) ──────────────────

function aggregateHardscapeFindings(response) {
  const findings = response.findings || [];
  const negativeHits = response.negativeHits || [];
  const secondaryServices = response.secondaryServices || [];

  const scoreMap = {};
  const evidenceMap = {};
  const termFreqMap = {};
  const matchedZones = {};

  for (const cat of HS_CATEGORIES) {
    scoreMap[cat.id] = 0;
    evidenceMap[cat.id] = [];
    termFreqMap[cat.id] = {};
    matchedZones[cat.id] = new Set();
  }

  const allKeywordsMatched = new Set();
  const highValueMatched = [];

  for (const f of findings) {
    const catId = f.category;
    if (!scoreMap.hasOwnProperty(catId)) continue;

    const w = typeof f.weight === "number" ? f.weight : 1;
    scoreMap[catId] += w;

    const snippet = (f.snippet || "").trim();
    const already = evidenceMap[catId].some((e) => e.snippet === snippet);
    if (!already) {
      evidenceMap[catId].push({
        snippet,
        matchedTerm: f.matchedTerm || "?",
        tier: f.tier || 1,
        weight: w,
        label: f.label || f.matchedTerm,
        zone: f.zone || f.tag || "?",
        tag: f.tag || "?",
        url: f.url || "",
        xpath: f.xpath || "",
      });
    }

    const term = f.matchedTerm || "unknown";
    allKeywordsMatched.add(term);
    termFreqMap[catId][term] = (termFreqMap[catId][term] || 0) + 1;
    if (f.zone) matchedZones[catId].add(f.zone);

    if (f.tier === 1 || f.tier === 2) {
      if (!highValueMatched.includes(f.label || term)) {
        highValueMatched.push(f.label || term);
      }
    }
  }

  const totalPositiveScore = Object.values(scoreMap).reduce((a, b) => a + b, 0);
  const penaltyScore = negativeHits.length * NEGATIVE_PENALTY;
  const netScore = Math.max(0, totalPositiveScore - penaltyScore);
  const rawConfidence = Math.min(
    100,
    Math.round((netScore / HS_THRESHOLD) * 100),
  );
  const confidence = Math.max(0, rawConfidence);

  const catConfidence = {};
  for (const cat of HS_CATEGORIES) {
    const s = scoreMap[cat.id];
    catConfidence[cat.id] =
      s === 0
        ? 0
        : Math.min(
            100,
            Math.round((s / (HS_THRESHOLD / HS_CATEGORIES.length)) * 100),
          );
  }

  const detectedServices = highValueMatched.slice(0, 20);
  const reasons = buildHardscapeReasons(
    confidence,
    scoreMap,
    matchedZones,
    negativeHits,
    detectedServices,
    catConfidence,
  );

  return {
    mode: "hardscaping",
    confidence,
    netScore,
    totalPositiveScore,
    penaltyScore,
    catConfidence,
    scoreMap,
    evidenceMap,
    termFreqMap,
    matchedZones: Object.fromEntries(
      Object.entries(matchedZones).map(([k, v]) => [k, [...v]]),
    ),
    detectedServices,
    allKeywordsMatched: [...allKeywordsMatched],
    negativeHits,
    secondaryServices,
    reasons,
  };
}

// ── HVAC Aggregation (new) ────────────────────────────────────────────────────

function aggregateHvacFindings(response) {
  const findings = response.findings || [];
  const negativeHits = response.negativeHits || [];

  const scoreMap = {};
  const evidenceMap = {};
  const termFreqMap = {};
  const matchedZones = {};

  for (const cat of HVAC_CATEGORIES) {
    scoreMap[cat.id] = 0;
    evidenceMap[cat.id] = [];
    termFreqMap[cat.id] = {};
    matchedZones[cat.id] = new Set();
  }

  const allKeywordsMatched = new Set();
  const highValueMatched = [];

  for (const f of findings) {
    const catId = f.category;
    if (!scoreMap.hasOwnProperty(catId)) continue;

    const w = typeof f.weight === "number" ? f.weight : 1;
    scoreMap[catId] += w;

    const snippet = (f.snippet || "").trim();
    const already = evidenceMap[catId].some((e) => e.snippet === snippet);
    if (!already) {
      evidenceMap[catId].push({
        snippet,
        matchedTerm: f.matchedTerm || "?",
        tier: f.tier || 1,
        weight: w,
        label: f.label || f.matchedTerm,
        zone: f.zone || f.tag || "?",
        tag: f.tag || "?",
        url: f.url || "",
        xpath: f.xpath || "",
      });
    }

    const term = f.matchedTerm || "unknown";
    allKeywordsMatched.add(term);
    termFreqMap[catId][term] = (termFreqMap[catId][term] || 0) + 1;
    if (f.zone) matchedZones[catId].add(f.zone);

    if (f.tier === 1 || f.tier === 2) {
      if (!highValueMatched.includes(f.label || term)) {
        highValueMatched.push(f.label || term);
      }
    }
  }

  const totalPositiveScore = Object.values(scoreMap).reduce((a, b) => a + b, 0);
  const penaltyScore = negativeHits.length * NEGATIVE_PENALTY;
  const netScore = Math.max(0, totalPositiveScore - penaltyScore);
  const rawConfidence = Math.min(
    100,
    Math.round((netScore / HVAC_THRESHOLD) * 100),
  );
  const confidence = Math.max(0, rawConfidence);

  const catConfidence = {};
  for (const cat of HVAC_CATEGORIES) {
    const s = scoreMap[cat.id];
    catConfidence[cat.id] =
      s === 0
        ? 0
        : Math.min(
            100,
            Math.round((s / (HVAC_THRESHOLD / HVAC_CATEGORIES.length)) * 100),
          );
  }

  // HVAC company verdict
  let hvacCompany;
  if (confidence >= 60) hvacCompany = "YES";
  else if (confidence >= 25) hvacCompany = "UNCERTAIN";
  else hvacCompany = "NO";

  // Confidence label
  let confidenceLabel;
  if (confidence >= 95) confidenceLabel = "Very Strong HVAC Evidence";
  else if (confidence >= 80) confidenceLabel = "Strong HVAC Evidence";
  else if (confidence >= 60) confidenceLabel = "Moderate HVAC Evidence";
  else if (confidence >= 40) confidenceLabel = "Weak / Uncertain";
  else confidenceLabel = "Probably Not HVAC";

  const detectedServices = highValueMatched.slice(0, 24);
  const reasons = buildHvacReasons(
    confidence,
    scoreMap,
    matchedZones,
    negativeHits,
    detectedServices,
    catConfidence,
  );
  const evidenceSignals = buildHvacEvidenceSignals(
    matchedZones,
    scoreMap,
    detectedServices,
  );

  return {
    mode: "hvac",
    confidence,
    confidenceLabel,
    hvacCompany,
    netScore,
    totalPositiveScore,
    penaltyScore,
    catConfidence,
    scoreMap,
    evidenceMap,
    termFreqMap,
    matchedZones: Object.fromEntries(
      Object.entries(matchedZones).map(([k, v]) => [k, [...v]]),
    ),
    detectedServices,
    allKeywordsMatched: [...allKeywordsMatched],
    negativeHits,
    secondaryServices: [],
    reasons,
    evidenceSignals,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// REASON BUILDERS
// ══════════════════════════════════════════════════════════════════════════════

function buildHardscapeReasons(
  confidence,
  scoreMap,
  matchedZones,
  negativeHits,
  detectedServices,
  catConfidence,
) {
  const reasons = [];

  if (confidence === 0) {
    reasons.push("❌ No hardscape signals detected on this page.");
    return reasons;
  }

  if (confidence >= 75) {
    reasons.push(
      "✅ Strong hardscaping contractor — multiple high-value services confirmed",
    );
  } else if (confidence >= 45) {
    reasons.push("🔶 Likely offers hardscaping — solid service evidence found");
  } else if (confidence >= 20) {
    reasons.push(
      "🔸 Possible hardscape work — limited or low-tier signals detected",
    );
  } else {
    reasons.push(
      "⚠️ Weak hardscape presence — mostly generic or low-value terms",
    );
  }

  const allZones = new Set(Object.values(matchedZones).flat());
  if (allZones.has("hero-heading") || allZones.has("h1"))
    reasons.push("🎯 Hardscape keywords found in hero / H1 heading");
  if (allZones.has("nav"))
    reasons.push("📍 Services listed in navigation menu");
  if (allZones.has("service-section"))
    reasons.push("📋 Dedicated hardscape services section detected");
  if (allZones.has("meta"))
    reasons.push("🔍 Keywords in page title or meta description");
  if (allZones.has("cta")) reasons.push("📣 Hardscape CTAs present on page");

  const topCats = HS_CATEGORIES.filter((c) => catConfidence[c.id] >= 30);
  if (topCats.length > 0) {
    reasons.push(
      "🏆 Specializes in: " + topCats.map((c) => c.label).join(", "),
    );
  }

  if (negativeHits.length > 0) {
    reasons.push(
      `⛔ Penalty signals: ${negativeHits.slice(0, 3).join(", ")}${negativeHits.length > 3 ? ` +${negativeHits.length - 3} more` : ""}`,
    );
  }

  return reasons;
}

function buildHvacReasons(
  confidence,
  scoreMap,
  matchedZones,
  negativeHits,
  detectedServices,
  catConfidence,
) {
  const reasons = [];

  if (confidence === 0) {
    reasons.push("❌ No HVAC signals detected on this page.");
    return reasons;
  }

  if (confidence >= 80) {
    reasons.push(
      "✅ Genuine HVAC contractor — strong multi-service evidence confirmed",
    );
  } else if (confidence >= 60) {
    reasons.push("🔶 Likely HVAC company — solid service evidence found");
  } else if (confidence >= 40) {
    reasons.push("🔸 Possible HVAC involvement — moderate signals detected");
  } else {
    reasons.push(
      "⚠️ Weak HVAC presence — low-tier or incidental terminology only",
    );
  }

  const allZones = new Set(Object.values(matchedZones).flat());
  if (allZones.has("hero-heading") || allZones.has("h1"))
    reasons.push("🎯 HVAC keywords found in hero heading / H1");
  if (allZones.has("nav"))
    reasons.push("📍 HVAC services listed in navigation menu");
  if (allZones.has("service-section"))
    reasons.push("📋 Dedicated HVAC services section detected");
  if (allZones.has("meta"))
    reasons.push("🔍 HVAC keywords in page title or meta description");
  if (allZones.has("cta"))
    reasons.push("📣 HVAC call-to-action buttons present");
  if (allZones.has("structured-data"))
    reasons.push("🗂️ HVAC signals found in structured data (JSON-LD)");

  const topCats = HVAC_CATEGORIES.filter((c) => catConfidence[c.id] >= 30);
  if (topCats.length > 0) {
    reasons.push(
      "🏆 Services confirmed: " + topCats.map((c) => c.label).join(", "),
    );
  }

  if (negativeHits.length > 0) {
    reasons.push(
      `⛔ Penalty signals (manufacturer/distributor?): ${negativeHits.slice(0, 2).join(", ")}${negativeHits.length > 2 ? ` +${negativeHits.length - 2} more` : ""}`,
    );
  }

  return reasons;
}

function buildHvacEvidenceSignals(matchedZones, scoreMap, detectedServices) {
  const signals = [];
  const allZones = new Set(Object.values(matchedZones).flat());

  if (allZones.has("hero-heading") || allZones.has("h1"))
    signals.push("HVAC services identified in primary page heading");
  if (allZones.has("nav"))
    signals.push("HVAC services listed in site navigation");
  if (allZones.has("service-section"))
    signals.push("Dedicated HVAC services section present");
  if (allZones.has("meta"))
    signals.push("HVAC keywords in page title / meta description");
  if (allZones.has("cta"))
    signals.push("HVAC-specific call-to-action elements detected");
  if (allZones.has("structured-data"))
    signals.push("HVAC business signals in structured data");
  if (scoreMap["emergency"] && scoreMap["emergency"] > 0)
    signals.push("24/7 or emergency HVAC service offered");
  if (scoreMap["commercial_hvac"] && scoreMap["commercial_hvac"] > 0)
    signals.push("Commercial HVAC capabilities detected");
  if (scoreMap["refrigeration"] && scoreMap["refrigeration"] > 0)
    signals.push("Commercial refrigeration services detected");
  if (detectedServices.length >= 5)
    signals.push(
      `${detectedServices.length} distinct HVAC services identified`,
    );

  return signals;
}

// ══════════════════════════════════════════════════════════════════════════════
// RENDER DASHBOARD — Routes to correct renderer
// ══════════════════════════════════════════════════════════════════════════════

function renderDashboard(data) {
  if (data.mode === "hvac") return renderHvacDashboard(data);
  return renderHardscapeDashboard(data);
}

// ── Hardscaping Dashboard (v4.0 logic preserved) ─────────────────────────────

function renderHardscapeDashboard(data) {
  const container = document.getElementById("resultContainer");
  const {
    confidence,
    catConfidence,
    evidenceMap,
    termFreqMap,
    detectedServices,
    negativeHits,
    secondaryServices,
    reasons,
  } = data;

  const confClass =
    confidence >= 65 ? "high" : confidence >= 35 ? "medium" : "low";
  const confLabel =
    confidence >= 75
      ? "Genuine Hardscape Contractor"
      : confidence >= 45
        ? "Likely Hardscape Contractor"
        : confidence >= 20
          ? "Possible Hardscape Work"
          : confidence > 0
            ? "Weak Hardscape Signals"
            : "Not a Hardscape Company";

  let html = "";

  // ── Primary confidence card ──
  html += `
    <div class="primary-card">
      <div class="primary-top">
        <div>
          <div class="primary-meta">🧱 Hardscape Confidence</div>
          <div class="primary-name">${confLabel}</div>
        </div>
        <div class="primary-conf ${confClass}">${confidence}%</div>
      </div>
      <div class="primary-reasons">${reasons.slice(0, 2).join(" · ")}</div>
    </div>`;

  // ── Detected services chips ──
  if (detectedServices.length > 0) {
    const chips = detectedServices
      .map((s) => `<span class="service-chip">${s}</span>`)
      .join("");
    html += `
      <div class="detected-services">
        <div class="section-label">🏗️ Hardscaping Services Detected</div>
        <div class="chip-row">${chips}</div>
      </div>`;
  }

  // ── Service category grid ──
  html += `<div class="result-grid">`;
  for (const cat of HS_CATEGORIES) {
    const score = catConfidence[cat.id] || 0;
    const isTop =
      score ===
        Math.max(...HS_CATEGORIES.map((c) => catConfidence[c.id] || 0)) &&
      score > 0;
    html += `
      <div class="service-card ${isTop ? "is-primary" : ""}">
        <div class="service-icon">${cat.icon}</div>
        <div class="service-name">${cat.label}</div>
        <div class="service-score" style="color:${cat.color}">${score}%</div>
        <div class="bar-bg"><div class="bar-fill" style="width:${score}%;background:${cat.color}"></div></div>
        <div class="service-matches">${evidenceMap[cat.id]?.length || 0} match${(evidenceMap[cat.id]?.length || 0) !== 1 ? "es" : ""}</div>
      </div>`;
  }
  html += `</div>`;

  html += buildReasonsCollapsible(reasons, "💡 Why Classified");
  html += buildEvidenceCollapsible(data, HS_CATEGORIES, "patios");
  html += buildKeywordsCollapsible(data, HS_CATEGORIES);

  // ── Secondary services ──
  if (secondaryServices.length > 0) {
    const secChips = secondaryServices
      .map((s) => `<span class="sec-chip">${s}</span>`)
      .join("");
    html += `
      <div class="secondary-section">
        <div class="section-label muted">🌿 Secondary Services Detected</div>
        <div class="chip-row">${secChips}</div>
      </div>`;
  }

  // ── Negative signals ──
  if (negativeHits.length > 0) {
    const negChips = negativeHits
      .map((n) => `<span class="neg-chip">${n}</span>`)
      .join("");
    html += `
      <div class="negative-section">
        <div class="section-label negative">⛔ Penalty Signals Detected (−${negativeHits.length * 10} pts)</div>
        <div class="chip-row">${negChips}</div>
      </div>`;
  }

  html += buildPagesFooter(data);

  container.innerHTML = html;
  container
    .querySelectorAll(".collapsible")
    .forEach((el) => makeCollapsible(el));
  wireEvidenceClicks(container);
}

// ── HVAC Dashboard (new) ──────────────────────────────────────────────────────

function renderHvacDashboard(data) {
  const container = document.getElementById("resultContainer");
  const {
    confidence,
    confidenceLabel,
    hvacCompany,
    catConfidence,
    evidenceMap,
    termFreqMap,
    detectedServices,
    negativeHits,
    reasons,
    evidenceSignals,
  } = data;

  const confClass =
    confidence >= 65 ? "high" : confidence >= 40 ? "medium" : "low";
  const verdictClass =
    hvacCompany === "YES" ? "yes" : hvacCompany === "NO" ? "no" : "uncertain";
  const verdictIcon =
    hvacCompany === "YES" ? "✅" : hvacCompany === "NO" ? "❌" : "⚠️";

  let html = "";

  // ── Primary HVAC card ──
  html += `
    <div class="primary-card hvac-card">
      <div class="primary-top">
        <div>
          <div class="primary-meta hvac-meta">🌡️ HVAC Detection</div>
          <div class="primary-name">${confidenceLabel}</div>
          <div class="hvac-verdict ${verdictClass}">${verdictIcon} HVAC Company: <strong>${hvacCompany}</strong></div>
        </div>
        <div class="primary-conf ${confClass}">${confidence}%</div>
      </div>
      <div class="primary-reasons">${reasons.slice(0, 2).join(" · ")}</div>
    </div>`;

  // ── Detected HVAC services chips ──
  if (detectedServices.length > 0) {
    const chips = detectedServices
      .map((s) => `<span class="service-chip hvac-chip">${s}</span>`)
      .join("");
    html += `
      <div class="detected-services">
        <div class="section-label hvac-label">🔧 HVAC Services Detected</div>
        <div class="chip-row">${chips}</div>
      </div>`;
  }

  // ── Service category grid (3-column for 9 categories) ──
  html += `<div class="result-grid three-col">`;
  for (const cat of HVAC_CATEGORIES) {
    const score = catConfidence[cat.id] || 0;
    const isTop =
      score ===
        Math.max(...HVAC_CATEGORIES.map((c) => catConfidence[c.id] || 0)) &&
      score > 0;
    html += `
      <div class="service-card ${isTop ? "is-primary-hvac" : ""}">
        <div class="service-icon">${cat.icon}</div>
        <div class="service-name">${cat.label}</div>
        <div class="service-score" style="color:${cat.color}">${score}%</div>
        <div class="bar-bg"><div class="bar-fill" style="width:${score}%;background:${cat.color}"></div></div>
        <div class="service-matches">${evidenceMap[cat.id]?.length || 0} hit${(evidenceMap[cat.id]?.length || 0) !== 1 ? "s" : ""}</div>
      </div>`;
  }
  html += `</div>`;

  // ── Evidence signals (collapsible) ──
  if (evidenceSignals && evidenceSignals.length > 0) {
    const signalsHtml = evidenceSignals
      .map((s) => `<div class="reason-item">📌 ${s}</div>`)
      .join("");
    html += `
      <div class="collapsible open" id="signalsSection">
        <div class="collapsible-header">
          <span class="collapsible-title">🔎 Evidence Signals <span class="collapsible-count">${evidenceSignals.length}</span></span>
          <span class="collapsible-arrow">▼</span>
        </div>
        <div class="collapsible-body">${signalsHtml}</div>
      </div>`;
  }

  html += buildReasonsCollapsible(reasons, "💡 Why Classified");
  html += buildEvidenceCollapsible(data, HVAC_CATEGORIES, "cooling", "hvac");
  html += buildKeywordsCollapsible(data, HVAC_CATEGORIES, "hvac");

  // ── Negative signals ──
  if (negativeHits.length > 0) {
    const negChips = negativeHits
      .map((n) => `<span class="neg-chip">${n}</span>`)
      .join("");
    html += `
      <div class="negative-section">
        <div class="section-label negative">⛔ Manufacturer/Distributor Signals Detected (−${negativeHits.length * 10} pts)</div>
        <div class="chip-row">${negChips}</div>
      </div>`;
  }

  html += buildPagesFooter(data);

  container.innerHTML = html;
  container
    .querySelectorAll(".collapsible")
    .forEach((el) => makeCollapsible(el));
  wireEvidenceClicks(container);
}

// ══════════════════════════════════════════════════════════════════════════════
// SHARED HTML BUILDERS
// ══════════════════════════════════════════════════════════════════════════════

function buildReasonsCollapsible(reasons, title) {
  if (!reasons || reasons.length === 0) return "";
  const reasonsHtml = reasons
    .map((r) => `<div class="reason-item">${r}</div>`)
    .join("");
  return `
    <div class="collapsible open" id="whySection">
      <div class="collapsible-header">
        <span class="collapsible-title">${title} <span class="collapsible-count">${reasons.length}</span></span>
        <span class="collapsible-arrow">▼</span>
      </div>
      <div class="collapsible-body">${reasonsHtml}</div>
    </div>`;
}

function buildEvidenceCollapsible(data, categories, defaultCat, modeClass) {
  const { evidenceMap } = data;
  const zoneClass = modeClass === "hvac" ? "hvac-zone" : "";
  let evidenceBodyHtml = "";
  let hasAny = false;
  let totalEvidence = 0;

  for (const cat of categories) {
    const items = evidenceMap[cat.id] || [];
    if (items.length === 0) continue;
    hasAny = true;
    totalEvidence += items.length;

    evidenceBodyHtml += `
      <div class="evidence-category">
        <div class="evidence-cat-label" style="color:${cat.color}">
          ${cat.icon} ${cat.label}
          <span class="evidence-count-sm">${items.length}</span>
        </div>`;

    const displayItems = items.slice(0, 6);
    for (const item of displayItems) {
      const escapedSnippet = (item.snippet || "")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      const displaySnippet = item.snippet
        ? item.snippet.substring(0, 80) + (item.snippet.length > 80 ? "…" : "")
        : "(no snippet)";
      const tierLabel =
        ["", "Core", "Strong", "Supporting", "Contextual"][item.tier] || "?";
      evidenceBodyHtml += `
        <div class="evidence-item"
             style="border-left-color:${cat.color}"
             data-url="${item.url}"
             data-xpath="${(item.xpath || "").replace(/"/g, "&quot;")}"
             data-snippet="${escapedSnippet}">
          <div class="evidence-text">"${displaySnippet}"</div>
          <div class="evidence-meta">
            <span class="badge-zone ${zoneClass}">${item.zone || item.tag}</span>
            <span class="badge-term">${item.matchedTerm}</span>
            <span class="badge-tier tier-${item.tier}">${tierLabel}</span>
            <span class="badge-weight">w:${item.weight}</span>
            <span class="jump-link">↗</span>
          </div>
        </div>`;
    }
    if (items.length > 6) {
      evidenceBodyHtml += `<div class="more-items">+ ${items.length - 6} more matches</div>`;
    }
    evidenceBodyHtml += `</div>`;
  }

  if (!hasAny) {
    evidenceBodyHtml = `<p class="no-evidence">No keyword matches. Try Deep Scan or check if the site is loaded.</p>`;
  }

  return `
    <div class="collapsible open" id="evidenceSection">
      <div class="collapsible-header">
        <span class="collapsible-title">📌 Evidence <span class="collapsible-count">${totalEvidence}</span></span>
        <span class="collapsible-arrow">▼</span>
      </div>
      <div class="collapsible-body">${evidenceBodyHtml}</div>
    </div>`;
}

function buildKeywordsCollapsible(data, categories, modeClass) {
  const { termFreqMap } = data;
  let termBodyHtml = "";
  let hasTerms = false;
  let totalTerms = 0;

  for (const cat of categories) {
    const terms = termFreqMap[cat.id] || {};
    const entries = Object.entries(terms);
    if (entries.length === 0) continue;
    hasTerms = true;
    totalTerms += entries.length;
    const show = entries.sort((a, b) => b[1] - a[1]).slice(0, 8);
    termBodyHtml += `
      <div class="term-row">
        <div class="term-cat-label" style="color:${cat.color}">${cat.icon} ${cat.label}</div>
        <div class="term-chips">
          ${show.map(([t, c]) => `<span class="term-badge">${t} <strong>(${c})</strong></span>`).join("")}
          ${entries.length > 8 ? `<span class="term-more">+${entries.length - 8}</span>` : ""}
        </div>
      </div>`;
  }

  if (!hasTerms) return "";

  return `
    <div class="collapsible" id="phrasesSection">
      <div class="collapsible-header">
        <span class="collapsible-title">🔢 Keywords Matched <span class="collapsible-count">${totalTerms}</span></span>
        <span class="collapsible-arrow">▼</span>
      </div>
      <div class="collapsible-body">${termBodyHtml}</div>
    </div>`;
}

function buildPagesFooter(data) {
  if (!data.pages || data.pages.length === 0) return "";
  const pageList = data.pages
    .map((p) => {
      const short = (p.url || "").replace(/^https?:\/\//, "").substring(0, 30);
      return `<span class="page-badge">${short}</span>`;
    })
    .join("");
  return `<div class="pages-footer">📄 ${pageList}</div>`;
}

function wireEvidenceClicks(container) {
  container.querySelectorAll(".evidence-item").forEach((el) => {
    el.addEventListener("click", async () => {
      const url = el.dataset.url;
      const xpath = el.dataset.xpath;
      if (!xpath) return;

      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab) return;

      if (url && tab.url !== url) {
        const newTab = await chrome.tabs.create({ url, active: true });
        chrome.tabs.onUpdated.addListener(function onLoaded(tabId, info) {
          if (tabId === newTab.id && info.status === "complete") {
            chrome.tabs.onUpdated.removeListener(onLoaded);
            setTimeout(
              () =>
                chrome.tabs.sendMessage(newTab.id, {
                  action: "scrollTo",
                  xpath,
                }),
              500,
            );
          }
        });
      } else {
        chrome.tabs.sendMessage(
          tab.id,
          { action: "scrollTo", xpath },
          (res) => {
            if (res && !res.success)
              console.warn("[Popup] scrollTo failed:", res.error);
          },
        );
      }
    });
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// COPY BUTTONS
// ══════════════════════════════════════════════════════════════════════════════

function updateCopyButtons(mode) {
  const copyPrimaryBtn = document.getElementById("copyPrimaryBtn");
  if (mode === "hvac") {
    copyPrimaryBtn.className = "btn-action blue";
    copyPrimaryBtn.textContent = "📋 Copy HVAC Score";
  } else {
    copyPrimaryBtn.className = "btn-action amber";
    copyPrimaryBtn.textContent = "📋 Copy Score";
  }
}

function copyPrimary() {
  if (!currentScanData) return;
  const d = currentScanData;
  const conf = d.confidence || 0;

  let text;
  if (d.mode === "hvac") {
    text = `HVAC Company: ${d.hvacCompany} — Confidence: ${conf}% — ${d.confidenceLabel}`;
  } else {
    const label =
      conf >= 75
        ? "Genuine Hardscape Contractor"
        : conf >= 45
          ? "Likely Hardscape Contractor"
          : conf >= 20
            ? "Possible Hardscape Work"
            : "Not a Hardscape Company";
    text = `${label} — ${conf}%`;
  }

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById("copyPrimaryBtn");
    const orig = btn.textContent;
    btn.textContent = "✅ Copied!";
    setTimeout(() => {
      btn.textContent = orig;
    }, 1500);
  });
}

function copyAll() {
  if (!currentScanData) return;
  const d = currentScanData;
  const domain = (d.pages?.[0]?.url || "")
    .replace(/^https?:\/\//, "")
    .split("/")[0];
  const conf = d.confidence || 0;
  const categories = d.mode === "hvac" ? HVAC_CATEGORIES : HS_CATEGORIES;

  let text = `====================================\n`;

  if (d.mode === "hvac") {
    text += `HVAC COMPANY FINDER REPORT\n`;
    text += `====================================\n\n`;
    text += `Company Website  : ${domain || "Unknown"}\n`;
    text += `Full URL         : ${d.pages?.[0]?.url || "N/A"}\n`;
    text += `Detection Mode   : HVAC\n`;
    text += `HVAC Company     : ${d.hvacCompany}\n`;
    text += `Confidence Score : ${conf}% — ${d.confidenceLabel}\n`;
    text += `Positive Score   : ${d.totalPositiveScore || 0} pts\n`;
    text += `Penalty Score    : −${d.penaltyScore || 0} pts\n`;
    text += `Net Score        : ${d.netScore || 0} pts\n\n`;

    text += `HVAC SERVICES DETECTED:\n`;
    if (d.detectedServices && d.detectedServices.length > 0) {
      d.detectedServices.forEach((s) => {
        text += `  • ${s}\n`;
      });
    } else {
      text += "  (none detected)\n";
    }

    text += `\nSERVICE CATEGORY BREAKDOWN:\n`;
    for (const cat of HVAC_CATEGORIES) {
      text += `  ${cat.icon} ${cat.label}: ${d.catConfidence?.[cat.id] || 0}%\n`;
    }

    if (d.evidenceSignals && d.evidenceSignals.length > 0) {
      text += `\nEVIDENCE SIGNALS:\n`;
      d.evidenceSignals.forEach((s) => {
        text += `  📌 ${s}\n`;
      });
    }
  } else {
    const label =
      conf >= 75
        ? "Genuine Hardscape Contractor"
        : conf >= 45
          ? "Likely Hardscape Contractor"
          : conf >= 20
            ? "Possible Hardscape Work"
            : "Not a Hardscape Company";

    text += `HARDSCAPING COMPANY FINDER REPORT\n`;
    text += `====================================\n\n`;
    text += `Company Website : ${domain || "Unknown"}\n`;
    text += `Full URL        : ${d.pages?.[0]?.url || "N/A"}\n`;
    text += `Detection Mode  : Hardscaping\n`;
    text += `Confidence Score: ${conf}% — ${label}\n`;
    text += `Positive Score  : ${d.totalPositiveScore || 0} pts\n`;
    text += `Penalty Score   : −${d.penaltyScore || 0} pts\n`;
    text += `Net Score       : ${d.netScore || 0} pts\n\n`;

    text += `HARDSCAPING SERVICES DETECTED:\n`;
    if (d.detectedServices && d.detectedServices.length > 0) {
      d.detectedServices.forEach((s) => {
        text += `  • ${s}\n`;
      });
    } else {
      text += "  (none detected)\n";
    }

    if (d.secondaryServices && d.secondaryServices.length > 0) {
      text += `\nSECONDARY SERVICES:\n`;
      d.secondaryServices.forEach((s) => {
        text += `  • ${s}\n`;
      });
    }
  }

  text += `\nKEYWORDS MATCHED:\n`;
  for (const cat of categories) {
    const terms = d.termFreqMap?.[cat.id] || {};
    const entries = Object.entries(terms);
    if (entries.length === 0) continue;
    text += `  ${cat.label}:\n`;
    entries
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([t, c]) => {
        text += `    "${t}" (×${c})\n`;
      });
  }

  text += `\nWHY CLASSIFIED:\n`;
  (d.reasons || []).forEach((r) => {
    text += `  ${r}\n`;
  });

  if (d.negativeHits && d.negativeHits.length > 0) {
    text += `\nNEGATIVE SIGNALS:\n`;
    d.negativeHits.forEach((n) => {
      text += `  ⛔ ${n}\n`;
    });
  }

  text += `\nEVIDENCE SNIPPETS:\n`;
  for (const cat of categories) {
    const items = d.evidenceMap?.[cat.id] || [];
    if (items.length === 0) continue;
    text += `\n  ${cat.label} (${items.length} occurrences):\n`;
    items.slice(0, 5).forEach((i) => {
      text += `    [${i.zone}] "${i.snippet?.substring(0, 80) || ""}" — matched: "${i.matchedTerm}"\n`;
    });
  }

  text += `\n====================================\n`;
  text += `Generated by HVAC & Hardscape Company Finder v5.0\n`;

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById("copyAllBtn");
    const orig = btn.textContent;
    btn.textContent = "✅ Copied!";
    setTimeout(() => {
      btn.textContent = orig;
    }, 1500);
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// DEBUG PANEL
// ══════════════════════════════════════════════════════════════════════════════

function toggleDebug() {
  const panel = document.getElementById("debugPanel");
  if (!panel) return;
  panel.classList.toggle("hidden");
  const btn = document.getElementById("debugToggleBtn");
  btn.classList.toggle("active", !panel.classList.contains("hidden"));
  if (!panel.classList.contains("hidden")) panel.classList.add("open");
}

function updateDebugPanel(data) {
  const body = document.getElementById("debugBody");
  if (!body) return;

  const categories = data.mode === "hvac" ? HVAC_CATEGORIES : HS_CATEGORIES;
  const threshold = data.mode === "hvac" ? HVAC_THRESHOLD : HS_THRESHOLD;

  const catLines = categories
    .map(
      (cat) =>
        `${cat.icon} ${cat.label}: ${data.scoreMap?.[cat.id] || 0} pts → ${data.catConfidence?.[cat.id] || 0}%`,
    )
    .join("<br>");

  body.innerHTML = `
    <div class="debug-row"><strong>Mode:</strong> ${data.mode === "hvac" ? "🌡️ HVAC" : "🧱 Hardscaping"}</div>
    <div class="debug-row"><strong>Nodes:</strong> ${data.totalNodes || 0}</div>
    <div class="debug-row"><strong>Text:</strong> ${(data.totalText || 0).toLocaleString()} chars</div>
    <div class="debug-row"><strong>Hits:</strong> ${data.totalHits || 0}</div>
    <div class="debug-row"><strong>Scan time:</strong> ${data.scanTime || "?"}ms</div>
    <div class="debug-row"><strong>Positive score:</strong> ${data.totalPositiveScore || 0} pts</div>
    <div class="debug-row"><strong>Penalty score:</strong> −${data.penaltyScore || 0} pts (${data.negativeHits?.length || 0} signals)</div>
    <div class="debug-row"><strong>Net score:</strong> ${data.netScore || 0} pts → ${data.confidence || 0}%</div>
    <div class="debug-row"><strong>Threshold:</strong> ${threshold} pts = 100%</div>
    ${data.mode === "hvac" ? `<div class="debug-row"><strong>HVAC Company:</strong> ${data.hvacCompany || "?"}</div>` : ""}
    <hr class="debug-divider">
    <div class="debug-row"><strong>Category scores:</strong><br>${catLines}</div>
    ${
      data.negativeHits?.length > 0
        ? `<hr class="debug-divider"><div class="debug-row"><strong>Negative signals:</strong><br>${data.negativeHits.join("<br>")}</div>`
        : ""
    }
    ${
      data.debugLog && data.debugLog.length > 0
        ? `<hr class="debug-divider"><div class="debug-row"><strong>Engine log:</strong><br>${data.debugLog.join("<br>")}</div>`
        : ""
    }
    <div class="debug-hint">Press <kbd>D</kbd> or click 🛠 to hide.</div>
  `;
}

document.addEventListener("keydown", (e) => {
  if (e.key === "d" || e.key === "D") toggleDebug();
});

// ══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════════════════

function showProgress(active) {
  const bar = document.getElementById("progressBar");
  const fill = document.getElementById("progressFill");
  if (active) {
    bar.classList.add("active");
    let w = 0;
    fill._interval = setInterval(() => {
      w = (w + 2) % 100;
      fill.style.width = w + "%";
    }, 30);
  } else {
    bar.classList.remove("active");
    fill.style.width = "0%";
    if (fill._interval) clearInterval(fill._interval);
  }
}

function setStatus(msg) {
  const el = document.getElementById("pageIndicator");
  if (el) el.textContent = msg;
}

function showError(msg) {
  document.getElementById("resultContainer").innerHTML =
    `<div class="status-msg error-msg">❌ ${msg}</div>`;
  document.getElementById("copySection").classList.add("hidden");
}

// ── Auto-Highlight ────────────────────────────────────────────────────────────

async function autoHighlight(tabId, scanData, mode) {
  if (!scanData || !scanData.termFreqMap) return;

  const categories = mode === "hvac" ? HVAC_CATEGORIES : HS_CATEGORIES;
  const terms = [];
  const seen = new Set();

  for (const cat of categories) {
    const termObj = scanData.termFreqMap[cat.id] || {};
    for (const term of Object.keys(termObj)) {
      if (!seen.has(term.toLowerCase())) {
        seen.add(term.toLowerCase());
        terms.push({ term, categoryId: cat.id });
      }
    }
  }

  if (terms.length === 0) return;

  try {
    chrome.tabs.sendMessage(
      tabId,
      { action: "highlightKeywords", terms, mode },
      (res) => {
        if (chrome.runtime.lastError) {
          console.warn(
            "[Popup] autoHighlight error:",
            chrome.runtime.lastError.message,
          );
          return;
        }
        if (res && res.success) {
          console.log(
            `[Popup] Highlighted ${res.highlightCount} occurrences (${mode} mode).`,
          );
          const clearBtn = document.getElementById("clearHighlightsBtn");
          if (clearBtn) clearBtn.classList.remove("hidden");
          const legend = document.getElementById("hlLegend");
          if (legend) legend.classList.remove("hidden");
        }
      },
    );
  } catch (e) {
    console.warn("[Popup] autoHighlight exception:", e);
  }
}

// ── Clear Highlights ──────────────────────────────────────────────────────────

async function clearPageHighlights() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;
  chrome.tabs.sendMessage(tab.id, { action: "clearHighlights" }, () => {
    const clearBtn = document.getElementById("clearHighlightsBtn");
    if (clearBtn) clearBtn.classList.add("hidden");
    const legend = document.getElementById("hlLegend");
    if (legend) legend.classList.add("hidden");
  });
}
