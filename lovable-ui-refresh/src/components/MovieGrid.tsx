import { Movie } from "@/types/movie";
import { MovieCard } from "./MovieCard";

interface MovieGridProps {
  movies: Movie[];
  title?: string;
  onMovieClick: (movie: Movie) => void;
}

export function MovieGrid({ movies, title, onMovieClick }: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-lg">No movies found matching your criteria.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-2xl font-semibold mb-6">{title}</h2>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {movies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={onMovieClick}
              className="w-full animate-fade-in"
              style={{ animationDelay: `${index * 30}ms` } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
