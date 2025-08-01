import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Universities from "./pages/Universities";
import Courses from "./pages/Courses";
import Branches from "./pages/Branches";
import Semesters from "./pages/Semesters";
import Subjects from "./pages/Subjects";
import Content from "./pages/Content";
import NotFound from "./pages/NotFound";
import AskExperts from "./pages/AskExperts";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/Dashboard";
import MaterialsPage from "./pages/admin/ManagePage";
// Auth
import ProtectedRoute from "./components/ProtectedRoutes";
import NewsLetter from "./pages/admin/NewsLetter";
import ContactMessages from "./pages/admin/ContactMessages";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  [
    {
      element: <PublicLayout />,
      children: [
        { path: "/", element: <Index /> },
        { path: "/about", element: <About /> },
        { path: "/contact", element: <Contact /> },
        { path: "/askexperts", element: <AskExperts /> },
        { path: "/universities", element: <Universities /> },
        {
          path: "/universities/:universityId/courses",
          element: <Courses />,
        },
        {
          path: "/universities/:universityId/courses/:courseId/branches",
          element: <Branches />,
        },
        {
          path: "/universities/:universityId/courses/:courseId/branches/:branchId/semesters",
          element: <Semesters />,
        },
        {
          path: "/universities/:universityId/courses/:courseId/branches/:branchId/semesters/:semesterId/subjects",
          element: <Subjects />,
        },
        {
          path: "/universities/:universityId/courses/:courseId/branches/:branchId/semesters/:semesterId/subjects/:subjectId/content",
          element: <Content />,
        },
        { path: "*", element: <NotFound /> },
      ],
    },
    {
      path: "/admin-login",
      element: <AdminLogin />,
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <AdminDashboard /> },
        { path: "materials", element: <MaterialsPage /> },
        { path: "newsletter", element: <NewsLetter /> },
        { path: "contact-messages", element: <ContactMessages /> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouterProvider router={router} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
