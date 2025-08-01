import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Toaster } from "react-hot-toast";


const PublicLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Toaster position="top-center" />
    <Navigation />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default PublicLayout;
