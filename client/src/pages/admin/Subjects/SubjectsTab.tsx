import { useEffect, useState } from "react";
import { SUBJECTS, UNIVERSITY_API, COURSES, BRANCHES, SEMESTERS } from "@/utils/apis";
import { showError, showSuccess } from "@/utils/toast";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import SubjectFormModal from "./SubjectFormModal";

const SubjectsTab = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    fetchAllDependencies();
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [searchQuery]);

  const fetchSubjects = async () => {
    try {
      const query = searchQuery ? `?search=${searchQuery}` : "";
      const res = await fetch(`${SUBJECTS.GET_ALL}${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) 
        setSubjects(data)
      else showError(data.message || "Failed to fetch subjects.");
    } catch {
      showError("Error fetching subjects.");
    }
  };

  const fetchAllDependencies = async () => {
    try {
      const [uRes, cRes, bRes, sRes] = await Promise.all([
        fetch(UNIVERSITY_API.GET_ALL, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(COURSES.GET_ALL, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(BRANCHES.GET_ALL, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(SEMESTERS.GET_ALL, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const [uData, cData, bData, sData] = await Promise.all([
        uRes.json(), cRes.json(), bRes.json(), sRes.json(),
      ]);

      if (uRes.ok) setUniversities(uData.data || []);
      if (cRes.ok) setCourses(cData.data || []);
      if (bRes.ok) setBranches(bData.data || []);
      if (sRes.ok) setSemesters(sData.data || []);
    } catch {
      showError("Failed to load dependencies.");
    }
  };

  const handleAddOrEdit = async (formData, onSuccess) => {
    setIsSubmitting(true);
    const isEditing = Boolean(selectedSubject);
    const url = isEditing ? SUBJECTS.EDIT(formData._id) : SUBJECTS.ADD;

    try {
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        showSuccess(isEditing ? "Subject updated!" : "Subject added!");
        fetchSubjects();
        setSelectedSubject(null);
        onSuccess?.();
      } else {
        showError(data.message || "Operation failed.");
      }
    } catch {
      showError("Server error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!subjectToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(SUBJECTS.DELETE(subjectToDelete._id), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        showSuccess("Subject deleted!");
        fetchSubjects();
      } else {
        showError(data.message || "Delete failed.");
      }
    } catch {
      showError("Server error.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSubjectToDelete(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Subjects</h2>
        <button
          onClick={() => {
            setSelectedSubject(null);
            setShowFormModal(true);
          }}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Subject
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by title..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full max-w-md border px-3 py-2 rounded mb-6"
      />

      {subjects.length === 0 ? (
        <p className="text-gray-500">No subjects found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((s) => (
            <div key={s._id} className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Description:</strong> {s.description || "—"}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Semester:</strong> {typeof s.semesterId === "object" ? s.semesterId.number : s.semesterId}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Credits:</strong> {s.credits || "—"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Badge:</strong> {s.badge || "—"}
              </p>
              <div className="flex justify-end mt-3 gap-2">
                <button
                  className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                  onClick={() => {
                    setSelectedSubject(s);
                    setShowFormModal(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                  onClick={() => {
                    setSubjectToDelete(s);
                    setShowDeleteModal(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showFormModal && (
        <SubjectFormModal
          isOpen={showFormModal}
          onClose={() => {
            setShowFormModal(false);
            setSelectedSubject(null);
          }}
          onSubmit={handleAddOrEdit}
          loading={isSubmitting}
          defaultValues={selectedSubject}
          universities={universities}
          courses={courses}
          branches={branches}
          semesters={semesters}
        />
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
        message={`Delete subject "${subjectToDelete?.title}"?`}
      />
    </div>
  );
};

export default SubjectsTab;
