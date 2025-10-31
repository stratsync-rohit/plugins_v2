// background.ts
import { GOOGLE_CLIENT_ID } from "./config";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "login") {
    // Compute redirect URI and log it so you can register it in Google Cloud Console
    const redirectUri = chrome.identity.getRedirectURL();
    console.log("[background] chrome.identity.getRedirectURL() ->", redirectUri);

    const clientId = (typeof GOOGLE_CLIENT_ID === "string" && GOOGLE_CLIENT_ID.length > 0)
      ? GOOGLE_CLIENT_ID
      : "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

    if (!GOOGLE_CLIENT_ID) {
      console.warn("[background] GOOGLE_CLIENT_ID is empty. Replace src/config.ts export with your client id.");
    }

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&response_type=token%20id_token&scope=${encodeURIComponent("openid email profile")}&redirect_uri=${encodeURIComponent(redirectUri)}&nonce=${encodeURIComponent("random_nonce")}&prompt=select_account`;

    chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: true }, (redirectUrl) => {
      // Check for runtime errors first
      if (chrome.runtime.lastError) {
        console.error("[background] launchWebAuthFlow error:", chrome.runtime.lastError.message);
        sendResponse({ error: chrome.runtime.lastError.message });
        return;
      }

      if (!redirectUrl) {
        console.error("[background] No redirectUrl returned from launchWebAuthFlow");
        sendResponse({ error: "No redirect URL returned" });
        return;
      }

      try {
        console.log("[background] launchWebAuthFlow redirected to:", redirectUrl);
        // redirectUrl might look like:
        // https://<EXT_ID>.chromiumapp.org/#access_token=XXX&id_token=YYY&expires_in=3600&token_type=Bearer
        const urlObj = new URL(redirectUrl);
        // urlObj.hash starts with '#', remove it:
        const hash = urlObj.hash ? urlObj.hash.substring(1) : "";
        // parse into key/value pairs
        const params = Object.fromEntries(
          hash.split("&")
              .filter(Boolean)
              .map(pair => pair.split("=").map(decodeURIComponent))
              .map(([k, v]) => [k, v ?? ""])
        ) as Record<string, string>;

        const accessToken = params["access_token"] || null;
        const idToken = params["id_token"] || null;

        if (!accessToken && !idToken) {
          console.error("[background] No access_token or id_token found in redirect URL.");
          sendResponse({ error: "No access_token or id_token found in redirect URL." });
          return;
        }

        // success
        sendResponse({ accessToken, idToken });
      } catch (e) {
        console.error("[background] Failed to parse redirect URL:", e);
        sendResponse({ error: (e as Error).message || "Failed to parse redirect URL" });
      }
    });

    // tell Chrome we'll respond asynchronously
    return true;
  }

  if (msg?.type === "close_me") {
    try {
      const tabId = sender?.tab?.id;
      if (typeof tabId === "number") {
        chrome.tabs.remove(tabId, () => {
          if (chrome.runtime.lastError) {
            console.warn("[background] tabs.remove error:", chrome.runtime.lastError.message);
          }
        });
        sendResponse({ ok: true });
      } else {
        // Fallback: try to close the active tab in the current window
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
          const activeId = tabs?.[0]?.id;
          if (typeof activeId === "number") {
            chrome.tabs.remove(activeId, () => {
              if (chrome.runtime.lastError) {
                console.warn("[background] tabs.remove fallback error:", chrome.runtime.lastError.message);
              }
            });
            sendResponse({ ok: true });
          } else {
            sendResponse({ ok: false, error: "No tab id to close" });
          }
        });
      }
    } catch (e) {
      sendResponse({ ok: false, error: (e as Error).message });
    }
    return true;
  }
});
