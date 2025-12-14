import React, { useState } from "react";
import {
  FaHome,
  FaBook,
  FaUserAlt,
  FaClipboard,
  FaMoneyBillWave,
  FaGraduationCap,
  FaFileSignature,
} from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { NavLink } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null); // কোন submenu খোলা আছে

  const menuItems = [
    { name: "Home", icon: <FaHome />, path: "/" },
    { name: "Subjects", icon: <FaBook />, path: "subjects" },
    { name: "Students", icon: <FaUserAlt />, path: "students" },
    { name: "Classes", icon: <FaGraduationCap />, path: "classes" },
    { name: "Teachers", icon: <GiTeacher />, path: "teachers" },
    {
      name: "Exam",
      icon: <FaClipboard />,
      subItems: [
        { name: "Semister", path: "exam" },
        { name: "Marks Entry", path: "marks-entry" },
        { name: "Marksheet", path: "marksheet" },
        { name: "Final Result", path: "finalresult" },
      ],
    },
    { name: "Fees", icon: <FaMoneyBillWave />, path: "fees" },
    { name: "Admit Card", icon: <FaUserAlt />, path: "admit" },
  ];

  const toggleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <div className="md:hidden p-2 bg-white shadow-md flex justify-between items-center fixed w-full z-20">
        <span className="text-xl font-bold text-indigo-600">Menu</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 focus:outline-none"
        >
          {isOpen ? "Close" : "Open"}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`bg-white shadow-md h-screen p-5 pt-16 md:pt-8 fixed md:relative z-30 top-0 left-0 transition-all duration-300 overflow-hidden ${
          isOpen ? "w-64" : "w-0 md:w-64"
        }`}
      >
        <div className="text-2xl font-bold text-indigo-600 mb-8">MySidebar</div>
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index} className="hover:bg-gray-200">
              <div
                className="flex items-center justify-between gap-3 text-gray-700 hover:text-indigo-600 cursor-pointer p-2 rounded-md"
                onClick={() => item.subItems && toggleSubmenu(index)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  {item.path ? (
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `text-md font-medium ${
                          isActive ? "text-indigo-600" : ""
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  ) : (
                    <span className="text-md font-medium">{item.name}</span>
                  )}
                </div>
                {/* Show arrow for items with subItems */}
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

              {/* Submenu */}
              {item.subItems && (
                <ul
                  className={`pl-10 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                    openSubmenu === index ? "max-h-40" : "max-h-0"
                  }`}
                >
                  {item.subItems.map((sub, subIndex) => (
                    <li key={subIndex}>
                      <NavLink
                        to={sub.path}
                        className={({ isActive }) =>
                          `block text-gray-600 hover:text-indigo-500 ${
                            isActive ? "font-semibold" : ""
                          }`
                        }
                      >
                        {sub.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-20 z-10 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
