import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [sessions, setSessions] = useState([]);
  const [newSession, setNewSession] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔹 Fetch sessions
  const fetchSessions = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/sessions`);
      const data = await res.json();
      setSessions(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // 🔹 Add new session
  const handleAddSession = async () => {
    if (!newSession) return;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionName: newSession }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(data.message);
        setNewSession("");
        fetchSessions(); // Refresh list
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          School Management System
        </h1>
        <p className="text-xl text-gray-600">Select a session to continue</p>
      </div>

      {/* 🔹 New Session Input */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="text"
          placeholder="Enter new session"
          value={newSession}
          onChange={(e) => setNewSession(e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAddSession}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Session"}
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      {/* 🔹 Existing Sessions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sessions.map((s) => (
          <Link
            key={s._id}
            to={`/dashboard/${s.sessionName}`}
            className="bg-white shadow-md rounded-lg p-6 hover:bg-blue-50 hover:scale-105 transform transition duration-300 flex items-center justify-center font-medium text-gray-700"
          >
            {s.sessionName}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
