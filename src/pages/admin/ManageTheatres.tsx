import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import type { Theatre } from "../../types";

function ManageTheatres() {
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

 
  const [editingId, setEditingId] = useState<number | null>(null);
  const [theatreName, setTheatreName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  const fetchTheatres = async () => {
    try {
      const response = await axiosInstance.get("/api/theatres");
      setTheatres(response.data);
    } catch {
      setError("Could not load theatres.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheatres();
  }, []);

  
  const resetForm = () => {
    setEditingId(null);
    setTheatreName("");
    setLocation("");
    setCapacity("");
    setStatus("ACTIVE");
  };

 
  const handleEdit = (theatre: Theatre) => {
    setEditingId(theatre.id);
    setTheatreName(theatre.theatreName);
    setLocation(theatre.location);
    setCapacity(String(theatre.capacity));
    setStatus(theatre.status);
    setMessage("");
    setError("");
  };

  const handleSubmit = async () => {
    setError("");
    setMessage("");

    if (!theatreName || !location || !capacity) {
      setError("Please fill in theatre name, location and capacity.");
      return;
    }

    const body = {
      theatreName: theatreName,
      location: location,
      capacity: Number(capacity),
      status: status,
    };

    try {
      if (editingId === null) {
        await axiosInstance.post("/api/theatres", body);
        setMessage("Theatre added successfully.");
      } else {
        await axiosInstance.put("/api/theatres/" + editingId, body);
        setMessage("Theatre updated successfully.");
      }
      resetForm();
      fetchTheatres();
    } catch {
      setError("Could not save the theatre.");
    }
  };

  const handleDelete = async (theatreId: number) => {
    setError("");
    setMessage("");
    if (!window.confirm("Are you sure you want to delete this theatre?")) {
      return;
    }
    try {
      await axiosInstance.delete("/api/theatres/" + theatreId);
      setMessage("Theatre deleted successfully.");
      fetchTheatres();
    } catch {
      setError("Could not delete the theatre. It may have shows linked to it.");
    }
  };

  if (loading) {
    return <p className="p-6 text-center text-gray-600">Loading theatres...</p>;
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Manage Theatres</h1>

      {message && (
        <p className="mb-4 rounded bg-green-100 p-3 text-green-700">{message}</p>
      )}
      {error && (
        <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>
      )}

      {/* Add / Edit form */}
      <div className="mb-6 rounded-lg border bg-white p-4 shadow">
        <h2 className="mb-3 font-semibold">
          {editingId === null ? "Add New Theatre" : "Edit Theatre #" + editingId}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Theatre Name"
            value={theatreName}
            onChange={(e) => setTheatreName(e.target.value)}
            className="rounded border p-2"
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded border p-2"
          />
          <input
            type="number"
            placeholder="Capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="rounded border p-2"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded border p-2"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleSubmit}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {editingId === null ? "Add Theatre" : "Update Theatre"}
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

      {/* Theatres table */}
      <div className="overflow-x-auto rounded-lg border bg-white shadow">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Location</th>
              <th className="p-2">Capacity</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {theatres.map((theatre) => (
              <tr key={theatre.id} className="border-t">
                <td className="p-2">{theatre.id}</td>
                <td className="p-2">{theatre.theatreName}</td>
                <td className="p-2">{theatre.location}</td>
                <td className="p-2">{theatre.capacity}</td>
                <td className="p-2">{theatre.status}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleEdit(theatre)}
                    className="mr-2 rounded bg-yellow-500 px-2 py-1 text-white hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(theatre.id)}
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

export default ManageTheatres;