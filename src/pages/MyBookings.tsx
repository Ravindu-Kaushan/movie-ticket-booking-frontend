import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import type { Booking } from "../types";

function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchBookings = async () => {
    try {
      const response = await axiosInstance.get("/api/bookings/my-bookings");
      setBookings(response.data);
    } catch {
      setError("Could not load your bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: number) => {
    setError("");
    setMessage("");
    try {
      await axiosInstance.put("/api/bookings/" + bookingId + "/cancel");
      setMessage("Booking cancelled successfully.");
      fetchBookings();
    } catch {
      setError("Could not cancel the booking.");
    }
  };

  if (loading) {
    return <p className="p-6 text-center text-gray-600">Loading bookings...</p>;
  }

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-4 text-2xl font-bold">My Bookings</h1>

      {message && (
        <p className="mb-4 rounded bg-green-100 p-3 text-green-700">
          {message}
        </p>
      )}
      {error && (
        <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>
      )}

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">You have no bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-lg border bg-white p-4 shadow"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Booking #{booking.id}</h2>
                <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                  {booking.status}
                </span>
              </div>
              <div className="mt-2 space-y-1 text-sm">
                <p>Show ID: {booking.showId}</p>
                <p>Seats: {booking.seatNumbers.join(", ")}</p>
                <p>Tickets: {booking.numberOfTickets}</p>
                <p>Total Amount: Rs. {booking.totalAmount}</p>
                <p>Booking Date: {booking.bookingDate}</p>
              </div>

              <div className="mt-3 flex gap-2">
                {booking.status === "PENDING" && (
                  <Link
                    to={"/payment/" + booking.id}
                    className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                  >
                    Pay Now
                  </Link>
                )}
                {booking.status !== "CANCELLED" && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;