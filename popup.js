// popup.js — Hardscaping Company Finder UI v4.0
// Weighted 4-tier scoring with negative keyword penalties.
// Output: Confidence Score, Hardscaping Services Detected, Keywords Matched,
//         Why Classified, Secondary Services, Negative Signals.

'use strict';

let currentScanData = null;

// ── BOOT ─────────────────────────────────────────────────────────────────────
document.getElementById('scanBtn').addEventListener('click', quickScan);
document.getElementById('deepScanBtn').addEventListener('click', startDeepScan);
document.getElementById('copyPrimaryBtn').addEventListener('click', copyPrimary);
document.getElementById('copyAllBtn').addEventListener('click', copyAll);
document.getElementById('debugToggleBtn').addEventListener('click', toggleDebug);
document.getElementById('clearHighlightsBtn').addEventListener('click', clearPageHighlights);

// ── COLLAPSIBLE HELPERS ──────────────────────────────────────────────────────
function makeCollapsible(el) {
  const header = el.querySelector('.collapsible-header');
  const body   = el.querySelector('.collapsible-body');
  if (!header || !body) return;
  header.addEventListener('click', () => { el.classList.toggle('open'); });
}

(function wireDebugHeader() {
  const panel = document.getElementById('debugPanel');
  if (panel) makeCollapsible(panel);
})();

// ── QUICK SCAN ───────────────────────────────────────────────────────────────
async function quickScan() {
  const btn = document.getElementById('scanBtn');
  btn.disabled    = true;
  btn.textContent = '⏳ Scanning…';
  showProgress(true);
  setStatus('Scanning…');

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) { showError('No active tab found.'); return; }

    try {
      await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
    } catch (_) { /* Already injected — OK */ }

    const response = await new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tab.id, { action: 'scanCurrentPage' }, (res) => {
        if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
        else resolve(res);
      });
    });

    if (response && Array.isArray(response.findings)) {
      const aggregated = aggregateFindings(response);
      currentScanData  = {
        ...aggregated,
        pages:      [{ url: response.pageUrl || tab.url, title: response.pageTitle || tab.title }],
        totalNodes: response.totalNodes || 0,
        totalText:  response.totalText  || 0,
        totalHits:  response.totalHits  || 0,
        debugLog:   response.debugLog   || [],
        scanTime:   response.scanTime   || '?',
      };
      renderDashboard(currentScanData);
      updateDebugPanel(currentScanData);
      document.getElementById('copySection').classList.remove('hidden');
      setStatus('Quick Scan');
      autoHighlight(tab.id, currentScanData);
    } else if (response && response.error) {
      showError('Scan error: ' + response.error);
    } else {
      showError('No data returned. Try refreshing the page then scanning again.');
    }
  } catch (e) {
    console.error('[Popup] quickScan error:', e);
    showError(
      `Could not connect to page. <small>${e.message}</small><br>` +
      `<small style="color:var(--text-dim)">Try: refresh → open extension → scan.</small>`
    );
  } finally {
    btn.disabled    = false;
    btn.textContent = '🔍 Quick Scan';
    showProgress(false);
  }
}

