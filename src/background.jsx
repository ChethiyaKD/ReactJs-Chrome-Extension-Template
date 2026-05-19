// Background service worker for Sri Lanka Bank USD Rates Extension

const defaultMockRates = {
  google: "305.50",
  cbsl: "302.25",
  cbsl_buy: "291.10",
  ComBank: "303.00",
  ComBank_Buy: "292.00",
  BOC: "304.00",
  BOC_Buy: "293.00",
  NTB: "305.00",
  NTB_Buy: "294.00",
  Seylan: "301.50",
  Seylan_Buy: "295.50",
  Sampath: "303.75",
  Sampath_Buy: "292.50",
  hnb: "304.25",
  hnb_buy: "293.25",
};

// Helper to fetch rates from the live API
async function fetchRatesFromApi() {
  try {
    const response = await fetch("http://usd-rate-checker.dev.chethiya-kusal.me/");
    if (!response.ok) throw new Error("API response not ok");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching live rates:", error);
    return null;
  }
}

// Update the extension badge with the selected rate
async function updateBadge(directSource, directType, directTab) {
  try {
    console.log("[Service Worker] updateBadge invocation:", { directSource, directType, directTab });

    chrome.storage.local.get(["rates", "badgeSource", "badgeType", "activeTab"], (stored) => {
      const rates = (stored && stored.rates) || {};
      const badgeSource = directSource || (stored && stored.badgeSource) || "average";
      const badgeType = directType || (stored && stored.badgeType) || "selling";
      const activeTab = directTab || (stored && stored.activeTab) || "selling";

      console.log("[Service Worker] Resolved config:", { badgeSource, badgeType, activeTab });

      // Determine the effective rate type (selling or buying)
      const rateType = badgeType;

      let rateValue = null;

      if (badgeSource === "average") {
        // Calculate average of the 6 commercial banks based on effective rate type
        const keys = rateType === "selling"
          ? ["ComBank", "NTB", "hnb", "Sampath", "Seylan", "BOC"]
          : ["ComBank_Buy", "NTB_Buy", "hnb_buy", "Sampath_Buy", "Seylan_Buy", "BOC_Buy"];
        
        let sum = 0;
        let count = 0;
        keys.forEach(k => {
          const val = rates[k] || defaultMockRates[k]; // PER-KEY FALLBACK
          if (val) {
            sum += parseFloat(val);
            count++;
          }
        });
        if (count > 0) {
          rateValue = sum / count;
        }
      } else {
        // Look up specific rate source (e.g. ComBank, Google, CBSL)
        let key = badgeSource;
        if (badgeSource !== "google" && badgeSource !== "cbsl") {
          // It's a commercial bank, check effective rate type suffix
          key = rateType === "selling" ? badgeSource : `${badgeSource}_Buy`;
        } else if (badgeSource === "cbsl") {
          key = rateType === "selling" ? "cbsl" : "cbsl_buy";
        }
        
        const rawVal = rates[key] || defaultMockRates[key]; // PER-KEY FALLBACK
        if (rawVal) {
          rateValue = parseFloat(rawVal);
        }
      }

      console.log("[Service Worker] Calculated rateValue:", rateValue);

      if (rateValue && !isNaN(rateValue)) {
        // Round to nearest integer to fit on standard badge (e.g. "303")
        const badgeText = Math.round(rateValue).toString();
        chrome.action.setBadgeText({ text: badgeText });
        chrome.action.setBadgeBackgroundColor({ color: "#10b981" }); // Emerald green badge
        console.log("[Service Worker] Badge successfully set to:", badgeText);
      } else {
        chrome.action.setBadgeText({ text: "" });
        console.log("[Service Worker] Badge set to empty (no rateValue found)");
      }
    });
  } catch (err) {
    console.error("Error updating extension badge:", err);
  }
}

// Initialize badge immediately on service worker startup
updateBadge();

// Alarm to periodicially fetch rates, notify, and update the badge
if (typeof chrome !== "undefined" && chrome.alarms) {
  chrome.alarms.create("fetchRateAlarm", { periodInMinutes: 15 });
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "fetchRateAlarm") {
      (async () => {
        const rates = await fetchRatesFromApi();
        if (rates) {
          chrome.storage.local.set({ rates }, () => {
            updateBadge();
          });
        }
      })();
    }
  });
}

// Listener for communications from popup and settings modal
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("[Service Worker] Message received:", msg);
  if (msg.command === "getData") {
    (async () => {
      const rates = await fetchRatesFromApi();
      if (rates) {
        chrome.storage.local.set({ rates }, () => {
          updateBadge();
        });
        sendResponse(rates);
      } else {
        // Fallback to storage if offline
        chrome.storage.local.get("rates", (stored) => {
          updateBadge(); // Ensure badge is updated even when offline
          sendResponse(stored.rates || null);
        });
      }
    })();
    return true; // Keep message channel open for async response
  } else if (msg.command === "updateBadge") {
    updateBadge(msg.badgeSource, msg.badgeType, msg.activeTab);
    sendResponse({ success: true });
  }
});

// Set up initial configurations and context menus on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["badgeSource", "badgeType", "activeTab", "notifications"], (stored) => {
    const updates = {};
    if (typeof stored.badgeSource === "undefined") updates.badgeSource = "average";
    if (typeof stored.badgeType === "undefined") updates.badgeType = "selling";
    if (typeof stored.activeTab === "undefined") updates.activeTab = "selling";
    if (typeof stored.notifications === "undefined") updates.notifications = true;
    
    if (Object.keys(updates).length > 0) {
      chrome.storage.local.set(updates, () => {
        updateBadge();
      });
    } else {
      updateBadge();
    }
  });

  // Register selection context menu safely
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "showRatesForAmount",
      title: "Show LK USD rates for '%s'",
      contexts: ["selection"]
    });
  });
});

// Listener for context menu clicks
if (typeof chrome !== "undefined" && chrome.contextMenus) {
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "showRatesForAmount" && tab) {
      const selection = info.selectionText || "";
      // Strip out commas and match standard numerical patterns
      const cleanedSelection = selection.replace(/,/g, "").match(/[0-9.]+/);
      const amount = cleanedSelection ? parseFloat(cleanedSelection[0]) : 1.0;
      
      console.log("[Service Worker] Context menu clicked. Cleaned selection:", selection, "=> Parsed amount:", amount);

      chrome.storage.local.get("rates", (stored) => {
        const rates = (stored && stored.rates) || defaultMockRates;
        chrome.tabs.sendMessage(tab.id, {
          command: "showConversionPopup",
          amount: amount,
          rates: rates
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.warn(
              "Could not dispatch conversion payload. The content script might not be active on this webpage tab.",
              chrome.runtime.lastError.message
            );
          }
        });
      });
    }
  });
}
