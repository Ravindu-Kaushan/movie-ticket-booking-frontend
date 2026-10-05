import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import type { Show, Movie, Theatre } from "../../types";

function ManageShows() {
  const [shows, setShows] = useState<Show[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

 
  const [editingId, setEditingId] = useState<number | null>(null);
  const [movieId, setMovieId] = useState("");
  const [theatreId, setTheatreId] = useState("");
  const [showDate, setShowDate] = useState("");
  const [showTime, setShowTime] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [status, setStatus] = useState("SCHEDULED");

  const fetchData = async () => {
    try {
      const showsRes = await axiosInstance.get("/api/shows");
      const moviesRes = await axiosInstance.get("/api/movies");
      const theatresRes = await axiosInstance.get("/api/theatres");
      setShows(showsRes.data);
      setMovies(moviesRes.data);
      setTheatres(theatresRes.data);
    } catch {
      setError("Could not load shows.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getMovieTitle = (id: number) => {
    const movie = movies.find((m) => m.id === id);
    return movie ? movie.title : "Unknown";
  };

  const getTheatreName = (id: number) => {
    const theatre = theatres.find((t) => t.id === id);
    return theatre ? theatre.theatreName : "Unknown";
  };

  
  const resetForm = () => {
    setEditingId(null);
    setMovieId("");
    setTheatreId("");
    setShowDate("");
    setShowTime("");
    setTicketPrice("");
    setStatus("SCHEDULED");
  };


  const handleEdit = (show: Show) => {
    setEditingId(show.id);
    setMovieId(String(show.movieId));
    setTheatreId(String(show.theatreId));
    setShowDate(show.showDate);
    setShowTime(show.showTime.substring(0, 5));
    setTicketPrice(String(show.ticketPrice));
    setStatus(show.status);
    setMessage("");
    setError("");
  };

  const handleSubmit = async () => {
    setError("");
    setMessage("");

    if (!movieId || !theatreId || !showDate || !showTime || !ticketPrice) {
      setError("Please select a movie and theatre, and fill in date, time and price.");
      return;
    }

    const body = {
      movieId: Number(movieId),
      theatreId: Number(theatreId),
      showDate: showDate,
      showTime: showTime + ":00",
      ticketPrice: Number(ticketPrice),
      status: status,
    };

    try {
      if (editingId === null) {
        await axiosInstance.post("/api/shows", body);
        setMessage("Show added successfully.");
      } else {
        await axiosInstance.put("/api/shows/" + editingId, body);
        setMessage("Show updated successfully.");
      }
      resetForm();
      fetchData();
    } catch {
      setError(
        "Could not save the show. The movie may have ended, the theatre may be inactive, or the theatre already has a show at that date and time."
      );
    }
  };

  const handleDelete = async (showId: number) => {
    setError("");
    setMessage("");
    if (!window.confirm("Are you sure you want to delete this show?")) {
      return;
    }
    try {
      await axiosInstance.delete("/api/shows/" + showId);
      setMessage("Show deleted successfully.");
      fetchData();
    } catch {
      setError("Could not delete the show. It may have bookings linked to it.");
    }
  };

  if (loading) {
    return <p className="p-6 text-center text-gray-600">Loading shows...</p>;
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Manage Shows</h1>

      {message && (
        <p className="mb-4 rounded bg-green-100 p-3 text-green-700">{message}</p>
      )}
      {error && (
        <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>
      )}

      {/* Add / Edit form */}
      <div className="mb-6 rounded-lg border bg-white p-4 shadow">
        <h2 className="mb-3 font-semibold">
          {editingId === null ? "Add New Show" : "Edit Show #" + editingId}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <select
            value={movieId}
            onChange={(e) => setMovieId(e.target.value)}
            className="rounded border p-2"
          >
            <option value="">Select Movie</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>

          <select
            value={theatreId}
            onChange={(e) => setTheatreId(e.target.value)}
            className="rounded border p-2"
          >
            <option value="">Select Theatre</option>
            {theatres.map((theatre) => (
              <option key={theatre.id} value={theatre.id}>
                {theatre.theatreName}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={showDate}
            onChange={(e) => setShowDate(e.target.value)}
            className="rounded border p-2"
          />
          <input
            type="time"
            value={showTime}
            onChange={(e) => setShowTime(e.target.value)}
            className="rounded border p-2"
          />
          <input
            type="number"
            placeholder="Ticket Price"
            value={ticketPrice}
            onChange={(e) => setTicketPrice(e.target.value)}
            className="rounded border p-2"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded border p-2"
          >
            <option value="SCHEDULED">Scheduled</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleSubmit}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {editingId === null ? "Add Show" : "Update Show"}
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

      {/* Shows table */}
      <div className="overflow-x-auto rounded-lg border bg-white shadow">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Movie</th>
              <th className="p-2">Theatre</th>
              <th className="p-2">Date</th>
              <th className="p-2">Time</th>
              <th className="p-2">Price</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shows.map((show) => (
              <tr key={show.id} className="border-t">
                <td className="p-2">{show.id}</td>
                <td className="p-2">{getMovieTitle(show.movieId)}</td>
                <td className="p-2">{getTheatreName(show.theatreId)}</td>
                <td className="p-2">{show.showDate}</td>
                <td className="p-2">{show.showTime}</td>
                <td className="p-2">Rs. {show.ticketPrice}</td>
                <td className="p-2">{show.status}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleEdit(show)}
                    className="mr-2 rounded bg-yellow-500 px-2 py-1 text-white hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(show.id)}
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

export default ManageShows;