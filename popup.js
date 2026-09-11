// popup.js — HVAC & Hardscaping Company Finder UI v5.0
// Dual-mode detection: HVAC and Hardscaping engines are completely independent.
// Mode is persisted via chrome.storage.local.

"use strict";

// ── GLOBAL STATE ──────────────────────────────────────────────────────────────
let currentScanData = null;
let currentMode = "hvac"; // 'hvac' | 'hardscaping' | 'roofing' | 'address' | 'moving' — default, overridden on boot

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

// ── Roofing Categories ──
const ROOFING_CATEGORIES = [
  { id: "roof_replacement", label: "Roof Replacement", icon: "🏠", color: "#ef4444" },
  { id: "roof_repair", label: "Roof Repair", icon: "🔧", color: "#f97316" },
  { id: "roof_installation", label: "Roof Installation", icon: "🛠️", color: "#dc2626" },
  { id: "roofing_materials", label: "Roofing Materials", icon: "🧱", color: "#b91c1c" },
  { id: "commercial_roofing", label: "Commercial Roofing", icon: "🏢", color: "#78350f" },
  { id: "emergency_roofing", label: "Emergency / Storm", icon: "⚡", color: "#fbbf24" },
];

// ── Roofing Highlight Legend Swatches ──
const ROOFING_LEGEND_SWATCHES = [
  { label: "Roofing", bg: "rgba(239,68,68,0.35)", border: "#dc2626" },
];

// ── Moving Categories ──
const MOVING_CATEGORIES = [
  { id: "moving_company",    label: "Moving Company",      icon: "🚛", color: "#8b5cf6" },
  { id: "residential",      label: "Residential Moving",  icon: "🏠", color: "#7c3aed" },
  { id: "commercial",       label: "Commercial Moving",   icon: "🏢", color: "#6d28d9" },
  { id: "long_distance",    label: "Long Distance",       icon: "🗺️", color: "#a78bfa" },
  { id: "packing",          label: "Packing Services",    icon: "📦", color: "#c4b5fd" },
  { id: "moving_storage",   label: "Moving & Storage",    icon: "🏗️", color: "#ddd6fe" },
];

// ── Moving Highlight Legend Swatches ──
const MOVING_LEGEND_SWATCHES = [
  { label: "Moving", bg: "rgba(139,92,246,0.35)", border: "#7c3aed" },
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
const ROOFING_CATEGORY_BY_ID = {};
for (const cat of ROOFING_CATEGORIES) ROOFING_CATEGORY_BY_ID[cat.id] = cat;
const MOVING_CATEGORY_BY_ID = {};
for (const cat of MOVING_CATEGORIES) MOVING_CATEGORY_BY_ID[cat.id] = cat;

// ── Scoring Constants ──
const HS_THRESHOLD      = 420;
const HVAC_THRESHOLD    = 420;
const NEGATIVE_PENALTY  = 10;
const ROOFING_THRESHOLD = 420;
const MOVING_THRESHOLD  = 380;

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

const ROOFING_DEEP_SCAN_PAGES = [
  "/",
  "/services",
  "/roofing",
  "/roof-repair",
  "/roof-replacement",
  "/roof-installation",
  "/residential-roofing",
  "/commercial-roofing",
  "/metal-roofing",
  "/shingle-roofing",
  "/flat-roofing",
  "/storm-damage",
  "/emergency-roofing",
  "/gutters",
  "/about",
  "/our-services",
  "/contact",
];

const MOVING_DEEP_SCAN_PAGES = [
  "/",
  "/services",
  "/moving",
  "/moving-services",
  "/residential-moving",
  "/commercial-moving",
  "/office-moving",
  "/long-distance-moving",
  "/local-moving",
  "/packing-services",
  "/packing-and-moving",
  "/moving-and-storage",
  "/storage",
  "/specialty-moving",
  "/about",
  "/about-us",
  "/our-services",
  "/contact",
];

// ── Address Finder Deep Scan Pages ──
const ADDR_DEEP_SCAN_PAGES = [
  "/",
  "/contact",
  "/contact-us",
  "/about",
  "/about-us",
  "/location",
  "/locations",
  "/our-location",
  "/find-us",
];

// ── Competitor Finder State ──
let currentCompetitorData = null;
let currentSheetInfo = null;
let currentSheetRows = [];
let activeRowNumber = 6;

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
document
  .getElementById("modeRoofBtn")
  .addEventListener("click", () => setMode("roofing"));
document
  .getElementById("modeAddrBtn")
  .addEventListener("click", () => setMode("address"));
document
  .getElementById("modeCompBtn")
  .addEventListener("click", () => setMode("competitor"));
document
  .getElementById("modeMovingBtn")
  .addEventListener("click", () => setMode("moving"));

// Wire Competitor Finder buttons (Single, Bulk & Google Auth)
document.getElementById("compSubSingleBtn")?.addEventListener("click", () => setCompSubMode("single"));
document.getElementById("compSubBulkBtn")?.addEventListener("click", () => setCompSubMode("bulk"));
document.getElementById("compGoogleAuthBtn")?.addEventListener("click", handleGoogleAuthClick);
document.getElementById("compSettingsToggleBtn")?.addEventListener("click", toggleCompSettings);
document.getElementById("compSaveClientIdBtn")?.addEventListener("click", saveCustomClientId);
document.getElementById("compConnectDirectTokenBtn")?.addEventListener("click", connectDirectAccessToken);
document.getElementById("compSaveWebhookBtn")?.addEventListener("click", saveWebhookUrl);
document.getElementById("compCopyRedirectUriBtn")?.addEventListener("click", copyRedirectUri);
document.getElementById("compRefreshSheetBtn")?.addEventListener("click", () => refreshCompetitorSheet(true));
document.getElementById("compWorksheetSelect")?.addEventListener("change", onWorksheetSelected);

// Single Row mode buttons
document.getElementById("compReadRowBtn")?.addEventListener("click", () => readActiveSheetRow(true));
document.getElementById("compRowIncBtn")?.addEventListener("click", () => stepRow(1));
document.getElementById("compRowDecBtn")?.addEventListener("click", () => stepRow(-1));
document.getElementById("compRowNumInput")?.addEventListener("change", onRowNumberChanged);
document.getElementById("compRowNumInput")?.addEventListener("keyup", (e) => { if (e.key === "Enter") onRowNumberChanged(); });
document.getElementById("compFindBtn")?.addEventListener("click", runCompetitorFinder);
document.getElementById("compSaveSheetBtn")?.addEventListener("click", () => saveCompetitorsToSheet(true));
document.getElementById("compCopyTsvBtn")?.addEventListener("click", copyCompetitorsTsv);

// Bulk Mode buttons
document.getElementById("compBulkRunBtn")?.addEventListener("click", startBulkCompetitorFinder);
document.getElementById("compBulkStopBtn")?.addEventListener("click", stopBulkCompetitorFinder);
document.getElementById("compBulkRetryBtn")?.addEventListener("click", retryFailedBulkRows);
document.getElementById("compBulkSaveSheetBtn")?.addEventListener("click", saveBulkCompetitorsToSheet);
document.getElementById("compBulkCopyTsvBtn")?.addEventListener("click", copyBulkResultsTsv);
document.getElementById("compBulkCopyTextBtn")?.addEventListener("click", copyBulkResultsFormattedText);

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
// MODE MANAGEMENT (Fixed & Robust Architecture)
// ══════════════════════════════════════════════════════════════════════════════

let activeScanToken = 0; // Generation token to invalidate any in-flight async operations on mode switch

function updateHeaderTitle(icon, name, accentClass) {
  const headerTitle = document.getElementById("headerTitle");
  if (!headerTitle) return;
  headerTitle.innerHTML = `${icon} <span class="${accentClass}" id="headerAccent">${name}</span> Finder`;
}

function setMode(mode, saveToStorage = true) {
  // 1. Cancel in-flight scan operations & reset timers
  activeScanToken++;
  currentMode = mode;
  currentScanData = null;
  showProgress(false);

  const isHvac   = mode === "hvac";
  const isAddr   = mode === "address";
  const isHs     = mode === "hardscaping";
  const isComp   = mode === "competitor";
  const isRoof   = mode === "roofing";
  const isMoving = mode === "moving";

  // 2. Safely update button active classes
  const hvacBtn   = document.getElementById("modeHvacBtn");
  const hsBtn     = document.getElementById("modeHsBtn");
  const addrBtn   = document.getElementById("modeAddrBtn");
  const compBtn   = document.getElementById("modeCompBtn");
  const roofBtn   = document.getElementById("modeRoofBtn");
  const movingBtn = document.getElementById("modeMovingBtn");
  if (hvacBtn)   hvacBtn.className   = "mode-btn" + (isHvac   ? " active-hvac"   : "");
  if (hsBtn)     hsBtn.className     = "mode-btn" + (isHs     ? " active-hs"     : "");
  if (addrBtn)   addrBtn.className   = "mode-btn" + (isAddr   ? " active-addr"   : "");
  if (compBtn)   compBtn.className   = "mode-btn" + (isComp   ? " active-comp"   : "");
  if (roofBtn)   roofBtn.className   = "mode-btn" + (isRoof   ? " active-roof"   : "");
  if (movingBtn) movingBtn.className = "mode-btn" + (isMoving ? " active-moving" : "");

  // 3. Safely update Header Title
  if (isHvac) {
    updateHeaderTitle("🌡️", "HVAC", "accent-hvac");
  } else if (isAddr) {
    updateHeaderTitle("📍", "Address", "accent-addr");
  } else if (isComp) {
    updateHeaderTitle("🎯", "Competitor", "accent-comp");
  } else if (isRoof) {
    updateHeaderTitle("🏠", "Roofing", "accent-roof");
  } else if (isMoving) {
    updateHeaderTitle("🚛", "Moving", "accent-moving");
  } else {
    updateHeaderTitle("🧱", "Hardscape", "accent-hs");
  }

  // 4. Panel visibility elements
  const scanBtnRow   = document.getElementById("scanBtnRow");
  const compSection  = document.getElementById("competitorSection");
  const resContainer = document.getElementById("resultContainer");
  const copySection  = document.getElementById("copySection");
  const locSec       = document.getElementById("locationSection");
  const clearHlBtn   = document.getElementById("clearHighlightsBtn");
  const hlLegend     = document.getElementById("hlLegend");
  const scanBtn      = document.getElementById("scanBtn");
  const deepScanBtn  = document.getElementById("deepScanBtn");

  // Hide common ephemeral sections
  if (copySection) copySection.classList.add("hidden");
  if (locSec)      locSec.classList.add("hidden");
  if (clearHlBtn)  clearHlBtn.classList.add("hidden");
  if (hlLegend)    hlLegend.classList.add("hidden");

  // Re-enable all action buttons
  if (scanBtn)     scanBtn.disabled = false;
  if (deepScanBtn) deepScanBtn.disabled = false;

  // 5. Mode specific panel activation
  if (isComp) {
    if (scanBtnRow)   scanBtnRow.classList.add("hidden");
    if (resContainer) resContainer.classList.add("hidden");
    if (compSection)  compSection.classList.remove("hidden");
    setStatus("Google Sheets");
    initCompetitorFinder();
  } else {
    if (scanBtnRow)   scanBtnRow.classList.remove("hidden");
    if (resContainer) resContainer.classList.remove("hidden");
    if (compSection)  compSection.classList.add("hidden");

    if (isHvac) {
      if (scanBtn) {
        scanBtn.className = "btn-scan-primary hvac-mode";
        scanBtn.textContent = "🔍 Quick Scan";
      }
      if (deepScanBtn) {
        deepScanBtn.className = "btn-scan-secondary hvac-mode";
        deepScanBtn.textContent = "🌐 Deep Scan";
      }
      if (resContainer) {
        resContainer.innerHTML = `<div class="status-msg">Click <strong>Quick Scan</strong> to analyze this site for HVAC services.</div>`;
      }
      renderLegendSwatches(HVAC_LEGEND_SWATCHES);
    } else if (isRoof) {
      if (scanBtn) {
        scanBtn.className = "btn-scan-primary roof-mode";
        scanBtn.textContent = "🔍 Quick Scan";
      }
      if (deepScanBtn) {
        deepScanBtn.className = "btn-scan-secondary";
        deepScanBtn.textContent = "🌐 Deep Scan";
      }
      if (resContainer) {
        resContainer.innerHTML = `<div class="status-msg">Click <strong>Quick Scan</strong> to analyze this site for roofing services.</div>`;
      }
      renderLegendSwatches(ROOFING_LEGEND_SWATCHES);
    } else if (isMoving) {
      if (scanBtn) {
        scanBtn.className = "btn-scan-primary moving-mode";
        scanBtn.textContent = "🔍 Quick Scan";
      }
      if (deepScanBtn) {
        deepScanBtn.className = "btn-scan-secondary";
        deepScanBtn.textContent = "🌐 Deep Scan";
      }
      if (resContainer) {
        resContainer.innerHTML = `<div class="status-msg">Click <strong>Quick Scan</strong> to analyze this site for moving company services.</div>`;
      }
      renderLegendSwatches(MOVING_LEGEND_SWATCHES);
    } else if (isHs) {
      if (scanBtn) {
        scanBtn.className = "btn-scan-primary";
        scanBtn.textContent = "🔍 Quick Scan";
      }
      if (deepScanBtn) {
        deepScanBtn.className = "btn-scan-secondary";
        deepScanBtn.textContent = "🌐 Deep Scan";
      }
      if (resContainer) {
        resContainer.innerHTML = `<div class="status-msg">Click <strong>Quick Scan</strong> to analyze this site for hardscaping services.</div>`;
      }
      renderLegendSwatches(HS_LEGEND_SWATCHES);
    } else if (isAddr) {
      if (scanBtn) {
        scanBtn.className = "btn-scan-primary addr-mode";
        scanBtn.textContent = "🔍 Find Address";
      }
      if (deepScanBtn) {
        deepScanBtn.className = "btn-scan-secondary";
        deepScanBtn.textContent = "🌐 Deep Scan";
      }
      if (resContainer) {
        resContainer.innerHTML = `<div class="status-msg">Click <strong>Find Address</strong> to locate this company's physical address.</div>`;
      }
    }
    setStatus("Ready");
  }

  // 6. Progress fill styling
  const fill = document.getElementById("progressFill");
  if (fill) {
    fill.className = "progress-fill";
    if (isHvac)        fill.classList.add("hvac-fill");
    else if (isAddr)   fill.classList.add("addr-fill");
    else if (isComp)   fill.classList.add("comp-fill");
    else if (isRoof)   fill.classList.add("roof-fill");
    else if (isMoving) fill.classList.add("moving-fill");
  }

  // 7. Persist mode
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

    // ── ADDRESS FINDER MODE — completely skip service detection ──
    if (currentMode === "address") {
      await runAddressFinderScan(tab.id);
      setStatus("Address Scan");
      return;
    }

    // ── HVAC / HARDSCAPING MODE ──
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
      // Location extraction — runs after main scan (non-blocking)
      extractAndRenderLocation(tab.id);
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
    btn.textContent = currentMode === "address" ? "🔍 Find Address" : "🔍 Quick Scan";
    showProgress(false);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// ADDRESS FINDER SCAN — Completely independent; no service detection
// ══════════════════════════════════════════════════════════════════════════════

async function runAddressFinderScan(tabId) {
  try {
    const locationData = await new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(
        tabId,
        { action: "extractLocation" },
        (res) => {
          if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
          else resolve(res);
        }
      );
    });

    currentLocationData = locationData || null;
    renderAddressFinderDashboard(locationData || { confidence: "none" });

    // Visually highlight the detected address on the page
    if (locationData && locationData.confidence !== "none") {
      chrome.tabs.sendMessage(
        tabId,
        { action: "highlightAddresses", locationData },
        (res) => {
          if (chrome.runtime.lastError) return;
          if (res && res.success && res.highlightCount > 0) {
            const clearBtn = document.getElementById("clearHighlightsBtn");
            if (clearBtn) clearBtn.classList.remove("hidden");
            const legend = document.getElementById("hlLegend");
            if (legend) {
              renderLegendSwatches([{ label: "Address", bg: "rgba(34,211,238,0.28)", border: "#22d3ee" }]);
              legend.classList.remove("hidden");
            }
          }
        }
      );
    }
  } catch (e) {
    console.warn("[Popup] Address scan failed:", e.message);
    renderAddressFinderDashboard({ confidence: "none", error: e.message });
  }
}

