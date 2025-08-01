import { useEffect, useState } from "react";
import PageLayout from "@/components/PageLayout";
import CardGrid from "@/components/CardGrid";
import { UNIVERSITY_API, COURSES } from "@/utils/apis";
import { showError } from "@/utils/toast";

const Universities = () => {
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    fetchUniversities();
  }, []);

 const fetchUniversities = async () => {
  try {
    const res = await fetch(UNIVERSITY_API.GET_ALL);
    const data = await res.json();

    if (res.ok) {
      const universitiesWithCounts = await Promise.all(
        data.data.map(async (u) => {
          try {
            const countRes = await fetch(COURSES.GET_COUNT_BY_UNIVERSITY(u._id));
            const countData = await countRes.json();
            return {
              id: u._id,
              title: u.title,
              description: u.description,
              link: `/universities/${u._id}/courses`,
              image: u.imageUrl,
              badge: u.badge || "Accredited",
              stats: [
                { label: "Students", value: u.students },
                { label: "Faculty", value: u.faculty },
                { label: "Courses", value: countData.count }
              ],
            };
          } catch {
            return {
              id: u._id,
              title: u.title,
              description: u.description,
              link: `/universities/${u._id}/courses`,
              image: u.imageUrl,
              badge: u.badge || "Accredited",
              stats: [
                { label: "Students", value: u.students },
                { label: "Faculty", value: u.faculty },
                { label: "Courses", value: 0 }
              ],
            };
          }
        })
      );

      setUniversities(universitiesWithCounts);
    } else {
      showError(data.message || "Failed to load universities");
    }
  } catch (err) {
    showError("Error fetching universities");
  }
};


  return (
    <PageLayout 
      title="Choose Your University" 
      description="Select your university to explore available courses and study materials."
      backgroundImage="/harvard-university-cambridge-usa.jpg"
    >
      <CardGrid items={universities} columns={3} />
    </PageLayout>
  );
};

export default Universities;
