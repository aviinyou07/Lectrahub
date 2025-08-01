import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import CardGrid from "@/components/CardGrid";
import { BookText } from "lucide-react";
import axios from "axios";
import {SUBJECTS, CONTENTS} from '@/utils/apis'

interface Subject {
  _id: string;
  title: string;
  description?: string;
  credits?: number;
  type?: string;
  notesCount?: number;
  videosCount?: number;
}

const Subjects = () => {
  const { universityId, courseId, branchId, semesterId } = useParams<{
    universityId: string;
    courseId: string;
    branchId: string;
    semesterId: string;
  }>();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchSubjectsWithStats = async () => {
    try {
      const res = await axios.get(SUBJECTS.GET_ALL, {
        params: { universityId, courseId, branchId, semesterId }
      });

      const subjectsData = Array.isArray(res.data) ? res.data : [];

      const enrichedSubjects = await Promise.all(
        subjectsData.map(async (subject) => {
          try {
            const statsRes = await axios.get(CONTENTS.GET_CONTENT_STATS(subject._id));
            return { ...subject, ...statsRes.data };
          } catch {
            return { ...subject };
          }
        })
      );

      setSubjects(enrichedSubjects);
    } catch (err) {
      console.error("Failed to load subjects", err);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  fetchSubjectsWithStats();
}, [universityId, courseId, branchId, semesterId]);

  const subjectCards = subjects.map((subject) => ({
    id: subject._id,
    title: subject.title,
    description: subject.description ?? "No description provided",
    link: `/universities/${universityId}/courses/${courseId}/branches/${branchId}/semesters/${semesterId}/subjects/${subject._id}/content`,
    icon: <BookText className="w-6 h-6 text-blue-600" />,
    badge: subject.type ?? "Core",
    stats: [
      { label: "Credits", value: String(subject.credits) },
      { label: "Notes", value: String(subject.notesCount) },
      { label: "Videos", value: String(subject.videosCount) }
    ]
  }));

  return (
    <PageLayout
      title={`Semester ${semesterId} - Subjects`}
      description="Select a subject to access comprehensive study materials, notes, and resources."
    >
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <CardGrid items={subjectCards} columns={3} />
      )}
    </PageLayout>
  );
};

export default Subjects;
