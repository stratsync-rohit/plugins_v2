import React, { useEffect, useState, useRef } from "react";

const TARGET_URL = "https://demo.stratsync.ai";
const LOAD_TIMEOUT_MS = 5000; // agar 5s me nahi load hua toh fallback show kar

export default function App() {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // set a timeout to assume iframe blocked (X-Frame-Options) or never loads
    timerRef.current = setTimeout(() => {
      if (loading) {
        setFailed(true);
        setLoading(false);
      }
    }, LOAD_TIMEOUT_MS);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [loading]);

  // iframe onLoad handler
  const handleLoad = () => {
    clearTimeout(timerRef.current);
    setLoading(false);
    setFailed(false);
  };

  return (
    <div style={{ width: "400px", height: "600px", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: 8, borderBottom: "1px solid #eee", fontWeight: 600 }}>
        Demo StratSync
      </div>

      <div style={{ flex: 1, position: "relative" }}>
        {loading && !failed && (
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            justifyContent: "center", alignItems: "center", background: "#fff"
          }}>
            <div>
              <div style={{ fontSize: 14, marginBottom: 6 }}>Loading...</div>
            </div>
          </div>
        )}

        {!failed ? (
          <iframe
            title="Demo StratSync"
            src={TARGET_URL}
            onLoad={handleLoad}
            style={{ width: "100%", height: "100%", border: "none" }}
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
          />
        ) : (
          <div style={{ padding: 16 }}>
            <p>Embedding blocked or failed to load inside popup.</p>
            <p>
              <a href={TARGET_URL} target="_blank" rel="noopener noreferrer">
                Open demo.stratsync.ai in a new tab
              </a>
            </p>
            <div style={{ marginTop: 8 }}>
              <button
                onClick={() => window.open(TARGET_URL, "_blank", "noopener,noreferrer")}
                style={{ padding: "8px 12px", cursor: "pointer" }}
              >
                Open in new tab
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
