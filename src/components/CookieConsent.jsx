import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    // Check both cookie and localStorage for user's consent preference
    const checkConsent = () => {
      const storageConsent = localStorage.getItem("artha_cookie_consent");
      const cookieConsent = document.cookie
        .split("; ")
        .find((row) => row.startsWith("artha_cookie_consent="));

      if (!storageConsent && !cookieConsent) {
        // Show banner after a slight delay for smoother user experience
        const timer = setTimeout(() => setVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    };

    checkConsent();
  }, []);

  const handleConsent = (status) => {
    // Save to localStorage
    localStorage.setItem("artha_cookie_consent", status);

    // Save to document.cookie (expires in 1 year, SameSite Lax for security)
    const expires = new Date();
    expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000);
    document.cookie = `artha_cookie_consent=${status}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;

    // Animate banner out
    setAnimateOut(true);
    setTimeout(() => {
      setVisible(false);
    }, 400); // match animation duration
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 md:p-0 md:bottom-6 md:right-6 md:left-auto md:max-w-md w-full transition-all duration-500 ease-out transform ${
        animateOut
          ? "opacity-0 translate-y-10 scale-95"
          : "opacity-100 translate-y-0 scale-100 animate-slide-up"
      }`}
    >
      <div className="glass-card-dark rounded-2xl p-6 relative overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Glow decoration */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl" />

        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
            <Cookie className="text-orange-500" size={20} />
          </div>
          <div>
            <h4 className="font-display font-semibold text-white text-sm">
              We Value Your Privacy
            </h4>
            <p className="text-white/60 text-xs mt-1.5 leading-relaxed">
              We use cookies to enhance your browsing experience, serve personalized financial insights, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
            </p>
          </div>
        </div>

        {/* Links & Buttons */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/5 pt-4">
          <Link
            to="/about"
            className="text-[11px] text-orange-400 hover:text-orange-300 underline font-medium"
          >
            Read Cookie Policy
          </Link>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleConsent("declined")}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold text-white/60 hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
            >
              Reject
            </button>
            <button
              onClick={() => handleConsent("accepted")}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 transition-all transform hover:-translate-y-0.5"
            >
              Accept All
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => handleConsent("dismissed")}
          className="absolute top-4 right-4 text-white/40 hover:text-white/80 p-0.5 rounded-lg transition-colors"
          aria-label="Dismiss banner"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
