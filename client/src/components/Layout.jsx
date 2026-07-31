import { Outlet } from "react-router";
import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";

export default function Layout() {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="flex flex-col items-center gap-12 mt-12">
        <Outlet />
      </div>
    </div>
  );
}