// ── Address Finder Dashboard Renderer ──
function renderAddressFinderDashboard(data) {
  const container = document.getElementById("resultContainer");
  const city       = data.primaryCity   || null;
  const state      = data.primaryState  || null;
  const confidence = data.confidence    || "none";
  const others     = (data.otherLocations || []).filter(o => o.city || o.state);
  const signals    = data.signals || [];
  const matchedKws = data.matchedKeywords || [];

  const confLabels = { high: "High Confidence", medium: "Medium Confidence", low: "Low Confidence", none: "Not Detected" };
  const confLabel  = confLabels[confidence] || "Unknown";

  let html = `<div class="addr-result-card" id="addrResultCard">`;
  html += `<div class="addr-mode-label">📍 Address Finder — Company Location</div>`;

  if (confidence === "none" || (!city && !state)) {
    html += `
      <div class="addr-not-detected">
        <span class="addr-nd-icon">🔍</span>
        No physical address detected on this page.<br>
        <small style="color:var(--text-dim)">Try Deep Scan to check contact/about pages.</small>
      </div>`;
  } else {
    // ── Big city, state display ──
    html += `<div class="addr-city-state-display">`;
    if (city)  html += `<span class="addr-city">${escHtml(city)}</span>`;
    if (city && state) html += `<span class="addr-sep">,</span>`;
    if (state) html += `<span class="addr-state">${escHtml(state)}</span>`;
    html += `</div>`;

    html += `<div class="addr-conf-row">
      <span class="addr-conf-badge ${confidence}">${confLabel}</span>
    </div>`;

    // ── Source signals ──
    if (signals.length > 0) {
      const sigChips = [...new Set(signals)]
        .slice(0, 6)
        .map(s => `<span class="addr-source-chip">${escHtml(s.replace(/-/g, ' '))}</span>`)
        .join("");
      html += `<div class="addr-sources">
        <div class="addr-sources-label">📡 Found In</div>
        <div class="addr-source-chips">${sigChips}</div>
      </div>`;
    }

    // ── Location keywords matched ──
    if (matchedKws.length > 0) {
      const kwChips = [...new Set(matchedKws)]
        .slice(0, 8)
        .map(k => `<span class="addr-kw-chip">${escHtml(k)}</span>`)
        .join("");
      html += `<div class="addr-keywords-found">
        <div class="addr-keywords-label">🔑 Location Keywords Matched</div>
        <div>${kwChips}</div>
      </div>`;
    }

    // ── Other locations ──
    if (others.length > 0) {
      const otherItems = others.slice(0, 4).map(o => {
        const parts = [o.city, o.state].filter(Boolean);
        return `<div class="addr-other-item">📌 ${escHtml(parts.join(", "))}</div>`;
      }).join("");
      html += `<div class="addr-others">
        <div class="addr-others-label">Other Locations Detected</div>
        ${otherItems}
      </div>`;
    }

    // ── Copy buttons ──
    const copyValue = [city, state].filter(Boolean).join(", ");
    html += `<div class="addr-copy-row">
      <button class="btn-addr-copy" id="addrCopyBtn" data-copy="${escLoc(copyValue)}">📋 Copy ${escHtml(copyValue)}</button>
    </div>`;

    if (confidence !== "none") {
      html += `<div class="addr-hl-note">✨ Address text highlighted on the page below</div>`;
    }
  }

  html += `</div>`;
  container.innerHTML = html;

  // Wire copy button
  const copyBtn = document.getElementById("addrCopyBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const value = copyBtn.getAttribute("data-copy");
      if (!value) return;
      navigator.clipboard.writeText(value).then(() => {
        const orig = copyBtn.textContent;
        copyBtn.textContent = "✅ Copied!";
        setTimeout(() => { copyBtn.textContent = orig; }, 1500);
      });
    });
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

  // ── Address Finder deep scan — different pages, no service detection ──
  if (currentMode === "address") {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (!tabs || !tabs[0]) {
        showError("No active tab found.");
        btn.disabled = false;
        btn.textContent = "🌐 Deep Scan";
        showProgress(false);
        return;
      }
      const tabId = tabs[0].id;
      try {
        await chrome.scripting.executeScript({ target: { tabId }, files: ["content.js"] });
      } catch (_) {}
      await runAddressFinderScan(tabId);
      setStatus("Addr Scan");
      btn.disabled = false;
      btn.textContent = "🌐 Deep Scan";
      showProgress(false);
    });
    return;
  }

  const pages =
    currentMode === "hvac"     ? HVAC_DEEP_SCAN_PAGES
    : currentMode === "roofing"  ? ROOFING_DEEP_SCAN_PAGES
    : currentMode === "moving"   ? MOVING_DEEP_SCAN_PAGES
    : HS_DEEP_SCAN_PAGES;

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
          // Location extraction on the active tab (non-blocking)
          chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
            if (activeTabs && activeTabs[0]) extractAndRenderLocation(activeTabs[0].id);
          });
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
  if (mode === "hvac")    return aggregateHvacFindings(response);
  if (mode === "roofing") return aggregateRoofingFindings(response);
  if (mode === "moving")  return aggregateMovingFindings(response);
  return aggregateHardscapeFindings(response);
}

// ── Hardscaping Aggregation (v4.0 logic + v5.1 strict multi-signal validation) ──

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

  // ── v5.1: Track strong signals for multi-signal validation ──
  let hasStrongSignal = false;       // At least one tier-1 or tier-2 match
  let strongSignalCount = 0;          // Number of distinct tier-1/tier-2 terms matched
  const strongSignalTerms = new Set(); // Distinct strong terms for quality check

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
      // v5.1: track strong signals
      if (!strongSignalTerms.has(term)) {
        strongSignalTerms.add(term);
        strongSignalCount++;
      }
      hasStrongSignal = true;
    }
  }

  // ── v5.1: Count how many distinct categories have meaningful scores ──
  // A category is "active" if its raw score reaches at least the weight of
  // one tier-2 keyword (10 pts) to prevent noise from inflating category count.
  const CATEGORY_ACTIVATION_THRESHOLD = 10;
  const activeCategoryCount = HS_CATEGORIES.filter(
    (cat) => scoreMap[cat.id] >= CATEGORY_ACTIVATION_THRESHOLD,
  ).length;

  const totalPositiveScore = Object.values(scoreMap).reduce((a, b) => a + b, 0);
  const penaltyScore = negativeHits.length * NEGATIVE_PENALTY;
  const netScore = Math.max(0, totalPositiveScore - penaltyScore);
  let rawConfidence = Math.min(
    100,
    Math.round((netScore / HS_THRESHOLD) * 100),
  );

  // ── v5.1: Strict multi-signal gates ──────────────────────────────────────
  // Gate 1: No tier-1 or tier-2 signal at all → cap confidence at 15 ("Weak").
  // This prevents generic tier-3/tier-4 words ("outdoor living", "outdoor spaces")
  // from pushing a score into the "Possible" or higher range on their own.
  if (!hasStrongSignal && rawConfidence > 15) {
    rawConfidence = 15;
  }

  // Gate 2: Only one strong signal and only one active category → cap at 30.
  // A single-service mention is not sufficient to classify as a hardscape company.
  if (strongSignalCount <= 1 && activeCategoryCount <= 1 && rawConfidence > 30) {
    rawConfidence = 30;
  }

  // Gate 3: "Genuine" (75+) requires both multiple strong signals AND
  // evidence from at least 2 distinct categories.
  if (rawConfidence >= 75 && (strongSignalCount < 3 || activeCategoryCount < 2)) {
    rawConfidence = 74;
  }

  // Gate 4: "Likely" (45+) requires at least one strong signal and
  // signals spanning at least 1 active category with 2+ strong terms.
  if (rawConfidence >= 45 && !hasStrongSignal) {
    rawConfidence = 44;
  }
  // ─────────────────────────────────────────────────────────────────────────

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
    hasStrongSignal,
    strongSignalCount,
    activeCategoryCount,
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

// ── Roofing Aggregation ───────────────────────────────────────────────────────

// ── Roofing Aggregation ───────────────────────────────────────────────────────

function aggregateRoofingFindings(response) {
  const findings = response.findings || [];
  const negativeHits = response.negativeHits || [];

  const scoreMap = {};
  const evidenceMap = {};
  const termFreqMap = {};
  const matchedZones = {};

  for (const cat of ROOFING_CATEGORIES) {
    scoreMap[cat.id] = 0;
    evidenceMap[cat.id] = [];
    termFreqMap[cat.id] = {};
    matchedZones[cat.id] = new Set();
  }

  const allKeywordsMatched = new Set();
  const highValueMatched = [];
  const tier1Terms = new Set();
  const tier2Terms = new Set();
  const strongSignalTerms = new Set();
  const prominentZones = new Set([
    "hero-heading",
    "hero",
    "h1",
    "h2",
    "nav",
    "meta",
    "service-section",
    "cta",
  ]);
  let hasProminentZone = false;

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
    if (f.zone) {
      matchedZones[catId].add(f.zone);
      if (prominentZones.has(f.zone)) {
        hasProminentZone = true;
      }
    }

    if (f.tier === 1) {
      tier1Terms.add(term);
      strongSignalTerms.add(term);
      if (!highValueMatched.includes(f.label || term)) {
        highValueMatched.push(f.label || term);
      }
    } else if (f.tier === 2) {
      tier2Terms.add(term);
      strongSignalTerms.add(term);
      if (!highValueMatched.includes(f.label || term)) {
        highValueMatched.push(f.label || term);
      }
    }
  }

  const strongSignalCount = strongSignalTerms.size;
  const tier1Count = tier1Terms.size;
  const hasStrongSignal = strongSignalCount > 0;

  // An active category requires at least 15 points (the weight of a core service term)
  const activeCategoryThreshold = 15;
  const activeCategoryCount = ROOFING_CATEGORIES.filter(
    (c) => (scoreMap[c.id] || 0) >= activeCategoryThreshold,
  ).length;

  const totalPositiveScore = Object.values(scoreMap).reduce((a, b) => a + b, 0);
  const penaltyScore = negativeHits.length * NEGATIVE_PENALTY;
  const netScore = Math.max(0, totalPositiveScore - penaltyScore);
  let rawConfidence = Math.min(100, Math.round((netScore / ROOFING_THRESHOLD) * 100));

  // ── Strict Multi-Signal Gates for Roofing Detection Mode ───────────────────

  // Gate 1: No Tier 1 or Tier 2 strong signal at all → cap at 15 ("NO").
  // Generic or ancillary terms alone (gutters, skylights, standalone "roof") cannot drive verdict.
  if (!hasStrongSignal && rawConfidence > 15) {
    rawConfidence = 15;
  }

  // Gate 2: Only one distinct strong signal term matched → cap at 28 ("UNCERTAIN").
  // A company cannot be classified as a roofing company based on a single keyword.
  if (strongSignalCount <= 1 && rawConfidence > 28) {
    rawConfidence = 28;
  }

  // Gate 3: Lack of prominent zone support → cap at 45 ("UNCERTAIN").
  // Genuine roofing contractors feature services in Hero, H1, H2, Nav, Title, or Service sections.
  // Terms found only in secondary body text or footers cannot validate a primary roofing business.
  if (!hasProminentZone && rawConfidence > 45) {
    rawConfidence = 45;
  }

  // Gate 4: Multi-Signal Confirmation required for "YES" (verdict >= 60).
  // A company must exhibit either:
  //   a) 3+ distinct strong roofing signals (e.g. roof installation + roof repair + shingle roofing), OR
  //   b) 2+ distinct strong signals with at least one Tier 1 core service, active evidence across 2+ categories, and prominent zone presence.
  const qualifiesForYes =
    strongSignalCount >= 3 ||
    (strongSignalCount >= 2 && tier1Count >= 1 && activeCategoryCount >= 2 && hasProminentZone);

  if (rawConfidence >= 60 && !qualifiesForYes) {
    rawConfidence = 50;
  }

  // Gate 5: High Confidence (>= 80) requires multi-service depth.
  // Must have 4+ distinct strong signals, 2+ active categories, at least 2 Tier 1 terms, and prominent zone support.
  if (
    rawConfidence >= 80 &&
    (strongSignalCount < 4 || activeCategoryCount < 2 || tier1Count < 2 || !hasProminentZone)
  ) {
    rawConfidence = 75;
  }

  // Gate 6: Negative Penalty signals from non-roofing primary businesses.
  // If multiple negative hits (e.g. pressure washing, solar installation, siding contractor) are detected,
  // cap confidence to ensure non-roofers are suppressed.
  if (negativeHits.length >= 2 && rawConfidence > 40) {
    rawConfidence = 40;
  }
  if (negativeHits.length >= 4 && rawConfidence > 20) {
    rawConfidence = 20;
  }

  const confidence = Math.max(0, rawConfidence);

  // Roofing company verdict
  let roofingCompany;
  if (confidence >= 60) roofingCompany = "YES";
  else if (confidence >= 25) roofingCompany = "UNCERTAIN";
  else roofingCompany = "NO";

  // Confidence label
  let confidenceLabel;
  if (confidence >= 95) confidenceLabel = "Very Strong Roofing Evidence";
  else if (confidence >= 80) confidenceLabel = "Strong Roofing Evidence";
  else if (confidence >= 60) confidenceLabel = "Moderate Roofing Evidence";
  else if (confidence >= 40) confidenceLabel = "Weak / Uncertain";
  else confidenceLabel = "Probably Not a Roofing Company";

  const catConfidence = {};
  for (const cat of ROOFING_CATEGORIES) {
    const s = scoreMap[cat.id];
    catConfidence[cat.id] =
      s === 0
        ? 0
        : Math.min(100, Math.round((s / (ROOFING_THRESHOLD / ROOFING_CATEGORIES.length)) * 100));
  }

  const detectedServices = highValueMatched.slice(0, 24);
  const reasons = buildRoofingReasons(
    confidence,
    scoreMap,
    matchedZones,
    negativeHits,
    detectedServices,
    catConfidence,
    hasStrongSignal,
    strongSignalCount,
    tier1Count,
    activeCategoryCount,
    hasProminentZone,
  );

  return {
    mode: "roofing",
    confidence,
    confidenceLabel,
    roofingCompany,
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
  };
}

