import { Movie } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { Info, Star, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { featuredMovie, movies } from "@/data/movies";

interface HeroSectionProps {
  movie: Movie;
  onMovieClick: (movie: Movie) => void;
  // New Prop: Decides if we cycle or stay static
  isSlideShow?: boolean;
}

export const HeroSection = ({ movie, onMovieClick, isSlideShow = false }: HeroSectionProps) => {
  // LOGIC:
  // If isSlideShow is TRUE: We use the full list [Dune, Oppenheimer, etc.]
  // If isSlideShow is FALSE: We create a list with ONLY the passed movie [SearchedMovie]
  const moviesToDisplay = isSlideShow ? [featuredMovie, ...movies] : [movie];
  
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index to 0 whenever the mode changes (e.g. searching)
  useEffect(() => {
    setCurrentIndex(0);
  }, [isSlideShow, movie.id]);

  useEffect(() => {
    // Only set the timer if we actually have multiple movies to cycle through
    if (moviesToDisplay.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % moviesToDisplay.length);
      }, 7000); 
      return () => clearInterval(timer);
    }
  }, [moviesToDisplay.length]); 

  const currentMovie = moviesToDisplay[currentIndex];

  // Helper to safely get genres
  const getGenres = (m: Movie) => {
    let list: string[] = [];
    if (Array.isArray(m.genres)) {
        list = m.genres;
    } else if (typeof m.genres === 'string') {
        list = (m.genres as string).split(',').map(g => g.trim()).filter(g => g);
    }
    return list.slice(0, 3);
  };

  const finalGenres = getGenres(currentMovie);

  return (
    <div className="relative h-[80vh] w-full mb-10 group overflow-hidden bg-black">
      
      {/* BACKGROUNDS */}
      {moviesToDisplay.map((m, index) => (
        <div
          key={m.id} // Unique key ensures React handles updates correctly
          className={`absolute inset-0 w-full h-full ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          style={{ 
            transitionProperty: 'opacity',
            transitionDuration: '3000ms', 
            transitionTimingFunction: 'ease-in-out' 
          }}
        >
          <img
            src={m.backdrop || m.poster}
            alt={m.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
      ))}

      {/* CONTENT */}
      <div className="relative z-20 h-full container mx-auto px-4 flex flex-col justify-center max-w-7xl">
        <div 
            key={currentIndex} 
            className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-left-8 fill-mode-forwards"
            style={{ animationDuration: '2000ms' }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-2xl">
            {currentMovie.title}
          </h1>

          <div className="flex items-center gap-4 text-white/90 text-sm md:text-base font-medium">
            <div className="flex items-center gap-1.5 text-yellow-400 bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
              <Star className="w-4 h-4 fill-yellow-400" />
              <span>{currentMovie.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
              <Calendar className="w-4 h-4" />
              <span>{currentMovie.year}</span>
            </div>
            
            {finalGenres.length > 0 && (
               <div className="flex flex-wrap gap-2">
                 {finalGenres.map((g) => (
                   <span 
                     key={g + currentMovie.id} 
                     className="px-3 py-1 text-xs font-medium text-white uppercase tracking-wider border border-white/20 rounded-md bg-white/5 backdrop-blur-sm"
                   >
                     {g}
                   </span>
                 ))}
               </div>
            )}
          </div>

          <p className="text-lg text-gray-200 line-clamp-3 leading-relaxed drop-shadow-md max-w-2xl">
            {currentMovie.description || currentMovie.overview || "No description available."}
          </p>

          <div className="flex gap-4 pt-4">
            <Button 
              onClick={() => onMovieClick(currentMovie)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-lg shadow-lg shadow-primary/20 transition-all hover:scale-105"
            >
              <Info className="mr-2 w-5 h-5" /> View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};