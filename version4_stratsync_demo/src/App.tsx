import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatWindow from "./components/ChatWindow";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
} from "firebase/auth";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [showUnauthorized, setShowUnauthorized] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const signingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("onAuthStateChanged fired", { user });
      if (user) {
        const email = user.email?.trim().toLowerCase();

        if (email && email.endsWith("@stratsync.ai")) {
          setIsLoggedIn(true);
          setShowLogin(false);
          setShowUnauthorized(false);
          // sign-in completed in another window — clear signing state
          setIsSigningIn(false);
        } else {
          toast.error("Unauthorized email address", { autoClose: 1000 });
          auth.signOut();
          setIsLoggedIn(false);
          setShowUnauthorized(true);
          setShowLogin(true);
          setIsSigningIn(false);
        }
      } else {
        setIsLoggedIn(false);
        setShowLogin(true);
        setShowUnauthorized(false);
        setIsSigningIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  
  // Removed fallback URL-based sign-in to avoid opening a new tab and keep user in popup
  useEffect(() => {}, []);

  const handleGoogleLogin = async () => {
    console.log("handleGoogleLogin clicked");
    // mark signing in and add a fallback timeout in case the popup is closed
    setIsSigningIn(true);
    if (signingTimeoutRef.current) {
      window.clearTimeout(signingTimeoutRef.current);
    }
    signingTimeoutRef.current = window.setTimeout(() => {
      console.warn("Signing in timed out, resetting state");
      setIsSigningIn(false);
      signingTimeoutRef.current = null;
    }, 30000);
    // Primary: background OAuth via chrome.identity.launchWebAuthFlow
    try {
      const chromeRuntime = (window as any).chrome?.runtime;
      if (chromeRuntime?.sendMessage) {
        chromeRuntime.sendMessage({ type: "login" }, async (resp: any) => {
          if ((window as any).chrome?.runtime?.lastError) {
            const msg = (window as any).chrome.runtime.lastError.message || "Unknown runtime error";
            console.error("Background login runtime error:", msg);
            toast.error(`Google login failed: ${msg}`, { autoClose: 3000 });
            setIsSigningIn(false);
            return;
          }
          if (!resp) {
            console.warn("No response from background login");
            toast.error("Google login failed: No response from background", { autoClose: 3000 });
            setIsSigningIn(false);
            return;
          }
          if (resp.error) {
            console.warn("Background login error:", resp.error);
            toast.error(`Google login failed: ${String(resp.error)}`, { autoClose: 3000 });
            setIsSigningIn(false);
            return;
          }

          const idToken = resp.idToken ?? null;
          const accessToken = resp.accessToken ?? null;
          if (idToken || accessToken) {
            try {
              // Prefer using only accessToken to avoid id_token audience mismatch issues
              const credential = accessToken
                ? GoogleAuthProvider.credential(undefined, accessToken)
                : GoogleAuthProvider.credential(idToken || undefined, undefined);
              await signInWithCredential(auth, credential);
              toast.success("Google login successful!", { autoClose: 1000 });
            } catch (e) {
              console.error("signInWithCredential failed:", e);
              const msg = (e as any)?.message || (e as Error)?.toString?.() || "Unknown error";
              toast.error(`Google login failed: ${msg}`, { autoClose: 3000 });
            } finally {
              setIsSigningIn(false);
            }
          } else {
            toast.error("Google login failed: Missing tokens in response", { autoClose: 3000 });
            setIsSigningIn(false);
          }
        });
      } else {
        toast.error("Google login failed: Chrome runtime unavailable", { autoClose: 3000 });
        setIsSigningIn(false);
      }
    } catch (e) {
      console.warn("Background auth failed:", e);
      toast.error(`Google login failed: ${(e as Error)?.message || e}`, { autoClose: 3000 });
      setIsSigningIn(false);
    }
  };

  // cleanup any pending timeout on unmount
  useEffect(() => {
    return () => {
      if (signingTimeoutRef.current) {
        window.clearTimeout(signingTimeoutRef.current);
        signingTimeoutRef.current = null;
      }
    };
  }, []);

  // Removed openTabForPopupSignin to avoid navigating away from the popup

  return (
    <div className="relative w-full h-full overflow-hidden">
      <ToastContainer />

      <div
        className={`transition-all duration-300 ${
          showLogin || showUnauthorized ? "blur-sm pointer-events-none" : ""
        }`}
      >
        <ChatWindow />
      </div>

      {(showLogin || showUnauthorized) && (
        <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
      )}

      <AnimatePresence>
        {showLogin && !isLoggedIn && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20 p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm text-center border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Welcome to StratSync
              </h2>
              <p className="text-gray-500 mb-8">
                Sign in to continue to your AI co-pilot for customer success and
                growth.
              </p>
              <button
                onClick={handleGoogleLogin}
                disabled={isSigningIn}
                className={`flex items-center justify-center gap-3 w-full bg-white border border-gray-300 text-gray-700 p-3 rounded-lg transition font-medium shadow-sm ${
                  isSigningIn ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
                }`}
              >
                {isSigningIn ? (
                  <>
                    <svg
                      className="w-5 h-5 animate-spin text-gray-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google logo"
                      className="w-5 h-5"
                    />
                    Sign in with Google (Chrome Extension)
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUnauthorized && !isLoggedIn && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20 p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm text-center border">
              <h2 className="text-2xl font-semibold text-red-600 mb-4">
                Unauthorized Access!
              </h2>
              <p className="text-gray-600 mb-6">
                Please contact the StratSync team for assistance.
              </p>
              <button
                onClick={() => {
                  setShowUnauthorized(false);
                  setShowLogin(true);
                }}
                className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition font-medium shadow-sm"
              >
                Go Back to Login
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
