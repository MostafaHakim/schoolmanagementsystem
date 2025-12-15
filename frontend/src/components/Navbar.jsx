import React from "react";
import ProfileImage from "../assets/user.png";

const Navbar = ({ sessionName }) => {
  return (
    <nav className="bg-white shadow-md px-6 py-2 sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo / Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Iqra International School
          </h1>
        </div>

        {/* Right side: Admin + Session */}
        <div className="flex items-center space-x-6">
          {/* Admin Profile */}
          <div className="flex items-center space-x-3 bg-gray-100 px-3 py-1 rounded-full shadow-sm">
            <img
              className="w-9 h-9 rounded-full border-2 border-gray-300"
              src={ProfileImage}
              alt="Admin"
            />
            <span className="font-medium text-gray-700">Admin</span>
          </div>
          {/* Session Info */}
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md font-medium shadow-sm">
            Session: {sessionName || "N/A"}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
