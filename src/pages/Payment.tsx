import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import type { Booking } from "../types";

function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axiosInstance.get("/api/bookings/" + bookingId);
        setBooking(response.data);
      } catch {
        setError("Could not load booking details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handlePayment = async (success: boolean) => {
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      
      const createRes = await axiosInstance.post("/api/payments", {
        bookingId: Number(bookingId),
        paymentMethod: paymentMethod,
      });

      
      await axiosInstance.put(
        "/api/payments/" + createRes.data.id + "/process?success=" + success
      );

      if (success) {
        setMessage("Payment completed. Your booking is confirmed!");
        setTimeout(() => navigate("/my-bookings"), 2000);
      } else {
        setError("Payment failed. Your booking is not confirmed.");
      }
    } catch {
      setError("Payment could not be processed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="p-6 text-center text-gray-600">Loading...</p>;
  }

  if (!booking) {
    return (
      <p className="m-6 rounded bg-red-100 p-3 text-center text-red-700">
        {error}
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-md p-4">
      <h1 className="mb-4 text-2xl font-bold">Payment</h1>

      <div className="rounded-lg border bg-white p-4 shadow">
        <p>Booking #{booking.id}</p>
        <p>Seats: {booking.seatNumbers.join(", ")}</p>
        <p>Tickets: {booking.numberOfTickets}</p>
        <p className="mt-1 text-lg font-semibold">
          Total Amount: Rs. {booking.totalAmount}
        </p>
        <p className="mt-1 text-sm">Booking Status: {booking.status}</p>

        <label className="mt-4 block text-sm font-medium">Payment Method</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="mt-1 w-full rounded border p-2"
        >
          <option value="CARD">Card</option>
          <option value="CASH">Cash</option>
          <option value="BANK_TRANSFER">Bank Transfer</option>
        </select>

        {message && (
          <p className="mt-3 rounded bg-green-100 p-2 text-sm text-green-700">
            {message}
          </p>
        )}
        {error && (
          <p className="mt-3 rounded bg-red-100 p-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {booking.status === "PENDING" && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => handlePayment(true)}
              disabled={submitting}
              className="flex-1 rounded bg-green-600 p-2 text-white hover:bg-green-700 disabled:bg-gray-400"
            >
              {submitting ? "Processing..." : "Pay Now"}
            </button>
            <button
              onClick={() => handlePayment(false)}
              disabled={submitting}
              className="flex-1 rounded bg-gray-500 p-2 text-white hover:bg-gray-600 disabled:bg-gray-400"
            >
              Simulate Failure
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Payment;