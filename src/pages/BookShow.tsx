import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import type { Show, Movie, Theatre } from "../types";


const rows = ["A", "B", "C", "D", "E"];
const seatsPerRow = 6;

function BookShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [show, setShow] = useState<Show | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [theatre, setTheatre] = useState<Theatre | null>(null);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const showRes = await axiosInstance.get("/api/shows/" + id);
        const seatsRes = await axiosInstance.get("/api/shows/" + id + "/seats");
        const movieRes = await axiosInstance.get(
          "/api/movies/" + showRes.data.movieId
        );
        const theatreRes = await axiosInstance.get(
          "/api/theatres/" + showRes.data.theatreId
        );
        setShow(showRes.data);
        setBookedSeats(seatsRes.data);
        setMovie(movieRes.data);
        setTheatre(theatreRes.data);
      } catch {
        setError("Could not load show details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

 
  const toggleSeat = (seat: string) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleBooking = async () => {
    setError("");
    setSubmitting(true);
    try {
      const response = await axiosInstance.post("/api/bookings", {
        showId: show?.id,
        seatNumbers: selectedSeats,
        numberOfTickets: selectedSeats.length,
      });
      
      navigate("/payment/" + response.data.id);
    } catch {
      setError("Booking failed. Some seats may already be booked.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="p-6 text-center text-gray-600">Loading...</p>;
  }

  if (!show) {
    return (
      <p className="m-6 rounded bg-red-100 p-3 text-center text-red-700">
        {error}
      </p>
    );
  }

  
  if (!user || user.role !== "CUSTOMER") {
    return (
      <p className="m-6 rounded bg-yellow-100 p-3 text-center text-yellow-800">
        Please sign in with a CUSTOMER account to book tickets.
      </p>
    );
  }

  const totalAmount = selectedSeats.length * show.ticketPrice;

  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="text-2xl font-bold">{movie?.title}</h1>
      <p className="text-gray-600">{theatre?.theatreName}</p>
      <p className="mb-4 text-sm text-gray-600">
        {show.showDate} at {show.showTime} | Rs. {show.ticketPrice} per ticket
      </p>

      {/* Screen */}
      <div className="mb-6 rounded bg-gray-300 p-1 text-center text-sm text-gray-700">
        SCREEN
      </div>

      {/* Seat grid */}
      <div className="mb-4 space-y-2">
        {rows.map((row) => (
          <div key={row} className="flex justify-center gap-2">
            {Array.from({ length: seatsPerRow }, (_, i) => {
              const seat = row + (i + 1);
              const isBooked = bookedSeats.includes(seat);
              const isSelected = selectedSeats.includes(seat);

              let color = "bg-white hover:bg-blue-100";
              if (isBooked) color = "bg-red-300 cursor-not-allowed";
              if (isSelected) color = "bg-green-500 text-white";

              return (
                <button
                  key={seat}
                  disabled={isBooked}
                  onClick={() => toggleSeat(seat)}
                  className={"h-10 w-10 rounded border text-sm " + color}
                >
                  {seat}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mb-6 flex justify-center gap-4 text-xs">
        <span>⬜ Available</span>
        <span>🟩 Selected</span>
        <span>🟥 Booked</span>
      </div>

      {/* Summary */}
      <div className="rounded-lg border bg-white p-4 shadow">
        <p>
          Selected Seats:{" "}
          {selectedSeats.length === 0 ? "None" : selectedSeats.join(", ")}
        </p>
        <p>Number of Tickets: {selectedSeats.length}</p>
        <p className="mt-1 text-lg font-semibold">
          Total Amount: Rs. {totalAmount}
        </p>

        {error && (
          <p className="mt-3 rounded bg-red-100 p-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          onClick={handleBooking}
          disabled={selectedSeats.length === 0 || submitting}
          className="mt-4 w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          {submitting ? "Booking..." : "Book Now"}
        </button>
      </div>
    </div>
  );
}

export default BookShow;