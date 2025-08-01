import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import CardGrid from "@/components/CardGrid";
import { List } from "lucide-react";
import { SEMESTERS } from "@/utils/apis";
import { showError } from "@/utils/toast";

const Semesters = () => {
  const { universityId, courseId, branchId } = useParams();
  const [semesters, setSemesters] = useState([]);
  const token = localStorage.getItem("admin_token");

  const branchName =
    branchId?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "";

  useEffect(() => {
  if (branchId) {
    fetchSemestersWithStats();
  }
}, [branchId]);

const fetchSemestersWithStats = async () => {
  try {
    const query = new URLSearchParams({ branchId });
    const [semRes, statsRes] = await Promise.all([
      fetch(`${SEMESTERS.GET_ALL}?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${SEMESTERS.GET_STATS}?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const semData = await semRes.json();
    const statsData = await statsRes.json();

    if (!semRes.ok || !statsRes.ok) {
      showError("Failed to fetch semesters or stats.");
      return;
    }

    const statsMap = (statsData.data || []).reduce((acc, stat) => {
      acc[stat.semester] = stat;
      return acc;
    }, {});

    const enriched = (semData.data || []).map((sem) => ({
      ...sem,
      stats: statsMap[sem.number] || {},
    }));

    setSemesters(enriched);
  } catch (error) {
    console.error("Error fetching stats:", error);
    showError("Error fetching semester data.");
  }
};


 const semesterCards = semesters.map((sem) => ({
  id: sem._id,
  title: `Semester ${sem.number}`,
  description: `Access all subjects, notes, and materials for the ${sem.number}${getSuffix(sem.number)} semester.`,
  link: `/universities/${universityId}/courses/${courseId}/branches/${branchId}/semesters/${sem.number}/subjects`,
  icon: <List className="w-6 h-6 text-blue-600" />,
  badge: sem.badge || "Available",
  stats: [
    { label: "Subjects", value: String(sem.stats?.subjectsCount) },
    { label: "Credits", value: String(sem.stats?.totalCredits) },
    { label: "Materials", value: String(sem.stats?.materialsCount) }
  ]
}));


  function getSuffix(num: number) {
    if (num === 1) return "st";
    if (num === 2) return "nd";
    if (num === 3) return "rd";
    return "th";
  }

  return (
    <PageLayout
      title={`${branchName} - Semesters`}
      description="Choose a semester to access subject-wise study materials and resources."
    >
      <CardGrid items={semesterCards} columns={4} />
    </PageLayout>
  );
};

export default Semesters;
