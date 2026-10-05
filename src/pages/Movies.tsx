import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import type { Movie } from "../types";

function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [languageFilter, setLanguageFilter] = useState("ALL");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axiosInstance.get("/api/movies");
        setMovies(response.data);
      } catch {
        setError("Failed to load movies. Please check that the backend is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);


  const languages = Array.from(new Set(movies.map((m) => m.language)));


  const filteredMovies = movies.filter((movie) => {
    const matchesTitle = movie.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || movie.status === statusFilter;
    const matchesLanguage =
      languageFilter === "ALL" || movie.language === languageFilter;
    return matchesTitle && matchesStatus && matchesLanguage;
  });

  if (loading) {
    return <p className="p-6 text-center text-gray-600">Loading movies...</p>;
  }

  if (error) {
    return (
      <p className="m-6 rounded bg-red-100 p-3 text-center text-red-700">
        {error}
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Movies</h1>

      {/* Search and filters */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded border p-2"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded border p-2"
        >
          <option value="ALL">All Status</option>
          <option value="UPCOMING">Upcoming</option>
          <option value="NOW_SHOWING">Now Showing</option>
          <option value="ENDED">Ended</option>
        </select>

        <select
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
          className="rounded border p-2"
        >
          <option value="ALL">All Languages</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      {/* Movie cards */}
      {filteredMovies.length === 0 ? (
        <p className="text-center text-gray-500">No movies found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className="rounded-lg border bg-white p-4 shadow">
              <h2 className="text-lg font-semibold">{movie.title}</h2>
              <p className="mt-1 text-sm text-gray-600">{movie.description}</p>
              <div className="mt-3 space-y-1 text-sm">
                <p>Genre: {movie.genre}</p>
                <p>Language: {movie.language}</p>
                <p>Duration: {movie.duration} min</p>
                <p>Release Date: {movie.releaseDate}</p>
              </div>
              <span className="mt-3 inline-block rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                {movie.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Movies;