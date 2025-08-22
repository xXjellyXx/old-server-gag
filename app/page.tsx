import { useEffect, useState } from "react";

export default function InAppBrowserChecker() {
  const [showBrowserWarning, setShowBrowserWarning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [autoRedirectAttempted, setAutoRedirectAttempted] = useState(false);

  // Function to open in external browser
  const openInBrowser = () => {
    const currentUrl = window.location.href;

    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      // iOS: Try Chrome scheme first
      window.location.href = `googlechrome://${currentUrl.replace(/^https?:\/\//, "")}`;
      setTimeout(() => {
        window.location.href = currentUrl; // fallback to Safari
      }, 1500);
    } else if (/Android/i.test(navigator.userAgent)) {
      // Android: Use Chrome Intent
      window.location.href = `intent://${currentUrl.replace(/https?:\/\//, "")}#Intent;scheme=https;package=com.android.chrome;end`;
      setTimeout(() => {
        window.location.href = currentUrl; // fallback
      }, 1500);
    } else {
      window.location.reload();
    }
  };

  // Detect in-app browsers (including TikTok)
  const detectInAppBrowser = () => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

    const isInAppBrowser =
      /FBAN|FBAV|Instagram|Twitter|Snapchat|LinkedIn|WhatsApp|Telegram|Line|WeChat|MicroMessenger|Pinterest|Reddit/i.test(
        userAgent
      ) ||
      /TikTok|musical\.ly|com\.zhiliaoapp\.musically/i.test(userAgent);

    if (isInAppBrowser) {
      setShowBrowserWarning(true);

      // Auto-attempt redirect if it's TikTok
      if (/TikTok|musical\.ly|zhiliaoapp/i.test(userAgent) && !autoRedirectAttempted) {
        setAutoRedirectAttempted(true);
        setTimeout(() => {
          openInBrowser();
        }, 2000);
      }
    }

    return isInAppBrowser;
  };

  useEffect(() => {
    // Show loading first for 3 seconds
    const timer = setTimeout(() => {
      setLoading(false);
      detectInAppBrowser();
    }, 3000);

    return () => clearTimeout(timer);
  }, [autoRedirectAttempted]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white px-4">
      {loading ? (
        <div className="text-center">
          <p className="text-xl font-bold">Finding old server...</p>
          <div className="mt-4 w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
        </div>
      ) : showBrowserWarning ? (
        <div className="text-center p-6 bg-gray-800 rounded-xl shadow-lg max-w-sm mx-auto">
          <h2 className="text-2xl font-bold mb-4">Open in Browser</h2>
          <p className="text-gray-300 mb-6">
            TikTok or Instagram may block some features. Please open this link in your default browser.
          </p>
          <button
            onClick={openInBrowser}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Open in Browser
          </button>
          <div className="text-sm text-gray-400 mt-6 text-left">
            <p className="font-semibold mb-2">How to open:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Tap the <strong>⋮</strong> (or Share icon) in TikTok</li>
              <li>Select <strong>Open in Browser</strong></li>
            </ol>
          </div>
        </div>
      ) : (
        <p className="text-lg font-semibold">You are using a normal browser.</p>
      )}
    </div>
  );
}
