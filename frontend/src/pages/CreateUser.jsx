import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  User,
  Lock,
  Mail,
  Phone,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Building,
} from "lucide-react";

const CreateUser = () => {
  const [form, setForm] = useState({
    userName: "",
    password: "",
    userType: "",
    userMobile: "",
    userEmail: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!form.userName.trim()) {
      newErrors.userName = "Username is required";
    } else if (form.userName.length < 3) {
      newErrors.userName = "Username must be at least 3 characters";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!form.userType) {
      newErrors.userType = "Please select a user role";
    }

    if (form.userMobile && !/^\d{10,15}$/.test(form.userMobile)) {
      newErrors.userMobile = "Please enter a valid phone number";
    }

    if (form.userEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.userEmail)) {
      newErrors.userEmail = "Please enter a valid email address";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const createUser = async (userData) => {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return res.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await createUser(form);

      if (res.success) {
        setSuccess("User created successfully!");

        // Reset form after success
        setTimeout(() => {
          setForm({
            userName: "",
            password: "",
            userType: "",
            userMobile: "",
            userEmail: "",
          });
          setSuccess("");
          // Optionally redirect to users list
          // navigate("/users");
        }, 2000);
      } else {
        setErrors({ general: res.message || "Failed to create user" });
      }
    } catch (err) {
      console.error("Create user error:", err);
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const generateRandomPassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm((prev) => ({ ...prev, password }));
    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
  };

  const roleOptions = [
    {
      value: "admin",
      label: "Administrator",
      color: "bg-red-100 text-red-800",
    },
    {
      value: "user",
      label: "Regular User",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "accounts",
      label: "Accounts",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "student",
      label: "Student",
      color: "bg-purple-100 text-purple-800",
    },
    {
      value: "parents",
      label: "Parents",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "teacher",
      label: "Teacher",
      color: "bg-indigo-100 text-indigo-800",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Create New User
              </h1>
              <p className="text-gray-600 mt-2">
                Add a new user to the school management system
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <UserPlus className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              {/* Success Message */}
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-green-700 font-medium">{success}</p>
                    <p className="text-green-600 text-sm mt-1">
                      User has been added to the system successfully.
                    </p>
                  </div>
                </div>
              )}

              {/* General Error */}
              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                  <p className="text-red-700">{errors.general}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      Username *
                    </span>
                  </label>
                  <input
                    type="text"
                    name="userName"
                    value={form.userName}
                    onChange={handleChange}
                    placeholder="Enter username"
                    className={`w-full px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.userName ? "border-red-300" : "border-gray-300"
                    }`}
                    disabled={loading}
                  />
                  {errors.userName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.userName}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <span className="flex items-center">
                        <Lock className="h-4 w-4 mr-2 text-gray-500" />
                        Password *
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={generateRandomPassword}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Generate Secure Password
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      className={`w-full px-4 py-3.5 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                        errors.password ? "border-red-300" : "border-gray-300"
                      }`}
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
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.password}
                    </p>
                  )}
                  {form.password && !errors.password && (
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <div className="flex-1">
                        <div className="flex items-center space-x-1">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full ${
                                form.password.length > 8
                                  ? "bg-green-500"
                                  : form.password.length > 5
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="ml-3">
                        {form.password.length > 8
                          ? "Strong"
                          : form.password.length > 5
                          ? "Medium"
                          : "Weak"}
                      </span>
                    </div>
                  )}
                </div>

                {/* User Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-gray-500" />
                      User Role *
                    </span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {roleOptions.map((role) => (
                      <button
                        type="button"
                        key={role.value}
                        onClick={() => {
                          setForm((prev) => ({
                            ...prev,
                            userType: role.value,
                          }));
                          if (errors.userType)
                            setErrors((prev) => ({ ...prev, userType: "" }));
                        }}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          form.userType === role.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-left">
                          <div
                            className={`inline-block px-2 py-1 rounded-lg text-xs font-medium mb-2 ${role.color}`}
                          >
                            {role.label}
                          </div>
                          <p className="text-sm text-gray-600">
                            {role.value === "admin" && "Full system access"}
                            {role.value === "user" && "Basic access"}
                            {role.value === "accounts" && "Financial access"}
                            {role.value === "student" &&
                              "Student portal access"}
                            {role.value === "parents" && "Parent portal access"}
                            {role.value === "teacher" &&
                              "Teacher dashboard access"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.userType && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.userType}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mobile Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        Mobile Number
                      </span>
                    </label>
                    <input
                      type="tel"
                      name="userMobile"
                      value={form.userMobile}
                      onChange={handleChange}
                      placeholder="Enter mobile number"
                      className={`w-full px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                        errors.userMobile ? "border-red-300" : "border-gray-300"
                      }`}
                      disabled={loading}
                    />
                    {errors.userMobile && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.userMobile}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        Email Address
                      </span>
                    </label>
                    <input
                      type="email"
                      name="userEmail"
                      value={form.userEmail}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className={`w-full px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                        errors.userEmail ? "border-red-300" : "border-gray-300"
                      }`}
                      disabled={loading}
                    />
                    {errors.userEmail && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.userEmail}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-3" />
                        Creating User...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-5 w-5 mr-3" />
                        Create New User
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Guidelines */}
          <div className="space-y-6">
            {/* Guidelines Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building className="h-5 w-5 mr-2 text-blue-600" />
                User Creation Guidelines
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <span className="text-sm text-gray-600">
                    <strong>Username:</strong> Must be unique and 3+ characters
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <span className="text-sm text-gray-600">
                    <strong>Password:</strong> Minimum 6 characters, recommended
                    8+
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <span className="text-sm text-gray-600">
                    <strong>User Roles:</strong> Define access permissions
                    carefully
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <span className="text-sm text-gray-600">
                    <strong>Contact Info:</strong> Optional but recommended for
                    notifications
                  </span>
                </li>
              </ul>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-blue-100">Total Active Users</p>
                  <p className="text-2xl font-bold">1,247</p>
                </div>
                <div>
                  <p className="text-sm text-blue-100">New Users This Month</p>
                  <p className="text-2xl font-bold">42</p>
                </div>
                <div>
                  <p className="text-sm text-blue-100">Most Common Role</p>
                  <p className="text-xl font-bold">Student</p>
                </div>
              </div>
            </div>

            {/* Role Permissions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Role Permissions
              </h3>
              <div className="space-y-3">
                {roleOptions.slice(0, 3).map((role) => (
                  <div
                    key={role.value}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {role.label}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${role.color}`}
                    >
                      {role.value === "admin" && "Full Access"}
                      {role.value === "user" && "Limited"}
                      {role.value === "accounts" && "Financial"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
