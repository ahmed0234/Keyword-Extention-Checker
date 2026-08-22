// Background Service Worker - Orchestrates deep scanning of multiple pages
// v5.0: Now passes detection mode to each page's analyzer call.
let scanState = {
  isScanning: false,
  tabIds: [],
  results: [],
  currentPage: 0,
  urlsToScan: [],
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startDeepScan") {
    startDeepScan(request.url, request.pages, request.mode || 'hardscaping').then(sendResponse);
    return true;
  }
  if (request.action === "getScanStatus") {
    sendResponse(scanState);
    return false;
  }
  if (request.action === "findCompetitors") {
    findCompetitorsOnGoogle(request.query, request.originalCompany).then(sendResponse);
    return true;
  }
  if (request.action === "fetchGoogleSheetData") {
    fetchGoogleSheetData(request.spreadsheetId, request.gid).then(sendResponse);
    return true;
  }
  if (request.action === "getRedirectUri") {
    sendResponse({ redirectUri: chrome.identity ? chrome.identity.getRedirectURL() : "" });
    return false;
  }
  if (request.action === "googleAuthGetToken") {
    googleAuthGetToken(request.interactive !== false, request.clientId).then(sendResponse);
    return true;
  }
  if (request.action === "googleAuthGetUserInfo") {
    googleAuthGetUserInfo(request.token).then(sendResponse);
    return true;
  }
  if (request.action === "googleAuthSignOut") {
    googleAuthSignOut(request.token).then(sendResponse);
    return true;
  }
  if (request.action === "sheetsApiGetMetadata") {
    sheetsApiGetMetadata(request.spreadsheetId, request.token).then(sendResponse);
    return true;
  }
  if (request.action === "sheetsApiGetValues") {
    sheetsApiGetValues(request.spreadsheetId, request.range, request.token).then(sendResponse);
    return true;
  }
  if (request.action === "sheetsApiUpdateRow") {
    sheetsApiUpdateRow(request.spreadsheetId, request.sheetTitle, request.row, request.competitor1, request.competitor2, request.token).then(sendResponse);
    return true;
  }
  if (request.action === "sheetsApiBatchUpdate") {
    sheetsApiBatchUpdate(request.spreadsheetId, request.sheetTitle, request.updates, request.token).then(sendResponse);
    return true;
  }
  if (request.action === "sheetsApiListSpreadsheets") {
    sheetsApiListSpreadsheets(request.token).then(sendResponse);
    return true;
  }
});

async function startDeepScan(baseUrl, pages, mode) {
  if (scanState.isScanning) return { error: "Scan already in progress" };

  scanState.isScanning = true;
  scanState.results = [];
  scanState.currentPage = 0;

  const normalizedBase = new URL(baseUrl).origin;

  // Build full URLs
  const fullUrls = pages
    .map((page) => {
      const url = new URL(page, normalizedBase);
      return url.href;
    })
    .filter((url, index, self) => self.indexOf(url) === index); // deduplicate

  scanState.urlsToScan = fullUrls;

  // Open tabs one by one to avoid rate limiting
  for (let i = 0; i < fullUrls.length; i++) {
    const url = fullUrls[i];
    scanState.currentPage = i;

    try {
      const tab = await chrome.tabs.create({ url, active: false });
      scanState.tabIds.push(tab.id);

      // Wait for page to load
      await new Promise((resolve) => {
        chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
          if (tabId === tab.id && info.status === "complete") {
            chrome.tabs.onUpdated.removeListener(listener);
            resolve();
          }
        });
        // timeout fallback
        setTimeout(resolve, 5000);
      });

      // Inject content script and get results for this page
      // Pass the detection mode so the correct engine runs
      const detectionMode = mode;
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (scanMode) => {
          if (window.__remodelAnalyzer) {
            return window.__remodelAnalyzer({ mode: scanMode });
          }
          return null;
        },
        args: [detectionMode],
      });

      if (results && results[0] && results[0].result) {
        scanState.results.push({
          url: url,
          pageData: results[0].result,
        });
      }

      // Close the tab to save memory
      await chrome.tabs.remove(tab.id);
    } catch (err) {
      console.error("Error scanning", url, err);
    }
  }

  scanState.isScanning = false;
  return { completed: true, results: scanState.results };
}

