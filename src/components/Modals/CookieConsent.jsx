import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always enabled
    functional: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const storedConsent = Cookies.get("cookieConsent");
    if (!storedConsent) {
      setShowBanner(true);
    } else {
      setPreferences(JSON.parse(storedConsent));
    }
  }, []);

  const handleAcceptAll = () => {
    const allPreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    updateConsent(allPreferences);
  };

  const handleAcceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    updateConsent(necessaryOnly);
  };

  const handleCustomize = () => {
    updateConsent(preferences);
  };

  const updateConsent = (newPreferences) => {
    setPreferences(newPreferences);
    Cookies.set("cookieConsent", JSON.stringify(newPreferences), { expires: 365 });
    setShowBanner(false);
  };

  return
  <></>
//   showBanner ? (
//     <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4 z-50 shadow-md">
//       <p className="mb-2">We use cookies to improve your experience. Choose your preference:</p>
//       <div className="flex gap-2">
//         <button onClick={handleAcceptAll} className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">Accept All</button>
//         <button onClick={handleAcceptNecessary} className="bg-gray-500 px-4 py-2 rounded hover:bg-gray-600">Accept Necessary</button>
//         <button onClick={() => setShowBanner(false)} className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-800">Customize</button>
//       </div>
//       <div className="mt-3 p-3 border rounded bg-gray-900">
//         <label className="block">
//           <input
//             type="checkbox"
//             checked={preferences.functional}
//             onChange={() => setPreferences({ ...preferences, functional: !preferences.functional })}
//           />
//           Functional Cookies
//         </label>
//         <label className="block">
//           <input
//             type="checkbox"
//             checked={preferences.analytics}
//             onChange={() => setPreferences({ ...preferences, analytics: !preferences.analytics })}
//           />
//           Analytics Cookies
//         </label>
//         <label className="block">
//           <input
//             type="checkbox"
//             checked={preferences.marketing}
//             onChange={() => setPreferences({ ...preferences, marketing: !preferences.marketing })}
//           />
//           Marketing Cookies
//         </label>
//         <button onClick={handleCustomize} className="mt-2 bg-green-500 px-4 py-2 rounded hover:bg-green-600">Save Preferences</button>
//       </div>
//     </div>
//   ) : null;
};

export default CookieConsent;