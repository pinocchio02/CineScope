import { Github, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LegalModal } from "@/components/LegalModal";
import { Toast } from "@/components/ui/SiteToast"; // Import our new Toast

export const Footer = () => {
  // State for Legal Modal
  const [isLegalOpen, setIsLegalOpen] = useState(false);

  // State for Toast Notification
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handlePlaceholderClick = (e: React.MouseEvent, featureName: string) => {
    e.preventDefault();
    setToastMessage(`${featureName} feature coming soon!`);
    setShowToast(true);
  };

  const handleLegalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLegalOpen(true);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <footer className="bg-black border-t border-zinc-800 text-zinc-400 py-12 mt-12 z-10 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">

            {/* 1. BRANDING - Updated to CINESCOPE */}
            <div className="col-span-2 md:col-span-1 space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tighter">
                CINE<span className="text-primary">SCOPE</span>
              </h2>
              <p className="text-sm leading-relaxed">
                Your ultimate lens into the world of cinema. Reviews, ratings, and personalized picks.
              </p>
              <div className="flex gap-4 mt-4">

                {/* GitHub */}
                <a
                  href="https://github.com/pinocchio02"
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/omramani/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-400 hover:text-blue-400 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>

              </div>
            </div>

            {/* 2. EXPLORE */}
            <div>
              <h3 className="font-semibold text-white mb-4">Explore</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => scrollToSection("top-rated")}
                    className="hover:text-primary transition-colors text-left"
                  >
                    Top Rated Gems
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("romance-drama")}
                    className="hover:text-primary transition-colors text-left"
                  >
                    Romance & Drama
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("action-adventure")}
                    className="hover:text-primary transition-colors text-left"
                  >
                    Action & Adventure
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("sci-fi")}
                    className="hover:text-primary transition-colors text-left"
                  >
                    Sci-Fi & Fantasy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("comedy")}
                    className="hover:text-primary transition-colors text-left"
                  >
                    Comedy Hits
                  </button>
                </li>
              </ul>
            </div>

            {/* 3. ACCOUNT (Now triggers Toast) */}
            <div>
              <h3 className="font-semibold text-white mb-4">Account</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" onClick={(e) => handlePlaceholderClick(e, "Watchlist")} className="hover:text-primary transition-colors">
                    My Watchlist
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => handlePlaceholderClick(e, "Favorites")} className="hover:text-primary transition-colors">
                    Favorites
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => handlePlaceholderClick(e, "Profile")} className="hover:text-primary transition-colors">
                    Profile Settings
                  </a>
                </li>
              </ul>
            </div>

            {/* 4. LEGAL (Triggers Modal) */}
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" onClick={handleLegalClick} className="hover:text-primary transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" onClick={handleLegalClick} className="hover:text-primary transition-colors">Terms of Service</a>
                </li>
                <li>
                  <a href="#" onClick={handleLegalClick} className="hover:text-primary transition-colors">Cookie Policy</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Updated Date to 2026 */}
          <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p>© 2026 CineScope. All rights reserved.</p>
            <div className="flex gap-8">
              <span>Built with React & Tailwind</span>
            </div>
          </div>
        </div>
      </footer>

      {/* RENDER MODAL & TOAST */}
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
      />

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};