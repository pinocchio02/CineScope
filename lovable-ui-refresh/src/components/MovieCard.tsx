import { Star, Info } from "lucide-react";
import { Movie } from "@/types/movie";
import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  className?: string;
  showOverlay?: boolean;
  style?: CSSProperties;
}

export function MovieCard({ movie, onClick, className, showOverlay = true, style }: MovieCardProps) {
  // Safe genre handling
  let genresToDisplay: string[] = [];
  if (Array.isArray(movie.genres)) {
      genresToDisplay = movie.genres;
  } else if (typeof movie.genres === 'string') {
      genresToDisplay = (movie.genres as string).split(',').map(g => g.trim()).filter(g => g);
  }

  // Filter out "RECOMMENDED" and limit to 2 for the card view
  const finalGenres = genresToDisplay
    .filter(g => g.toUpperCase() !== "RECOMMENDED")
    .slice(0, 2);

  return (
    <div
      className={cn(
        "movie-card group cursor-pointer aspect-[2/3] w-40 sm:w-48 md:w-52 relative rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:shadow-black/50",
        className
      )}
      onClick={() => onClick(movie)}
      style={style}
    >
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />

      {showOverlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 flex flex-col justify-end p-4">
          
          <div className="absolute top-3 right-3 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
            <button className="w-8 h-8 rounded-full bg-primary/90 flex items-center justify-center hover:bg-primary transition-colors shadow-lg shadow-primary/20 backdrop-blur-sm">
              <Info className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>

          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="font-bold text-white text-sm mb-2 line-clamp-2 drop-shadow-sm">{movie.title}</h3>
            
            <div className="flex items-center gap-2 text-xs text-gray-300 mb-2 font-medium">
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="w-3.5 h-3.5 fill-yellow-400" />
                {movie.rating.toFixed(1)}
              </div>
              <span className="text-gray-500">•</span>
              <span>{movie.year}</span>
            </div>

            {/* --- GENRES: Hero Style (Visuals) + Card Size (Dimensions) --- */}
            {finalGenres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {finalGenres.map((genre) => (
                  <span 
                    key={genre + movie.id} 
                    className="px-2 py-0.5 text-[10px] font-medium text-white uppercase tracking-wider border border-white/20 rounded-md bg-white/5 backdrop-blur-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
            
          </div>
        </div>
      )}

      <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-medium text-yellow-400 z-20 shadow-sm border border-white/10">
        <Star className="w-3 h-3 fill-yellow-400" />
        {movie.rating.toFixed(1)}
      </div>
    </div>
  );
}