// ── DEEP SCAN ────────────────────────────────────────────────────────────────
function startDeepScan() {
  const btn = document.getElementById('deepScanBtn');
  btn.disabled    = true;
  btn.textContent = '⏳ Scanning…';
  showProgress(true);
  setStatus('Deep scan…');

  // Hardscape-specific pages to scan
  const pages = [
    '/', '/services', '/hardscaping', '/hardscape', '/patios', '/patio',
    '/retaining-walls', '/walkways', '/driveways', '/outdoor-kitchens',
    '/outdoor-living', '/masonry', '/concrete', '/water-features',
    '/landscape-lighting', '/portfolio', '/gallery', '/projects', '/about',
    '/our-services', '/what-we-do',
  ];

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || !tabs[0]) {
      showError('No active tab found.');
      btn.disabled    = false;
      btn.textContent = '🌐 Deep Scan';
      showProgress(false);
      return;
    }

    const url = tabs[0].url;
    chrome.runtime.sendMessage({ action: 'startDeepScan', url, pages }, (response) => {
      if (chrome.runtime.lastError) {
        showError('Deep scan error: ' + chrome.runtime.lastError.message);
        btn.disabled    = false;
        btn.textContent = '🌐 Deep Scan';
        showProgress(false);
        return;
      }

      if (response && response.results) {
        const allFindings       = [];
        const allNegativeHits   = [];
        const allSecondary      = new Set();
        const pageMeta          = [];

        for (const r of response.results) {
          if (r.pageData && Array.isArray(r.pageData.findings)) {
            allFindings.push(...r.pageData.findings);
            pageMeta.push({ url: r.url, title: r.pageData.pageTitle || r.url });
            for (const neg of (r.pageData.negativeHits || [])) {
              if (!allNegativeHits.includes(neg)) allNegativeHits.push(neg);
            }
            for (const sec of (r.pageData.secondaryServices || [])) allSecondary.add(sec);
          }
        }

        const syntheticResponse = {
          findings:         allFindings,
          negativeHits:     allNegativeHits,
          secondaryServices: [...allSecondary],
        };

        const aggregated    = aggregateFindings(syntheticResponse);
        currentScanData     = { ...aggregated, pages: pageMeta };
        renderDashboard(currentScanData);
        updateDebugPanel(currentScanData);
        document.getElementById('copySection').classList.remove('hidden');
        setStatus(`Deep (${pageMeta.length}p)`);
      } else {
        showError('Deep scan returned no data. The site may block automated scanning.');
      }

      btn.disabled    = false;
      btn.textContent = '🌐 Deep Scan';
      showProgress(false);
    });
  });
}

// ── CATEGORY DEFINITIONS ─────────────────────────────────────────────────────
const ALL_CATEGORIES = [
  { id: 'patios',          label: 'Patio & Paver Work',        icon: '🧱', color: '#f59e0b' },
  { id: 'walls',           label: 'Walls & Masonry',           icon: '🪨', color: '#94a3b8' },
  { id: 'outdoor_living',  label: 'Outdoor Living Spaces',     icon: '🔥', color: '#f97316' },
  { id: 'walkways_drives', label: 'Walkways & Driveways',      icon: '🛤️', color: '#60a5fa' },
  { id: 'water_landscape', label: 'Water Features & Lighting', icon: '💧', color: '#34d399' },
  { id: 'site_work',       label: 'Site Work & Construction',  icon: '🏗️', color: '#a78bfa' },
];

const CATEGORY_BY_ID = {};
for (const cat of ALL_CATEGORIES) CATEGORY_BY_ID[cat.id] = cat;

// ── SCORING CONSTANTS ────────────────────────────────────────────────────────
// A page with ~3 Tier-1 keywords in H1/nav zones (weight ~15×8 = 120 each) = 360 pts
// Threshold set so ~360 pts = ~85% confidence
const HARDSCAPE_THRESHOLD = 420;
const NEGATIVE_PENALTY    = 10;  // pts deducted per unique negative keyword hit

