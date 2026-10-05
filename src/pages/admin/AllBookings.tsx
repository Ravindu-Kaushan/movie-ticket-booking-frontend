import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import type { Booking } from "../../types";

function AllBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchBookings = async () => {
    try {
      const response = await axiosInstance.get("/api/bookings");
      setBookings(response.data);
    } catch {
      setError("Could not load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

 
  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    setError("");
    setMessage("");
    try {
      await axiosInstance.put(
        "/api/bookings/" + bookingId + "/status?status=" + newStatus
      );
      setMessage("Booking #" + bookingId + " status updated to " + newStatus + ".");
      fetchBookings();
    } catch {
      setError("Could not update the booking status.");
    }
  };

  const filteredBookings = bookings.filter(
    (booking) => statusFilter === "ALL" || booking.status === statusFilter
  );

  if (loading) {
    return <p className="p-6 text-center text-gray-600">Loading bookings...</p>;
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">All Bookings</h1>

      {message && (
        <p className="mb-4 rounded bg-green-100 p-3 text-green-700">{message}</p>
      )}
      {error && (
        <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>
      )}

      {/* Status filter */}
      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded border p-2"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Bookings table */}
      <div className="overflow-x-auto rounded-lg border bg-white shadow">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">User ID</th>
              <th className="p-2">Show ID</th>
              <th className="p-2">Seats</th>
              <th className="p-2">Tickets</th>
              <th className="p-2">Total</th>
              <th className="p-2">Date</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="border-t">
                <td className="p-2">{booking.id}</td>
                <td className="p-2">{booking.userId}</td>
                <td className="p-2">{booking.showId}</td>
                <td className="p-2">{booking.seatNumbers.join(", ")}</td>
                <td className="p-2">{booking.numberOfTickets}</td>
                <td className="p-2">Rs. {booking.totalAmount}</td>
                <td className="p-2">{booking.bookingDate}</td>
                <td className="p-2">
                  <select
                    value={booking.status}
                    onChange={(e) =>
                      handleStatusChange(booking.id, e.target.value)
                    }
                    className="rounded border p-1"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBookings.length === 0 && (
        <p className="mt-4 text-center text-gray-500">No bookings found.</p>
      )}
    </div>
  );
}

export default AllBookings;