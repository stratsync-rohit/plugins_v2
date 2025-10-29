// Safer injector: wait for body, guard chrome.runtime, handle SPA nav
(function () {
  const BTN_ID = "stratsync-floating-btn";

  function createButton() {
    if (!document.body) return null;
    if (document.getElementById(BTN_ID)) return document.getElementById(BTN_ID);

    const btn = document.createElement("button");
    btn.id = BTN_ID;
    btn.innerText = "🤖 StratSync";
    // By default show the floating button.
    Object.assign(btn.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: "999999",
      backgroundColor: "#ff2e2e",
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

    // If we're on YouTube, make the button visually 'white' and hide it from
    // assistive technologies so screen readers won't read it.
    const isYouTube = /(^|\.)youtube\.com$/.test(window.location.hostname);
    if (isYouTube) {
      // Make the button blend into white backgrounds and remove visual affordances.
      btn.style.backgroundColor = "#ffffff";
      btn.style.color = "#ffffff";
      btn.style.boxShadow = "none";
      btn.style.cursor = "default";
      // Prevent keyboard focus and hide from AT
      btn.setAttribute("aria-hidden", "true");
      btn.setAttribute("tabindex", "-1");
      // Avoid hover/click on YouTube
      btn.style.pointerEvents = "none";
    }

    // Only attach hover effects when not hidden for YouTube.
    if (!btn.hasAttribute("aria-hidden")) {
      btn.addEventListener("mouseenter", () => (btn.style.backgroundColor = "#cc0000"));
      btn.addEventListener("mouseleave", () => (btn.style.backgroundColor = "#ff2e2e"));
    }

    btn.addEventListener("click", () => {
      try {
        if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
          chrome.runtime.sendMessage({ action: "open_popup" });
        } else {
          console.info("StratSync: clicked (no chrome.runtime)");
        }
      } catch (e) {
        console.warn("StratSync click error", e);
      }
    });

    document.body.appendChild(btn);
    return btn;
  }

  function ensureButton() {
    try {
      createButton();
    } catch (err) {
      console.warn("StratSync: ensureButton failed", err);
    }
  }

  // If DOM already ready, create now; otherwise wait for load/DOMContentLoaded
  if (document.readyState === "complete" || document.readyState === "interactive") {
    ensureButton();
  } else {
    window.addEventListener("DOMContentLoaded", ensureButton);
    window.addEventListener("load", ensureButton);
  }

  // Watch for SPA navigation on YouTube
  (function hookHistory() {
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
    window.addEventListener("locationchange", () => setTimeout(ensureButton, 200));
  })();

  // MutationObserver fallback to create button if body arrives later
  const obs = new MutationObserver(() => ensureButton());
  obs.observe(document.documentElement || document, { childList: true, subtree: true });
})();
