import { Movie, MovieCategory } from "@/types/movie";

export const featuredMovie: Movie = {
  id: 1,
  title: "Dune: Part Two",
  poster: "https://image.tmdb.org/t/p/original/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
  backdrop: "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
  rating: 8.7,
  year: 2024,
  genres: ["Sci-Fi", "Adventure", "Drama"],
  description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.",
  overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
  runtime: 166,
  director: "Denis Villeneuve",
};

export const movies: Movie[] = [
  {
    id: 2,
    title: "Oppenheimer",
    poster: "https://image.tmdb.org/t/p/original/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    // FIXED: High-res landscape
    backdrop: "https://media.themoviedb.org/t/p/w1000_and_h563_face/xcXALwBjdHIjrESpGVhghqj8fGT.jpg", 
    rating: 8.5,
    year: 2023,
    genres: ["Drama", "History", "Thriller"],
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    overview: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
  },
  {
    id: 3,
    title: "Poor Things",
    poster: "https://image.tmdb.org/t/p/original/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg",
    // FIXED: High-res landscape
    backdrop: "https://media.themoviedb.org/t/p/w1066_and_h600_face/zh6IdheEYinU4TPtorWsjx6qPQE.jpg", 
    rating: 8.0,
    year: 2023,
    genres: ["Sci-Fi", "Comedy", "Romance"],
    description: "The incredible tale about the fantastical evolution of Bella Baxter.",
    overview: "The incredible tale about the fantastical evolution of Bella Baxter.",
  },
  {
    id: 4,
    title: "The Holdovers",
    poster: "https://image.tmdb.org/t/p/original/VHSzNBTwxV8vh7wylo7O9CLdac.jpg",
    // FIXED: High-res landscape
    backdrop: "https://media.themoviedb.org/t/p/w1000_and_h563_face/1SSRvks2S85yu0V6BomFwk4qCsr.jpg", 
    rating: 7.9,
    year: 2023,
    genres: ["Comedy", "Drama"],
    description: "A curmudgeonly instructor at a New England prep school remains on campus during Christmas break.",
    overview: "A curmudgeonly instructor at a New England prep school remains on campus during Christmas break.",
  },
  {
    id: 5,
    title: "Killers of the Flower Moon",
    poster: "https://image.tmdb.org/t/p/original/dB6Krk806zeqd0YNp2ngQ9zXteH.jpg",
    // FIXED: High-res landscape
    backdrop: "https://image.tmdb.org/t/p/original/pA3vdhadJPxF5GA1uo8OPTiNQDT.jpg",
    rating: 7.8,
    year: 2023,
    genres: ["Crime", "Drama", "History"],
    description: "Members of the Osage tribe in the United States are murdered under mysterious circumstances in the 1920s.",
    overview: "Members of the Osage tribe in the United States are murdered under mysterious circumstances in the 1920s.",
  },
  {
    id: 6,
    title: "Past Lives",
    poster: "https://image.tmdb.org/t/p/original/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg",
    // FIXED: High-res landscape
    backdrop: "https://media.themoviedb.org/t/p/w1000_and_h563_face/iJONcj9JxINueHtfvuXmQ4ddPnD.jpg",
    rating: 8.1,
    year: 2023,
    genres: ["Drama", "Romance"],
    description: "Two childhood friends are separated after one's family emigrates from South Korea.",
    overview: "Two childhood friends are separated after one's family emigrates from South Korea.",
  },
  {
    id: 7,
    title: "The Zone of Interest",
    poster: "https://image.tmdb.org/t/p/original/hUu9zyZmDd8VZegKi1iK1Vk0RYS.jpg",
    // FIXED: High-res landscape
    backdrop: "https://image.tmdb.org/t/p/original/qdIMHd4sEfJSckfVJfKQvisL02a.jpg",
    rating: 7.4,
    year: 2023,
    genres: ["Drama", "History", "War"],
    description: "The commandant of Auschwitz and his wife strive to build a dream life in a house beside the camp.",
    overview: "The commandant of Auschwitz and his wife strive to build a dream life in a house beside the camp.",
  },
  {
    id: 8,
    title: "Godzilla Minus One",
    poster: "https://image.tmdb.org/t/p/original/hkxxMIGaiCTmrEArK7J56JTKUlB.jpg",
    // FIXED: High-res landscape
    backdrop: "https://image.tmdb.org/t/p/original/bWIIWhnaoWx3FTVXv6GkYDv3djL.jpg",
    rating: 8.0,
    year: 2023,
    genres: ["Action", "Sci-Fi", "Drama"],
    description: "Post-war Japan is at its lowest point when a new crisis emerges in the form of a giant monster.",
    overview: "Post-war Japan is at its lowest point when a new crisis emerges in the form of a giant monster.",
  },
  {
    id: 9,
    title: "Anatomy of a Fall",
    poster: "https://image.tmdb.org/t/p/original/kQs6keheMwCxJxrzV83VUwFtHkB.jpg",
    // FIXED: High-res landscape
    backdrop: "https://media.themoviedb.org/t/p/w1000_and_h563_face/5fOu0c3lcjNYdZF2UlJVScuiaML.jpg",
    rating: 7.8,
    year: 2023,
    genres: ["Drama", "Thriller", "Mystery"],
    description: "A woman is suspected of her husband's murder, and their blind son faces a moral dilemma as a witness.",
    overview: "A woman is suspected of her husband's murder, and their blind son faces a moral dilemma as a witness.",
  },
  {
    id: 10,
    title: "Barbie",
    poster: "https://image.tmdb.org/t/p/original/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
    // FIXED: High-res landscape
    backdrop: "https://image.tmdb.org/t/p/original/ctMserH8g2SeOAnCw5gFjdQF8mo.jpg",
    rating: 7.0,
    year: 2023,
    genres: ["Comedy", "Adventure", "Fantasy"],
    description: "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land.",
    overview: "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land.",
  },
  {
    id: 11,
    title: "The Boy and the Heron",
    poster: "https://image.tmdb.org/t/p/original/y9xS5NQjs5b8onxMyiVkv5fM7y.jpg",
    // FIXED: High-res landscape
    backdrop: "https://media.themoviedb.org/t/p/w1000_and_h563_face/ybn3jCia5XBD0ZgEM07gcUPuRNh.jpg",
    rating: 7.6,
    year: 2023,
    genres: ["Animation", "Fantasy", "Adventure"],
    description: "A young boy named Mahito yearning for his mother ventures into a world shared by the living and the dead.",
    overview: "A young boy named Mahito yearning for his mother ventures into a world shared by the living and the dead.",
  },
  {
    id: 12,
    title: "American Fiction",
    poster: "https://image.tmdb.org/t/p/original/57MFWGHarg9jid7yfDTka4RmcMU.jpg",
    // FIXED: High-res landscape
    backdrop: "https://media.themoviedb.org/t/p/w1066_and_h600_face/3mpgltEMgPf8zFtPnAWdDVN8ZT1.jpg",
    rating: 7.6,
    year: 2023,
    genres: ["Comedy", "Drama"],
    description: "A novelist who's fed up with the establishment profiting from Black entertainment uses a pen name.",
    overview: "A novelist who's fed up with the establishment profiting from Black entertainment uses a pen name.",
  },
];

export const movieCategories: MovieCategory[] = [
  { id: "sci-fi", title: "Sci-Fi & Fantasy", movies: [] },
  { id: "top-rated", title: "Top Rated Gems", movies: [] },
  { id: "romance-drama", title: "Romance & Drama", movies: [] },
  { id: "action-adventure", title: "Action & Adventure", movies: [] },
  { id: "comedy", title: "Comedy Hits", movies: [] },
];

export const allGenres = [
  "Action", "Adventure", "Animation", "Comedy", "Crime", "Drama", 
  "Fantasy", "Mystery", "Romance", "Sci-Fi", "Thriller", "War",
];