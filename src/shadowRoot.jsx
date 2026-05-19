import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { getBrowser } from "./utils/browser";

export const initPopup = async (amount, rates) => {
  const popup = document.createElement("div");
  popup.id = "react-chrome-extension-popup";
  popup.style.position = "fixed";
  popup.style.top = "20px";
  popup.style.right = "20px";
  popup.style.width = "370px";
  popup.style.height = "490px";
  popup.style.backgroundColor = "transparent";
  popup.style.zIndex = "999999999";
  popup.style.display = "flex";
  
  // Slide-in transition setup
  popup.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease";
  popup.style.transform = "translateX(420px)";
  popup.style.opacity = "0";

  const shadowRoot = popup.attachShadow({ mode: "open" });
  const reactContainer = document.createElement("div");
  reactContainer.id = "react-target";
  reactContainer.style.width = "100%";
  reactContainer.style.height = "100%";
  shadowRoot.appendChild(reactContainer);

  // Load the built CSS file with Tailwind styles
  const linkElement = document.createElement("link");
  linkElement.rel = "stylesheet";
  linkElement.href = getBrowser().runtime.getURL("shadow-root.css");
  shadowRoot.appendChild(linkElement);

  document.body.appendChild(popup);

  // Trigger browser layout before animate
  popup.getBoundingClientRect();
  popup.style.transform = "translateX(0)";
  popup.style.opacity = "1";

  const closePopup = () => {
    popup.style.transform = "translateX(420px)";
    popup.style.opacity = "0";
    setTimeout(() => {
      popup.remove();
    }, 400);
  };

  const root = createRoot(reactContainer);
  root.render(
    <App amount={amount} rates={rates} onClose={closePopup} />
  );

  return { popup, shadowRoot, root, close: closePopup };
};