function buildRoofingReasons(
  confidence,
  scoreMap,
  matchedZones,
  negativeHits,
  detectedServices,
  catConfidence,
  hasStrongSignal,
  strongSignalCount,
  tier1Count,
  activeCategoryCount,
  hasProminentZone,
) {
  const reasons = [];

  if (confidence === 0) {
    reasons.push("\u274c No roofing signals detected on this page.");
    return reasons;
  }

  if (confidence >= 80) {
    reasons.push("\u2705 Genuine roofing contractor \u2014 strong multi-service evidence confirmed across key zones");
  } else if (confidence >= 60) {
    reasons.push("\ud83d\udd36 Likely roofing company \u2014 solid dedicated service evidence confirmed");
  } else if (confidence >= 25) {
    reasons.push("\ud83d\udd38 Possible roofing involvement \u2014 moderate or isolated signals detected");
  } else {
    reasons.push("\u26a0\ufe0f Weak roofing presence \u2014 low-tier, ancillary, or incidental terminology only");
  }

  // Multi-signal gating explanations
  if (!hasStrongSignal) {
    reasons.push("\u26a0\ufe0f No dedicated roofing service terms found \u2014 only generic or ancillary mentions");
  } else if (strongSignalCount <= 1) {
    reasons.push("\u2139\ufe0f Only one distinct roofing term matched \u2014 multiple service signals required for confirmation");
  } else if (!hasProminentZone) {
    reasons.push("\u26a0\ufe0f Roofing terms appear only in body/secondary text \u2014 not featured in navigation, headings, or service sections");
  } else if (confidence < 60 && strongSignalCount < 3) {
    reasons.push("\u2139\ufe0f Limited service breadth \u2014 additional dedicated roofing services needed for full confirmation");
  }

  const allZones = new Set(Object.values(matchedZones).flat());
  if (allZones.has("hero-heading") || allZones.has("h1"))
    reasons.push("\ud83c\udfaf Roofing keywords found in hero heading / H1");
  if (allZones.has("nav"))
    reasons.push("\ud83d\udccd Roofing services listed in navigation menu");
  if (allZones.has("service-section"))
    reasons.push("\ud83d\udccb Dedicated roofing services section detected");
  if (allZones.has("meta"))
    reasons.push("\ud83d\udd0d Roofing keywords in page title or meta description");
  if (allZones.has("cta"))
    reasons.push("\ud83d\udce3 Roofing call-to-action buttons present");
  if (allZones.has("structured-data"))
    reasons.push("\ud83d\uddc2\ufe0f Roofing signals found in structured data (JSON-LD)");

  const topCats = ROOFING_CATEGORIES.filter((c) => catConfidence[c.id] >= 25);
  if (topCats.length > 0) {
    reasons.push("\ud83c\udfc6 Services confirmed: " + topCats.map((c) => c.label).join(", "));
  }

  if (negativeHits.length > 0) {
    reasons.push(`\u26d4 Penalty signals: ${negativeHits.slice(0, 3).join(", ")}${negativeHits.length > 3 ? ` +${negativeHits.length - 3} more` : ""}`);
  }

  return reasons;
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
  hasStrongSignal = true,
  strongSignalCount = 0,
  activeCategoryCount = 0,
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

  // v5.1: Explain when multi-signal gates suppressed the score
  if (!hasStrongSignal) {
    reasons.push(
      "⚠️ No specific hardscape service terms found — only generic 'outdoor' phrases detected",
    );
  } else if (strongSignalCount <= 1 && activeCategoryCount <= 1) {
    reasons.push(
      "ℹ️ Only one distinct hardscape service category matched — more signals needed for higher confidence",
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
  if (data.mode === "hvac")    return renderHvacDashboard(data);
  if (data.mode === "roofing") return renderRoofingDashboard(data);
  if (data.mode === "moving")  return renderMovingDashboard(data);
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

  html += buildReasonsCollapsible(reasons, "💡 Why Classified", "hardscape");
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

  html += buildReasonsCollapsible(reasons, "💡 Why Classified", "hvac");
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

// ── Roofing Dashboard ────────────────────────────────────────────────────────

function renderRoofingDashboard(data) {
  const container = document.getElementById("resultContainer");
  const {
    confidence,
    confidenceLabel,
    roofingCompany,
    catConfidence,
    evidenceMap,
    termFreqMap,
    detectedServices,
    negativeHits,
    reasons,
  } = data;

  const confClass = confidence >= 65 ? "high" : confidence >= 40 ? "medium" : "low";
  const verdictClass = roofingCompany === "YES" ? "yes" : roofingCompany === "NO" ? "no" : "uncertain";
  const verdictIcon = roofingCompany === "YES" ? "\u2705" : roofingCompany === "NO" ? "\u274c" : "\u26a0\ufe0f";

  let html = "";

  // ── Primary roofing card ──
  html += `
    <div class="primary-card roof-card">
      <div class="primary-top">
        <div>
          <div class="primary-meta roof-meta">\ud83c\udfe0 Roofing Detection</div>
          <div class="primary-name">${confidenceLabel}</div>
          <div class="hvac-verdict ${verdictClass}">${verdictIcon} Roofing Company: <strong>${roofingCompany}</strong></div>
        </div>
        <div class="primary-conf ${confClass}">${confidence}%</div>
      </div>
      <div class="primary-reasons">${reasons.slice(0, 2).join(" \u00b7 ")}</div>
    </div>`;

  // ── Detected roofing services chips ──
  if (detectedServices.length > 0) {
    const chips = detectedServices
      .map((s) => `<span class="service-chip" style="background:rgba(239,68,68,0.18);border-color:rgba(239,68,68,0.4);color:#fca5a5;">${s}</span>`)
      .join("");
    html += `
      <div class="detected-services">
        <div class="section-label" style="color:#ef4444;">\ud83c\udfe0 Roofing Services Detected</div>
        <div class="chip-row">${chips}</div>
      </div>`;
  }

  // ── Service category grid ──
  html += `<div class="result-grid three-col">`;
  for (const cat of ROOFING_CATEGORIES) {
    const score = catConfidence[cat.id] || 0;
    const isTop =
      score === Math.max(...ROOFING_CATEGORIES.map((c) => catConfidence[c.id] || 0)) && score > 0;
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

  html += buildReasonsCollapsible(reasons, "\ud83d\udca1 Why Classified", "roof");
  html += buildEvidenceCollapsible(data, ROOFING_CATEGORIES, "roof_replacement", "roof");
  html += buildKeywordsCollapsible(data, ROOFING_CATEGORIES, "roof");

  // ── Negative signals ──
  if (negativeHits.length > 0) {
    const negChips = negativeHits
      .map((n) => `<span class="neg-chip">${n}</span>`)
      .join("");
    html += `
      <div class="negative-section">
        <div class="section-label negative">\u26d4 Penalty Signals Detected (\u2212${negativeHits.length * 10} pts)</div>
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
// MOVING AGGREGATION ENGINE
// ══════════════════════════════════════════════════════════════════════════════

function aggregateMovingFindings(response) {
  const findings = response.findings || [];
  const negativeHits = response.negativeHits || [];

  const scoreMap = {};
  const evidenceMap = {};
  const termFreqMap = {};
  const matchedZones = {};

  for (const cat of MOVING_CATEGORIES) {
    scoreMap[cat.id] = 0;
    evidenceMap[cat.id] = [];
    termFreqMap[cat.id] = {};
    matchedZones[cat.id] = new Set();
  }

  const allKeywordsMatched = new Set();
  const highValueMatched = [];
  const tier1Terms = new Set();
  const tier2Terms = new Set();
  const strongSignalTerms = new Set();
  const prominentZones = new Set([
    "hero-heading", "hero", "h1", "h2", "nav", "meta", "service-section", "cta",
  ]);
  let hasProminentZone = false;

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
    if (f.zone) {
      matchedZones[catId].add(f.zone);
      if (prominentZones.has(f.zone)) hasProminentZone = true;
    }

    if (f.tier === 1) {
      tier1Terms.add(term);
      strongSignalTerms.add(term);
      if (!highValueMatched.includes(f.label || term)) highValueMatched.push(f.label || term);
    } else if (f.tier === 2) {
      tier2Terms.add(term);
      strongSignalTerms.add(term);
      if (!highValueMatched.includes(f.label || term)) highValueMatched.push(f.label || term);
    }
  }

  const strongSignalCount  = strongSignalTerms.size;
  const tier1Count         = tier1Terms.size;
  const hasStrongSignal    = strongSignalCount > 0;

  // Active category requires ≥15 pts (one core service keyword hit)
  const ACTIVE_CAT_THRESHOLD = 15;
  const activeCategoryCount  = MOVING_CATEGORIES.filter(
    (c) => (scoreMap[c.id] || 0) >= ACTIVE_CAT_THRESHOLD,
  ).length;

  const totalPositiveScore = Object.values(scoreMap).reduce((a, b) => a + b, 0);
  const penaltyScore       = negativeHits.length * NEGATIVE_PENALTY;
  const netScore           = Math.max(0, totalPositiveScore - penaltyScore);
  let rawConfidence        = Math.min(100, Math.round((netScore / MOVING_THRESHOLD) * 100));

  // ── Moving-specific strict gates ──────────────────────────────────────────

  // Gate 1: No Tier 1 or Tier 2 signal → cap at 15 ("NO").
  // Generic words like "move", "moving", "relocation" alone can't validate a mover.
  if (!hasStrongSignal && rawConfidence > 15) {
    rawConfidence = 15;
  }

  // Gate 2: Only one distinct strong signal → cap at 28 ("UNCERTAIN").
  // A single keyword like "moving company" is not sufficient — context is required.
  if (strongSignalCount <= 1 && rawConfidence > 28) {
    rawConfidence = 28;
  }

  // Gate 3: Prominent zone required to exceed UNCERTAIN.
  // Genuine movers feature services in H1/H2/Nav/Hero/CTA — not just body text.
  if (!hasProminentZone && rawConfidence > 40) {
    rawConfidence = 40;
  }

  // Gate 4: Qualify for YES (≥60) requires depth.
  // Must have 3+ distinct strong signals, OR 2+ signals with tier1, 2+ active categories, prominent zone.
  const qualifiesForYes =
    strongSignalCount >= 3 ||
    (strongSignalCount >= 2 && tier1Count >= 1 && activeCategoryCount >= 2 && hasProminentZone);
  if (rawConfidence >= 60 && !qualifiesForYes) {
    rawConfidence = 50;
  }

  // Gate 5: High confidence (≥80) requires 4+ strong signals, 2+ active categories, 2+ tier1, prominent zone.
  if (
    rawConfidence >= 80 &&
    (strongSignalCount < 4 || activeCategoryCount < 2 || tier1Count < 2 || !hasProminentZone)
  ) {
    rawConfidence = 75;
  }

  // Gate 6: Hard negative penalty gates — suppress companies that are NOT movers.
  // 2+ negative hits → strong evidence this is a different business type.
  if (negativeHits.length >= 2 && rawConfidence > 35) rawConfidence = 35;
  if (negativeHits.length >= 4 && rawConfidence > 15) rawConfidence = 15;

  const confidence = Math.max(0, rawConfidence);

  // Moving company verdict
  let movingCompany;
  if (confidence >= 60)      movingCompany = "YES";
  else if (confidence >= 25) movingCompany = "UNCERTAIN";
  else                       movingCompany = "NO";

  // Confidence label
  let confidenceLabel;
  if (confidence >= 95)      confidenceLabel = "Very Strong Moving Company Evidence";
  else if (confidence >= 80) confidenceLabel = "Strong Moving Company Evidence";
  else if (confidence >= 60) confidenceLabel = "Moderate Moving Company Evidence";
  else if (confidence >= 40) confidenceLabel = "Weak / Uncertain";
  else                       confidenceLabel = "Probably Not a Moving Company";

  const catConfidence = {};
  for (const cat of MOVING_CATEGORIES) {
    const s = scoreMap[cat.id];
    catConfidence[cat.id] =
      s === 0 ? 0
              : Math.min(100, Math.round((s / (MOVING_THRESHOLD / MOVING_CATEGORIES.length)) * 100));
  }

  const detectedServices = highValueMatched.slice(0, 24);
  const reasons = buildMovingReasons(
    confidence, scoreMap, matchedZones, negativeHits, detectedServices,
    catConfidence, hasStrongSignal, strongSignalCount, tier1Count,
    activeCategoryCount, hasProminentZone,
  );

  return {
    mode: "moving",
    confidence,
    confidenceLabel,
    movingCompany,
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
  };
}

function buildMovingReasons(
  confidence, scoreMap, matchedZones, negativeHits, detectedServices,
  catConfidence, hasStrongSignal, strongSignalCount, tier1Count,
  activeCategoryCount, hasProminentZone,
) {
  const reasons = [];

  if (confidence === 0) {
    reasons.push("❌ No moving company signals detected on this page.");
    return reasons;
  }

  if (confidence >= 80) {
    reasons.push("✅ Genuine moving company — strong multi-service evidence confirmed across key zones");
  } else if (confidence >= 60) {
    reasons.push("🔶 Likely moving company — solid dedicated service evidence confirmed");
  } else if (confidence >= 25) {
    reasons.push("🔸 Possible moving involvement — moderate or isolated signals detected");
  } else {
    reasons.push("⚠️ Weak moving presence — low-tier, ancillary, or incidental terminology only");
  }

  // Explain when strict gates suppressed the score
  if (!hasStrongSignal) {
    reasons.push("⚠️ No dedicated moving service terms found — only generic words like \"move\" or \"relocation\" detected");
  } else if (strongSignalCount <= 1) {
    reasons.push("ℹ️ Only one distinct moving term matched — multiple service signals required for confirmation");
  } else if (!hasProminentZone) {
    reasons.push("⚠️ Moving terms appear only in body/secondary text — not featured in navigation, headings, or service sections");
  } else if (confidence < 60 && strongSignalCount < 3) {
    reasons.push("ℹ️ Limited service breadth — additional dedicated moving services needed for full confirmation");
  }

  const allZones = new Set(Object.values(matchedZones).flat());
  if (allZones.has("hero-heading") || allZones.has("h1"))
    reasons.push("🎯 Moving keywords found in hero heading / H1");
  if (allZones.has("nav"))
    reasons.push("📍 Moving services listed in navigation menu");
  if (allZones.has("service-section"))
    reasons.push("📋 Dedicated moving services section detected");
  if (allZones.has("meta"))
    reasons.push("🔍 Moving keywords in page title or meta description");
  if (allZones.has("cta"))
    reasons.push("📣 Moving call-to-action buttons present");
  if (allZones.has("structured-data"))
    reasons.push("🗂️ Moving signals found in structured data (JSON-LD)");

  const topCats = MOVING_CATEGORIES.filter((c) => catConfidence[c.id] >= 25);
  if (topCats.length > 0) {
    reasons.push("🏆 Services confirmed: " + topCats.map((c) => c.label).join(", "));
  }

  if (negativeHits.length > 0) {
    reasons.push(`⛔ Penalty signals: ${negativeHits.slice(0, 3).join(", ")}${negativeHits.length > 3 ? ` +${negativeHits.length - 3} more` : ""}`);
  }

  return reasons;
}

// ── Moving Dashboard ─────────────────────────────────────────────────────────

function renderMovingDashboard(data) {
  const container = document.getElementById("resultContainer");
  const {
    confidence,
    confidenceLabel,
    movingCompany,
    catConfidence,
    evidenceMap,
    termFreqMap,
    detectedServices,
    negativeHits,
    reasons,
  } = data;

  const confClass    = confidence >= 65 ? "high" : confidence >= 40 ? "medium" : "low";
  const verdictClass = movingCompany === "YES" ? "yes" : movingCompany === "NO" ? "no" : "uncertain";
  const verdictIcon  = movingCompany === "YES" ? "✅" : movingCompany === "NO" ? "❌" : "⚠️";

  let html = "";

  // ── Primary moving card ──
  html += `
    <div class="primary-card moving-card">
      <div class="primary-top">
        <div>
          <div class="primary-meta moving-meta">🚛 Moving Detection</div>
          <div class="primary-name">${confidenceLabel}</div>
          <div class="hvac-verdict ${verdictClass}">${verdictIcon} Moving Company: <strong>${movingCompany}</strong></div>
        </div>
        <div class="primary-conf ${confClass}">${confidence}%</div>
      </div>
      <div class="primary-reasons">${reasons.slice(0, 2).join(" · ")}</div>
    </div>`;

  // ── Detected moving services chips ──
  if (detectedServices.length > 0) {
    const chips = detectedServices
      .map((s) => `<span class="service-chip" style="background:rgba(139,92,246,0.18);border-color:rgba(139,92,246,0.4);color:#c4b5fd;">${s}</span>`)
      .join("");
    html += `
      <div class="detected-services">
        <div class="section-label" style="color:#8b5cf6;">🚛 Moving Services Detected</div>
        <div class="chip-row">${chips}</div>
      </div>`;
  }

  // ── Service category grid ──
  html += `<div class="result-grid three-col">`;
  for (const cat of MOVING_CATEGORIES) {
    const score = catConfidence[cat.id] || 0;
    const isTop =
      score === Math.max(...MOVING_CATEGORIES.map((c) => catConfidence[c.id] || 0)) && score > 0;
    html += `
      <div class="service-card" style="${isTop ? "border-color:#8b5cf6;box-shadow:0 0 0 1px rgba(139,92,246,0.18);" : ""}">
        <div class="service-icon">${cat.icon}</div>
        <div class="service-name">${cat.label}</div>
        <div class="service-score" style="color:${cat.color}">${score}%</div>
        <div class="bar-bg"><div class="bar-fill" style="width:${score}%;background:${cat.color}"></div></div>
        <div class="service-matches">${evidenceMap[cat.id]?.length || 0} hit${(evidenceMap[cat.id]?.length || 0) !== 1 ? "s" : ""}</div>
      </div>`;
  }
  html += `</div>`;

  html += buildReasonsCollapsible(reasons, "💡 Why Classified", "moving");
  html += buildEvidenceCollapsible(data, MOVING_CATEGORIES, "moving_company", "moving");
  html += buildKeywordsCollapsible(data, MOVING_CATEGORIES, "moving");

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

// ══════════════════════════════════════════════════════════════════════════════
// SHARED HTML BUILDERS
// ══════════════════════════════════════════════════════════════════════════════

function buildReasonsCollapsible(reasons, title, modeClass) {
  if (!reasons || reasons.length === 0) return "";
  const reasonsHtml = reasons
    .map((r) => `<div class="reason-item">${r}</div>`)
    .join("");
  const badgeClass = modeClass === "hvac" ? "why-loc-badge hvac-badge" : "why-loc-badge";
  return `
    <div class="collapsible open" id="whySection">
      <div class="collapsible-header">
        <span class="collapsible-title">${title} <span class="collapsible-count">${reasons.length}</span></span>
        <span class="collapsible-arrow">▼</span>
      </div>
      <div class="collapsible-body">
        <div class="${badgeClass}" id="whySectionLocBadge">
          <div class="why-loc-badge-item">
            <span class="why-loc-badge-label">🗺️ State</span>
            <span class="why-loc-badge-val loading" id="whyLocState">detecting…</span>
          </div>
          <span class="why-loc-sep">|</span>
          <div class="why-loc-badge-item">
            <span class="why-loc-badge-label">📍 City</span>
            <span class="why-loc-badge-val loading" id="whyLocCity">detecting…</span>
          </div>
        </div>
        ${reasonsHtml}
      </div>
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
  } else if (mode === "roofing") {
    copyPrimaryBtn.className = "btn-action";
    copyPrimaryBtn.style.cssText = "background:rgba(239,68,68,0.18);border-color:rgba(239,68,68,0.45);color:#ef4444;";
    copyPrimaryBtn.textContent = "📋 Copy Roofing Score";
  } else {
    copyPrimaryBtn.className = "btn-action amber";
    copyPrimaryBtn.style.cssText = "";
    copyPrimaryBtn.textContent = "📋 Copy Score";
  }
}

function copyPrimary() {
  if (!currentScanData) return;
  const d = currentScanData;
  const conf = d.confidence || 0;

  let text;
  if (d.mode === "hvac") {
    text = `HVAC Company: ${d.hvacCompany} \u2014 Confidence: ${conf}% \u2014 ${d.confidenceLabel}`;
  } else if (d.mode === "roofing") {
    const label =
      conf >= 75 ? "Genuine Roofing Contractor"
      : conf >= 45 ? "Likely Roofing Company"
      : conf >= 20 ? "Possible Roofing Work"
      : "Not a Roofing Company";
    text = `${label} \u2014 ${conf}%`;
  } else {
    const label =
      conf >= 75
        ? "Genuine Hardscape Contractor"
        : conf >= 45
          ? "Likely Hardscape Contractor"
          : conf >= 20
            ? "Possible Hardscape Work"
            : "Not a Hardscape Company";
    text = `${label} \u2014 ${conf}%`;
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
  const categories = d.mode === "hvac" ? HVAC_CATEGORIES
    : d.mode === "roofing" ? ROOFING_CATEGORIES
    : HS_CATEGORIES;

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
    text += `Net Score        : ${d.netScore || 0} pts\n`;
    if (currentLocationData) {
      text += `Company City     : ${currentLocationData.primaryCity || "Not detected"}\n`;
      text += `Company State    : ${currentLocationData.primaryState || "Not detected"}\n`;
      text += `Location Conf.   : ${currentLocationData.confidence || "none"}\n`;
    }
    text += `\n`;

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
        text += `  \ud83d\udccc ${s}\n`;
      });
    }
  } else if (d.mode === "roofing") {
    const label =
      conf >= 75 ? "Genuine Roofing Contractor"
      : conf >= 45 ? "Likely Roofing Company"
      : conf >= 20 ? "Possible Roofing Work"
      : "Not a Roofing Company";

    text += `ROOFING COMPANY FINDER REPORT\n`;
    text += `====================================\n\n`;
    text += `Company Website : ${domain || "Unknown"}\n`;
    text += `Full URL        : ${d.pages?.[0]?.url || "N/A"}\n`;
    text += `Detection Mode  : Roofing\n`;
    text += `Confidence Score: ${conf}% \u2014 ${label}\n`;
    text += `Positive Score  : ${d.totalPositiveScore || 0} pts\n`;
    text += `Penalty Score   : \u2212${d.penaltyScore || 0} pts\n`;
    text += `Net Score       : ${d.netScore || 0} pts\n`;
    if (currentLocationData) {
      text += `Company City    : ${currentLocationData.primaryCity || "Not detected"}\n`;
      text += `Company State   : ${currentLocationData.primaryState || "Not detected"}\n`;
      text += `Location Conf.  : ${currentLocationData.confidence || "none"}\n`;
    }
    text += `\n`;

    text += `ROOFING SERVICES DETECTED:\n`;
    if (d.detectedServices && d.detectedServices.length > 0) {
      d.detectedServices.forEach((s) => {
        text += `  \u2022 ${s}\n`;
      });
    } else {
      text += "  (none detected)\n";
    }

    text += `\nSERVICE CATEGORY BREAKDOWN:\n`;
    for (const cat of ROOFING_CATEGORIES) {
      text += `  ${cat.icon} ${cat.label}: ${d.catConfidence?.[cat.id] || 0}%\n`;
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
    text += `Net Score       : ${d.netScore || 0} pts\n`;
    if (currentLocationData) {
      text += `Company City    : ${currentLocationData.primaryCity || "Not detected"}\n`;
      text += `Company State   : ${currentLocationData.primaryState || "Not detected"}\n`;
      text += `Location Conf.  : ${currentLocationData.confidence || "none"}\n`;
    }
    text += `\n`;

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

  const categories =
    data.mode === "hvac"
      ? HVAC_CATEGORIES
      : data.mode === "roofing"
      ? ROOFING_CATEGORIES
      : HS_CATEGORIES;
  const threshold =
    data.mode === "hvac"
      ? HVAC_THRESHOLD
      : data.mode === "roofing"
      ? ROOFING_THRESHOLD
      : HS_THRESHOLD;

  const catLines = categories
    .map(
      (cat) =>
        `${cat.icon} ${cat.label}: ${data.scoreMap?.[cat.id] || 0} pts → ${data.catConfidence?.[cat.id] || 0}%`,
    )
    .join("<br>");

  body.innerHTML = `
    <div class="debug-row"><strong>Mode:</strong> ${data.mode === "hvac" ? "🌡️ HVAC" : data.mode === "roofing" ? "🏠 Roofing" : "🧱 Hardscaping"}</div>
    <div class="debug-row"><strong>Nodes:</strong> ${data.totalNodes || 0}</div>
    <div class="debug-row"><strong>Text:</strong> ${(data.totalText || 0).toLocaleString()} chars</div>
    <div class="debug-row"><strong>Hits:</strong> ${data.totalHits || 0}</div>
    <div class="debug-row"><strong>Scan time:</strong> ${data.scanTime || "?"}ms</div>
    <div class="debug-row"><strong>Positive score:</strong> ${data.totalPositiveScore || 0} pts</div>
    <div class="debug-row"><strong>Penalty score:</strong> −${data.penaltyScore || 0} pts (${data.negativeHits?.length || 0} signals)</div>
    <div class="debug-row"><strong>Net score:</strong> ${data.netScore || 0} pts → ${data.confidence || 0}%</div>
    <div class="debug-row"><strong>Threshold:</strong> ${threshold} pts = 100%</div>
    ${data.mode === "hvac" ? `<div class="debug-row"><strong>HVAC Company:</strong> ${data.hvacCompany || "?"}</div>` : data.mode === "roofing" ? `<div class="debug-row"><strong>Roofing Company:</strong> ${data.roofingCompany || "?"}</div>` : ""}
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
  if (!bar || !fill) return;
  if (fill._interval) {
    clearInterval(fill._interval);
    fill._interval = null;
  }
  if (active) {
    bar.classList.add("active");
    let w = 0;
    fill._interval = setInterval(() => {
      w = (w + 3) % 100;
      fill.style.width = w + "%";
    }, 35);
  } else {
    bar.classList.remove("active");
    fill.style.width = "0%";
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

  const categories =
    mode === "hvac"    ? HVAC_CATEGORIES
    : mode === "roofing" ? ROOFING_CATEGORIES
    : mode === "moving"  ? MOVING_CATEGORIES
    : HS_CATEGORIES;
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

// ══════════════════════════════════════════════════════════════════════════════
// LOCATION EXTRACTION — City & State Detection
// ══════════════════════════════════════════════════════════════════════════════

// Stores last extracted location so copyAll() can include it
let currentLocationData = null;

async function extractAndRenderLocation(tabId) {
  const section = document.getElementById("locationSection");
  if (!section) return;

  // Show loading state immediately
  section.innerHTML = buildLocationCardHtml({ loading: true });
  section.classList.remove("hidden");

  try {
    // Ensure content script is injected
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ["content.js"],
      });
    } catch (_) { /* Already injected */ }

    const locationData = await new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(
        tabId,
        { action: "extractLocation" },
        (res) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(res);
          }
        }
      );
    });

    currentLocationData = locationData || null;
    section.innerHTML = buildLocationCardHtml(locationData || { confidence: "none" });
    wireLocationCopyHandlers(section);
    updateWhyLocBadge(locationData);

  } catch (e) {
    console.warn("[Popup] Location extraction failed:", e.message);
    currentLocationData = null;
    section.innerHTML = buildLocationCardHtml({ confidence: "none", error: e.message });
    wireLocationCopyHandlers(section);
    updateWhyLocBadge(null);
  }
}

// ── Update State/City badge inside WHY CLASSIFIED box ────────────────────────

function updateWhyLocBadge(locationData) {
  const stateEl = document.getElementById("whyLocState");
  const cityEl  = document.getElementById("whyLocCity");
  if (!stateEl || !cityEl) return; // WHY CLASSIFIED box not rendered (no reasons)

  const state = locationData && locationData.primaryState ? locationData.primaryState : null;
  const city  = locationData && locationData.primaryCity  ? locationData.primaryCity  : null;

  stateEl.textContent = state || "Not detected";
  stateEl.classList.toggle("loading", !state);

  cityEl.textContent = city || "Not detected";
  cityEl.classList.toggle("loading", !city);
}

// ── Build the location card HTML ──────────────────────────────────────────────

function buildLocationCardHtml(data) {
  if (data.loading) {
    return `<div class="location-card">
      <div class="location-label">📍 Company Location</div>
      <div style="font-size:10px;color:var(--text-dim);text-align:center;padding:4px 0;">Detecting location…</div>
    </div>`;
  }

  const city       = data.primaryCity  || null;
  const state      = data.primaryState || null;
  const confidence = data.confidence   || "none";
  const others     = (data.otherLocations || []).filter(o => o.city && o.state);
  const signals    = data.signals || [];

  const confLabels = { high: "High", medium: "Medium", low: "Low", none: "Not Detected" };
  const confLabel  = confLabels[confidence] || "Unknown";

  // ── City field ──
  const cityHtml = city
    ? `<span class="location-value" data-loc-copy="${escLoc(city)}" title="Click to copy city">${escHtml(city)}</span>
       <span class="loc-copy-icon" data-loc-copy="${escLoc(city)}" title="Copy city">📋</span>`
    : `<span class="location-value not-detected">Not detected</span>`;

  // ── State field ──
  const stateHtml = state
    ? `<span class="location-value" data-loc-copy="${escLoc(state)}" title="Click to copy state">${escHtml(state)}</span>
       <span class="loc-copy-icon" data-loc-copy="${escLoc(state)}" title="Copy state">📋</span>`
    : `<span class="location-value not-detected">Not detected</span>`;

  // ── Other locations ──
  let othersHtml = "";
  if (others.length > 0) {
    const rows = others.slice(0, 5).map(o => `
      <div class="location-other-row">
        <span class="loc-other-city" data-loc-copy="${escLoc(o.city)}" title="Copy city">${escHtml(o.city)}</span>
        <span class="loc-sep">|</span>
        <span class="loc-other-state" data-loc-copy="${escLoc(o.state)}" title="Copy state">${escHtml(o.state)}</span>
        <span class="loc-other-copy" data-loc-copy="${escLoc(o.city)}" title="Copy city">📋</span>
        <span class="loc-other-copy" data-loc-copy="${escLoc(o.state)}" title="Copy state">📋</span>
      </div>`).join("");
    othersHtml = `
      <div class="location-others">
        <div class="location-others-label">Other Physical Locations</div>
        ${rows}
      </div>`;
  }

  // ── Source signals hint ──
  let signalsHtml = "";
  if (signals.length > 0 && confidence !== "none") {
    const srcLabels = [...new Set(signals)].slice(0, 3).map(s => s.replace(/-/g, " ")).join(", ");
    signalsHtml = `<div class="loc-signals">📡 Sources: ${escHtml(srcLabels)}</div>`;
  } else if (confidence === "none") {
    signalsHtml = `<div class="loc-signals">No physical address found on this page.</div>`;
  }

  return `
    <div class="location-card" id="locationCard">
      <div class="location-label">
        📍 Company Location
        <span class="loc-confidence ${confidence}">${confLabel}</span>
      </div>
      <div class="location-primary-row">
        <div class="location-field">
          <div class="location-field-label">City</div>
          <div class="location-value-wrap">${cityHtml}</div>
        </div>
        <div class="location-field">
          <div class="location-field-label">State</div>
          <div class="location-value-wrap">${stateHtml}</div>
        </div>
      </div>
      ${othersHtml}
      ${signalsHtml}
      <div class="loc-toast" id="locToast">Copied!</div>
    </div>`;
}

// ── Wire click-to-copy handlers on all [data-loc-copy] elements ───────────────

function wireLocationCopyHandlers(container) {
  container.querySelectorAll("[data-loc-copy]").forEach(el => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      const value = el.getAttribute("data-loc-copy");
      if (!value) return;
      copyLocationValue(value, container);
    });
  });
}

// ── Copy a location value and show toast ─────────────────────────────────────

let _locToastTimer = null;

function copyLocationValue(value, containerEl) {
  navigator.clipboard.writeText(value).then(() => {
    const toast = containerEl.querySelector("#locToast");
    if (toast) {
      toast.textContent = `"${value}" copied!`;
      toast.classList.add("show");
      if (_locToastTimer) clearTimeout(_locToastTimer);
      _locToastTimer = setTimeout(() => {
        toast.classList.remove("show");
      }, 1600);
    }
  }).catch(err => {
    console.warn("[Popup] Location copy failed:", err);
  });
}

// ── HTML escape helpers ───────────────────────────────────────────────────────

function escHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escLoc(str) {
  if (!str) return "";
  return String(str).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// ══════════════════════════════════════════════════════════════════════════════
// COMPETITOR FINDER MODULE (v5.2 - Single Row & Bulk Mode with Google Sheets API)
// ══════════════════════════════════════════════════════════════════════════════

let compActiveSubMode = "single"; // "single" | "bulk"
let googleAuthState = {
  token: null,
  user: null,
  isConnected: false
};
let availableWorksheets = [];
let selectedWorksheetTitle = "";
let bulkProcessingState = {
  isRunning: false,
  isCancelled: false,
  startRow: 1,
  endRow: 50,
  results: [],
  stats: { total: 0, found: 0, empty: 0, failed: 0 }
};

async function initCompetitorFinder() {
  setStatus("Competitor Finder");
  const sheetStatusEl = document.getElementById("compSheetStatus");
  const sheetNameEl   = document.getElementById("compSheetNameTitle");
  const bulkSheetEl   = document.getElementById("compBulkSheetNameTitle");
  const gidBadgeEl    = document.getElementById("compGidBadge");
  const bulkGidBadgeEl= document.getElementById("compBulkGidBadge");

  if (sheetStatusEl) sheetStatusEl.textContent = "Connecting…";

  // 1. Initialize Google OAuth status
  await checkGoogleAuthStatus();

  // 2. Load Redirect URI for settings box
  chrome.runtime.sendMessage({ action: "getRedirectUri" }, (res) => {
    const uriEl = document.getElementById("compRedirectUriText");
    if (uriEl && res && res.redirectUri) uriEl.textContent = res.redirectUri;
  });

  // 3. Load saved custom Client ID, Token, and Webhook into settings
  chrome.storage.local.get(["googleOAuthClientId", "googleAppsScriptWebhook"], (res) => {
    const idInput = document.getElementById("compCustomClientIdInput");
    const whInput = document.getElementById("compWebhookUrlInput");
    if (idInput && res.googleOAuthClientId) idInput.value = res.googleOAuthClientId;
    if (whInput && res.googleAppsScriptWebhook) whInput.value = res.googleAppsScriptWebhook;
  });

  // 4. Detect open Google Sheet tab
  try {
    const sheetTab = await detectGoogleSheetTab();
    if (sheetTab) {
      currentSheetInfo = {
        tabId: sheetTab.id,
        url: sheetTab.url,
        title: (sheetTab.title || "Google Sheet").replace(/\s*-\s*Google Sheets$/i, ""),
        spreadsheetId: extractSpreadsheetId(sheetTab.url),
        gid: extractGid(sheetTab.url)
      };

      if (sheetStatusEl) {
        sheetStatusEl.textContent = "Connected";
        sheetStatusEl.style.color = "#3fb950";
        sheetStatusEl.style.borderColor = "rgba(63,185,80,0.4)";
        sheetStatusEl.style.background = "rgba(63,185,80,0.15)";
      }
      if (sheetNameEl) sheetNameEl.textContent = currentSheetInfo.title;
      if (bulkSheetEl) bulkSheetEl.textContent = currentSheetInfo.title;
      if (gidBadgeEl)  gidBadgeEl.textContent  = `gid: ${currentSheetInfo.gid}`;
      if (bulkGidBadgeEl) bulkGidBadgeEl.textContent = `gid: ${currentSheetInfo.gid}`;

      // 5. Load worksheet tabs & sheet rows
      if (googleAuthState.isConnected && currentSheetInfo.spreadsheetId) {
        await loadSpreadsheetWorksheets(currentSheetInfo.spreadsheetId);
      }
      await readActiveSheetRow(true);
    } else {
      currentSheetInfo = null;
      if (sheetStatusEl) {
        sheetStatusEl.textContent = "No Sheet Open";
        sheetStatusEl.style.color = "#d29922";
        sheetStatusEl.style.borderColor = "rgba(210,153,34,0.4)";
        sheetStatusEl.style.background = "rgba(210,153,34,0.15)";
      }
      if (sheetNameEl) sheetNameEl.textContent = "Please focus your Google Sheet tab";
      if (bulkSheetEl) bulkSheetEl.textContent = "Please focus your Google Sheet tab";
      if (gidBadgeEl)  gidBadgeEl.textContent  = "gid: —";
      if (bulkGidBadgeEl) bulkGidBadgeEl.textContent = "gid: —";

      loadSheetRowsAndDisplay(activeRowNumber);
    }
  } catch (err) {
    console.error("[Competitor] init error:", err);
    if (sheetStatusEl) sheetStatusEl.textContent = "Error";
  }
}

// ── Google OAuth, Token & Settings Management ──

async function checkGoogleAuthStatus() {
  const btn = document.getElementById("compGoogleAuthBtn");
  const res = await new Promise((r) => chrome.runtime.sendMessage({ action: "googleAuthGetToken", interactive: false }, r));

  if (res && res.success && res.token) {
    googleAuthState.token = res.token;
    googleAuthState.isConnected = true;

    // Fetch user profile
    const userRes = await new Promise((r) => chrome.runtime.sendMessage({ action: "googleAuthGetUserInfo", token: res.token }, r));
    if (userRes && userRes.success && userRes.user) {
      googleAuthState.user = userRes.user;
      if (btn) {
        btn.textContent = `🟢 ${userRes.user.email ? userRes.user.email.split("@")[0] : "Connected"}`;
        btn.title = `Connected as ${userRes.user.email} (Click to sign out)`;
        btn.classList.add("connected");
      }
    } else {
      if (btn) {
        btn.textContent = "🟢 Connected";
        btn.classList.add("connected");
      }
    }
  } else {
    googleAuthState.token = null;
    googleAuthState.user = null;
    googleAuthState.isConnected = false;
    if (btn) {
      btn.textContent = "👤 Sign in";
      btn.title = "Sign in with Google to enable direct saving & sheet editing";
      btn.classList.remove("connected");
    }
  }
}

async function handleGoogleAuthClick() {
  const btn = document.getElementById("compGoogleAuthBtn");

  if (googleAuthState.isConnected) {
    const email = googleAuthState.user ? googleAuthState.user.email : "your Google account";
    const proceed = confirm(`Currently connected as: ${email}\n\nDo you want to sign out or switch accounts?`);
    if (proceed) {
      if (btn) btn.textContent = "⏳ Signing out…";
      await new Promise((r) => chrome.runtime.sendMessage({ action: "googleAuthSignOut", token: googleAuthState.token }, r));
      await checkGoogleAuthStatus();
      return;
    }
  }

  // Check if client ID is set
  const savedClientId = await new Promise((r) => chrome.storage.local.get(["googleOAuthClientId"], (res) => r(res.googleOAuthClientId)));
  if (!savedClientId) {
    toggleCompSettings(true);
    alert("Please enter your Google Cloud OAuth Client ID (or paste an Access Token) in the settings panel below to connect.");
    return;
  }

  if (btn) btn.textContent = "⏳ Connecting…";
  try {
    const res = await new Promise((r) => chrome.runtime.sendMessage({ action: "googleAuthGetToken", interactive: true }, r));
    if (res && res.success && res.token) {
      await checkGoogleAuthStatus();
      if (currentSheetInfo && currentSheetInfo.spreadsheetId) {
        await loadSpreadsheetWorksheets(currentSheetInfo.spreadsheetId);
        await readActiveSheetRow(true);
      }
    } else {
      alert("Google Sign-In Error: " + (res ? res.error : "Failed to sign in."));
      await checkGoogleAuthStatus();
    }
  } catch (err) {
    alert("Google Sign-In Error: " + err.message);
    await checkGoogleAuthStatus();
  }
}

function toggleCompSettings(forceOpen = null) {
  const box = document.getElementById("compSettingsBox");
  if (!box) return;
  if (forceOpen === true) box.classList.remove("hidden");
  else if (forceOpen === false) box.classList.add("hidden");
  else box.classList.toggle("hidden");
}

async function saveCustomClientId() {
  const input = document.getElementById("compCustomClientIdInput");
  const msg = document.getElementById("compClientIdSavedMsg");
  const val = (input ? input.value : "").trim();

  await new Promise((r) => chrome.storage.local.set({ googleOAuthClientId: val }, r));
  if (msg) {
    msg.textContent = "✅ Saved!";
    setTimeout(() => { if (msg) msg.textContent = ""; }, 2000);
  }

  // Automatically start auth flow if ID provided
  if (val) {
    await handleGoogleAuthClick();
  }
}

async function connectDirectAccessToken() {
  const input = document.getElementById("compDirectTokenInput");
  const msg = document.getElementById("compDirectTokenMsg");
  const token = (input ? input.value : "").trim();

  if (!token) {
    if (msg) msg.textContent = "⚠️ Please paste a token.";
    return;
  }

  if (msg) msg.textContent = "⏳ Verifying token…";

  try {
    // Validate token by fetching user profile
    const userRes = await new Promise((r) => chrome.runtime.sendMessage({ action: "googleAuthGetUserInfo", token }, r));
    if (userRes && userRes.success && userRes.user) {
      await new Promise((r) => chrome.storage.local.set({
        googleAuthToken: token,
        googleAuthTokenExpiry: Date.now() + (3600 * 1000)
      }, r));

      if (msg) {
        msg.textContent = `✅ Connected as ${userRes.user.email}!`;
        msg.style.color = "#3fb950";
      }
      await checkGoogleAuthStatus();
      if (currentSheetInfo && currentSheetInfo.spreadsheetId) {
        await loadSpreadsheetWorksheets(currentSheetInfo.spreadsheetId);
        await readActiveSheetRow(true);
      }
    } else {
      if (msg) {
        msg.textContent = "❌ Invalid or expired token.";
        msg.style.color = "#f85149";
      }
    }
  } catch (err) {
    if (msg) {
      msg.textContent = "❌ Error: " + err.message;
      msg.style.color = "#f85149";
    }
  }
}

async function saveWebhookUrl() {
  const input = document.getElementById("compWebhookUrlInput");
  const msg = document.getElementById("compWebhookSavedMsg");
  const val = (input ? input.value : "").trim();

  await new Promise((r) => chrome.storage.local.set({ googleAppsScriptWebhook: val }, r));
  if (msg) {
    msg.textContent = "✅ Webhook Saved!";
    setTimeout(() => { if (msg) msg.textContent = ""; }, 2000);
  }
}

function copyRedirectUri() {
  const uriEl = document.getElementById("compRedirectUriText");
  const uri = uriEl ? uriEl.textContent : chrome.identity.getRedirectURL();
  navigator.clipboard.writeText(uri).then(() => {
    const btn = document.getElementById("compCopyRedirectUriBtn");
    if (btn) {
      btn.textContent = "✅ Copied!";
      setTimeout(() => { btn.textContent = "📋 Copy"; }, 1500);
    }
  });
}

// ── Worksheet Selection & Metadata ──

async function loadSpreadsheetWorksheets(spreadsheetId) {
  const select = document.getElementById("compWorksheetSelect");
  if (!select || !spreadsheetId) return;

  try {
    const res = await new Promise((r) => {
      chrome.runtime.sendMessage({ action: "sheetsApiGetMetadata", spreadsheetId }, r);
    });

    if (res && res.success && Array.isArray(res.sheets) && res.sheets.length > 0) {
      availableWorksheets = res.sheets;
      select.innerHTML = "";

      let matchedIndex = 0;
      availableWorksheets.forEach((sh, idx) => {
        const opt = document.createElement("option");
        opt.value = sh.title;
        opt.textContent = `${sh.title} (${sh.rowCount} rows)`;
        select.appendChild(opt);

        if (currentSheetInfo && String(sh.sheetId) === String(currentSheetInfo.gid)) {
          matchedIndex = idx;
        }
      });

      select.selectedIndex = matchedIndex;
      selectedWorksheetTitle = availableWorksheets[matchedIndex] ? availableWorksheets[matchedIndex].title : "";
    }
  } catch (err) {
    console.warn("[Competitor] loadSpreadsheetWorksheets error:", err);
  }
}

function onWorksheetSelected() {
  const select = document.getElementById("compWorksheetSelect");
  if (!select) return;
  selectedWorksheetTitle = select.value;
  readActiveSheetRow(true);
}

async function refreshCompetitorSheet(force = true) {
  const btn = document.getElementById("compRefreshSheetBtn");
  if (btn) btn.textContent = "⏳";
  await initCompetitorFinder();
  if (btn) {
    btn.textContent = "✅";
    setTimeout(() => { if (btn) btn.textContent = "🔄"; }, 1200);
  }
}

// ── Sub-Mode Navigation (Single Row vs Bulk Mode) ──

function setCompSubMode(subMode) {
  compActiveSubMode = subMode;
  const singleBtn = document.getElementById("compSubSingleBtn");
  const bulkBtn   = document.getElementById("compSubBulkBtn");
  const singleWrap= document.getElementById("compSingleModeWrap");
  const bulkWrap  = document.getElementById("compBulkModeWrap");

  if (subMode === "bulk") {
    if (singleBtn) singleBtn.classList.remove("active");
    if (bulkBtn)   bulkBtn.classList.add("active");
    if (singleWrap) singleWrap.classList.add("hidden");
    if (bulkWrap)   bulkWrap.classList.remove("hidden");

    // Sync sheet info to bulk card
    const bulkSheetEl = document.getElementById("compBulkSheetNameTitle");
    const bulkGidBadgeEl = document.getElementById("compBulkGidBadge");
    if (bulkSheetEl && currentSheetInfo) bulkSheetEl.textContent = currentSheetInfo.title;
    if (bulkGidBadgeEl && currentSheetInfo) bulkGidBadgeEl.textContent = `gid: ${currentSheetInfo.gid}`;
  } else {
    if (singleBtn) singleBtn.classList.add("active");
    if (bulkBtn)   bulkBtn.classList.remove("active");
    if (singleWrap) singleWrap.classList.remove("hidden");
    if (bulkWrap)   bulkWrap.classList.add("hidden");
  }
}

// ── Tab & Row Detection ──

async function detectGoogleSheetTab() {
  // 1. Check current active tab
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (activeTab && activeTab.url && activeTab.url.includes("docs.google.com/spreadsheets")) {
    return activeTab;
  }

  // 2. Otherwise search all open tabs for any Google Sheet
  const sheetTabs = await chrome.tabs.query({ url: "*://docs.google.com/spreadsheets/*" });
  if (sheetTabs && sheetTabs.length > 0) {
    return sheetTabs[0];
  }

  return null;
}

function extractSpreadsheetId(url) {
  if (!url) return null;
  const m = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return m ? m[1] : null;
}

function extractGid(url) {
  if (!url) return "0";
  const m = url.match(/gid=(\d+)/);
  return m ? m[1] : "0";
}

// Helper: Parse Google Visualization JSON table into 2D Array
function parseGvizData(gvizJson) {
  if (!gvizJson || !gvizJson.table || !Array.isArray(gvizJson.table.rows)) return [];
  const rows = [];
  
  // Header row from cols
  if (Array.isArray(gvizJson.table.cols)) {
    const headers = gvizJson.table.cols.map(c => (c && c.label != null ? String(c.label) : ""));
    rows.push(headers);
  }

  for (const r of gvizJson.table.rows) {
    if (!r || !Array.isArray(r.c)) {
      rows.push([]);
      continue;
    }
    const rowVals = r.c.map(cell => {
      if (!cell) return "";
      if (cell.v !== null && cell.v !== undefined) return String(cell.v);
      if (cell.f !== null && cell.f !== undefined) return String(cell.f);
      return "";
    });
    rows.push(rowVals);
  }
  return rows;
}

// Helper: Parse CSV text into 2D Array
function parseCSV(text) {
  if (!text) return [];
  const lines = [];
  let row = [];
  let inQuotes = false;
  let currentVal = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentVal += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(currentVal);
      currentVal = "";
    } else if ((char === "\r" || char === "\n") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") i++;
      row.push(currentVal);
      lines.push(row);
      row = [];
      currentVal = "";
    } else {
      currentVal += char;
    }
  }

  if (currentVal || row.length > 0) {
    row.push(currentVal);
    lines.push(row);
  }

  return lines;
}

async function readActiveSheetRow(forceFetchSheet = false) {
  showProgress(true);
  try {
    const sheetTab = await detectGoogleSheetTab();
    if (!sheetTab || !sheetTab.id) {
      loadSheetRowsAndDisplay(activeRowNumber);
      return;
    }

    currentSheetInfo = {
      tabId: sheetTab.id,
      url: sheetTab.url,
      title: (sheetTab.title || "Google Sheet").replace(/\s*-\s*Google Sheets$/i, ""),
      spreadsheetId: extractSpreadsheetId(sheetTab.url),
      gid: extractGid(sheetTab.url)
    };

    if (forceFetchSheet || currentSheetRows.length === 0) {
      let fetched = false;

      // Method 1: Same-origin fetch inside the open Google Sheet tab (Has active user session!)
      try {
        const tabRes = await chrome.scripting.executeScript({
          target: { tabId: sheetTab.id },
          func: (spreadsheetId, gid) => {
            const gvizUrl = `/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&gid=${gid}`;
            return fetch(gvizUrl, { credentials: "include" })
              .then((r) => r.text())
              .catch(() => null);
          },
          args: [currentSheetInfo.spreadsheetId, currentSheetInfo.gid]
        });

        if (tabRes && tabRes[0] && tabRes[0].result) {
          const gvizText = tabRes[0].result;
          const jsonMatch = gvizText.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\);/);
          if (jsonMatch && jsonMatch[1]) {
            const data = JSON.parse(jsonMatch[1]);
            const parsed = parseGvizData(data);
            if (parsed && parsed.length > 0) {
              currentSheetRows = parsed;
              fetched = true;
            }
          }
        }
      } catch (tabErr) {
        console.warn("[Competitor] Tab GViz fetch error:", tabErr);
      }

      // Method 2: CSV export inside active tab
      if (!fetched) {
        try {
          const csvRes = await chrome.scripting.executeScript({
            target: { tabId: sheetTab.id },
            func: (spreadsheetId, gid) => {
              const csvUrl = `/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
              return fetch(csvUrl, { credentials: "include" })
                .then((r) => r.text())
                .catch(() => null);
            },
            args: [currentSheetInfo.spreadsheetId, currentSheetInfo.gid]
          });

          if (csvRes && csvRes[0] && csvRes[0].result) {
            const parsed = parseCSV(csvRes[0].result);
            if (parsed && parsed.length > 0) {
              currentSheetRows = parsed;
              fetched = true;
            }
          }
        } catch (_) {}
      }

      // Method 3: Google Sheets API v4 (if signed in)
      if (!fetched && googleAuthState.isConnected) {
        const range = selectedWorksheetTitle ? `'${selectedWorksheetTitle}'!A1:Z5000` : "A1:Z5000";
        const apiRes = await new Promise((resolve) => {
          chrome.runtime.sendMessage({
            action: "sheetsApiGetValues",
            spreadsheetId: currentSheetInfo.spreadsheetId,
            range: range
          }, resolve);
        });

        if (apiRes && apiRes.success && Array.isArray(apiRes.values) && apiRes.values.length > 0) {
          currentSheetRows = apiRes.values;
          fetched = true;
        }
      }

      // Method 4: Background fetch fallback
      if (!fetched) {
        const dataRes = await new Promise((resolve) => {
          chrome.runtime.sendMessage({
            action: "fetchGoogleSheetData",
            spreadsheetId: currentSheetInfo.spreadsheetId,
            gid: currentSheetInfo.gid
          }, resolve);
        });

        if (dataRes && dataRes.success) {
          currentSheetRows = dataRes.rows || dataRes.data || [];
        }
      }
    }

    // Display row data in UI
    loadSheetRowsAndDisplay(activeRowNumber);
  } catch (e) {
    console.error("[Competitor] readActiveSheetRow error:", e);
    loadSheetRowsAndDisplay(activeRowNumber);
  } finally {
    showProgress(false);
  }
}

