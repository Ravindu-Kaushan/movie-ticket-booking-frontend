import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import type { Movie } from "../../types";

function ManageMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

 
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [language, setLanguage] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [status, setStatus] = useState("UPCOMING");

  const fetchMovies = async () => {
    try {
      const response = await axiosInstance.get("/api/movies");
      setMovies(response.data);
    } catch {
      setError("Could not load movies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  
  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setDuration("");
    setLanguage("");
    setGenre("");
    setReleaseDate("");
    setStatus("UPCOMING");
  };

  
  const handleEdit = (movie: Movie) => {
    setEditingId(movie.id);
    setTitle(movie.title);
    setDescription(movie.description);
    setDuration(String(movie.duration));
    setLanguage(movie.language);
    setGenre(movie.genre);
    setReleaseDate(movie.releaseDate);
    setStatus(movie.status);
    setMessage("");
    setError("");
  };

  const handleSubmit = async () => {
    setError("");
    setMessage("");

    if (!title || !language || !genre || !releaseDate || !duration) {
      setError("Please fill in title, duration, language, genre and release date.");
      return;
    }

    const body = {
      title: title,
      description: description,
      duration: Number(duration),
      language: language,
      genre: genre,
      releaseDate: releaseDate,
      status: status,
    };

    try {
      if (editingId === null) {
        await axiosInstance.post("/api/movies", body);
        setMessage("Movie added successfully.");
      } else {
        await axiosInstance.put("/api/movies/" + editingId, body);
        setMessage("Movie updated successfully.");
      }
      resetForm();
      fetchMovies();
    } catch {
      setError("Could not save the movie.");
    }
  };

  const handleDelete = async (movieId: number) => {
    setError("");
    setMessage("");
    if (!window.confirm("Are you sure you want to delete this movie?")) {
      return;
    }
    try {
      await axiosInstance.delete("/api/movies/" + movieId);
      setMessage("Movie deleted successfully.");
      fetchMovies();
    } catch {
      setError("Could not delete the movie. It may have shows linked to it.");
    }
  };

  if (loading) {
    return <p className="p-6 text-center text-gray-600">Loading movies...</p>;
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Manage Movies</h1>

      {message && (
        <p className="mb-4 rounded bg-green-100 p-3 text-green-700">{message}</p>
      )}
      {error && (
        <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>
      )}

      {/* Add / Edit form */}
      <div className="mb-6 rounded-lg border bg-white p-4 shadow">
        <h2 className="mb-3 font-semibold">
          {editingId === null ? "Add New Movie" : "Edit Movie #" + editingId}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded border p-2"
          />
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="rounded border p-2"
          />
          <input
            type="text"
            placeholder="Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded border p-2"
          />
          <input
            type="text"
            placeholder="Genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="rounded border p-2"
          />
          <input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            className="rounded border p-2"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded border p-2"
          >
            <option value="UPCOMING">Upcoming</option>
            <option value="NOW_SHOWING">Now Showing</option>
            <option value="ENDED">Ended</option>
          </select>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded border p-2 sm:col-span-2"
          />
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleSubmit}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {editingId === null ? "Add Movie" : "Update Movie"}
          </button>
          {editingId !== null && (
            <button
              onClick={resetForm}
              className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* Movies table */}
      <div className="overflow-x-auto rounded-lg border bg-white shadow">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Title</th>
              <th className="p-2">Language</th>
              <th className="p-2">Genre</th>
              <th className="p-2">Duration</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie.id} className="border-t">
                <td className="p-2">{movie.id}</td>
                <td className="p-2">{movie.title}</td>
                <td className="p-2">{movie.language}</td>
                <td className="p-2">{movie.genre}</td>
                <td className="p-2">{movie.duration} min</td>
                <td className="p-2">{movie.status}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleEdit(movie)}
                    className="mr-2 rounded bg-yellow-500 px-2 py-1 text-white hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(movie.id)}
                    className="rounded bg-red-600 px-2 py-1 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageMovies;