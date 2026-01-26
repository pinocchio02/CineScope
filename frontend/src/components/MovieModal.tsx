import { X, Calendar, Star, ExternalLink } from "lucide-react";
import { Movie } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface MovieModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MovieModal = ({ movie, isOpen, onClose }: MovieModalProps) => {
  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !movie) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleLearnMore = () => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(movie.title + " movie")}`, '_blank');
  };

  // Use backdrop if available for wide aspect ratio, else fall back to poster
  const bgImage = movie.backdrop || movie.poster;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-4xl h-[85vh] bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden text-white">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2 bg-black/50 hover:bg-white/20 rounded-full text-white transition-all transform hover:scale-105"
        >
          <X className="w-6 h-6" />
        </button>

        {/* --- LAYER 1: BACKGROUND IMAGE --- */}
        <div className="absolute inset-0">
            <img 
                src={bgImage} 
                alt={movie.title} 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
        </div>


        {/* --- LAYER 3: CONTENT (FOREGROUND) --- */}
        <div className="relative z-20 h-full flex flex-col justify-end p-8 md:p-12">
            
            {/* Title & Metadata */}
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight drop-shadow-lg">
                {movie.title}
            </h2>

            <div className="flex items-center gap-4 mb-6 text-sm md:text-base font-medium drop-shadow">
                <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-5 h-5 fill-yellow-400" />
                    <span>{movie.rating.toFixed(1)}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1 text-gray-200">
                    <Calendar className="w-5 h-5" />
                    <span>{movie.year}</span>
                </div>
                {/* Genres List */}
                <div className="hidden md:flex gap-2 ml-4">
                  {movie.genres.slice(0, 3).map((g, i) => (
                    <span 
                      key={i} 
                      className="flex items-center justify-center px-3 pt-[2px] pb-[1px] border border-white/30 rounded-full text-xs leading-none uppercase tracking-wider"
                    >
                      {g}
                    </span>
                  ))}
                </div>
            </div>

            {/* UPDATED DESCRIPTION:
               1. text-zinc-100: Brighter/Whiter text.
               2. font-medium: Slightly thicker font for better legibility against images.
               3. text-base md:text-lg: Responsive text size (not too huge on small screens).
               4. drop-shadow-lg: Stronger shadow to make text pop off the background.
            */}
            <p className="text-zinc-100 text-base md:text-lg font-medium leading-relaxed mb-8 max-w-2xl drop-shadow-lg max-h-[150px] md:max-h-[200px] overflow-y-auto pr-4 custom-scrollbar">
                {movie.description || "No description available."}
            </p>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-4 mt-auto shrink-0">
                <Button 
                    onClick={handleLearnMore}
                    size="lg"
                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-base px-8"
                >
                    Learn More <ExternalLink className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};