// ── AGGREGATE FINDINGS ───────────────────────────────────────────────────────
function aggregateFindings(response) {
  const findings         = response.findings         || [];
  const negativeHits     = response.negativeHits     || [];
  const secondaryServices = response.secondaryServices || [];

  // Per-category accumulators
  const scoreMap    = {};
  const evidenceMap = {};
  const termFreqMap = {};
  const matchedZones = {};

  for (const cat of ALL_CATEGORIES) {
    scoreMap[cat.id]     = 0;
    evidenceMap[cat.id]  = [];
    termFreqMap[cat.id]  = {};
    matchedZones[cat.id] = new Set();
  }

  // Track unique keywords matched (for the "keywords matched" section)
  const allKeywordsMatched = new Set();
  const highValueMatched   = [];   // tier 1 and 2 keywords found

  for (const f of findings) {
    const catId = f.category;
    if (!scoreMap.hasOwnProperty(catId)) continue;

    const w = typeof f.weight === 'number' ? f.weight : 1;
    scoreMap[catId] += w;

    const snippet = (f.snippet || '').trim();
    const already = evidenceMap[catId].some((e) => e.snippet === snippet);
    if (!already) {
      evidenceMap[catId].push({
        snippet,
        matchedTerm: f.matchedTerm || '?',
        tier:        f.tier        || 1,
        weight:      w,
        label:       f.label       || f.matchedTerm,
        zone:        f.zone        || f.tag || '?',
        tag:         f.tag         || '?',
        url:         f.url         || '',
        xpath:       f.xpath       || '',
      });
    }

    const term = f.matchedTerm || 'unknown';
    allKeywordsMatched.add(term);
    termFreqMap[catId][term] = (termFreqMap[catId][term] || 0) + 1;
    if (f.zone) matchedZones[catId].add(f.zone);

    if (f.tier === 1 || f.tier === 2) {
      if (!highValueMatched.includes(f.label || term)) {
        highValueMatched.push(f.label || term);
      }
    }
  }

  // ── Composite hardscape score ──
  const totalPositiveScore = Object.values(scoreMap).reduce((a, b) => a + b, 0);
  const penaltyScore       = negativeHits.length * NEGATIVE_PENALTY;
  const netScore           = Math.max(0, totalPositiveScore - penaltyScore);
  const rawConfidence      = Math.min(100, Math.round((netScore / HARDSCAPE_THRESHOLD) * 100));
  const confidence         = Math.max(0, rawConfidence);

  // ── Per-category confidence (for the service grid) ──
  const catConfidence = {};
  for (const cat of ALL_CATEGORIES) {
    const s = scoreMap[cat.id];
    catConfidence[cat.id] = s === 0 ? 0 : Math.min(100, Math.round((s / (HARDSCAPE_THRESHOLD / ALL_CATEGORIES.length)) * 100));
  }

  // ── Detected hardscape service labels (tier 1 + 2 unique labels) ──
  const detectedServices = highValueMatched.slice(0, 20);

  // ── Why classified ──
  const reasons = buildReasons(confidence, scoreMap, matchedZones, negativeHits, detectedServices, catConfidence);

  return {
    confidence,
    netScore,
    totalPositiveScore,
    penaltyScore,
    catConfidence,
    scoreMap,
    evidenceMap,
    termFreqMap,
    matchedZones: Object.fromEntries(Object.entries(matchedZones).map(([k, v]) => [k, [...v]])),
    detectedServices,
    allKeywordsMatched: [...allKeywordsMatched],
    negativeHits,
    secondaryServices,
    reasons,
  };
}

// ── BUILD CLASSIFICATION REASONS ─────────────────────────────────────────────
function buildReasons(confidence, scoreMap, matchedZones, negativeHits, detectedServices, catConfidence) {
  const reasons = [];

  if (confidence === 0) {
    reasons.push('❌ No hardscape signals detected on this page.');
    return reasons;
  }

  // Lead with confidence tier
  if (confidence >= 75) {
    reasons.push('✅ Strong hardscaping contractor — multiple high-value services confirmed');
  } else if (confidence >= 45) {
    reasons.push('🔶 Likely offers hardscaping — solid service evidence found');
  } else if (confidence >= 20) {
    reasons.push('🔸 Possible hardscape work — limited or low-tier signals detected');
  } else {
    reasons.push('⚠️ Weak hardscape presence — mostly generic or low-value terms');
  }

  // Zone evidence
  const allZones = new Set(Object.values(matchedZones).flat());
  if (allZones.has('hero-heading') || allZones.has('h1'))
    reasons.push('🎯 Hardscape keywords found in hero / H1 heading');
  if (allZones.has('nav'))
    reasons.push('📍 Services listed in navigation menu');
  if (allZones.has('service-section'))
    reasons.push('📋 Dedicated hardscape services section detected');
  if (allZones.has('meta'))
    reasons.push('🔍 Keywords in page title or meta description');
  if (allZones.has('cta'))
    reasons.push('📣 Hardscape CTAs present on page');

  // Top categories
  const topCats = ALL_CATEGORIES.filter((c) => catConfidence[c.id] >= 30);
  if (topCats.length > 0) {
    reasons.push('🏆 Specializes in: ' + topCats.map((c) => c.label).join(', '));
  }

  // Negatives warning
  if (negativeHits.length > 0) {
    reasons.push(`⛔ Penalty signals: ${negativeHits.slice(0, 3).join(', ')}${negativeHits.length > 3 ? ` +${negativeHits.length - 3} more` : ''}`);
  }

  return reasons;
}

