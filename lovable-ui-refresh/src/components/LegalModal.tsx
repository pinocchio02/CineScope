import { X, Shield, FileText, Cookie } from "lucide-react";
import { useEffect } from "react";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "privacy" | "terms" | "cookies"; // Optional: to scroll to section
}

export const LegalModal = ({ isOpen, onClose }: LegalModalProps) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Legal & Privacy Disclaimer
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto text-zinc-300 leading-relaxed">
          
          {/* General Notice */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-yellow-200/80 text-sm">
            <strong>Note:</strong> This application is a portfolio project developed for educational and demonstration purposes. It is not a commercial service.
          </div>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="w-4 h-4" /> Terms of Service
            </h3>
            <p className="text-sm">
              By using CineScope, you acknowledge that this is a demo application. No real-world services are provided. The movie data is sourced from TMDB (The Movie Database) API and is used here under fair use for demonstration.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Shield className="w-4 h-4" /> Privacy Policy
            </h3>
            <p className="text-sm">
              We respect your privacy. As this is a demo project:
            </p>
            <ul className="list-disc list-inside text-sm pl-2 space-y-1 text-zinc-400">
              <li>No personal data is sold to third parties.</li>
              <li>Any "login" or "account" features are simulations and may not store data permanently.</li>
              <li>Input data (like search queries) is processed locally or sent to our demo API solely to provide results.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Cookie className="w-4 h-4" /> Cookie Policy
            </h3>
            <p className="text-sm">
              This site may use local storage to save your preferences (like your "Watchlist" or "Theme"). We do not use tracking cookies for advertising purposes.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Acknowledge
          </button>
        </div>

      </div>
    </div>
  );
};