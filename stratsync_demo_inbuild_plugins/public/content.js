// Robust button injector for YouTube (handles SPA navigation)
(() => {
  const BTN_ID = "stratsync-floating-btn";

  function createButton() {
    if (!document.body) return null;
    if (document.getElementById(BTN_ID)) return document.getElementById(BTN_ID);

    const btn = document.createElement("button");
    btn.id = BTN_ID;
    btn.innerText = "StratSync";
    Object.assign(btn.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: "999999",
      backgroundColor: "#ffffffff",
      color: "#fff",
      border: "none",
      borderRadius: "50px",
      padding: "12px 20px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      transition: "all 0.2s ease",
    });

    btn.addEventListener("mouseenter", () => (btn.style.backgroundColor = "#cc0000"));
    btn.addEventListener("mouseleave", () => (btn.style.backgroundColor = "#ff2e2e"));

    btn.addEventListener("click", () => {
      try {
        chrome.runtime.sendMessage({ action: "open_popup" });
      } catch (e) {
        // fallback for non-extension contexts
        console.log("StratSync: clicked (no runtime)");
      }
    });

    document.body.appendChild(btn);
    return btn;
  }

  // Ensure button exists now
  function ensureButton() {
    try {
      createButton();
    } catch (err) {
      // defensive: if DOM isn't ready yet
      // we'll retry from mutation observer
      // eslint-disable-next-line no-console
      console.warn("StratSync: ensureButton failed", err);
    }
  }

  // Detect SPA navigation: patch history methods and listen to popstate
  function hookHistoryEvents() {
    const push = history.pushState;
    const replace = history.replaceState;
    history.pushState = function () {
      const res = push.apply(this, arguments);
      window.dispatchEvent(new Event("locationchange"));
      return res;
    };
    history.replaceState = function () {
      const res = replace.apply(this, arguments);
      window.dispatchEvent(new Event("locationchange"));
      return res;
    };
    window.addEventListener("popstate", () => window.dispatchEvent(new Event("locationchange")));
    window.addEventListener("locationchange", () => {
      // small timeout to allow YouTube to update DOM
      setTimeout(ensureButton, 250);
    });
  }

  // MutationObserver as a fallback when the page mutates
  function observeDOM() {
    const observer = new MutationObserver(() => ensureButton());
    observer.observe(document.documentElement || document, { childList: true, subtree: true });
  }

  // start
  ensureButton();
  hookHistoryEvents();
  observeDOM();
})();