// ══════════════════════════════════════════════════════════════════════════════
// COMPETITOR FINDER ENGINE
// ══════════════════════════════════════════════════════════════════════════════

const DIRECTORY_DOMAINS = [
  "yelp.com", "angi.com", "angieslist.com", "homeadvisor.com", "thumbtack.com",
  "bbb.org", "yellowpages.com", "superpages.com", "nextdoor.com", "porch.com",
  "houzz.com", "facebook.com", "instagram.com", "linkedin.com", "twitter.com", "x.com",
  "mapquest.com", "indeed.com", "glassdoor.com", "forbes.com", "reddit.com",
  "expertise.com", "thisoldhouse.com", "bobvila.com", "wikipedia.org", "google.com",
  "tripadvisor.com", "groupon.com", "buildzoom.com", "alignable.com", "manta.com",
  "local.com", "chamberofcommerce.com", "usnews.com", "consumeraffairs.com", "cnet.com",
  "trustpilot.com", "sitejabber.com", "zoominfo.com", "dnb.com", "dexknows.com",
  "citysearch.com", "threebestrated.com", "bestprosintown.com", "bark.com", "networx.com",
  "toptenreviews.com", "contractorchecklist.com"
];

const DIRECTORY_KEYWORDS = [
  "yelp", "angi", "angie's list", "homeadvisor", "thumbtack", "better business bureau",
  "bbb", "yellow pages", "yellowpages", "superpages", "nextdoor", "porch", "houzz",
  "expertise.com", "this old house", "bob vila", "top 10", "10 best", "top 5", "5 best",
  "best 10", "best 15", "the 10 best", "the 15 best", "the 20 best", "find the best",
  "top rated", "cost guide", "average cost", "how to choose", "free quotes",
  "compare quotes", "directory", "contractor list", "ratings & reviews"
];

function isExcludedDirectory(title, url) {
  const lowTitle = (title || "").toLowerCase();
  const lowUrl = (url || "").toLowerCase();

  // Check URL against directory domains
  for (const dom of DIRECTORY_DOMAINS) {
    if (lowUrl.includes(dom)) return true;
  }

  // Check title against directory keywords
  for (const kw of DIRECTORY_KEYWORDS) {
    if (lowTitle.includes(kw)) return true;
  }

  // Check list-style regex patterns
  if (/\b(?:top|best|the best|find)\s+\d+\b/i.test(lowTitle)) return true;
  if (/\b\d+\s+(?:best|top|rated)\b/i.test(lowTitle)) return true;

  return false;
}

function normalizeForComparison(str) {
  if (!str) return "";
  let clean = str.toLowerCase()
    .replace(/&amp;/g, "and")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Strip generic corporate and trade suffixes
  const stopWords = [
    "\\binc\\b", "\\bincorporated\\b", "\\bllc\\b", "\\bltd\\b", "\\blimited\\b",
    "\\bco\\b", "\\bcompany\\b", "\\bcorp\\b", "\\bcorporation\\b",
    "\\bservices\\b", "\\bservice\\b", "\\bheating\\b", "\\bcooling\\b",
    "\\bhvac\\b", "\\bair\\b", "\\bconditioning\\b", "\\bplumbing\\b",
    "\\bcontractors\\b", "\\bcontractor\\b", "\\benterprises\\b", "\\bgroup\\b",
    "\\bthe\\b", "\\band\\b", "\\bpro\\b", "\\bpros\\b", "\\bmechanical\\b"
  ];

  for (const sw of stopWords) {
    clean = clean.replace(new RegExp(sw, "gi"), " ");
  }

  return clean.replace(/\s+/g, "").trim();
}

function isOriginalCompany(candidateName, originalCompany) {
  if (!candidateName || !originalCompany) return false;

  const normCandidate = normalizeForComparison(candidateName);
  const normOriginal = normalizeForComparison(originalCompany);

  if (!normCandidate || !normOriginal) return false;

  // Exact normalized match
  if (normCandidate === normOriginal) return true;

  // Substring match if long enough
  if (normOriginal.length >= 4 && (normCandidate.includes(normOriginal) || normOriginal.includes(normCandidate))) {
    return true;
  }

  return false;
}

