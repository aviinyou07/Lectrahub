import React from "react";
import { Toaster } from "react-hot-toast";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  LogOut,
  Mails,
  MessagesSquare,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Materials", path: "/admin/materials", icon: FileText },
  { name: "Newletter", path: "/admin/newsletter", icon: Mails },
  { name: "ContactMessages", path: "/admin/contact-messages", icon: MessagesSquare },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin-login");
  };

  return (
   <>
     <Toaster position="top-right" />
     <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-4 space-y-6 border-r">
        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>

        <nav className="space-y-2">
          {navItems.map(({ name, path, icon: Icon }) => (
            <Link
              key={name}
              to={path}
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 ${
                location.pathname === path ? "bg-gray-200 font-medium" : ""
              }`}
            >
              <Icon className="w-5 h-5" />
              {name}
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-red-500 hover:underline"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
   </>
  );
};

export default AdminLayout;
