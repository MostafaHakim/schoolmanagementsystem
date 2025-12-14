import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const { sessionName } = useParams();
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 ">
        <Navbar sessionName={sessionName} />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