function cleanBusinessName(rawTitle) {
  if (!rawTitle) return "";
  let clean = rawTitle.trim();

  // If title contains separators like " | ", " - ", " : ", " • ", " – ", " — "
  // usually the company name is the first or last segment
  const separators = [" | ", " - ", " – ", " — ", " : ", " • ", " · ", " / "];
  for (const sep of separators) {
    if (clean.includes(sep)) {
      const parts = clean.split(sep).map(p => p.trim()).filter(Boolean);
      if (parts.length > 1) {
        // Typically the first part is the company name unless it's a generic phrase
        const first = parts[0];
        if (!/^(home|welcome|about us|services|ac repair|hvac|contact)/i.test(first) && first.length >= 2) {
          clean = first;
          break;
        } else {
          clean = parts[parts.length - 1];
        }
      }
    }
  }

  // Remove common trailing location or marketing taglines
  clean = clean.replace(/\s*,\s*(?:LLC|Inc|Co|Corp)\.?$/i, (match) => match.trim());
  clean = clean.replace(/\s*-\s*Home$/i, "");
  clean = clean.replace(/\s*-\s*Official Website$/i, "");
  clean = clean.replace(/\s*\|\s*Official Site$/i, "");

  return clean.trim();
}

async function findCompetitorsOnGoogle(query, originalCompany) {
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&hl=en&gl=us&num=20`;
  let foundCandidates = [];

  try {
    // 1. First attempt: Render Google search in a background tab to capture full rendered DOM & Local Pack
    const tab = await chrome.tabs.create({ url: searchUrl, active: false });
    
    // Wait for tab to load
    await new Promise((resolve) => {
      let resolved = false;
      const listener = (tabId, info) => {
        if (tabId === tab.id && info.status === "complete") {
          if (!resolved) {
            resolved = true;
            chrome.tabs.onUpdated.removeListener(listener);
            resolve();
          }
        }
      };
      chrome.tabs.onUpdated.addListener(listener);
      // Timeout fallback (3.5s is plenty for Google Search HTML)
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          chrome.tabs.onUpdated.removeListener(listener);
          resolve();
        }
      }, 3500);
    });

    // Brief delay to allow client-side DOM hydration
    await new Promise((r) => setTimeout(r, 600));

    // Extract businesses from Google DOM
    const injectionResults = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const results = [];
        const seen = new Set();

        const addCandidate = (name, url, type) => {
          const trimmed = (name || "").trim();
          if (!trimmed || trimmed.length < 2 || trimmed.length > 75) return;
          // Filter out ratings, hours, generic buttons
          if (/^\d+(\.\d+)?\s*(★|stars?|\(\d+\))/i.test(trimmed)) return;
          if (/^(open|closed|closes|opens|directions|website|call|hours|address|phone|reviews?|photos?)/i.test(trimmed)) return;
          const low = trimmed.toLowerCase();
          if (seen.has(low)) return;
          seen.add(low);
          results.push({ name: trimmed, url: url || "", type });
        };

        // 1. Local 3-Pack & Places pack (High quality local contractors)
        const localSelectors = [
          'div.dbg0pd',
          'div.OSrXXb',
          'span.OSrXXb',
          'div.CCgQ5',
          'div.bJUIbe',
          'div[data-attrid="kc:/local:business_list"] div[role="heading"]',
          'div.VkpGBb div[role="heading"]',
          'div.rllt__details > div:first-child',
          'div.fontHeadlineSmall',
          'div.fontTitleMedium'
        ];
        for (const sel of localSelectors) {
          try {
            document.querySelectorAll(sel).forEach((el) => {
              addCandidate(el.innerText || el.textContent, "", "local_pack");
            });
          } catch (_) {}
        }

        // 2. Organic Search Result Headings (div.g, h3.LC20lb, h3)
        const headingSelectors = [
          'h3.LC20lb',
          'div.tF2Cxc h3',
          'div.yuRUbf h3',
          'div.MjjYud h3',
          'div.g h3',
          'h3'
        ];
        for (const sel of headingSelectors) {
          try {
            document.querySelectorAll(sel).forEach((h3) => {
              const anchor = h3.closest('a');
              const href = anchor ? anchor.getAttribute('href') : "";
              addCandidate(h3.innerText || h3.textContent, href, "organic");
            });
          } catch (_) {}
        }

        return results;
      }
    }).catch((err) => {
      console.warn("[Background] executeScript error:", err);
      return null;
    });

    // Close background tab safely
    try {
      if (tab && tab.id) await chrome.tabs.remove(tab.id);
    } catch (_) {}

    if (injectionResults && injectionResults[0] && Array.isArray(injectionResults[0].result)) {
      foundCandidates = injectionResults[0].result;
    }
  } catch (err) {
    console.warn("[Background] Tab search error, using fetch fallback:", err);
  }

  // 2. Fallback attempt via fetch if tab search returned empty
  if (foundCandidates.length === 0) {
    try {
      const resp = await fetch(searchUrl, {
        headers: {
          "Accept-Language": "en-US,en;q=0.9",
          "User-Agent": navigator.userAgent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        }
      });
      const htmlText = await resp.text();

      const addCandidateFromRegex = (name, url, type) => {
        const clean = (name || "").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').trim();
        if (clean && clean.length >= 2 && clean.length <= 75) {
          if (!/^\d+(\.\d+)?\s*(★|stars?|\(\d+\))/i.test(clean) && !/^(open|closed|directions|website|call)/i.test(clean)) {
            foundCandidates.push({ name: clean, url: url || "", type });
          }
        }
      };

      // Match Google Mobile/Standard HTML classes
      // Class BNeawe vvjwJb AP7Wnd is Google's main search result title class
      const bneaweRegex = /<div class="BNeawe vvjwJb AP7Wnd">([\s\S]*?)<\/div>/gi;
      let m;
      while ((m = bneaweRegex.exec(htmlText)) !== null) {
        addCandidateFromRegex(m[1], "", "fetch_bneawe");
      }

      // Match h3 tags in HTML
      const h3Regex = /<h3[^>]*>([\s\S]*?)<\/h3>/gi;
      while ((m = h3Regex.exec(htmlText)) !== null) {
        addCandidateFromRegex(m[1], "", "fetch_h3");
      }

      // Match vvjwJb class
      const vvRegex = /<div class="[^"]*vvjwJb[^"]*">([\s\S]*?)<\/div>/gi;
      while ((m = vvRegex.exec(htmlText)) !== null) {
        addCandidateFromRegex(m[1], "", "fetch_vv");
      }

      // Match OSrXXb (Local pack in fetch)
      const osrRegex = /<(?:div|span) class="[^"]*OSrXXb[^"]*">([\s\S]*?)<\/(?:div|span)>/gi;
      while ((m = osrRegex.exec(htmlText)) !== null) {
        addCandidateFromRegex(m[1], "", "fetch_osr");
      }
    } catch (fetchErr) {
      console.error("[Background] Fetch search also failed:", fetchErr);
    }
  }

  // 3. Filter candidates strictly according to rules
  const validCompetitors = [];
  const seenNormalized = new Set();

  // Normalize original company for exclusion
  const normOriginal = normalizeForComparison(originalCompany);
  if (normOriginal) seenNormalized.add(normOriginal);

  for (const item of foundCandidates) {
    const rawName = item.name;
    const url = item.url || "";

    // Exclude directories and aggregators
    if (isExcludedDirectory(rawName, url)) continue;

    // Clean business name
    const cleaned = cleanBusinessName(rawName);
    if (!cleaned || cleaned.length < 2 || cleaned.length > 70) continue;

    // Exclude original company
    if (isOriginalCompany(cleaned, originalCompany)) continue;

    // Exclude generic non-business names
    if (/^(people also ask|related searches|videos|images|maps|more businesses|directions|website|sponsored|top \d+|best \d+|find local)/i.test(cleaned)) {
      continue;
    }

    const norm = normalizeForComparison(cleaned);
    if (!norm || norm.length < 2) continue;

    // Deduplicate
    if (seenNormalized.has(norm)) continue;

    seenNormalized.add(norm);
    validCompetitors.push(cleaned);

    if (validCompetitors.length >= 3) break;
  }

  return {
    success: true,
    query,
    originalCompany,
    competitor1: validCompetitors[0] || "",
    competitor2: validCompetitors[1] || "",
    competitor3: validCompetitors[2] || "",
    totalFound: validCompetitors.length,
    allCandidates: validCompetitors
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// GOOGLE SHEETS DATA FETCHER (GViz / CSV)
// ══════════════════════════════════════════════════════════════════════════════

async function fetchGoogleSheetData(spreadsheetId, gid = "0") {
  try {
    const exportUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
    const resp = await fetch(exportUrl, { credentials: "include" });
    if (!resp.ok) {
      // Try GViz endpoint fallback
      const gvizUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&gid=${gid}`;
      const gvizResp = await fetch(gvizUrl, { credentials: "include" });
      if (!gvizResp.ok) throw new Error(`Google Sheets returned status ${resp.status}`);
      const gvizText = await gvizResp.text();
      // GViz returns /*O_o*/ google.visualization.Query.setResponse({...});
      const jsonMatch = gvizText.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\);/);
      if (jsonMatch && jsonMatch[1]) {
        const data = JSON.parse(jsonMatch[1]);
        return { success: true, type: "gviz", data: parseGvizData(data) };
      }
    }

    const csvText = await resp.text();
    const rows = parseCSV(csvText);
    return { success: true, type: "csv", rows };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function parseCSV(text) {
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
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentVal.trim());
      currentVal = "";
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      row.push(currentVal.trim());
      lines.push(row);
      row = [];
      currentVal = "";
    } else {
      currentVal += char;
    }
  }
  if (currentVal || row.length > 0) {
    row.push(currentVal.trim());
    lines.push(row);
  }

  // Trim only trailing empty rows at the end of the file
  while (lines.length > 0 && lines[lines.length - 1].every(c => c === "")) {
    lines.pop();
  }

  return lines;
}

