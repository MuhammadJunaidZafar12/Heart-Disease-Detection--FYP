"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import API from "@/services/api";
import { Shield, Trash2, CheckCircle, Circle } from "lucide-react";

export default function UsersManagement() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [deleting, setDeleting] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminStatus = async (userId, currentStatus) => {
    setUpdating((prev) => ({ ...prev, [userId]: true }));
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/users/${userId}/set-admin`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isAdmin: !currentStatus }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, isAdmin: !currentStatus } : u
          )
        );
        alert(data.message);
      } else {
        alert(data.error || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user");
    } finally {
      setUpdating((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setDeleting((prev) => ({ ...prev, [userId]: true }));
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        alert("User deleted successfully");
      } else {
        alert(data.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user");
    } finally {
      setDeleting((prev) => ({ ...prev, [userId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)] mx-auto mb-4"></div>
          <p className="text-[var(--color-muted)]">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="table-shell overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Admin Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-[var(--color-muted)]">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id}>
                    <td className="font-medium text-[var(--color-foreground)]">
                      {user.name}
                    </td>
                    <td>
                      {user.email}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {user.isAdmin ? (
                          <>
                            <CheckCircle size={18} className="text-green-500" />
                            <span className="text-green-600 font-semibold">
                              Admin
                            </span>
                          </>
                        ) : (
                          <>
                            <Circle size={18} className="text-gray-400" />
                            <span className="text-gray-600">User</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="space-x-2 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() =>
                          toggleAdminStatus(user._id, user.isAdmin)
                        }
                        disabled={updating[user._id]}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition ${
                          user.isAdmin
                            ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <Shield size={16} />
                        {updating[user._id]
                          ? "Updating..."
                          : user.isAdmin
                          ? "Remove Admin"
                          : "Make Admin"}
                      </button>

                      <button
                        onClick={() => deleteUser(user._id)}
                        disabled={deleting[user._id]}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={16} />
                        {deleting[user._id] ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

        <div className="px-4 sm:px-6 py-4 bg-gray-50/80 border-t border-gray-100">
          <p className="text-sm text-[var(--color-muted)]">
            Total Users: <span className="font-semibold text-[var(--color-foreground)]">{users.length}</span>
          </p>
        </div>
      </div>
    </>
  );
}