function loadSheetRowsAndDisplay(rowNum) {
  activeRowNumber = Math.max(1, parseInt(rowNum, 10) || 1);
  const inputEl = document.getElementById("compRowNumInput");
  if (inputEl) inputEl.value = activeRowNumber;

  // Zero-indexed row in array (Row 1 -> index 0)
  const rowIndex = activeRowNumber - 1;
  const rowValues = (currentSheetRows && currentSheetRows[rowIndex]) ? currentSheetRows[rowIndex] : [];

  // Google Sheet Column Mapping:
  // Col F = index 5 (Company Name)
  // Col G = index 6 (Main Service)
  // Col H = index 7 (Competitor 1)
  // Col I = index 8 (Competitor 2)
  // Col J = index 9 (Company City)
  // Col K = index 10 (Company State)
  const companyName   = (rowValues[5]  || "").trim();
  const mainService   = (rowValues[6]  || "").trim();
  const existingComp1 = (rowValues[7]  || "").trim();
  const existingComp2 = (rowValues[8]  || "").trim();
  const companyCity   = (rowValues[9]  || "").trim();
  const companyState  = (rowValues[10] || "").trim();

  // Populate Field Values in UI
  const valCompEl = document.getElementById("compValCompany");
  const valServEl = document.getElementById("compValService");
  const valCityEl = document.getElementById("compValCity");
  const valStatEl = document.getElementById("compValState");

  if (valCompEl) {
    valCompEl.textContent = companyName || "—";
    valCompEl.className = "comp-field-val" + (!companyName ? " missing" : "");
  }
  if (valServEl) {
    valServEl.textContent = mainService || "Missing";
    valServEl.className = "comp-field-val" + (!mainService ? " missing" : "");
  }
  if (valCityEl) {
    valCityEl.textContent = companyCity || "Missing";
    valCityEl.className = "comp-field-val" + (!companyCity ? " missing" : "");
  }
  if (valStatEl) {
    valStatEl.textContent = companyState || "Missing";
    valStatEl.className = "comp-field-val" + (!companyState ? " missing" : "");
  }

  // Validation Check: Main Service required, City & State recommended
  const missing = [];
  if (!mainService)  missing.push("Main Service (Col G)");
  if (!companyCity)  missing.push("City (Col J)");
  if (!companyState) missing.push("State (Col K)");

  const warnBanner = document.getElementById("compWarnBanner");
  const warnMsg    = document.getElementById("compWarnMsg");
  const findBtn    = document.getElementById("compFindBtn");
  const queryText  = document.getElementById("compQueryText");

  let query = "";
  if (!mainService && !companyName) {
    if (warnBanner) warnBanner.classList.remove("hidden");
    if (warnMsg) warnMsg.textContent = `Row ${activeRowNumber} is empty or missing required columns.`;
    if (findBtn) {
      findBtn.disabled = true;
      findBtn.textContent = "⚠️ Fill Required Fields to Search";
    }
    if (queryText) queryText.textContent = "—";
  } else {
    // Generate clean query
    const serviceTerm = mainService || "HVAC contractors";
    const locParts = [companyCity, companyState].filter(Boolean).join(", ");
    query = locParts ? `${serviceTerm} in ${locParts}` : serviceTerm;

    if (missing.length > 0) {
      if (warnBanner) warnBanner.classList.remove("hidden");
      if (warnMsg) warnMsg.textContent = `Missing ${missing.join(", ")} in Row ${activeRowNumber}. Searching with available info.`;
    } else {
      if (warnBanner) warnBanner.classList.add("hidden");
    }

    if (findBtn) {
      findBtn.disabled = false;
      findBtn.textContent = "🔍 Find Competitors";
    }
    if (queryText) queryText.textContent = query;
  }

  // Existing Competitor notice & Overwrite Protection
  const existNotice   = document.getElementById("compExistingNotice");
  const overwriteLbl  = document.getElementById("compOverwriteLabel");
  const overwriteChk  = document.getElementById("compOverwriteCheck");

  if (existingComp1 || existingComp2) {
    const parts = [];
    if (existingComp1) parts.push(`H: "${existingComp1}"`);
    if (existingComp2) parts.push(`I: "${existingComp2}"`);
    if (existNotice) existNotice.classList.remove("hidden");
    if (overwriteLbl) overwriteLbl.textContent = `Overwrite existing ${parts.join(" and ")} in Row ${activeRowNumber}`;
    if (overwriteChk) overwriteChk.checked = false; // safe by default
  } else {
    if (existNotice) existNotice.classList.add("hidden");
  }

  // Reset Results card for new row
  const resultsCard = document.getElementById("compResultsCard");
  const saveStatus  = document.getElementById("compSaveStatus");
  if (resultsCard) resultsCard.classList.add("hidden");
  if (saveStatus)  saveStatus.classList.add("hidden");

  currentCompetitorData = {
    row: activeRowNumber,
    companyName,
    mainService,
    city: companyCity,
    state: companyState,
    query,
    existingComp1,
    existingComp2,
    isValid: !!query && query !== "—"
  };
}

