
import { Link, useParams, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const Breadcrumb = () => {
  const params = useParams();
  const location = useLocation();
  
  const breadcrumbs = [];
  
  // Add home
  breadcrumbs.push({ label: "Home", path: "/" });
  
  // Build breadcrumb based on current path
  if (location.pathname.includes("/universities")) {
    breadcrumbs.push({ label: "Universities", path: "/universities" });
    
    if (params.universityId) {
      const universityName = params.universityId.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
      breadcrumbs.push({ 
        label: universityName, 
        path: `/universities/${params.universityId}/courses` 
      });
      
      if (params.courseId) {
        const courseName = params.courseId.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
        breadcrumbs.push({ 
          label: courseName, 
          path: `/universities/${params.universityId}/courses/${params.courseId}/branches` 
        });
        
        if (params.branchId) {
          const branchName = params.branchId.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
          breadcrumbs.push({ 
            label: branchName, 
            path: `/universities/${params.universityId}/courses/${params.courseId}/branches/${params.branchId}/semesters` 
          });
          
          if (params.semesterId) {
            const semesterName = `Semester ${params.semesterId}`;
            breadcrumbs.push({ 
              label: semesterName, 
              path: `/universities/${params.universityId}/courses/${params.courseId}/branches/${params.branchId}/semesters/${params.semesterId}/subjects` 
            });
            
            if (params.subjectId) {
              const subjectName = params.subjectId.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
              breadcrumbs.push({ 
                label: subjectName, 
                path: `/universities/${params.universityId}/courses/${params.courseId}/branches/${params.branchId}/semesters/${params.semesterId}/subjects/${params.subjectId}/content` 
              });
            }
          }
        }
      }
    }
  }
  
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center">
          {index === 0 ? (
            <Home className="w-4 h-4 mr-1" />
          ) : (
            <ChevronRight className="w-4 h-4 mx-2" />
          )}
          {index === breadcrumbs.length - 1 ? (
            <span className="text-foreground font-medium">{crumb.label}</span>
          ) : (
            <Link 
              to={crumb.path} 
              className="hover:text-foreground transition-colors duration-200"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
