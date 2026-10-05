import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import type { Payment } from "../../types";

function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axiosInstance.get("/api/payments");
        setPayments(response.data);
      } catch {
        setError("Could not load payments.");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(
    (payment) => statusFilter === "ALL" || payment.status === statusFilter
  );

 
  const getStatusColor = (status: string) => {
    if (status === "COMPLETED") return "bg-green-100 text-green-700";
    if (status === "FAILED") return "bg-red-100 text-red-700";
    if (status === "REFUNDED") return "bg-purple-100 text-purple-700";
    return "bg-yellow-100 text-yellow-700";
  };

  if (loading) {
    return <p className="p-6 text-center text-gray-600">Loading payments...</p>;
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Payments</h1>

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
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </select>
      </div>

      {/* Payments table */}
      <div className="overflow-x-auto rounded-lg border bg-white shadow">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Booking ID</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Method</th>
              <th className="p-2">Payment Date</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="border-t">
                <td className="p-2">{payment.id}</td>
                <td className="p-2">{payment.bookingId}</td>
                <td className="p-2">Rs. {payment.amount}</td>
                <td className="p-2">{payment.paymentMethod}</td>
                <td className="p-2">
                  {payment.paymentDate
                    ? payment.paymentDate.substring(0, 16).replace("T", " ")
                    : "-"}
                </td>
                <td className="p-2">
                  <span
                    className={
                      "rounded px-2 py-1 text-xs font-medium " +
                      getStatusColor(payment.status)
                    }
                  >
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPayments.length === 0 && (
        <p className="mt-4 text-center text-gray-500">No payments found.</p>
      )}
    </div>
  );
}

export default Payments;