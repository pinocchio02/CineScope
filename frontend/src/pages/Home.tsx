import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { MovieRow } from "@/components/MovieRow";
import { MovieModal } from "@/components/MovieModal";
import { FilterSidebar } from "@/components/FilterSidebar";
import { MovieGrid } from "@/components/MovieGrid";
import { Footer } from "@/components/Footer";
import { Movie } from "@/types/movie";
import { featuredMovie, allGenres, movieCategories as localCategories } from "@/data/movies";
import { Button } from "@/components/ui/button";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [homeCategories, setHomeCategories] = useState<any[]>(localCategories);
  const [isHomeLoading, setIsHomeLoading] = useState(true);

  // Search & Discover States
  const [sourceMovie, setSourceMovie] = useState<Movie | null>(null);
  const [apiRecommendations, setApiRecommendations] = useState<Movie[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [gridTitle, setGridTitle] = useState("");

  // Filter States
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [releaseYear, setReleaseYear] = useState(1950);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await fetch("/api/home");
        if (response.ok) {
          const apiData = await response.json();
          const mappedData = apiData.map((category: any, index: number) => {
            let fixedId = category.id;
            let fixedTitle = category.title;
            const titleLower = category.title.toLowerCase();

            if (index === 3) {
              fixedId = "sci-fi";
              fixedTitle = "Sci-Fi & Fantasy";
            }
            else if (titleLower.includes("top rated")) fixedId = "top-rated";
            else if (titleLower.includes("romance")) fixedId = "romance-drama";
            else if (titleLower.includes("action")) fixedId = "action-adventure";
            else if (titleLower.includes("comedy")) fixedId = "comedy";

            return { ...category, id: fixedId, title: fixedTitle };
          });
          setHomeCategories(mappedData);
        } else {
          console.warn("API failed, using local structure");
        }
      } catch (error) {
        console.error("Failed to load home data", error);
      } finally {
        setIsHomeLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?query=${searchQuery}`);
        if (response.ok) { const data = await response.json(); setSuggestions(data); setShowSuggestions(true); }
      } catch (error) { console.error(error); }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if (selectedGenre === "All") handleResetFilters();
    else if (selectedGenre) handleDiscover(selectedGenre);
  }, [selectedGenre]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMovieClick = (movie: Movie) => { setSelectedMovie(movie); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setSelectedMovie(null); };

  const handleResetFilters = () => {
    setHasSearched(false); setSourceMovie(null); setSearchQuery(""); setApiRecommendations([]);
    setErrorMsg(null); setSelectedGenre(null); setMinRating(0); setReleaseYear(1950); setSuggestions([]);
  };

  const handleDiscover = async (genre: string) => {
    setIsSearchLoading(true); setHasSearched(true); setErrorMsg(null); setGridTitle(`Top ${genre} Movies`); setShowSuggestions(false);
    try {
      const params = new URLSearchParams({ genre: genre, min_year: releaseYear.toString(), min_rating: minRating.toString() });
      const response = await fetch(`/api/discover?${params}`);
      if (!response.ok) throw new Error("Failed to load genre movies.");
      const data = await response.json();
      if (data.length > 0) {
        const heroData = data[0];
        setSourceMovie({ id: heroData.tmdbId, title: heroData.title, rating: heroData.rating, year: heroData.year, poster: heroData.poster_url, backdrop: heroData.backdrop_url, genres: heroData.genres, description: heroData.description });
        setApiRecommendations(data.slice(1).map((item: any) => ({ id: item.tmdbId, title: item.title, rating: item.rating, year: item.year, poster: item.poster_url, backdrop: item.backdrop_url, genres: [genre], description: item.description })));
      } else { setErrorMsg("No movies found for this filter."); }
    } catch (error) { console.error(error); setErrorMsg("Could not load movies."); } finally { setIsSearchLoading(false); }
  };

  const handleSearchSubmit = async (overrideQuery?: string) => {
    const query = overrideQuery || searchQuery;
    if (!query.trim()) return;
    setIsSearchLoading(true); setHasSearched(true); setErrorMsg(null); setSelectedGenre(null); setShowSuggestions(false);
    if (overrideQuery) setSearchQuery(overrideQuery);
    try {
      const params = new URLSearchParams({ title: query, min_year: releaseYear.toString(), min_rating: minRating.toString() });
      const response = await fetch(`/api/recommend?${params}`);
      if (!response.ok) { if (response.status === 404) throw new Error("Movie not found. Try exact spelling!"); throw new Error("Connection failed."); }
      const data = await response.json();
      setSourceMovie({ id: data.source.id, title: data.source.title, rating: data.source.rating, year: data.source.year, poster: data.source.poster, backdrop: data.source.backdrop, genres: data.source.genres, description: data.source.description });
      setApiRecommendations(data.recommendations.map((item: any) => ({ id: item.tmdbId, title: item.title, rating: item.rating, year: item.year, poster: item.poster_url, backdrop: item.backdrop_url, genres: item.genres, description: item.description })));
      setGridTitle(`More like "${data.source.title}"`);
    } catch (error) { setErrorMsg((error as Error).message); setSourceMovie(null); setApiRecommendations([]); } finally { setIsSearchLoading(false); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSearchSubmit(); };

  return (
    <div
      className="min-h-screen bg-background relative"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="main"
    >
      <div ref={searchContainerRef} className="relative z-50">
        <Navbar
          searchQuery={searchQuery}
          onSearchChange={(val) => { setSearchQuery(val); if (val === "") handleResetFilters(); }}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          onSuggestionClick={(title) => handleSearchSubmit(title)}
          onSearchSubmit={() => handleSearchSubmit()}
        />
      </div>

      <div className="flex">
        {/* Sidebar also needs to be pushed down if it's sticky, but usually it sits in flow */}
        <FilterSidebar minRating={minRating} onMinRatingChange={setMinRating} releaseYear={releaseYear} onReleaseYearChange={setReleaseYear} selectedGenre={selectedGenre} onGenreSelect={setSelectedGenre} genres={allGenres} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onReset={handleResetFilters} />

        {/* FIX 1: Add pt-20 (padding-top) here to push the Hero Section DOWN below the Navbar */}
        <div className="flex-1 min-w-0 pt-20">
          {hasSearched ? (
            <div className="animate-in fade-in duration-500 flex-1 flex flex-col">
              {errorMsg ? (
                <div className="flex-1 flex flex-col items-center justify-center p-10 pt-32 text-center space-y-6 min-h-[50vh]">
                  <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-2 animate-bounce"><span className="text-4xl">🤔</span></div>
                  <div className="space-y-2"><h2 className="text-3xl font-bold text-white">Movie Not Found</h2><p className="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed">We couldn't find anything for "{searchQuery}". <br />Try checking the spelling or searching for another title.</p></div>
                  <Button variant="outline" size="lg" className="border-zinc-700 hover:bg-zinc-800 text-white px-8 mt-4" onClick={handleResetFilters}>Go Back Home</Button>
                </div>
              ) : (
                <>
                  {sourceMovie && <HeroSection movie={sourceMovie} onMovieClick={handleMovieClick} isSlideShow={false} />}
                  <main className="px-8 pt-8 pb-12">
                    <h2 className="text-2xl font-semibold text-white mb-6">{isSearchLoading ? "Thinking..." : (gridTitle || "Search Results")}</h2>
                    {apiRecommendations.length > 0 && <MovieGrid movies={apiRecommendations} title="" onMovieClick={handleMovieClick} />}
                  </main>
                </>
              )}
            </div>
          ) : (
            <>
              <HeroSection movie={featuredMovie} onMovieClick={handleMovieClick} isSlideShow={true} />

              {/* FIX 2: Changed pt-8 to pt-0 to REMOVE the gap between Hero and Rows */}
              <main className="pb-10 pt-0 space-y-12">
                {isHomeLoading ? (
                  <div className="text-center py-20 text-gray-500 animate-pulse">Loading movies...</div>
                ) : (
                  homeCategories.map((category) => (
                    <div
                      key={category.id}
                      id={category.id}
                      className="scroll-mt-24"
                    >
                      <MovieRow category={category} onMovieClick={handleMovieClick} />
                    </div>
                  ))
                )}
              </main>
            </>
          )}

          <Footer />
        </div>
      </div>
      <MovieModal movie={selectedMovie} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default Home;