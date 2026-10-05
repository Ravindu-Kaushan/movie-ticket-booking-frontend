import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import type { Show, Movie, Theatre } from "../types";

function Shows() {
  const [shows, setShows] = useState<Show[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [movieFilter, setMovieFilter] = useState("ALL");
  const [theatreFilter, setTheatreFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const showsRes = await axiosInstance.get("/api/shows");
        const moviesRes = await axiosInstance.get("/api/movies");
        const theatresRes = await axiosInstance.get("/api/theatres");
        setShows(showsRes.data);
        setMovies(moviesRes.data);
        setTheatres(theatresRes.data);
      } catch {
        setError("Failed to load shows. Please check that the backend is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const getMovieTitle = (movieId: number) => {
    const movie = movies.find((m) => m.id === movieId);
    return movie ? movie.title : "Unknown movie";
  };


  const getTheatreName = (theatreId: number) => {
    const theatre = theatres.find((t) => t.id === theatreId);
    return theatre ? theatre.theatreName : "Unknown theatre";
  };


  const filteredShows = shows.filter((show) => {
    const matchesMovie =
      movieFilter === "ALL" || show.movieId === Number(movieFilter);
    const matchesTheatre =
      theatreFilter === "ALL" || show.theatreId === Number(theatreFilter);
    const matchesDate = dateFilter === "" || show.showDate === dateFilter;
    return matchesMovie && matchesTheatre && matchesDate;
  });

  if (loading) {
    return <p className="p-6 text-center text-gray-600">Loading shows...</p>;
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
      <h1 className="mb-4 text-2xl font-bold">Shows</h1>

      {/* Filters */}
      <div className="mb-6 grid gap-3 sm:grid-cols-4">
        <select
          value={movieFilter}
          onChange={(e) => setMovieFilter(e.target.value)}
          className="rounded border p-2"
        >
          <option value="ALL">All Movies</option>
          {movies.map((movie) => (
            <option key={movie.id} value={movie.id}>
              {movie.title}
            </option>
          ))}
        </select>

        <select
          value={theatreFilter}
          onChange={(e) => setTheatreFilter(e.target.value)}
          className="rounded border p-2"
        >
          <option value="ALL">All Theatres</option>
          {theatres.map((theatre) => (
            <option key={theatre.id} value={theatre.id}>
              {theatre.theatreName}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded border p-2"
        />

        <button
          onClick={() => {
            setMovieFilter("ALL");
            setTheatreFilter("ALL");
            setDateFilter("");
          }}
          className="rounded bg-gray-200 p-2 hover:bg-gray-300"
        >
          Clear Filters
        </button>
      </div>

      {/* Show cards */}
      {filteredShows.length === 0 ? (
        <p className="text-center text-gray-500">No shows found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredShows.map((show) => (
            <div key={show.id} className="rounded-lg border bg-white p-4 shadow">
              <h2 className="text-lg font-semibold">
                {getMovieTitle(show.movieId)}
              </h2>
              <p className="text-sm text-gray-600">
                {getTheatreName(show.theatreId)}
              </p>
              <div className="mt-3 space-y-1 text-sm">
                <p>Date: {show.showDate}</p>
                <p>Time: {show.showTime}</p>
                <p>Ticket Price: Rs. {show.ticketPrice}</p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                  {show.status}
                </span>
                {show.status === "SCHEDULED" && (
                  <Link
                    to={`/shows/${show.id}/book`}
                    className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                  >
                    Book
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Shows;