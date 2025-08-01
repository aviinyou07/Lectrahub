import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import CardGrid from "@/components/CardGrid";
import { FolderOpen } from "lucide-react";
import { BRANCHES } from "@/utils/apis";
import { showError } from "@/utils/toast";

const Branches = () => {
  const { universityId, courseId } = useParams();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  const courseName =
    courseId?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "";

const fetchBranches = async () => {
  try {
    const res = await fetch(`${BRANCHES.STATS}?courseId=${courseId}`);
    const data = await res.json();

    if (res.ok) {
      const formatted = (data.data || []).map((b) => ({
        id: b.id,
        title: b.title,
        description: b.description,
        link: `/universities/${universityId}/courses/${courseId}/branches/${b.id}/semesters`,
        icon: <FolderOpen className="w-6 h-6 text-blue-600" />,
        badge: b.badge || "",
        stats: [
          { label: "Semesters", value: b.semestersCount },
          { label: "Core Subjects", value: b.coreSubjects },
          { label: "Electives", value: b.electives },
        ]
      }));

      setBranches(formatted);
    } else {
      showError(data.message || "Failed to load branch stats.");
    }
  } catch (err) {
    showError("Server error while loading branch stats.");
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (courseId) fetchBranches();
  }, [courseId]);

  return (
    <PageLayout
      title={`${courseName} Branches`}
      description="Select your specialization or branch to access semester-wise study materials."
      backgroundImage="/public/harvard-university-cambridge-usa.jpg"
    >
      {loading ? (
        <p className="text-center text-gray-500">Loading branches...</p>
      ) : (
        <CardGrid items={branches} columns={2} />
      )}
    </PageLayout>
  );
};

export default Branches;
