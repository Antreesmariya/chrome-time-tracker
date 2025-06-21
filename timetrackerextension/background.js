let currentTabId = null;
let currentDomain = null;
let startTime = null;

function getDomainFromUrl(url) {
  try {
    return new URL(url).hostname;
  } catch (e) {
    return null;
  }
}

function storeTime(domain, duration) {
  if (!domain || duration <= 0) return;

  chrome.storage.local.get([domain], (result) => {
    const previous = result[domain] || 0;
    chrome.storage.local.set({ [domain]: previous + duration });
  });
}

function handleTabChange(newTab) {
  const endTime = Date.now();

  // Save time for previous tab
  if (currentDomain && startTime) {
    const timeSpent = endTime - startTime;
    storeTime(currentDomain, timeSpent);
  }

  // Start tracking new tab
  const url = newTab.url;
  currentDomain = getDomainFromUrl(url);
  startTime = endTime;
}

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    handleTabChange(tab);
    currentTabId = tab.id;
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === "complete") {
    handleTabChange(tab);
  }
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) return;
  chrome.windows.get(windowId, { populate: true }, (window) => {
    const activeTab = window.tabs.find((t) => t.active);
    if (activeTab) {
      handleTabChange(activeTab);
    }
  });
});
