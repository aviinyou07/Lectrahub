import { useEffect, useState } from "react";
import { BRANCHES, COURSES, UNIVERSITY_API } from "@/utils/apis";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import BranchFormModal from "./BranchFormModal";
import { showError, showSuccess } from "@/utils/toast";

const BranchesTab = () => {
  const [universities, setUniversities] = useState([]);
  const [branches, setBranches] = useState({ data: [], total: 0, page: 1 });
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const token = localStorage.getItem("admin_token");
  

useEffect(() => {
  fetchUniversities();
  fetchCourses();
}, []);

const fetchUniversities = async () => {
  try {
    const res = await fetch(UNIVERSITY_API.GET_ALL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok && Array.isArray(data.data)) {
      setUniversities(data.data || []);
    } else {
      showError(data.message || "Failed to fetch universities.");
    }
  } catch {
    showError("Error fetching universities.");
  }
};


useEffect(() => {
  const delay = setTimeout(() => {
    fetchBranches();
  }, 300);

  return () => clearTimeout(delay);
}, [currentPage, searchQuery, selectedCourseId]);


  const fetchCourses = async () => {
    try {
      const res = await fetch(COURSES.GET_ALL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.data)) {
        setCourses(data.data);
      } else {
        showError(data.message || "Failed to fetch courses.");
      }
    } catch {
      showError("Error fetching courses.");
    }
  };
const fetchBranches = async () => {
  try {
    const query = new URLSearchParams({
      page: String(currentPage),
      limit: String(itemsPerPage),
    });

    if (searchQuery.trim()) {
      query.append("search", searchQuery.trim());
    }

    if (selectedCourseId) {
      query.append("courseId", selectedCourseId);
    }

    const res = await fetch(`${BRANCHES.GET_ALL}?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (res.ok) {
      setBranches({
        data: data.data,
        total: data.total,
        page: data.currentPage,
      });
    } else {
      showError(data.message || "Failed to fetch branches.");
      setBranches({ data: [], total: 0, page: 1 });
    }
  } catch {
    showError("Error fetching branches.");
    setBranches({ data: [], total: 0, page: 1 });
  }
};


  const handleAddOrEdit = async (formData, onSuccess) => {
    setIsSubmitting(true);
    const url = selectedBranch ? BRANCHES.EDIT(formData._id) : BRANCHES.ADD;

    try {
      const res = await fetch(url, {
        method: selectedBranch ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        showSuccess(selectedBranch ? "Branch updated!" : "Branch added!");
        fetchBranches();
        setSelectedBranch(null);
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
    if (!branchToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(BRANCHES.DELETE(branchToDelete._id), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        showSuccess("Branch deleted!");
        fetchBranches();
      } else {
        showError(data.message || "Delete failed.");
      }
    } catch {
      showError("Server error.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setBranchToDelete(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Branches</h2>
        <button
          onClick={() => {
            setSelectedBranch(null);
            setShowFormModal(true);
          }}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700"
        >
          Add Branch
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search branches..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded w-full max-w-md"
        />

        <select
          value={selectedCourseId}
          onChange={(e) => {
            setSelectedCourseId(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Courses</option>
          {(courses || []).map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {(branches.data || []).length === 0 ? (
        <p className="text-gray-500 mt-4">No branches found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.data.map((b) => (
              <div key={b._id} className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-bold">{b.title}</h3>
                <p className="text-sm text-gray-600">{b.description}</p>
                <p className="text-sm mt-1">
                  <strong>Badge:</strong> {b.badge}
                </p>
                <p className="text-sm mt-1">
                  <strong>Course:</strong> {b.courseId?.title || b.courseId}
                </p>

                <div className="flex justify-end mt-3 space-x-2">
                  <button
                    onClick={() => {
                      setSelectedBranch(b);
                      setShowFormModal(true);
                    }}
                    className="text-sm px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setBranchToDelete(b);
                      setShowDeleteModal(true);
                    }}
                    className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {branches.total > itemsPerPage && (
            <div className="mt-6 flex justify-center items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {currentPage} of{" "}
                {Math.ceil(branches.total / itemsPerPage)}
              </span>
              <button
                disabled={currentPage >= Math.ceil(branches.total / itemsPerPage)}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showFormModal && (
        <BranchFormModal
          isOpen={showFormModal}
          onClose={() => {
            setShowFormModal(false);
            setSelectedBranch(null);
          }}
          onSubmit={handleAddOrEdit}
          loading={isSubmitting}
          defaultValues={selectedBranch}
          courses={courses}
          universities={universities}
        />
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
        message={`Delete branch "${branchToDelete?.title}"?`}
      />
    </div>
  );
};

export default BranchesTab;