// ── RENDER DASHBOARD ─────────────────────────────────────────────────────────
function renderDashboard(data) {
  const container = document.getElementById('resultContainer');
  const {
    confidence, catConfidence, evidenceMap, termFreqMap,
    detectedServices, negativeHits, secondaryServices, reasons,
  } = data;

  const confClass = confidence >= 65 ? 'high' : confidence >= 35 ? 'medium' : 'low';
  const confLabel = confidence >= 75 ? 'Genuine Hardscape Contractor'
                  : confidence >= 45 ? 'Likely Hardscape Contractor'
                  : confidence >= 20 ? 'Possible Hardscape Work'
                  : confidence >   0  ? 'Weak Hardscape Signals'
                  : 'Not a Hardscape Company';

  let html = '';

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
      <div class="primary-reasons">${reasons.slice(0, 2).join(' · ')}</div>
    </div>`;

  // ── Detected hardscape services chips ──
  if (detectedServices.length > 0) {
    const chips = detectedServices
      .map((s) => `<span class="service-chip">${s}</span>`)
      .join('');
    html += `
      <div class="detected-services">
        <div class="section-label">🏗️ Hardscaping Services Detected</div>
        <div class="chip-row">${chips}</div>
      </div>`;
  }

  // ── Service category grid ──
  html += `<div class="result-grid">`;
  for (const cat of ALL_CATEGORIES) {
    const score = catConfidence[cat.id] || 0;
    const isTop = score === Math.max(...ALL_CATEGORIES.map((c) => catConfidence[c.id] || 0)) && score > 0;
    html += `
      <div class="service-card ${isTop ? 'is-primary' : ''}">
        <div class="service-icon">${cat.icon}</div>
        <div class="service-name">${cat.label}</div>
        <div class="service-score" style="color:${cat.color}">${score}%</div>
        <div class="bar-bg"><div class="bar-fill" style="width:${score}%;background:${cat.color}"></div></div>
        <div class="service-matches">${evidenceMap[cat.id]?.length || 0} match${(evidenceMap[cat.id]?.length || 0) !== 1 ? 'es' : ''}</div>
      </div>`;
  }
  html += `</div>`;

  // ── Why classified (collapsible) ──
  if (reasons.length > 0) {
    const reasonsHtml = reasons.map((r) => `<div class="reason-item">${r}</div>`).join('');
    html += `
      <div class="collapsible open" id="whySection">
        <div class="collapsible-header">
          <span class="collapsible-title">💡 Why Classified <span class="collapsible-count">${reasons.length}</span></span>
          <span class="collapsible-arrow">▼</span>
        </div>
        <div class="collapsible-body">${reasonsHtml}</div>
      </div>`;
  }

  // ── Evidence panel (collapsible, open by default) ──
  let totalEvidence   = ALL_CATEGORIES.reduce((n, c) => n + (evidenceMap[c.id]?.length || 0), 0);
  let evidenceBodyHtml = '';
  let hasAny          = false;

  for (const cat of ALL_CATEGORIES) {
    const items = evidenceMap[cat.id] || [];
    if (items.length === 0) continue;
    hasAny = true;
    evidenceBodyHtml += `
      <div class="evidence-category">
        <div class="evidence-cat-label" style="color:${cat.color}">
          ${cat.icon} ${cat.label}
          <span class="evidence-count-sm">${items.length}</span>
        </div>`;

    const displayItems = items.slice(0, 6);
    for (const item of displayItems) {
      const escapedSnippet = (item.snippet || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const displaySnippet = item.snippet
        ? item.snippet.substring(0, 80) + (item.snippet.length > 80 ? '…' : '')
        : '(no snippet)';
      const tierLabel = ['', 'Core', 'Strong', 'Supporting', 'Contextual'][item.tier] || '?';
      evidenceBodyHtml += `
        <div class="evidence-item"
             style="border-left-color:${cat.color}"
             data-url="${item.url}"
             data-xpath="${(item.xpath || '').replace(/"/g, '&quot;')}"
             data-snippet="${escapedSnippet}">
          <div class="evidence-text">"${displaySnippet}"</div>
          <div class="evidence-meta">
            <span class="badge-zone">${item.zone || item.tag}</span>
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
    evidenceBodyHtml = `<p class="no-evidence">No hardscape keyword matches. Try Deep Scan or check if the site is loaded.</p>`;
  }

  html += `
    <div class="collapsible open" id="evidenceSection">
      <div class="collapsible-header">
        <span class="collapsible-title">📌 Evidence <span class="collapsible-count">${totalEvidence}</span></span>
        <span class="collapsible-arrow">▼</span>
      </div>
      <div class="collapsible-body">${evidenceBodyHtml}</div>
    </div>`;

  // ── Keyword frequency (collapsible) ──
  let termBodyHtml = '';
  let hasTerms     = false;
  let totalTerms   = 0;

  for (const cat of ALL_CATEGORIES) {
    const terms   = termFreqMap[cat.id] || {};
    const entries = Object.entries(terms);
    if (entries.length === 0) continue;
    hasTerms = true;
    totalTerms += entries.length;
    const show = entries.sort((a, b) => b[1] - a[1]).slice(0, 8);
    termBodyHtml += `
      <div class="term-row">
        <div class="term-cat-label" style="color:${cat.color}">${cat.icon} ${cat.label}</div>
        <div class="term-chips">
          ${show.map(([t, c]) => `<span class="term-badge">${t} <strong>(${c})</strong></span>`).join('')}
          ${entries.length > 8 ? `<span class="term-more">+${entries.length - 8}</span>` : ''}
        </div>
      </div>`;
  }

  if (hasTerms) {
    html += `
      <div class="collapsible" id="phrasesSection">
        <div class="collapsible-header">
          <span class="collapsible-title">🔢 Keywords Matched <span class="collapsible-count">${totalTerms}</span></span>
          <span class="collapsible-arrow">▼</span>
        </div>
        <div class="collapsible-body">${termBodyHtml}</div>
      </div>`;
  }

  // ── Secondary services (if any) ──
  if (secondaryServices.length > 0) {
    const secChips = secondaryServices.map((s) => `<span class="sec-chip">${s}</span>`).join('');
    html += `
      <div class="secondary-section">
        <div class="section-label muted">🌿 Secondary Services Detected</div>
        <div class="chip-row">${secChips}</div>
      </div>`;
  }

  // ── Negative signals (if any) ──
  if (negativeHits.length > 0) {
    const negChips = negativeHits.map((n) => `<span class="neg-chip">${n}</span>`).join('');
    html += `
      <div class="negative-section">
        <div class="section-label negative">⛔ Penalty Signals Detected (−${negativeHits.length * 10} pts)</div>
        <div class="chip-row">${negChips}</div>
      </div>`;
  }

  // ── Scanned pages footer ──
  if (data.pages && data.pages.length > 0) {
    const pageList = data.pages.map((p) => {
      const short = (p.url || '').replace(/^https?:\/\//, '').substring(0, 30);
      return `<span class="page-badge">${short}</span>`;
    }).join('');
    html += `<div class="pages-footer">📄 ${pageList}</div>`;
  }

  container.innerHTML = html;

  // Wire collapsibles
  container.querySelectorAll('.collapsible').forEach((el) => makeCollapsible(el));

  // Attach click-to-highlight listeners on evidence items
  container.querySelectorAll('.evidence-item').forEach((el) => {
    el.addEventListener('click', async () => {
      const url   = el.dataset.url;
      const xpath = el.dataset.xpath;
      if (!xpath) return;

      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) return;

      if (url && tab.url !== url) {
        const newTab = await chrome.tabs.create({ url, active: true });
        chrome.tabs.onUpdated.addListener(function onLoaded(tabId, info) {
          if (tabId === newTab.id && info.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(onLoaded);
            setTimeout(() => chrome.tabs.sendMessage(newTab.id, { action: 'scrollTo', xpath }), 500);
          }
        });
      } else {
        chrome.tabs.sendMessage(tab.id, { action: 'scrollTo', xpath }, (res) => {
          if (res && !res.success) console.warn('[Popup] scrollTo failed:', res.error);
        });
      }
    });
  });
}