function stepRow(delta) {
  const newRow = Math.max(1, activeRowNumber + delta);
  loadSheetRowsAndDisplay(newRow);
}

function onRowNumberChanged() {
  const inputEl = document.getElementById("compRowNumInput");
  if (!inputEl) return;
  const row = parseInt(inputEl.value, 10);
  if (!isNaN(row) && row >= 1) {
    loadSheetRowsAndDisplay(row);
  }
}

// ── Single Row Competitor Search ──

async function runCompetitorFinder() {
  // Sync row number from input field
  const inputEl = document.getElementById("compRowNumInput");
  if (inputEl) {
    const row = parseInt(inputEl.value, 10);
    if (!isNaN(row) && row >= 1) {
      if (!currentCompetitorData || currentCompetitorData.row !== row) {
        loadSheetRowsAndDisplay(row);
      }
    }
  }

  if (!currentCompetitorData || !currentCompetitorData.isValid) {
    if (!currentSheetRows || currentSheetRows.length === 0) {
      await readActiveSheetRow(true);
    }
    if (!currentCompetitorData || !currentCompetitorData.isValid) {
      alert("Please select a row with a Main Service or Company Name.");
      return;
    }
  }

  const findBtn  = document.getElementById("compFindBtn");
  const resCard  = document.getElementById("compResultsCard");
  const resRowEl = document.getElementById("compResRow");
  const resQueryEl = document.getElementById("compResQuery");
  const res1El   = document.getElementById("compRes1");
  const res2El   = document.getElementById("compRes2");
  const statusEl = document.getElementById("compSaveStatus");

  findBtn.disabled = true;
  findBtn.textContent = "⏳ Searching Google…";
  showProgress(true);
  setStatus("Finding competitors…");

  try {
    const response = await new Promise((resolve) => {
      chrome.runtime.sendMessage({
        action: "findCompetitors",
        query: currentCompetitorData.query,
        originalCompany: currentCompetitorData.companyName
      }, resolve);
    });

    if (response && response.success) {
      const c1 = response.competitor1 || "";
      const c2 = response.competitor2 || "";

      currentCompetitorData.foundComp1 = c1;
      currentCompetitorData.foundComp2 = c2;

      // Update Results Display
      if (resCard) resCard.classList.remove("hidden");
      if (resRowEl) resRowEl.textContent = currentCompetitorData.row;
      if (resQueryEl) resQueryEl.textContent = currentCompetitorData.query;

      if (res1El) {
        if (c1) {
          res1El.textContent = c1;
          res1El.className = "comp-result-val";
        } else {
          res1El.textContent = "No suitable competitor found.";
          res1El.className = "comp-result-val comp-result-none";
        }
      }

      if (res2El) {
        if (c2) {
          res2El.textContent = c2;
          res2El.className = "comp-result-val";
        } else {
          res2El.textContent = "No suitable competitor found.";
          res2El.className = "comp-result-val comp-result-none";
        }
      }

      setStatus(`Found ${response.totalFound} competitors`);

      if (statusEl) {
        statusEl.textContent = "";
        statusEl.classList.add("hidden");
      }
    } else {
      showError("Competitor search failed: " + (response ? response.error : "Unknown error"));
    }
  } catch (err) {
    console.error("[Competitor] Search error:", err);
    showError("Search failed: " + err.message);
  } finally {
    findBtn.disabled = false;
    findBtn.textContent = "🔍 Find Competitors";
    showProgress(false);
  }
}

