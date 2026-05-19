import { initializeApp } from "firebase/app";
import { getToken } from "firebase/messaging";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";
import {
  defaultMockRates,
  fetchRatesFromApi,
  pairTokenWithBackend,
  processIncomingNotification,
} from "./utils/rateService";

const firebaseConfig = {
  apiKey: "AIzaSyDN4MpxsPchga5_mKFD27tEN21QhQ-eF9o",
  authDomain: "usd-rate-checker.firebaseapp.com",
  projectId: "usd-rate-checker",
  storageBucket: "usd-rate-checker.firebasestorage.app",
  messagingSenderId: "305658572674",
  appId: "1:305658572674:web:d63335360102845174a99b",
  measurementId: "G-VDLX12HSHD",
};

const VAPID_KEY =
  "BFOhWquikoxkmVZERfjyScGq8L3tpNuaaWFjWbwEVF6ZP6gPcW57Pf7kbfDGsGNxQVQWFtt1ndzxm8j4p3BPfms";

let app = null;
let messaging = null;

try {
  app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
} catch (err) {
  console.error("Failed to initialize Firebase:", err);
}

async function updateBadge(directSource, directType, directTab) {
  try {
    console.log("[Service Worker] updateBadge invocation:", {
      directSource,
      directType,
      directTab,
    });

    chrome.storage.local.get(
      ["rates", "badgeSource", "badgeType", "activeTab"],
      (stored) => {
        const rates = (stored && stored.rates) || {};
        const badgeSource =
          directSource || (stored && stored.badgeSource) || "average";
        const badgeType =
          directType || (stored && stored.badgeType) || "selling";
        const activeTab =
          directTab || (stored && stored.activeTab) || "selling";

        console.log("[Service Worker] Resolved config:", {
          badgeSource,
          badgeType,
          activeTab,
        });

        const rateType = badgeType;
        let rateValue = null;

        if (badgeSource === "average") {
          const keys =
            rateType === "selling"
              ? ["ComBank", "NTB", "hnb", "Sampath", "Seylan", "BOC"]
              : [
                  "ComBank_Buy",
                  "NTB_Buy",
                  "hnb_buy",
                  "Sampath_Buy",
                  "Seylan_Buy",
                  "BOC_Buy",
                ];

          let sum = 0;
          let count = 0;
          keys.forEach((k) => {
            const val = rates[k] || defaultMockRates[k];
            if (val) {
              sum += parseFloat(val);
              count++;
            }
          });
          if (count > 0) {
            rateValue = sum / count;
          }
        } else {
          let key = badgeSource;
          if (badgeSource !== "google" && badgeSource !== "cbsl") {
            key = rateType === "selling" ? badgeSource : `${badgeSource}_Buy`;
          } else if (badgeSource === "cbsl") {
            key = rateType === "selling" ? "cbsl" : "cbsl_buy";
          }

          const rawVal = rates[key] || defaultMockRates[key];
          if (rawVal) {
            rateValue = parseFloat(rawVal);
          }
        }

        console.log("[Service Worker] Calculated rateValue:", rateValue);

        if (rateValue && !isNaN(rateValue)) {
          const badgeText = Math.round(rateValue).toString();
          chrome.action.setBadgeText({ text: badgeText });
          chrome.action.setBadgeBackgroundColor({ color: "#10b981" });
          console.log("[Service Worker] Badge successfully set to:", badgeText);
        } else {
          chrome.action.setBadgeText({ text: "" });
          console.log(
            "[Service Worker] Badge set to empty (no rateValue found)",
          );
        }
      },
    );
  } catch (err) {
    console.error("Error updating extension badge:", err);
  }
}

updateBadge();

