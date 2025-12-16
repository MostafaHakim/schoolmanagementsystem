import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LogIn,
  Eye,
  EyeOff,
  User,
  Lock,
  School,
  AlertCircle,
  CheckCircle,
  Loader2,
  Shield,
} from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({
    userName: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Auto-redirect if already logged in
    if (user?.userName) {
      navigate("/home");
    }

    // Check for remembered credentials
    const rememberedUser = localStorage.getItem("rememberedUser");
    if (rememberedUser) {
      try {
        const parsed = JSON.parse(rememberedUser);
        setForm({
          userName: parsed.userName || "",
          password: "",
        });
        setRememberMe(true);
      } catch (err) {
        console.error("Error parsing remembered user:", err);
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const loginUser = async () => {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/user/role`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    return res.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Basic validation
    if (!form.userName.trim() || !form.password.trim()) {
      setError("Please enter both username and password");
      setLoading(false);
      return;
    }

    try {
      const res = await loginUser();

      if (res.success) {
        // Save to localStorage
        const userData = {
          id: res.data._id,
          userName: res.data.userName,
          userType: res.data.userType,
          token: res.token, // Assuming API returns a token
        };

        localStorage.setItem("user", JSON.stringify(userData));

        // Save credentials if "Remember me" is checked
        if (rememberMe) {
          localStorage.setItem(
            "rememberedUser",
            JSON.stringify({
              userName: form.userName,
              timestamp: new Date().toISOString(),
            })
          );
        } else {
          localStorage.removeItem("rememberedUser");
        }

        setSuccess(`Welcome back, ${res.data.userName}!`);

        // Show success message before redirect
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else {
        setError(res.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const demoCredentials = {
      admin: { userName: "admin_demo", password: "demo123" },
      teacher: { userName: "teacher_demo", password: "demo123" },
      student: { userName: "student_demo", password: "demo123" },
    };

    setForm(demoCredentials[role]);
    setError("");
    setSuccess(`Demo ${role} credentials loaded. Click Login to continue.`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Brand/Info */}
        <div className="hidden lg:block bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl shadow-2xl p-12 text-white">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <School className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">School Manager</h1>
                <p className="text-blue-100 text-sm">
                  Professional Education Platform
                </p>
              </div>
            </div>

            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Streamline Your School Management
            </h2>

            <p className="text-blue-100 mb-10 text-lg">
              Access your academic dashboard, manage sessions, and collaborate
              with your educational community.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <Shield className="h-6 w-6" />
                <div>
                  <h3 className="font-semibold">Secure Access</h3>
                  <p className="text-sm text-blue-100">
                    Enterprise-grade security for your data
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <User className="h-6 w-6" />
                <div>
                  <h3 className="font-semibold">Role-Based Access</h3>
                  <p className="text-sm text-blue-100">
                    Different views for admins, teachers, and students
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/20">
              <p className="text-sm text-blue-100">
                "Education is the most powerful weapon which you can use to
                change the world."
                <span className="block mt-2">- Nelson Mandela</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="lg:hidden flex items-center justify-center space-x-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <School className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    School Manager
                  </h1>
                  <p className="text-gray-500 text-sm">
                    Professional Education Platform
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Sign in to your account to continue
              </p>
            </div>

            {/* Demo Credentials Section */}
            <div className="mb-8">
              <p className="text-sm text-gray-500 mb-3">Try demo accounts:</p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleDemoLogin("admin")}
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
                >
                  Admin Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("teacher")}
                  className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition"
                >
                  Teacher Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("student")}
                  className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100 transition"
                >
                  Student Demo
                </button>
              </div>
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
                <button
                  onClick={() => setError("")}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  ×
                </button>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-green-700 text-sm">{success}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="userName"
                    value={form.userName}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 placeholder-gray-500"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 placeholder-gray-500"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me on this device
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-3" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-3" />
                    Sign In to Account
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-500">OR</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition"
                >
                  Create new account
                </Link>
              </p>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <div className="text-center space-y-2">
                <p className="text-xs text-gray-500">
                  By signing in, you agree to our Terms of Service and Privacy
                  Policy
                </p>
                <p className="text-xs text-gray-400">
                  © {new Date().getFullYear()} School Manager. All rights
                  reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Login;