// ── Single Row Save to Sheet ──

async function saveCompetitorsToSheet(userClicked = true) {
  if (!currentCompetitorData || (!currentCompetitorData.foundComp1 && !currentCompetitorData.foundComp2)) {
    alert("No competitors found to save yet. Run 'Find Competitors' first.");
    return;
  }

  const c1 = currentCompetitorData.foundComp1 || "";
  const c2 = currentCompetitorData.foundComp2 || "";
  const row = currentCompetitorData.row;
  const statusEl = document.getElementById("compSaveStatus");
  const saveBtn  = document.getElementById("compSaveSheetBtn");

  if (saveBtn) saveBtn.textContent = "⏳ Saving…";

  try {
    let saved = false;

    // 1. If Google OAuth / Bearer token is connected, save directly via Google Sheets API v4
    if (googleAuthState.isConnected && currentSheetInfo && currentSheetInfo.spreadsheetId) {
      const apiRes = await new Promise((resolve) => {
        chrome.runtime.sendMessage({
          action: "sheetsApiUpdateRow",
          spreadsheetId: currentSheetInfo.spreadsheetId,
          sheetTitle: selectedWorksheetTitle,
          row: row,
          competitor1: c1,
          competitor2: c2
        }, resolve);
      });

      if (apiRes && apiRes.success) {
        saved = true;
      } else if (apiRes && apiRes.error) {
        console.warn("[Competitor] Sheets API save error:", apiRes.error);
      }
    }

    // 2. Try Apps Script Webhook if configured
    if (!saved) {
      const webhookUrl = await new Promise((r) => chrome.storage.local.get(["googleAppsScriptWebhook"], (res) => r(res.googleAppsScriptWebhook)));
      if (webhookUrl) {
        try {
          const whResp = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "updateRow",
              spreadsheetId: currentSheetInfo ? currentSheetInfo.spreadsheetId : "",
              sheetTitle: selectedWorksheetTitle || "",
              row: row,
              competitor1: c1,
              competitor2: c2
            })
          });
          if (whResp.ok) saved = true;
        } catch (_) {}
      }
    }

    // 3. Update local cache row
    const rowIndex = row - 1;
    if (currentSheetRows && currentSheetRows[rowIndex]) {
      currentSheetRows[rowIndex][7] = c1;
      currentSheetRows[rowIndex][8] = c2;
    }

    if (statusEl) {
      if (saved) {
        statusEl.textContent = `✅ Saved to Sheet: H${row}="${c1 || '—'}" | I${row}="${c2 || '—'}"`;
        statusEl.style.color = "#3fb950";
      } else {
        statusEl.textContent = `⚠️ Sign in with Google above to enable 1-click sheet saving.`;
        statusEl.style.color = "#d29922";
      }
      statusEl.classList.remove("hidden");
    }

    if (saveBtn) {
      saveBtn.textContent = saved ? "✅ Saved to Sheet!" : "💾 Save to Google Sheet";
      setTimeout(() => { if (saveBtn) saveBtn.textContent = "💾 Save to Google Sheet"; }, 2000);
    }
  } catch (err) {
    console.error("[Competitor] Save error:", err);
    if (statusEl) {
      statusEl.textContent = `❌ Error saving: ${err.message}`;
      statusEl.style.color = "#f85149";
      statusEl.classList.remove("hidden");
    }
    if (saveBtn) saveBtn.textContent = "💾 Save to Google Sheet";
  }
}

