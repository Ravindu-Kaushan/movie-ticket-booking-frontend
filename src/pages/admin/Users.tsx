import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import type { User } from "../../types";

function Users() {
  const { user: loggedInUser } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

 
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("CUSTOMER");

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/api/users");
      setUsers(response.data);
    } catch {
      setError("Could not load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

 
  const resetForm = () => {
    setEditingId(null);
    setFullName("");
    setEmail("");
    setRole("CUSTOMER");
  };

 
  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setFullName(user.fullName);
    setEmail(user.email);
    setRole(user.role);
    setMessage("");
    setError("");
  };

  const handleUpdate = async () => {
    setError("");
    setMessage("");

    if (!fullName || !email) {
      setError("Please fill in full name and email.");
      return;
    }

    const body = {
      fullName: fullName,
      email: email,
      role: role,
    };

    try {
      await axiosInstance.put("/api/users/" + editingId, body);
      setMessage("User updated successfully.");
      resetForm();
      fetchUsers();
    } catch {
      setError("Could not update the user. The email may already be in use.");
    }
  };

  const handleDelete = async (userId: number) => {
    setError("");
    setMessage("");
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    try {
      await axiosInstance.delete("/api/users/" + userId);
      setMessage("User deleted successfully.");
      fetchUsers();
    } catch {
      setError("Could not delete the user. They may have bookings linked to them.");
    }
  };

  if (loading) {
    return <p className="p-6 text-center text-gray-600">Loading users...</p>;
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Users</h1>

      {message && (
        <p className="mb-4 rounded bg-green-100 p-3 text-green-700">{message}</p>
      )}
      {error && (
        <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>
      )}

      {/* Edit form (shown only when editing) */}
      {editingId !== null && (
        <div className="mb-6 rounded-lg border bg-white p-4 shadow">
          <h2 className="mb-3 font-semibold">Edit User #{editingId}</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded border p-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded border p-2"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded border p-2"
            >
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleUpdate}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Update User
            </button>
            <button
              onClick={resetForm}
              className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
            >
              Cancel Edit
            </button>
          </div>
        </div>
      )}

      {/* Users table */}
      <div className="overflow-x-auto rounded-lg border bg-white shadow">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Full Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-2">{user.id}</td>
                <td className="p-2">{user.fullName}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="mr-2 rounded bg-yellow-500 px-2 py-1 text-white hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  {user.email !== loggedInUser?.email && (
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="rounded bg-red-600 px-2 py-1 text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;