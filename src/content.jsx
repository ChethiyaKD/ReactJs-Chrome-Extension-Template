import React from "react";
import { initPopup } from "./shadowRoot";

let activePopupInstance = null;

const showPopup = (amount, rates) => {
  // If a popup is already rendered on the page, gracefully remove it first
  const existing = document.querySelector("#react-chrome-extension-popup");
  if (existing) {
    existing.remove();
  }

  // Initialize a fresh new slide-in Shadow DOM popup instance
  initPopup(amount, rates).then((instance) => {
    activePopupInstance = instance;
  });
};

if (typeof chrome !== "undefined" && chrome.runtime) {
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log("[Content Script] Message received:", msg);
    if (msg.command === "showConversionPopup") {
      showPopup(msg.amount, msg.rates);
      sendResponse({ success: true });
    }
  });
}