function copyCompetitorsTsv() {
  if (!currentCompetitorData) return;
  const c1 = currentCompetitorData.foundComp1 || "";
  const c2 = currentCompetitorData.foundComp2 || "";
  const tsv = `${c1}\t${c2}`;

  const copyBtn = document.getElementById("compCopyTsvBtn");
  navigator.clipboard.writeText(tsv).then(() => {
    if (copyBtn) {
      const orig = copyBtn.textContent;
      copyBtn.textContent = "✅ Copied!";
      setTimeout(() => { copyBtn.textContent = orig; }, 1500);
    }
  }).catch(() => {
    // Fallback if clipboard API fails
    const textarea = document.createElement("textarea");
    textarea.value = tsv;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    if (copyBtn) {
      const orig = copyBtn.textContent;
      copyBtn.textContent = "✅ Copied!";
      setTimeout(() => { copyBtn.textContent = orig; }, 1500);
    }
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// BULK MODE ENGINE (Iterates single-row logic across range)
// ══════════════════════════════════════════════════════════════════════════════

async function startBulkCompetitorFinder() {
  const startInput = document.getElementById("compBulkStartInput");
  const endInput   = document.getElementById("compBulkEndInput");
  const runBtn     = document.getElementById("compBulkRunBtn");
  const stopBtn    = document.getElementById("compBulkStopBtn");
  const retryBtn   = document.getElementById("compBulkRetryBtn");
  const progCard   = document.getElementById("compBulkProgressCard");
  const resultsWrap= document.getElementById("compBulkResultsWrap");
  const actionsBar = document.getElementById("compBulkActionsBar");

  const startRow = Math.max(1, parseInt(startInput?.value, 10) || 1);
  const endRow   = Math.max(startRow, parseInt(endInput?.value, 10) || startRow);

  const skipExisting = document.getElementById("compBulkSkipExisting")?.checked !== false;
  const delayMs = parseInt(document.getElementById("compBulkDelaySelect")?.value, 10) || 1500;

  // Make sure sheet rows are loaded
  if (!currentSheetRows || currentSheetRows.length === 0) {
    await readActiveSheetRow(true);
  }

  // Initialize Bulk State
  bulkProcessingState = {
    isRunning: true,
    isCancelled: false,
    startRow,
    endRow,
    results: [],
    stats: {
      total: endRow - startRow + 1,
      found: 0,
      empty: 0,
      failed: 0
    }
  };

  // Update UI for Bulk Run
  if (runBtn) { runBtn.disabled = true; runBtn.textContent = "⏳ Running Bulk Search…"; }
  if (stopBtn) stopBtn.disabled = false;
  if (retryBtn) retryBtn.disabled = true;
  if (progCard) progCard.classList.remove("hidden");
  if (resultsWrap) resultsWrap.classList.remove("hidden");
  if (actionsBar) actionsBar.classList.add("hidden");

  renderBulkResultsContainer();
  updateBulkProgressUI(0, bulkProcessingState.stats.total, "Starting bulk competitor search…");

  const totalRows = endRow - startRow + 1;
  let processedCount = 0;

  for (let row = startRow; row <= endRow; row++) {
    if (bulkProcessingState.isCancelled) {
      break;
    }

    processedCount++;
    const progressPercent = Math.round((processedCount / totalRows) * 100);
    updateBulkProgressUI(processedCount, totalRows, `Processing row ${row} of ${endRow}…`, progressPercent);

    // 1. Extract row data from in-memory sheet rows
    const rowIndex = row - 1;
    const rowValues = (currentSheetRows && currentSheetRows[rowIndex]) ? currentSheetRows[rowIndex] : [];

    const companyName   = (rowValues[5]  || "").trim();
    const mainService   = (rowValues[6]  || "").trim();
    const existingComp1 = (rowValues[7]  || "").trim();
    const existingComp2 = (rowValues[8]  || "").trim();
    const companyCity   = (rowValues[9]  || "").trim();
    const companyState  = (rowValues[10] || "").trim();

    // Check if row already has competitors
    if (skipExisting && (existingComp1 || existingComp2)) {
      const rowRes = {
        row,
        companyName,
        mainService,
        city: companyCity,
        state: companyState,
        query: `${mainService} in ${companyCity}, ${companyState}`,
        competitor1: existingComp1,
        competitor2: existingComp2,
        status: "skipped",
        reason: "Existing competitors in sheet",
        hasExisting: true
      };
      bulkProcessingState.results.push(rowRes);
      if (existingComp1 || existingComp2) bulkProcessingState.stats.found++;
      updateBulkRowItemInList(rowRes);
      updateBulkStatsUI();
      continue;
    }

    // 2. Construct Search Query
    const serviceTerm = mainService || "HVAC contractors";
    const locParts = [companyCity, companyState].filter(Boolean).join(", ");
    const query = locParts ? `${serviceTerm} in ${locParts}` : serviceTerm;

    if (!mainService && !companyName) {
      const rowRes = {
        row,
        companyName,
        mainService,
        city: companyCity,
        state: companyState,
        query: "—",
        competitor1: "",
        competitor2: "",
        status: "skipped",
        reason: "Empty row",
        hasExisting: false
      };
      bulkProcessingState.results.push(rowRes);
      bulkProcessingState.stats.failed++;
      updateBulkRowItemInList(rowRes);
      updateBulkStatsUI();
      continue;
    }

    // Mark row as active in UI
    updateBulkRowItemInList({
      row,
      companyName,
      mainService,
      city: companyCity,
      state: companyState,
      query,
      status: "searching"
    });

    // 3. Run Google Search (exact same logic)
    try {
      const response = await new Promise((resolve) => {
        chrome.runtime.sendMessage({
          action: "findCompetitors",
          query: query,
          originalCompany: companyName
        }, resolve);
      });

      if (response && response.success) {
        const c1 = response.competitor1 || "";
        const c2 = response.competitor2 || "";
        const hasAny = !!(c1 || c2);

        const rowRes = {
          row,
          companyName,
          mainService,
          city: companyCity,
          state: companyState,
          query,
          competitor1: c1,
          competitor2: c2,
          status: hasAny ? "found" : "none",
          reason: hasAny ? "" : "No suitable competitor found.",
          totalFound: response.totalFound || 0
        };

        if (hasAny) {
          bulkProcessingState.stats.found++;
          // Update in-memory sheet row
          if (currentSheetRows && currentSheetRows[rowIndex]) {
            currentSheetRows[rowIndex][7] = c1;
            currentSheetRows[rowIndex][8] = c2;
          }
        } else {
          bulkProcessingState.stats.empty++;
        }

        bulkProcessingState.results.push(rowRes);
        updateBulkRowItemInList(rowRes);
      } else {
        const errMsg = response ? response.error : "Search failed";
        const rowRes = {
          row,
          companyName,
          mainService,
          city: companyCity,
          state: companyState,
          query,
          competitor1: "",
          competitor2: "",
          status: "error",
          reason: errMsg
        };
        bulkProcessingState.stats.failed++;
        bulkProcessingState.results.push(rowRes);
        updateBulkRowItemInList(rowRes);
      }
    } catch (err) {
      const rowRes = {
        row,
        companyName,
        mainService,
        city: companyCity,
        state: companyState,
        query,
        competitor1: "",
        competitor2: "",
        status: "error",
        reason: err.message
      };
      bulkProcessingState.stats.failed++;
      bulkProcessingState.results.push(rowRes);
      updateBulkRowItemInList(rowRes);
    }

    updateBulkStatsUI();

    // 4. Throttle pause before next search (unless last row or stopped)
    if (row < endRow && !bulkProcessingState.isCancelled) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  // Complete / Halt
  finishBulkCompetitorFinder();
}

function stopBulkCompetitorFinder() {
  bulkProcessingState.isCancelled = true;
  const textEl = document.getElementById("compBulkProgressText");
  const stopBtn = document.getElementById("compBulkStopBtn");
  if (textEl) textEl.textContent = "Stopping bulk search…";
  if (stopBtn) stopBtn.disabled = true;
}

function finishBulkCompetitorFinder() {
  bulkProcessingState.isRunning = false;
  const runBtn     = document.getElementById("compBulkRunBtn");
  const stopBtn    = document.getElementById("compBulkStopBtn");
  const retryBtn   = document.getElementById("compBulkRetryBtn");
  const actionsBar = document.getElementById("compBulkActionsBar");
  const textEl     = document.getElementById("compBulkProgressText");
  const countLabel = document.getElementById("compBulkCountLabel");

  if (runBtn) { runBtn.disabled = false; runBtn.textContent = "🔍 Find Competitors"; }
  if (stopBtn) stopBtn.disabled = true;

  const hasFailed = bulkProcessingState.stats.failed > 0;
  if (retryBtn) retryBtn.disabled = !hasFailed;

  if (actionsBar) actionsBar.classList.remove("hidden");
  if (countLabel) countLabel.textContent = bulkProcessingState.results.length;

  if (bulkProcessingState.isCancelled) {
    if (textEl) textEl.textContent = `⏸️ Bulk search paused (${bulkProcessingState.results.length} rows processed).`;
    setStatus("Bulk search stopped");
  } else {
    if (textEl) {
      textEl.textContent = `✅ Completed: ${bulkProcessingState.results.length} / ${bulkProcessingState.stats.total} rows (${bulkProcessingState.stats.found} found, ${bulkProcessingState.stats.failed} failed).`;
    }
    setStatus("Bulk search complete");
  }
}

async function retryFailedBulkRows() {
  const failedRows = bulkProcessingState.results.filter(r => r.status === "error");
  if (failedRows.length === 0) return;

  const runBtn   = document.getElementById("compBulkRunBtn");
  const stopBtn  = document.getElementById("compBulkStopBtn");
  const retryBtn = document.getElementById("compBulkRetryBtn");
  const delayMs  = parseInt(document.getElementById("compBulkDelaySelect")?.value, 10) || 1500;

  bulkProcessingState.isRunning = true;
  bulkProcessingState.isCancelled = false;

  if (runBtn) runBtn.disabled = true;
  if (stopBtn) stopBtn.disabled = false;
  if (retryBtn) retryBtn.disabled = true;

  let retriedCount = 0;
  const totalRetries = failedRows.length;

  for (const item of failedRows) {
    if (bulkProcessingState.isCancelled) break;

    retriedCount++;
    const row = item.row;
    updateBulkProgressUI(retriedCount, totalRetries, `Retrying row ${row} (${retriedCount}/${totalRetries})…`);

    const query = item.query !== "—" ? item.query : `${item.mainService} in ${item.city}, ${item.state}`;

    updateBulkRowItemInList({ ...item, status: "searching" });

    try {
      const response = await new Promise((resolve) => {
        chrome.runtime.sendMessage({
          action: "findCompetitors",
          query: query,
          originalCompany: item.companyName
        }, resolve);
      });

      if (response && response.success) {
        const c1 = response.competitor1 || "";
        const c2 = response.competitor2 || "";
        const hasAny = !!(c1 || c2);

        item.competitor1 = c1;
        item.competitor2 = c2;
        item.status = hasAny ? "found" : "none";
        item.reason = hasAny ? "" : "No suitable competitor found.";

        bulkProcessingState.stats.failed = Math.max(0, bulkProcessingState.stats.failed - 1);
        if (hasAny) bulkProcessingState.stats.found++;
        else bulkProcessingState.stats.empty++;

        // Update in-memory row
        const rowIndex = row - 1;
        if (currentSheetRows && currentSheetRows[rowIndex]) {
          currentSheetRows[rowIndex][7] = c1;
          currentSheetRows[rowIndex][8] = c2;
        }

        updateBulkRowItemInList(item);
      }
    } catch (_) {}

    updateBulkStatsUI();
    if (retriedCount < totalRetries && !bulkProcessingState.isCancelled) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  finishBulkCompetitorFinder();
}

// ── Bulk UI Rendering Helpers ──

function updateBulkProgressUI(current, total, text, percent = null) {
  const textEl = document.getElementById("compBulkProgressText");
  const pctEl  = document.getElementById("compBulkProgressPercent");
  const fillEl = document.getElementById("compBulkProgressFill");

  const calcPct = percent !== null ? percent : (total > 0 ? Math.round((current / total) * 100) : 0);

  if (textEl) textEl.textContent = text;
  if (pctEl)  pctEl.textContent  = `${calcPct}%`;
  if (fillEl) fillEl.style.width = `${calcPct}%`;
}

function updateBulkStatsUI() {
  const totEl = document.getElementById("compStatTotal");
  const fndEl = document.getElementById("compStatSuccess");
  const empEl = document.getElementById("compStatEmpty");
  const fldEl = document.getElementById("compStatFailed");

  if (totEl) totEl.textContent = bulkProcessingState.stats.total;
  if (fndEl) fndEl.textContent = bulkProcessingState.stats.found;
  if (empEl) empEl.textContent = bulkProcessingState.stats.empty;
  if (fldEl) fldEl.textContent = bulkProcessingState.stats.failed;
}

function renderBulkResultsContainer() {
  const listEl = document.getElementById("compBulkResultsList");
  if (listEl) listEl.innerHTML = "";
}

function updateBulkRowItemInList(rowRes) {
  const listEl = document.getElementById("compBulkResultsList");
  if (!listEl) return;

  const rowId = `bulkRow_${rowRes.row}`;
  let card = document.getElementById(rowId);

  if (!card) {
    card = document.createElement("div");
    card.id = rowId;
    listEl.appendChild(card);
  }

  let statusClass = "item-empty";
  let statusBadgeText = "None Found";
  let statusBadgeClass = "none";

  if (rowRes.status === "searching") {
    statusClass = "item-active";
    statusBadgeText = "Searching…";
    statusBadgeClass = "skipped";
  } else if (rowRes.status === "found") {
    statusClass = "item-success";
    statusBadgeText = "Found (2)";
    statusBadgeClass = "found";
  } else if (rowRes.status === "skipped") {
    statusClass = "item-empty";
    statusBadgeText = rowRes.hasExisting ? "Existing" : "Skipped";
    statusBadgeClass = "skipped";
  } else if (rowRes.status === "error") {
    statusClass = "item-failed";
    statusBadgeText = "Error";
    statusBadgeClass = "error";
  }

  const c1 = rowRes.competitor1;
  const c2 = rowRes.competitor2;

  card.className = `comp-bulk-item ${statusClass}`;
  card.innerHTML = `
    <div class="comp-bulk-item-head">
      <div>
        <span class="comp-bulk-row-badge">Row ${rowRes.row}</span>
        <span class="comp-bulk-company-name">${escHtml(rowRes.companyName || "No Company Name")}</span>
      </div>
      <span class="comp-bulk-status-badge ${statusBadgeClass}">${statusBadgeText}</span>
    </div>
    <div class="comp-bulk-query-line" title="${escHtml(rowRes.query)}">🔎 ${escHtml(rowRes.query || "—")}</div>
    ${rowRes.status !== "searching" ? `
      <div class="comp-bulk-results-line">
        <div class="comp-bulk-c-row">
          <span class="comp-bulk-c-label">Comp 1:</span>
          <span class="comp-bulk-c-val ${!c1 ? 'none' : ''}">${escHtml(c1 || (rowRes.reason || 'No suitable competitor found.'))}</span>
        </div>
        <div class="comp-bulk-c-row">
          <span class="comp-bulk-c-label">Comp 2:</span>
          <span class="comp-bulk-c-val ${!c2 ? 'none' : ''}">${escHtml(c2 || (rowRes.reason || 'No suitable competitor found.'))}</span>
        </div>
      </div>
    ` : ''}
  `;

  // Auto-scroll to latest card
  card.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

// ── Bulk Actions (Save & Copy) ──

async function saveBulkCompetitorsToSheet() {
  const saveBtn  = document.getElementById("compBulkSaveSheetBtn");
  const statusEl = document.getElementById("compBulkSaveStatus");

  const toSave = bulkProcessingState.results.filter(r => (r.competitor1 || r.competitor2) && r.status !== "skipped");
  if (toSave.length === 0) {
    if (statusEl) {
      statusEl.textContent = "⚠️ No new competitors to save in this batch.";
      statusEl.style.color = "#d29922";
      statusEl.classList.remove("hidden");
    }
    return;
  }

  if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = "⏳ Saving Batch…"; }

  try {
    let saved = false;

    // 1. Google Sheets API v4 batch update if connected
    if (googleAuthState.isConnected && currentSheetInfo && currentSheetInfo.spreadsheetId) {
      const updates = toSave.map(r => ({
        row: r.row,
        competitor1: r.competitor1 || "",
        competitor2: r.competitor2 || ""
      }));

      const apiRes = await new Promise((resolve) => {
        chrome.runtime.sendMessage({
          action: "sheetsApiBatchUpdate",
          spreadsheetId: currentSheetInfo.spreadsheetId,
          sheetTitle: selectedWorksheetTitle,
          updates: updates
        }, resolve);
      });

      if (apiRes && apiRes.success) {
        saved = true;
      } else if (apiRes && apiRes.error) {
        console.warn("[Bulk] Sheets API batch save error:", apiRes.error);
      }
    }

    // 2. Apps Script Webhook fallback
    if (!saved) {
      const webhookUrl = await new Promise((r) => chrome.storage.local.get(["googleAppsScriptWebhook"], (res) => r(res.googleAppsScriptWebhook)));
      if (webhookUrl) {
        try {
          const updates = toSave.map(r => ({
            row: r.row,
            competitor1: r.competitor1 || "",
            competitor2: r.competitor2 || ""
          }));
          const whResp = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "batchUpdate",
              spreadsheetId: currentSheetInfo ? currentSheetInfo.spreadsheetId : "",
              sheetTitle: selectedWorksheetTitle || "",
              updates: updates
            })
          });
          if (whResp.ok) saved = true;
        } catch (_) {}
      }
    }

    if (saved) {
      if (statusEl) {
        statusEl.textContent = `✅ Successfully saved ${toSave.length} rows directly into Google Sheet ('${selectedWorksheetTitle || 'Active Sheet'}')!`;
        statusEl.style.color = "#3fb950";
        statusEl.classList.remove("hidden");
      }
      if (saveBtn) {
        saveBtn.textContent = "✅ Saved to Sheet!";
        setTimeout(() => { if (saveBtn) saveBtn.textContent = "💾 Save to Google Sheet"; }, 2500);
      }
    } else {
      // Fallback: Copy TSV for manual paste
      await copyBulkResultsTsv();
      if (statusEl) {
        statusEl.textContent = `⚠️ Copied TSV to clipboard (${toSave.length} rows). Sign in with Google or configure Webhook to enable automatic 1-click sheet saving.`;
        statusEl.style.color = "#d29922";
        statusEl.classList.remove("hidden");
      }
    }
  } catch (err) {
    console.error("[Bulk] Save error:", err);
    if (statusEl) {
      statusEl.textContent = `⚠️ Save error: ${err.message}. Use 'Copy Results' to paste directly.`;
      statusEl.style.color = "#f85149";
      statusEl.classList.remove("hidden");
    }
  } finally {
    if (saveBtn) saveBtn.disabled = false;
  }
}

async function copyBulkResultsTsv() {
  const copyBtn = document.getElementById("compBulkCopyTsvBtn");
  if (!bulkProcessingState.results || bulkProcessingState.results.length === 0) return;

  // Build TSV matching the contiguous range [startRow..endRow]
  const startRow = bulkProcessingState.startRow;
  const endRow   = bulkProcessingState.endRow;
  const resultMap = new Map();
  bulkProcessingState.results.forEach(r => resultMap.set(r.row, r));

  const tsvLines = [];
  for (let r = startRow; r <= endRow; r++) {
    const item = resultMap.get(r);
    const c1 = item ? (item.competitor1 || "") : "";
    const c2 = item ? (item.competitor2 || "") : "";
    tsvLines.push(`${c1}\t${c2}`);
  }

  const tsv = tsvLines.join("\n");
  try {
    await navigator.clipboard.writeText(tsv);
    if (copyBtn) {
      const orig = copyBtn.textContent;
      copyBtn.textContent = "✅ Copied TSV!";
      setTimeout(() => { if (copyBtn) copyBtn.textContent = orig; }, 1800);
    }
  } catch (err) {
    console.warn("[Bulk] Copy TSV error:", err);
  }
}

async function copyBulkResultsFormattedText() {
  const copyBtn = document.getElementById("compBulkCopyTextBtn");
  if (!bulkProcessingState.results || bulkProcessingState.results.length === 0) return;

  const lines = [];
  bulkProcessingState.results.forEach(r => {
    lines.push(`Row ${r.row} - ${r.companyName || 'Unknown Company'}`);
    lines.push(`Search Query: ${r.query || '—'}`);
    lines.push(`Competitor 1: ${r.competitor1 || (r.reason || 'No suitable competitor found.')}`);
    lines.push(`Competitor 2: ${r.competitor2 || (r.reason || 'No suitable competitor found.')}`);
    lines.push("");
  });

  const text = lines.join("\n");
  try {
    await navigator.clipboard.writeText(text);
    if (copyBtn) {
      const orig = copyBtn.textContent;
      copyBtn.textContent = "✅ Copied Text!";
      setTimeout(() => { if (copyBtn) copyBtn.textContent = orig; }, 1800);
    }
  } catch (err) {
    console.warn("[Bulk] Copy text error:", err);
  }
}



