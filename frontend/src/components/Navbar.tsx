import { Search } from "lucide-react";
import { useState, useEffect } from "react";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  suggestions: any[];
  showSuggestions: boolean;
  onSuggestionClick: (title: string) => void;
  onSearchSubmit: () => void;
}

export const Navbar = ({ 
  searchQuery, 
  onSearchChange, 
  suggestions, 
  showSuggestions, 
  onSuggestionClick,
  onSearchSubmit
}: NavbarProps) => {
  
  // State for keyboard navigation
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Reset selection when search changes or suggestions update
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery, suggestions]);

  // Handle Arrow Keys and Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      // If no suggestions, just let the standard Enter key trigger the search
      if (e.key === 'Enter') onSearchSubmit();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0) {
        // If an item is selected via arrows, click it
        onSuggestionClick(suggestions[selectedIndex].title);
      } else {
        // Otherwise perform standard search
        onSearchSubmit();
      }
    }
  };

  return (
    <nav className="fixed top-0 right-0 left-0 md:left-64 z-40 bg-black/90 backdrop-blur-lg border-b border-white/10 px-6 md:pl-24 py-4 transition-all duration-300">
      
      <div className="max-w-7xl mx-auto flex items-center gap-8">
        
        {/* Branding / Logo */}
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter text-white mr-4 shrink-0">
          <span className="bg-primary text-black px-1 rounded">C</span>
          <span className="hidden sm:inline">CINESCOPE</span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl relative group">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search movies..." 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleKeyDown} // Attached Key Handler here
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-zinc-500"
            />
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
              {suggestions.map((movie: any, index: number) => (
                <button
                  key={movie.tmdbId}
                  onClick={() => onSuggestionClick(movie.title)}
                  // Dynamic class: Adds 'bg-zinc-800' if this item is selected via keyboard
                  className={`w-full text-left px-4 py-2 flex flex-col transition-colors ${
                    index === selectedIndex ? "bg-zinc-800" : "hover:bg-zinc-800"
                  }`}
                >
                  {/* Image Removed */}
                  <div>
                    <p className={`text-sm font-medium transition-colors ${
                      index === selectedIndex ? "text-primary" : "text-zinc-200"
                    }`}>
                      {movie.title}
                    </p>
                    <p className="text-xs text-zinc-500">{movie.year}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};