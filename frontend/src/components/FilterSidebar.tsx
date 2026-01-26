import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  minRating: number;
  onMinRatingChange: (value: number) => void;
  releaseYear: number;
  onReleaseYearChange: (value: number) => void;
  selectedGenre: string | null;
  onGenreSelect: (genre: string | null) => void;
  genres: string[];
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
}

export const FilterSidebar = ({
  minRating,
  onMinRatingChange,
  releaseYear,
  onReleaseYearChange,
  selectedGenre,
  onGenreSelect,
  genres,
  isOpen,
  onClose,
  onReset,
}: FilterSidebarProps) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen w-80 bg-zinc-950 border-r border-zinc-800 z-50 transform transition-transform duration-300 ease-in-out lg:transform-none flex flex-col group",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 flex items-center justify-between border-b border-zinc-800 shrink-0">
          <h2 className="text-xl font-bold text-white">Filters</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* STANDARD DIV: 
           By using 'overflow-y-auto' without any extra classes, 
           this div will automatically use the ::-webkit-scrollbar styles 
           defined in your index.css
        */}
        <div className="flex-1 px-6 py-6 overflow-y-auto">
          <div className="space-y-8 pb-20">
            
            {/* Rating Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-200">
                  <span className="text-yellow-500 mr-2">★</span>
                  Minimum Rating
                </span>
                <span className="text-sm text-zinc-400">{minRating.toFixed(1)}+</span>
              </div>
              <Slider
                value={[minRating]}
                onValueChange={(vals) => onMinRatingChange(vals[0])}
                max={10}
                step={0.5}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-zinc-600 px-1">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>

            {/* Year Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-200">
                  <span className="text-primary mr-2">📅</span>
                  Released After
                </span>
                <span className="text-sm text-zinc-400">{releaseYear}</span>
              </div>
              <Slider
                value={[releaseYear]}
                onValueChange={(vals) => onReleaseYearChange(vals[0])}
                min={1950}
                max={2026}
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-zinc-600 px-1">
                <span>1950</span>
                <span>1990</span>
                <span>2026</span>
              </div>
            </div>

            {/* Genres Grid */}
            <div className="space-y-4">
              <span className="text-sm font-medium text-zinc-200 block">Genres</span>
              <div className="grid grid-cols-2 gap-2">
                {/* "All" Button */}
                <Button
                  variant={selectedGenre === null ? "default" : "outline"}
                  size="sm"
                  onClick={onReset}
                  className={cn(
                    "w-full justify-start font-normal text-xs h-9",
                    selectedGenre === null
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 border-transparent"
                      : "bg-transparent border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                  )}
                >
                  All
                </Button>

                {/* Genre List */}
                {genres.map((genre) => (
                  <Button
                    key={genre}
                    variant={selectedGenre === genre ? "default" : "outline"}
                    size="sm"
                    onClick={() => onGenreSelect(genre)}
                    className={cn(
                      "w-full justify-start font-normal text-xs h-9",
                      selectedGenre === genre
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 border-transparent"
                        : "bg-transparent border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                    )}
                  >
                    {genre}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reset Button (Fixed at Bottom) */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-950 shrink-0">
          <Button 
            variant="outline" 
            className="w-full border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 hover:border-zinc-700"
            onClick={onReset}
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </>
  );
};