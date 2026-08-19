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