if (typeof chrome !== "undefined" && chrome.alarms) {
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
        chrome.storage.local.get("rates", (stored) => {
          updateBadge();
          sendResponse(stored.rates || null);
        });
      }
    })();
    return true;
  } else if (msg.command === "updateBadge") {
    updateBadge(msg.badgeSource, msg.badgeType, msg.activeTab);
    sendResponse({ success: true });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.remove("fcmToken");
  chrome.storage.local.get(
    ["badgeSource", "badgeType", "activeTab", "notifications"],
    (stored) => {
      const updates = {};
      if (typeof stored.badgeSource === "undefined")
        updates.badgeSource = "average";
      if (typeof stored.badgeType === "undefined")
        updates.badgeType = "selling";
      if (typeof stored.activeTab === "undefined")
        updates.activeTab = "selling";
      if (typeof stored.notifications === "undefined")
        updates.notifications = true;

      if (Object.keys(updates).length > 0) {
        chrome.storage.local.set(updates, () => {
          updateBadge();
        });
      } else {
        updateBadge();
      }
    },
  );

  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "showRatesForAmount",
      title: "Show LK USD rates for '%s'",
      contexts: ["selection"],
    });
  });
});

if (typeof chrome !== "undefined" && chrome.contextMenus) {
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "showRatesForAmount" && tab) {
      const selection = info.selectionText || "";
      const cleanedSelection = selection.replace(/,/g, "").match(/[0-9.]+/);
      const amount = cleanedSelection ? parseFloat(cleanedSelection[0]) : 1.0;

      console.log(
        "[Service Worker] Context menu clicked. Cleaned selection:",
        selection,
        "=> Parsed amount:",
        amount,
      );

      chrome.storage.local.get("rates", (stored) => {
        const rates = (stored && stored.rates) || defaultMockRates;
        chrome.tabs.sendMessage(
          tab.id,
          {
            command: "showConversionPopup",
            amount: amount,
            rates: rates,
          },
          (response) => {
            if (chrome.runtime.lastError) {
              console.warn(
                "Could not dispatch conversion payload. The content script might not be active on this webpage tab.",
                chrome.runtime.lastError.message,
              );
            }
          },
        );
      });
    }
  });
}

const FCM_SENDER_ID = "305658572674";
let isRegisteringFcm = false;

function registerFcmPushToken() {
  if (messaging) {
    chrome.storage.local.get("fcmToken", async (stored) => {
      if (stored && stored.fcmToken) {
        pairTokenWithBackend(stored.fcmToken);
        return;
      }

      try {
        const registrationId = await getToken(messaging, {
          serviceWorkerRegistration: self.registration,
          vapidKey: VAPID_KEY,
        });

        if (registrationId) {
          chrome.storage.local.set({ fcmToken: registrationId });
          pairTokenWithBackend(registrationId);
        }
      } catch (err) {
        console.error("FCM registration failed:", err);
      }
    });
    return;
  }

  if (typeof chrome !== "undefined" && chrome.gcm) {
    if (isRegisteringFcm) return;
    isRegisteringFcm = true;

    chrome.storage.local.get("fcmToken", (stored) => {
      if (stored && stored.fcmToken) {
        pairTokenWithBackend(stored.fcmToken);
        isRegisteringFcm = false;
        return;
      }

      chrome.gcm.register([FCM_SENDER_ID], (registrationId) => {
        isRegisteringFcm = false;
        if (chrome.runtime.lastError) return;
        chrome.storage.local.set({ fcmToken: registrationId });
        pairTokenWithBackend(registrationId);
      });
    });
  }
}

async function startExtension() {
  const isBrave =
    typeof navigator !== "undefined" &&
    navigator.brave &&
    typeof navigator.brave.isBrave === "function"
      ? await navigator.brave.isBrave()
      : false;

  if (isBrave) {
    if (typeof chrome !== "undefined" && chrome.alarms) {
      chrome.alarms.create("fetchRateAlarm", { periodInMinutes: 15 });
    }
  } else {
    registerFcmPushToken();
  }
}

if (typeof self !== "undefined" && self.registration) {
  if (self.registration.active) {
    startExtension();
  } else {
    self.addEventListener("activate", () => {
      startExtension();
    });
  }
} else {
  startExtension();
}

if (messaging) {
  onBackgroundMessage(messaging, (payload) => {
    if (payload && payload.data) {
      processIncomingNotification(payload.data, updateBadge);
    }
  });
}

if (typeof chrome !== "undefined" && chrome.gcm) {
  chrome.gcm.onMessage.addListener((message) => {
    if (message && message.data) {
      processIncomingNotification(message.data, updateBadge);
    }
  });
}
