export interface Movie {
  id: number;
  title: string;
  poster: string;
  backdrop?: string;
  rating: number;
  year: number;
  genres: string[];
  overview: string;
  runtime?: number;
  director?: string;
}

export interface MovieCategory {
  id: string;
  title: string;
  movies: Movie[];
}
