import { useState } from "react";
import {
  FaHome,
  FaBook,
  FaUserAlt,
  FaGraduationCap,
  FaClipboard,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaIdCard,
  FaEdit,
  FaFileAlt,
  FaChartBar,
  FaChevronRight,
  FaBlackTie,
  FaSignOutAlt,
} from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { GiTeacher } from "react-icons/gi";
import { Link, NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, onToggle, sessionName }) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Home",
      icon: <FaHome />,
      path: `/dashboard/${sessionName}`,
    },
    {
      name: "Subjects",
      icon: <FaBook />,
      path: "subjects",
    },
    {
      name: "Students",
      icon: <FaUserAlt />,
      path: "students",
    },
    {
      name: "Classes",
      icon: <FaGraduationCap />,
      path: "classes",
    },
    {
      name: "Teachers",
      icon: <GiTeacher />,
      path: "teachers",
    },
    {
      name: "Exam",
      icon: <FaClipboard />,
      subItems: [
        { name: "Semester", icon: <FaCalendarAlt />, path: "exam" },
        { name: "Admit Card", icon: <FaIdCard />, path: "admit" },
        { name: "Marks Entry", icon: <FaEdit />, path: "marks-entry" },
        { name: "Marksheet", icon: <FaFileAlt />, path: "marksheet" },
        { name: "Final Result", icon: <FaChartBar />, path: "finalresult" },
        { name: "Promotion", icon: <FaBlackTie />, path: "promotion" },
      ],
    },
    {
      name: "Fees",
      icon: <FaMoneyBillWave />,
      path: "fees",
    },
    {
      name: "Events",
      icon: <FaMoneyBillWave />,
      path: "events",
    },
    {
      name: "Settings",
      icon: <CiSettings />,
      path: "settings",
    },
  ];

  const toggleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  // 🔴 Logout Handler
  const handleLogout = () => {
    localStorage.clear(); // token, user, session সব clear
    navigate("/login");
  };

  return (
    <div
      className={`bg-white shadow-lg h-screen p-5 fixed md:relative z-30 top-0 left-0 transition-all duration-300 overflow-y-auto ${
        isOpen ? "w-64" : "w-0 md:w-20"
      }`}
    >
      {/* Mobile close button */}
      <div className="md:hidden mb-6">
        <button onClick={onToggle} className="p-2 rounded-lg hover:bg-gray-100">
          ✕
        </button>
      </div>

      {/* Logo */}
      <Link
        to="/"
        className={`flex items-center gap-3 mb-8 ${
          isOpen ? "" : "justify-center"
        }`}
      >
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">S</span>
        </div>
        {isOpen && (
          <div>
            <h1 className="text-xl font-bold text-gray-800">School ERP</h1>
            <p className="text-gray-500 text-xs">Management</p>
          </div>
        )}
      </Link>

      {/* Menu */}
      <ul className="space-y-2">
        {menuItems.map((item, index) => (
          <li key={index}>
            {!isOpen ? (
              <div className="relative group">
                <NavLink
                  to={item.path || "#"}
                  className="flex items-center justify-center p-3 rounded-lg text-gray-600 hover:bg-gray-100"
                  onClick={(e) => item.subItems && e.preventDefault()}
                >
                  <span className="text-xl">{item.icon}</span>
                </NavLink>
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100">
                  {item.name}
                </div>
              </div>
            ) : (
              <>
                <div
                  className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-100"
                  onClick={() => item.subItems && toggleSubmenu(index)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    {item.path ? (
                      <NavLink to={item.path}>{item.name}</NavLink>
                    ) : (
                      <span>{item.name}</span>
                    )}
                  </div>
                  {item.subItems && (
                    <FaChevronRight
                      className={`transition-transform ${
                        openSubmenu === index ? "rotate-90" : ""
                      }`}
                    />
                  )}
                </div>

                {item.subItems && openSubmenu === index && (
                  <ul className="pl-10 space-y-1">
                    {item.subItems.map((sub, i) => (
                      <li key={i}>
                        <NavLink
                          to={sub.path}
                          className="flex items-center gap-2 p-2 text-sm text-gray-600 hover:text-indigo-500"
                        >
                          {sub.icon}
                          {sub.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </li>
        ))}
      </ul>

      {/* 🔴 Logout Button */}
      <div className="absolute bottom-20 left-0 w-full px-5">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full p-3 rounded-lg text-red-600 hover:bg-red-50 ${
            !isOpen && "justify-center"
          }`}
        >
          <FaSignOutAlt />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
