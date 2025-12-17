import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Building2,
  User,
  LogOut,
  PlusCircle,
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  School,
  Settings,
  Users,
} from "lucide-react";

const Home = () => {
  const userAvailable = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  useEffect(() => {
    !userAvailable ? navigate("/login") : navigate("/home");
  }, []);
  const [sessions, setSessions] = useState([]);
  const [newSession, setNewSession] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [settings, setSettings] = useState(null);
  const [showSchoolForm, setShowSchoolForm] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolEin: "",
    schoolAddress: "",
  });

  useEffect(() => {
    fetchSessions();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/usersettings`);
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setSettings(data.data[0]);
        setShowSchoolForm(false);
      } else {
        setSettings(null);
        setShowSchoolForm(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSessions = async () => {
    setSessionLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/sessions`);
      const data = await res.json();
      setSessions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSessionLoading(false);
    }
  };

  const handleSchoolChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSchoolSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/usersettings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(data.message);
        fetchSettings();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      console.log(err);
      setError("Failed to save school information");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSession = async () => {
    if (!newSession.trim()) {
      setError("Please enter a session name");
      return;
    }

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
        setSuccess(`Session "${newSession}" added successfully`);
        setNewSession("");
        fetchSessions();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to add session");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <School className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {settings?.schoolName || "School Management System"}
                </h1>
                <p className="text-xs text-gray-500">
                  {settings?.schoolEin
                    ? `EIN: ${settings.schoolEin}`
                    : "Setup Required"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.userName}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.userType}
                </p>
              </div>
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError("")}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
            <p className="text-green-700">{success}</p>
            <button
              onClick={() => setSuccess("")}
              className="ml-auto text-green-500 hover:text-green-700"
            >
              ×
            </button>
          </div>
        )}

        {/* School Setup Modal */}
        {showSchoolForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                  Welcome to School Manager
                </h2>
                <p className="text-gray-600 text-center mb-6">
                  Please set up your school information to get started
                </p>

                <form onSubmit={handleSchoolSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      School Name *
                    </label>
                    <input
                      type="text"
                      name="schoolName"
                      placeholder="Enter school name"
                      value={formData.schoolName}
                      onChange={handleSchoolChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      School EIN *
                    </label>
                    <input
                      type="text"
                      name="schoolEin"
                      placeholder="Enter EIN number"
                      value={formData.schoolEin}
                      onChange={handleSchoolChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      School Address *
                    </label>
                    <textarea
                      name="schoolAddress"
                      placeholder="Enter complete address"
                      value={formData.schoolAddress}
                      onChange={handleSchoolChange}
                      rows="3"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                    />
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Saving...
                        </span>
                      ) : (
                        "Save & Continue"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            {settings?.schoolName || "School Management System"}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Welcome to your school's centralized management platform. Select an
            academic session to continue.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <CalendarDays className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Sessions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">User Role</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">
                  {user?.userType}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">School Status</p>
                <p className="text-2xl font-bold text-gray-900">
                  {settings ? "Configured" : "Setup Required"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Session Section */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Academic Sessions
              </h2>
              <p className="text-gray-600">
                Create new or select existing academic sessions
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <div className="relative flex-1 sm:w-auto">
                <input
                  type="text"
                  placeholder="Enter new session (e.g., 2024-2025)"
                  value={newSession}
                  onChange={(e) => setNewSession(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddSession()}
                  className="w-full sm:w-64 px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                <CalendarDays className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
              <button
                onClick={handleAddSession}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Add Session
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sessions Grid */}
        {sessionLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          </div>
        ) : sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((s) => (
              <Link
                key={s._id}
                to={`/dashboard/${s.sessionName}`}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <CalendarDays className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition">
                        {s.sessionName}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Click to access dashboard
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    Active Session
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <CalendarDays className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Sessions Available
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first academic session to get started
            </p>
            <button
              onClick={() =>
                document.querySelector('input[type="text"]')?.focus()
              }
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Add a session
            </button>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center text-gray-500 text-sm">
            <p>
              © {new Date().getFullYear()}{" "}
              {settings?.schoolName || "School Management System"}. All rights
              reserved.
            </p>
            <p className="mt-1">
              Need help? Contact your system administrator.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