// ── DEBUG PANEL ───────────────────────────────────────────────────────────────
function toggleDebug() {
  const panel = document.getElementById('debugPanel');
  if (!panel) return;
  panel.classList.toggle('hidden');
  const btn = document.getElementById('debugToggleBtn');
  btn.classList.toggle('active', !panel.classList.contains('hidden'));
  if (!panel.classList.contains('hidden')) panel.classList.add('open');
}

function updateDebugPanel(data) {
  const body = document.getElementById('debugBody');
  if (!body) return;

  const catLines = ALL_CATEGORIES.map((cat) =>
    `${cat.icon} ${cat.label}: ${data.scoreMap?.[cat.id] || 0} pts → ${data.catConfidence?.[cat.id] || 0}%`
  ).join('<br>');

  body.innerHTML = `
    <div class="debug-row"><strong>Nodes:</strong> ${data.totalNodes || 0}</div>
    <div class="debug-row"><strong>Text:</strong> ${(data.totalText || 0).toLocaleString()} chars</div>
    <div class="debug-row"><strong>Hits:</strong> ${data.totalHits || 0}</div>
    <div class="debug-row"><strong>Scan time:</strong> ${data.scanTime || '?'}ms</div>
    <div class="debug-row"><strong>Positive score:</strong> ${data.totalPositiveScore || 0} pts</div>
    <div class="debug-row"><strong>Penalty score:</strong> −${data.penaltyScore || 0} pts (${data.negativeHits?.length || 0} signals)</div>
    <div class="debug-row"><strong>Net score:</strong> ${data.netScore || 0} pts → ${data.confidence || 0}%</div>
    <div class="debug-row"><strong>Threshold:</strong> ${420} pts = 100%</div>
    <hr class="debug-divider">
    <div class="debug-row"><strong>Category scores:</strong><br>${catLines}</div>
    ${data.negativeHits?.length > 0
      ? `<hr class="debug-divider"><div class="debug-row"><strong>Negative signals:</strong><br>${data.negativeHits.join('<br>')}</div>`
      : ''}
    ${data.debugLog && data.debugLog.length > 0
      ? `<hr class="debug-divider"><div class="debug-row"><strong>Engine log:</strong><br>${data.debugLog.join('<br>')}</div>`
      : ''}
    <div class="debug-hint">Press <kbd>D</kbd> or click 🛠 to hide.</div>
  `;
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'd' || e.key === 'D') toggleDebug();
});

