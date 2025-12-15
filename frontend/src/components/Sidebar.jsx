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
} from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { GiTeacher } from "react-icons/gi";
import { Link, NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, onToggle, sessionName }) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const menuItems = [
    {
      name: "Home",
      icon: <FaHome />,
      path: `/dashboard/:${sessionName}`,
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
        {
          name: "Semester",
          icon: <FaCalendarAlt />,
          path: "exam",
        },
        {
          name: "Admit Card",
          icon: <FaIdCard />,
          path: "admit",
        },
        {
          name: "Marks Entry",
          icon: <FaEdit />,
          path: "marks-entry",
        },
        {
          name: "Marksheet",
          icon: <FaFileAlt />,
          path: "marksheet",
        },
        {
          name: "Final Result",
          icon: <FaChartBar />,
          path: "finalresult",
        },
        {
          name: "Promotion",
          icon: <FaBlackTie />,
          path: "promotion",
        },
      ],
    },
    {
      name: "Fees",
      icon: <FaMoneyBillWave />,
      path: "fees",
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

  return (
    <>
      {/* Sidebar container */}
      <div
        className={`bg-white shadow-lg h-screen p-5 fixed md:relative z-30 top-0 left-0 transition-all duration-300 overflow-y-auto ${
          isOpen ? "w-64" : "w-0 md:w-20"
        }`}
      >
        {/* Toggle button inside sidebar for mobile */}
        <div className="md:hidden mb-6">
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Logo - Show only icon when collapsed */}
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

        {/* Menu Items */}
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              {/* When sidebar is collapsed, show only icon with tooltip */}
              {!isOpen ? (
                <div className="relative group">
                  <NavLink
                    to={item.path || "#"}
                    className={({ isActive }) =>
                      `flex items-center justify-center p-3 rounded-lg ${
                        isActive
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-gray-600 hover:bg-gray-100"
                      }`
                    }
                    onClick={(e) => item.subItems && e.preventDefault()}
                  >
                    <span className="text-xl">{item.icon}</span>
                  </NavLink>

                  {/* Tooltip for collapsed sidebar */}
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.name}
                  </div>
                </div>
              ) : (
                // Full sidebar view
                <div>
                  <div
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                      openSubmenu === index
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => item.subItems && toggleSubmenu(index)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      {item.path ? (
                        <NavLink
                          to={item.path}
                          className={({ isActive }) =>
                            `text-md font-medium ${
                              isActive ? "text-indigo-600 font-semibold" : ""
                            }`
                          }
                          end
                        >
                          {item.name}
                        </NavLink>
                      ) : (
                        <span className="text-md font-medium">{item.name}</span>
                      )}
                    </div>

                    {item.subItems && (
                      <FaChevronRight
                        className={`transition-transform duration-300 ${
                          openSubmenu === index
                            ? "rotate-90 text-indigo-500"
                            : "text-gray-400"
                        }`}
                      />
                    )}
                  </div>

                  {/* Submenu for full sidebar */}
                  {item.subItems && isOpen && (
                    <ul
                      className={`pl-10 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                        openSubmenu === index ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      {item.subItems.map((sub, subIndex) => (
                        <li key={subIndex}>
                          <NavLink
                            to={sub.path}
                            className={({ isActive }) =>
                              `flex items-center gap-3 p-2 rounded-lg ${
                                isActive
                                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                                  : "text-gray-600 hover:text-indigo-500"
                              }`
                            }
                          >
                            <span className="text-gray-500">{sub.icon}</span>
                            <span className="text-sm">{sub.name}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
export default Sidebar;
