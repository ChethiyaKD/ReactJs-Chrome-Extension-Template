import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { getFromStorage, saveToStorage } from "./controllers/storageController.js";
import Header from "./components/Header";
import Tabs from "./components/Tabs";
import RateCard from "./components/RateCard";
import SettingsModal from "./components/SettingsModal";
import SkeletonLoader from "./components/SkeletonLoader";
import "./index.css";

import googleLogo from "./assets/images/google.png";
import combankLogo from "./assets/images/combank.png";
import ntbLogo from "./assets/images/ntb.png";
import hnbLogo from "./assets/images/hnb.png";
import sampathLogo from "./assets/images/sampath.png";
import seylanLogo from "./assets/images/seylan.png";
import bocLogo from "./assets/images/boc.png";

function Popup() {
  const [rates, setRates] = useState(null);
  const [activeTab, setActiveTab] = useState("selling");
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = () => {
      const mockData = {
        google: "305.50",
        ComBank: "303.00",
        ComBank_Buy: "292.00",
        BOC: "304.00",
        BOC_Buy: "293.00",
        NTB: "305.00",
        NTB_Buy: "294.00",
        Seylan: "304.50",
        Seylan_Buy: "293.50",
        Sampath: "303.75",
        Sampath_Buy: "292.50",
        hnb: "304.25",
        hnb_buy: "293.25",
      };

      if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage({ command: "getData" }, (response) => {
          if (chrome.runtime.lastError) {
            console.warn("Chrome runtime error:", chrome.runtime.lastError.message);
            setRates(mockData);
          } else if (response) {
            setRates(response);
          } else {
            console.warn("Received empty response from background script. Falling back to mock data.");
            setRates(mockData);
          }
          setLoading(false);
        });
      } else {
        setTimeout(() => {
          setRates(mockData);
          setLoading(false);
        }, 1000);
      }
    };

    const fetchSettings = async () => {
      try {
        const stored = await getFromStorage(["notifications"]);
        if (stored && typeof stored.notifications !== "undefined") {
          setNotifications(stored.notifications);
        }
      } catch (err) {
        console.warn("Storage API not available, using default notification setting.");
      }
    };

    fetchRates();
    fetchSettings();
  }, []);

  const handleToggleNotifications = async (val) => {
    setNotifications(val);
    try {
      await saveToStorage({ notifications: val });
    } catch (err) {
      console.warn("Failed to save notification preferences to storage.");
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#f4f7fc] relative select-none">
      <Header onOpenSettings={() => setShowSettings(true)} />

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="px-4 py-1.5 flex flex-col gap-2 select-none">
        {loading ? (
          <div className="w-full h-20 rounded-[18px] bg-white border border-gray-100 flex flex-col p-2.5 justify-between animate-pulse">
            <div className="w-24 h-3 bg-gray-200 rounded self-end mr-1 mt-1"></div>
            <div className="flex justify-between items-center mb-1">
              <div className="w-20 h-6 bg-gray-200 rounded ml-2"></div>
              <div className="w-7 h-7 bg-gray-200 rounded-full mr-2"></div>
            </div>
          </div>
        ) : (
          <RateCard
            bankName="Google"
            rate={rates?.google}
            logo={googleLogo}
            isDark={true}
            bgClass="bg-[#2c2c2c] text-white shadow-lg"
          />
        )}
        <hr className="border-gray-200/80 my-1.5" />
      </div>

      <div className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="px-4 pb-4">
            <SkeletonLoader />
          </div>
        ) : (
          <div
            className="w-[200%] flex transition-transform duration-300 ease-in-out"
            style={{
              transform: activeTab === "buying" ? "translateX(-50%)" : "translateX(0%)",
            }}
          >
            <div className="w-1/2 px-4 pb-8 flex flex-col gap-1">
              <RateCard
                bankName="Commercial Bank"
                rate={rates?.ComBank}
                logo={combankLogo}
                textColor="#2f3648"
              />
              <RateCard
                bankName="Nations Trust Bank"
                rate={rates?.NTB}
                logo={ntbLogo}
                textColor="#482f41"
              />
              <RateCard
                bankName="HNB"
                rate={rates?.hnb}
                logo={hnbLogo}
                textColor="#432914"
              />
              <RateCard
                bankName="Sampath Bank"
                rate={rates?.Sampath}
                logo={sampathLogo}
                textColor="#432914"
              />
              <RateCard
                bankName="Seylan Bank"
                rate={rates?.Seylan}
                logo={seylanLogo}
                textColor="#5e141f"
              />
              <RateCard
                bankName="Bank of Ceylon"
                rate={rates?.BOC}
                logo={bocLogo}
                textColor="#353535"
              />
            </div>

            <div className="w-1/2 px-4 pb-8 flex flex-col gap-1">
              <RateCard
                bankName="Commercial Bank"
                rate={rates?.ComBank_Buy}
                logo={combankLogo}
                textColor="#2f3648"
              />
              <RateCard
                bankName="Nations Trust Bank"
                rate={rates?.NTB_Buy}
                logo={ntbLogo}
                textColor="#482f41"
              />
              <RateCard
                bankName="HNB"
                rate={rates?.hnb_buy}
                logo={hnbLogo}
                textColor="#5e141f"
              />
              <RateCard
                bankName="Sampath Bank"
                rate={rates?.Sampath_Buy}
                logo={sampathLogo}
                textColor="#432914"
              />
              <RateCard
                bankName="Seylan Bank"
                rate={rates?.Seylan_Buy}
                logo={seylanLogo}
                textColor="#5e141f"
              />
              <RateCard
                bankName="Bank of Ceylon"
                rate={rates?.BOC_Buy}
                logo={bocLogo}
                textColor="#353535"
              />
            </div>
          </div>
        )}
      </div>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        notifications={notifications}
        onToggleNotifications={handleToggleNotifications}
      />
    </div>
  );
}

const container = document.getElementById("react-target");
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
}
