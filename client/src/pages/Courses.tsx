import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import CardGrid from "@/components/CardGrid";
import { BookOpen } from "lucide-react";
import { COURSES, UNIVERSITY_API } from "@/utils/apis";
import { showError } from "@/utils/toast";

const Courses = () => {
  const { universityId } = useParams();
  const [university, setUniversity] = useState(null);
  const [courses, setCourses] = useState([]);
  const [universityImage, setUniversityImage] = useState("");

useEffect(() => {
  const fetchUniversity = async () => {
    try {
      const res = await fetch(UNIVERSITY_API.GET_BY_ID(universityId));
      const data = await res.json();
      if (res.ok) {
        setUniversityImage(data.imageUrl)
        setUniversity(data.title)
      } else {
        console.error("University fetch failed");
      }
    } catch {
      console.error("Error fetching university");
    }
  };

  if (universityId) {
    fetchUniversity();
  }
}, [universityId]);

  useEffect(() => {
  const fetchCourses = async () => {
    try {
      const res = await fetch(`${COURSES.STATS}?universityId=${universityId}`);
      const data = await res.json();

      if (res.ok && Array.isArray(data)) {
        const formatted = data.map((c) => ({
          id: c.courseId,
          title: c.title,
          description: c.description || "",
          link: `/universities/${universityId}/courses/${c.courseId}/branches`,
          icon: <BookOpen className="w-6 h-6 text-blue-600" />,
          badge: c.badge || "",
          stats: [
            { label: "Branches", value: c.branchesCount },
            { label: "Semesters", value: c.semestersCount },
            { label: "Subjects", value: c.subjectsCount }
          ]
        }));
        setCourses(formatted);
      } else {
        showError(data.message || "Failed to load course stats.");
      }
    } catch (err) {
      showError("Server error while fetching course stats.");
      console.error(err);
    }
  };

  if (universityId) fetchCourses();
}, [universityId]);

  return (
    <PageLayout 
      title={`Courses at ${university}`}
      description="Choose your course to explore available branches and specializations."
      backgroundImage={universityImage}
    >
      <CardGrid items={courses} columns={3} />
    </PageLayout>
  );
};

export default Courses;
