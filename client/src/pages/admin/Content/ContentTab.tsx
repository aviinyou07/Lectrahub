import { useEffect, useState } from "react";
import {
  UNIVERSITY_API,
  COURSES,
  BRANCHES,
  SEMESTERS,
  SUBJECTS,
  CONTENTS,
} from "@/utils/apis";
import { showError, showSuccess } from "@/utils/toast";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import ContentFormModal from "./ContentFormModal";

const ContentTab = () => {
  const [contents, setContents] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contentToDelete, setContentToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    fetchAllDependencies();
  }, []);

  useEffect(() => {
    fetchContents();
  }, [searchQuery]);

  const fetchContents = async () => {
    try {
      const query = searchQuery ? `?search=${searchQuery}` : "";
      const res = await fetch(`${CONTENTS.GET_ALL}${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setContents(data);
      else showError(data.message || "Failed to fetch contents.");
    } catch {
      showError("Error fetching contents.");
    }
  };

  const fetchAllDependencies = async () => {
    try {
      const [uRes, cRes, bRes, sRes, subRes] = await Promise.all([
        fetch(UNIVERSITY_API.GET_ALL, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(COURSES.GET_ALL, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(BRANCHES.GET_ALL, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(SEMESTERS.GET_ALL, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(SUBJECTS.GET_ALL, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const [uData, cData, bData, sData, subData] = await Promise.all([
        uRes.json(), cRes.json(), bRes.json(), sRes.json(), subRes.json(),
      ]);

      if (uRes.ok) setUniversities(uData.data || []);
      if (cRes.ok) setCourses(cData.data || []);
      if (bRes.ok) setBranches(bData.data || []);
      if (sRes.ok) setSemesters(sData.data || []);
      if (subRes.ok) setSubjects(subData || []);
    } catch {
      showError("Failed to load dependencies.");
    }
  };

  const handleAddOrEdit = (_data, onSuccess) => {
  fetchContents();
  setSelectedContent(null);
  onSuccess?.();
};

  const handleDelete = async () => {
    if (!contentToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(CONTENTS.DELETE(contentToDelete._id), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        showSuccess("Content deleted!");
        fetchContents();
      } else {
        showError(data.message || "Delete failed.");
      }
    } catch {
      showError("Server error.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setContentToDelete(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Contents</h2>
        <button
          onClick={() => {
            setSelectedContent(null);
            setShowFormModal(true);
          }}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Content
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by title..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full max-w-md border px-3 py-2 rounded mb-6"
      />

      {contents.length === 0 ? (
        <p className="text-gray-500">No content found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contents.map((c) => (
            <div key={c._id} className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Description:</strong> {c.description || "—"}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Type:</strong> {c.type}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Files:</strong> {c.items?.length || 0}
              </p>
              <div className="flex justify-end mt-3 gap-2">
                <button
                  className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                  onClick={() => {
                    setSelectedContent(c);
                    setShowFormModal(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                  onClick={() => {
                    setContentToDelete(c);
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
        <ContentFormModal
          isOpen={showFormModal}
          onClose={() => {
            setShowFormModal(false);
            setSelectedContent(null);
          }}
          onSubmit={handleAddOrEdit}
          loading={isSubmitting}
          defaultValues={selectedContent}
          universities={universities}
          courses={courses}
          branches={branches}
          semesters={semesters}
          subjects={subjects}
        />
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
        message={`Delete content "${contentToDelete?.title}"?`}
      />
    </div>
  );
};

export default ContentTab;