function parseGvizData(gviz) {
  if (!gviz || !gviz.table || !gviz.table.rows) return [];
  return gviz.table.rows.map(r => {
    return (r.c || []).map(cell => (cell && cell.v !== null && cell.v !== undefined) ? String(cell.v) : "");
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// GOOGLE OAUTH 2.0 & SHEETS API v4 INTEGRATION
// ══════════════════════════════════════════════════════════════════════════════

const GOOGLE_AUTH_SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile"
];

// Default public OAuth client ID for extension (or user can configure their own)
const DEFAULT_CLIENT_ID = "336829774642-4q3f0449k1v268a719g8eb5l7nsvcv79.apps.googleusercontent.com";

async function getSavedClientId() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["googleOAuthClientId"], (res) => {
      resolve(res.googleOAuthClientId || DEFAULT_CLIENT_ID);
    });
  });
}

async function googleAuthGetToken(interactive = true, customClientId = null) {
  // 1. Check for valid cached token in storage
  const cached = await new Promise((resolve) => {
    chrome.storage.local.get(["googleAuthToken", "googleAuthTokenExpiry"], resolve);
  });

  if (cached.googleAuthToken && cached.googleAuthTokenExpiry && Date.now() < cached.googleAuthTokenExpiry - 60000) {
    return { success: true, token: cached.googleAuthToken, fromCache: true };
  }

  // 2. Determine Client ID
  const clientId = customClientId || (await getSavedClientId());
  if (!clientId) {
    return {
      success: false,
      error: "Google OAuth Client ID is missing. Please set your Client ID in Settings."
    };
  }

  // 3. Try chrome.identity.launchWebAuthFlow (Universal OAuth 2.0 Web Flow)
  const redirectUri = chrome.identity.getRedirectURL();
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(GOOGLE_AUTH_SCOPES.join(" "))}&prompt=select_account`;

  try {
    const responseUrl = await new Promise((resolve, reject) => {
      chrome.identity.launchWebAuthFlow(
        { url: authUrl, interactive: interactive },
        (redirectUrl) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else if (!redirectUrl) {
            reject(new Error("Authorization cancelled or failed."));
          } else {
            resolve(redirectUrl);
          }
        }
      );
    });

    // Parse token and expiresIn from URL hash: #access_token=...&expires_in=...
    const hash = responseUrl.split("#")[1] || "";
    const params = new URLSearchParams(hash);
    const token = params.get("access_token");
    const expiresIn = parseInt(params.get("expires_in") || "3599", 10);

    if (!token) {
      const error = params.get("error") || "No access token found in OAuth response.";
      return { success: false, error };
    }

    const expiryTime = Date.now() + (expiresIn * 1000);
    await new Promise((r) => chrome.storage.local.set({
      googleAuthToken: token,
      googleAuthTokenExpiry: expiryTime
    }, r));

    return { success: true, token, expiryTime };
  } catch (err) {
    // 4. If launchWebAuthFlow fails and manifest has oauth2, try getAuthToken as fallback
    try {
      const tokenRes = await new Promise((resolve) => {
        chrome.identity.getAuthToken({ interactive: interactive }, (tok) => {
          if (chrome.runtime.lastError || !tok) {
            resolve(null);
          } else {
            resolve(tok);
          }
        });
      });

      if (tokenRes) {
        await new Promise((r) => chrome.storage.local.set({
          googleAuthToken: tokenRes,
          googleAuthTokenExpiry: Date.now() + 3500000
        }, r));
        return { success: true, token: tokenRes };
      }
    } catch (_) {}

    return { success: false, error: err.message || "Failed to authenticate with Google." };
  }
}

async function googleAuthGetUserInfo(token) {
  if (!token) {
    const tokenRes = await googleAuthGetToken(false);
    if (!tokenRes.success) return { success: false, error: "Not signed in" };
    token = tokenRes.token;
  }

  try {
    const resp = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!resp.ok) {
      if (resp.status === 401) {
        // Token expired, clear cache
        await new Promise((r) => chrome.storage.local.remove(["googleAuthToken", "googleAuthTokenExpiry"], r));
      }
      return { success: false, status: resp.status, error: "Failed to get user profile" };
    }
    const user = await resp.json();
    return { success: true, user };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function googleAuthSignOut(token) {
  try {
    if (token) {
      try {
        await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(token)}`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
      } catch (_) {}

      try {
        chrome.identity.removeCachedAuthToken({ token }, () => {});
      } catch (_) {}
    }

    await new Promise((r) => chrome.storage.local.remove([
      "googleAuthToken",
      "googleAuthTokenExpiry",
      "googleUserProfile"
    ], r));

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function getValidAuthToken() {
  const res = await googleAuthGetToken(false);
  if (res.success && res.token) return res.token;
  return null;
}

