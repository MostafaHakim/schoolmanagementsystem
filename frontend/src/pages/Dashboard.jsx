import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const NAVBAR_HEIGHT = "64px"; // h-16

const Dashboard = () => {
  const { sessionName } = useParams();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pageTitle, setPageTitle] = useState("Dashboard");

  useEffect(() => {
    const path = location.pathname;

    const titleMap = {
      "/subjects": "Subjects",
      "/students": "Students",
      "/classes": "Classes",
      "/teachers": "Teachers",
      "/exam": "Semester Exam",
      "/admit": "Admit Card",
      "/marks-entry": "Marks Entry",
      "/marksheet": "Marksheet",
      "/finalresult": "Final Result",
      "/fees": "Fee Management",
    };

    const matchedTitle = Object.keys(titleMap).find((key) =>
      path.includes(key)
    );

    setPageTitle(matchedTitle ? titleMap[matchedTitle] : "Dashboard");
  }, [location]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      {/* ===== Navbar (Fixed) ===== */}
      <div className="fixed top-0 left-0 right-0 z-50 h-16">
        <Navbar
          sessionName={sessionName}
          pageTitle={pageTitle}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={toggleSidebar}
        />
      </div>

      {/* ===== Body Area ===== */}
      <div className="flex pt-16 h-full">
        {/* ===== Sidebar (Fixed) ===== */}
        <div
          className={`fixed top-18 left-0 h-[calc(100vh-64px)] 
          bg-white border-r transition-all duration-300 z-40
          ${sidebarOpen ? "w-64" : "w-20"}`}
        >
          <Sidebar
            isOpen={sidebarOpen}
            onToggle={toggleSidebar}
            sessionName={sessionName}
          />
        </div>

        {/* ===== Main Content (Scrollable) ===== */}
        <main
          className={`flex-1 ml-20 md:ml-64 transition-all duration-300 
          overflow-y-auto p-4 md:p-6`}
          style={{
            marginLeft: sidebarOpen ? "16rem" : "5rem",
          }}
        >
          <div className="max-w-9xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
              <Outlet />
            </div>

            <footer className="mt-8 text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} School Management System. All rights
              reserved.
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