// ── COPY FUNCTIONS ────────────────────────────────────────────────────────────
function copyPrimary() {
  if (!currentScanData) return;
  const conf = currentScanData.confidence || 0;
  const label = conf >= 75 ? 'Genuine Hardscape Contractor'
              : conf >= 45 ? 'Likely Hardscape Contractor'
              : conf >= 20 ? 'Possible Hardscape Work'
              : 'Not a Hardscape Company';
  navigator.clipboard.writeText(`${label} — ${conf}%`).then(() => {
    const btn  = document.getElementById('copyPrimaryBtn');
    const orig = btn.textContent;
    btn.textContent = '✅ Copied!';
    setTimeout(() => { btn.textContent = orig; }, 1500);
  });
}

function copyAll() {
  if (!currentScanData) return;
  const d      = currentScanData;
  const domain = (d.pages?.[0]?.url || '').replace(/^https?:\/\//, '').split('/')[0];
  const conf   = d.confidence || 0;
  const label  = conf >= 75 ? 'Genuine Hardscape Contractor'
               : conf >= 45 ? 'Likely Hardscape Contractor'
               : conf >= 20 ? 'Possible Hardscape Work'
               : 'Not a Hardscape Company';

  let text = `====================================\n`;
  text    += `HARDSCAPING COMPANY FINDER REPORT\n`;
  text    += `====================================\n\n`;
  text    += `Company Website : ${domain || 'Unknown'}\n`;
  text    += `Full URL        : ${d.pages?.[0]?.url || 'N/A'}\n`;
  text    += `Confidence Score: ${conf}% — ${label}\n`;
  text    += `Positive Score  : ${d.totalPositiveScore || 0} pts\n`;
  text    += `Penalty Score   : −${d.penaltyScore || 0} pts\n`;
  text    += `Net Score       : ${d.netScore || 0} pts\n\n`;

  text += `HARDSCAPING SERVICES DETECTED:\n`;
  if (d.detectedServices && d.detectedServices.length > 0) {
    d.detectedServices.forEach((s) => { text += `  • ${s}\n`; });
  } else {
    text += '  (none detected)\n';
  }

  text += `\nKEYWORDS MATCHED:\n`;
  for (const cat of ALL_CATEGORIES) {
    const terms   = d.termFreqMap?.[cat.id] || {};
    const entries = Object.entries(terms);
    if (entries.length === 0) continue;
    text += `  ${cat.label}:\n`;
    entries.sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([t, c]) => {
      text += `    "${t}" (×${c})\n`;
    });
  }

  text += `\nWHY CLASSIFIED:\n`;
  (d.reasons || []).forEach((r) => { text += `  ${r}\n`; });

  if (d.secondaryServices && d.secondaryServices.length > 0) {
    text += `\nSECONDARY SERVICES:\n`;
    d.secondaryServices.forEach((s) => { text += `  • ${s}\n`; });
  }

  if (d.negativeHits && d.negativeHits.length > 0) {
    text += `\nNEGATIVE SIGNALS (penalty keywords):\n`;
    d.negativeHits.forEach((n) => { text += `  ⛔ ${n}\n`; });
  }

  text += `\nEVIDENCE SNIPPETS:\n`;
  for (const cat of ALL_CATEGORIES) {
    const items = d.evidenceMap?.[cat.id] || [];
    if (items.length === 0) continue;
    text += `\n  ${cat.label} (${items.length} occurrences):\n`;
    items.slice(0, 5).forEach((i) => {
      text += `    [${i.zone}] "${i.snippet?.substring(0, 80) || ''}" — matched: "${i.matchedTerm}"\n`;
    });
  }

  text += `\n====================================\n`;
  text += `Generated by Hardscaping Company Finder v4.0\n`;

  navigator.clipboard.writeText(text).then(() => {
    const btn  = document.getElementById('copyAllBtn');
    const orig = btn.textContent;
    btn.textContent = '✅ Copied!';
    setTimeout(() => { btn.textContent = orig; }, 1500);
  });
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function showProgress(active) {
  const bar  = document.getElementById('progressBar');
  const fill = document.getElementById('progressFill');
  if (active) {
    bar.classList.add('active');
    let w = 0;
    fill._interval = setInterval(() => {
      w = (w + 2) % 100;
      fill.style.width = w + '%';
    }, 30);
  } else {
    bar.classList.remove('active');
    fill.style.width = '0%';
    if (fill._interval) clearInterval(fill._interval);
  }
}

function setStatus(msg) {
  const el = document.getElementById('pageIndicator');
  if (el) el.textContent = msg;
}

function showError(msg) {
  document.getElementById('resultContainer').innerHTML =
    `<div class="status-msg error-msg">❌ ${msg}</div>`;
  document.getElementById('copySection').classList.add('hidden');
}

// ── AUTO-HIGHLIGHT ────────────────────────────────────────────────────────────
async function autoHighlight(tabId, scanData) {
  if (!scanData || !scanData.termFreqMap) return;

  const terms = [];
  const seen  = new Set();
  for (const cat of ALL_CATEGORIES) {
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
    chrome.tabs.sendMessage(tabId, { action: 'highlightKeywords', terms }, (res) => {
      if (chrome.runtime.lastError) {
        console.warn('[Popup] autoHighlight error:', chrome.runtime.lastError.message);
        return;
      }
      if (res && res.success) {
        console.log(`[Popup] Highlighted ${res.highlightCount} occurrences.`);
        const clearBtn = document.getElementById('clearHighlightsBtn');
        if (clearBtn) clearBtn.classList.remove('hidden');
        const legend = document.getElementById('hlLegend');
        if (legend) legend.classList.remove('hidden');
      }
    });
  } catch (e) {
    console.warn('[Popup] autoHighlight exception:', e);
  }
}

// ── CLEAR HIGHLIGHTS ──────────────────────────────────────────────────────────
async function clearPageHighlights() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;
  chrome.tabs.sendMessage(tab.id, { action: 'clearHighlights' }, () => {
    const clearBtn = document.getElementById('clearHighlightsBtn');
    if (clearBtn) clearBtn.classList.add('hidden');
    const legend = document.getElementById('hlLegend');
    if (legend) legend.classList.add('hidden');
  });
}
