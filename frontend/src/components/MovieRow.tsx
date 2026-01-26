import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Movie, MovieCategory } from "@/types/movie";
import { MovieCard } from "./MovieCard";
import { Button } from "@/components/ui/button";

interface MovieRowProps {
  category: MovieCategory;
  onMovieClick: (movie: Movie) => void;
}

export function MovieRow({ category, onMovieClick }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 400;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative group/row py-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold">{category.title}</h2>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View All
          </a>
        </div>

        {/* Carousel */}
        <div className="relative -mx-4 px-4">
          {/* Scroll Buttons */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover/row:opacity-100 transition-opacity shadow-lg hidden sm:flex"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover/row:opacity-100 transition-opacity shadow-lg hidden sm:flex"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Movie Cards */}
          <div
            ref={scrollRef}
            className="scroll-container -mx-2 px-2"
          >
            {category.movies.map((movie, index) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={onMovieClick}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
