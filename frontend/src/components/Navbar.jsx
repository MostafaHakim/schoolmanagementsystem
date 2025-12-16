// Navbar.jsx - Updated version
import { FaBell, FaUserCircle, FaBars } from "react-icons/fa";

const Navbar = ({ sessionName, pageTitle, sidebarOpen, onToggleSidebar }) => {
  return (
    <nav className="bg-white shadow-xs border-b border-gray-200 sticky">
      <div className="px-4 md:px-6 py-2">
        <div className="flex items-center justify-between">
          {/* Left side - Toggle button and page title */}
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaBars className="w-5 h-5 text-gray-600" />
            </button>

            <div>
              <h1 className="text-sm  font-semibold text-gray-800">
                {pageTitle}
              </h1>
              {sessionName && (
                <p className="text-xs text-gray-600">
                  Session: <span className="font-medium">{sessionName}</span>
                </p>
              )}
            </div>
          </div>

          {/* Right side - User profile and notifications */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <FaBell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-800">Admin User</p>
                <p className="text-xs text-gray-500">admin@school.edu</p>
              </div>
              <button className="p-1 rounded-full hover:bg-gray-100">
                <FaUserCircle className="w-8 h-8 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
