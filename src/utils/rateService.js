export const API_BASE_URL = "https://usd-rate-checker-backend.vercel.app/";

export const defaultMockRates = {
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

export const bankStorageMap = {
  hnb: { buy: "hnb_buy", sell: "hnb", name: "HNB" },
  combank: { buy: "ComBank_Buy", sell: "ComBank", name: "Commercial Bank" },
  commercial: { buy: "ComBank_Buy", sell: "ComBank", name: "Commercial Bank" },
  boc: { buy: "BOC_Buy", sell: "BOC", name: "Bank of Ceylon" },
  sampath: { buy: "Sampath_Buy", sell: "Sampath", name: "Sampath Bank" },
  seylan: { buy: "Seylan_Buy", sell: "Seylan", name: "Seylan Bank" },
  ntb: { buy: "NTB_Buy", sell: "NTB", name: "Nations Trust" },
  google: { buy: "google", sell: "google", name: "Google Finance" },
  cbsl: { buy: "cbsl_buy", sell: "cbsl", name: "Central Bank" },
};

export async function fetchRatesFromApi() {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    if (!response.ok) throw new Error("API response not ok");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching live rates:", error);
    return null;
  }
}

export function pairTokenWithBackend(token) {
  fetch(`${API_BASE_URL}/register-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  })
    .then((res) => res.json())
    .catch((err) =>
      console.error(
        "[FCM Push] Failed to register token with backend server:",
        err,
      ),
    );
}

export function processIncomingNotification(data, onUpdateCallback) {
  if (!data) return;
  console.log("[FCM Push] Processing incoming message data payload:", data);

  let updatedBankId = null;
  let updatedRates = null;

  for (const key of Object.keys(data)) {
    try {
      const val = data[key];
      const parsed = JSON.parse(val);
      if (parsed && (parsed.buy !== undefined || parsed.sell !== undefined)) {
        updatedBankId = key.toLowerCase();
        updatedRates = parsed;
        break;
      }
    } catch (e) { }
  }

  if (!updatedBankId && data.payload) {
    try {
      const parsedPayload = JSON.parse(data.payload);
      const keys = Object.keys(parsedPayload);
      if (keys.length > 0) {
        const firstKey = keys[0];
        if (
          parsedPayload[firstKey] &&
          typeof parsedPayload[firstKey] === "object"
        ) {
          updatedBankId = firstKey.toLowerCase();
          updatedRates = parsedPayload[firstKey];
        }
      }
    } catch (e) { }
  }

  if (!updatedBankId && data.bank) {
    updatedBankId = data.bank.toLowerCase();
    updatedRates = {
      buy: parseFloat(data.buy),
      sell: parseFloat(data.sell),
    };
  }

  if (!updatedBankId || !updatedRates) {
    console.warn(
      "[FCM Push] Unable to parse bank rates payload from push data:",
      data,
    );
    return;
  }

  const matched =
    bankStorageMap[updatedBankId] ||
    Object.values(bankStorageMap).find(
      (b) =>
        b.name.toLowerCase() === updatedBankId ||
        b.buy.toLowerCase().startsWith(updatedBankId),
    );

  if (!matched) {
    console.warn(
      "[FCM Push] Unknown or unsupported bank key received:",
      updatedBankId,
    );
    return;
  }

  console.log(
    `[FCM Push] Successfully parsed updates for ${matched.name}: Buy: ${updatedRates.buy}, Sell: ${updatedRates.sell}`,
  );

  chrome.storage.local.get(["rates", "notifications"], (stored) => {
    const currentRates = { ...(stored.rates || defaultMockRates) };
    let ratesMutated = false;

    if (updatedRates.buy !== undefined && !isNaN(updatedRates.buy)) {
      currentRates[matched.buy] = parseFloat(updatedRates.buy).toFixed(2);
      ratesMutated = true;
    }
    if (updatedRates.sell !== undefined && !isNaN(updatedRates.sell)) {
      currentRates[matched.sell] = parseFloat(updatedRates.sell).toFixed(2);
      ratesMutated = true;
    }

    if (ratesMutated) {
      chrome.storage.local.set({ rates: currentRates }, () => {
        if (onUpdateCallback) onUpdateCallback();
      });
    }
  });
}