// ── Google Sheets API v4 Endpoints ──

async function sheetsApiGetMetadata(spreadsheetId, passedToken = null) {
  const token = passedToken || (await getValidAuthToken());
  if (!token) {
    return { success: false, error: "Google OAuth sign-in required.", requireAuth: true };
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=spreadsheetId,properties.title,sheets(properties(sheetId,title,index,gridProperties))`;
    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!resp.ok) {
      const errJson = await resp.json().catch(() => ({}));
      const msg = errJson.error ? errJson.error.message : `HTTP ${resp.status}`;
      if (resp.status === 401) {
        await new Promise((r) => chrome.storage.local.remove(["googleAuthToken", "googleAuthTokenExpiry"], r));
        return { success: false, error: "Session expired. Please sign in again.", requireAuth: true };
      }
      if (resp.status === 403) {
        return { success: false, error: `Access denied. Ensure your Google account has Editor access to this spreadsheet (${msg})` };
      }
      return { success: false, error: msg };
    }

    const data = await resp.json();
    const sheets = (data.sheets || []).map((s) => ({
      sheetId: s.properties.sheetId,
      title: s.properties.title,
      index: s.properties.index,
      rowCount: s.properties.gridProperties ? s.properties.gridProperties.rowCount : 0,
      columnCount: s.properties.gridProperties ? s.properties.gridProperties.columnCount : 0
    }));

    return {
      success: true,
      spreadsheetId: data.spreadsheetId,
      title: data.properties ? data.properties.title : "Google Sheet",
      sheets
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function sheetsApiGetValues(spreadsheetId, range, passedToken = null) {
  const token = passedToken || (await getValidAuthToken());
  if (!token) {
    return { success: false, error: "Google OAuth sign-in required.", requireAuth: true };
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueRenderOption=UNFORMATTED_VALUE`;
    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!resp.ok) {
      const errJson = await resp.json().catch(() => ({}));
      const msg = errJson.error ? errJson.error.message : `HTTP ${resp.status}`;
      return { success: false, error: msg };
    }

    const data = await resp.json();
    return {
      success: true,
      range: data.range,
      values: data.values || []
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function sheetsApiUpdateRow(spreadsheetId, sheetTitle, row, comp1, comp2, passedToken = null) {
  const token = passedToken || (await getValidAuthToken());
  if (!token) {
    return { success: false, error: "Google OAuth sign-in required.", requireAuth: true };
  }

  try {
    const safeSheetTitle = sheetTitle ? `'${sheetTitle.replace(/'/g, "''")}'` : "";
    const range = safeSheetTitle ? `${safeSheetTitle}!H${row}:I${row}` : `H${row}:I${row}`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;

    const resp = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        range,
        majorDimension: "ROWS",
        values: [[comp1 || "", comp2 || ""]]
      })
    });

    if (!resp.ok) {
      const errJson = await resp.json().catch(() => ({}));
      const msg = errJson.error ? errJson.error.message : `HTTP ${resp.status}`;
      if (resp.status === 403) {
        return { success: false, error: "Permission Denied: Your Google account needs Editor permission on this sheet to save changes." };
      }
      return { success: false, error: msg };
    }

    const data = await resp.json();
    return {
      success: true,
      updatedRange: data.updatedRange,
      updatedRows: data.updatedRows,
      updatedCells: data.updatedCells
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function sheetsApiBatchUpdate(spreadsheetId, sheetTitle, updates, passedToken = null) {
  const token = passedToken || (await getValidAuthToken());
  if (!token) {
    return { success: false, error: "Google OAuth sign-in required.", requireAuth: true };
  }

  if (!updates || updates.length === 0) {
    return { success: true, updatedCount: 0, message: "No updates to apply." };
  }

  try {
    const safeSheetTitle = sheetTitle ? `'${sheetTitle.replace(/'/g, "''")}'` : "";
    const dataPayload = updates.map((u) => {
      const range = safeSheetTitle ? `${safeSheetTitle}!H${u.row}:I${u.row}` : `H${u.row}:I${u.row}`;
      return {
        range,
        majorDimension: "ROWS",
        values: [[u.competitor1 || "", u.competitor2 || ""]]
      };
    });

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`;
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        valueInputOption: "USER_ENTERED",
        data: dataPayload
      })
    });

    if (!resp.ok) {
      const errJson = await resp.json().catch(() => ({}));
      const msg = errJson.error ? errJson.error.message : `HTTP ${resp.status}`;
      if (resp.status === 403) {
        return { success: false, error: "Permission Denied: Your Google account needs Editor permission on this sheet to save changes." };
      }
      return { success: false, error: msg };
    }

    const data = await resp.json();
    return {
      success: true,
      totalUpdatedRows: data.totalUpdatedRows || updates.length,
      totalUpdatedCells: data.totalUpdatedCells || updates.length * 2,
      response: data
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function sheetsApiListSpreadsheets(passedToken = null) {
  const token = passedToken || (await getValidAuthToken());
  if (!token) {
    return { success: false, error: "Google OAuth sign-in required.", requireAuth: true };
  }

  try {
    const url = `https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.spreadsheet' and trashed = false&fields=files(id,name,modifiedTime)&orderBy=modifiedTime desc&pageSize=25`;
    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!resp.ok) {
      const errJson = await resp.json().catch(() => ({}));
      return { success: false, error: errJson.error ? errJson.error.message : `HTTP ${resp.status}` };
    }

    const data = await resp.json();
    return { success: true, files: data.files || [] };
  } catch (err) {
    return { success: false, error: err.message };
  }
}


