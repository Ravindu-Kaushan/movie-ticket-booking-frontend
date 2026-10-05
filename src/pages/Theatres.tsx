import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import type { Theatre } from "../types";

function Theatres() {
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTheatres = async () => {
      try {
        const response = await axiosInstance.get("/api/theatres");
        setTheatres(response.data);
      } catch {
        setError("Failed to load theatres. Please check that the backend is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchTheatres();
  }, []);

  if (loading) {
    return <p className="p-6 text-center text-gray-600">Loading theatres...</p>;
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
      <h1 className="mb-4 text-2xl font-bold">Theatres</h1>

      {theatres.length === 0 ? (
        <p className="text-center text-gray-500">No theatres found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {theatres.map((theatre) => (
            <div
              key={theatre.id}
              className="rounded-lg border bg-white p-4 shadow"
            >
              <h2 className="text-lg font-semibold">{theatre.theatreName}</h2>
              <div className="mt-3 space-y-1 text-sm">
                <p>Location: {theatre.location}</p>
                <p>Capacity: {theatre.capacity} seats</p>
              </div>
              <span
                className={
                  theatre.status === "ACTIVE"
                    ? "mt-3 inline-block rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
                    : "mt-3 inline-block rounded bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700"
                }
              >
                {theatre.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Theatres;