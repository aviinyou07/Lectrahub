import { useEffect, useState } from "react";
import { SEMESTERS, BRANCHES, COURSES, UNIVERSITY_API } from "@/utils/apis";
import { showError, showSuccess } from "@/utils/toast";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import SemesterFormModal from "./SemesterFormModal";

const SemestersTab = () => {
  const [semesters, setSemesters] = useState({ data: [], total: 0, page: 1 });
  const [branches, setBranches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [universities, setUniversities] = useState([]);

  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [semesterToDelete, setSemesterToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;
  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchSemesters();
    }, 300);
    return () => clearTimeout(delay);
  }, [currentPage, searchQuery, selectedBranchId]);

  const fetchInitialData = () => {
    fetchBranches();
    fetchCourses();
    fetchUniversities();
  };

  const fetchBranches = async () => {
    try {
      const res = await fetch(BRANCHES.GET_ALL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setBranches(data.data || []);
      } else {
        showError(data.message || "Failed to fetch branches.");
      }
    } catch {
      showError("Error fetching branches.");
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch(COURSES.GET_ALL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setCourses(data.data || []);
      } else {
        showError(data.message || "Failed to fetch courses.");
      }
    } catch {
      showError("Error fetching courses.");
    }
  };

  const fetchUniversities = async () => {
    try {
      const res = await fetch(UNIVERSITY_API.GET_ALL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUniversities(data.data || []);
      } else {
        showError(data.message || "Failed to fetch universities.");
      }
    } catch {
      showError("Error fetching universities.");
    }
  };

  const fetchSemesters = async () => {
    try {
      const query = new URLSearchParams({
        page: String(currentPage),
        limit: String(itemsPerPage),
      });

      if (searchQuery.trim()) query.append("search", searchQuery.trim());
      if (selectedBranchId) query.append("branchId", selectedBranchId);

      const res = await fetch(`${SEMESTERS.GET_ALL}?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setSemesters({
          data: data.data,
          total: data.total,
          page: data.currentPage,
        });
      } else {
        showError(data.message || "Failed to fetch semesters.");
      }
    } catch {
      showError("Error fetching semesters.");
    }
  };

  const handleAddOrEdit = async (formData, onSuccess) => {
    setIsSubmitting(true);
    const url = selectedSemester
      ? SEMESTERS.EDIT(formData._id)
      : SEMESTERS.ADD;

    try {
      const res = await fetch(url, {
        method: selectedSemester ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        showSuccess(selectedSemester ? "Semester updated!" : "Semester added!");
        fetchSemesters();
        setSelectedSemester(null);
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
    if (!semesterToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(SEMESTERS.DELETE(semesterToDelete._id), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        showSuccess("Semester deleted!");
        fetchSemesters();
      } else {
        showError(data.message || "Delete failed.");
      }
    } catch {
      showError("Server error.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSemesterToDelete(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Semesters</h2>
        <button
          onClick={() => {
            setSelectedSemester(null);
            setShowFormModal(true);
          }}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700"
        >
          Add Semester
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by number..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded w-full max-w-md"
        />

        <select
          value={selectedBranchId}
          onChange={(e) => {
            setSelectedBranchId(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Branches</option>
          {branches.map((b) => (
            <option key={b._id} value={b._id}>
              {b.title}
            </option>
          ))}
        </select>
      </div>

      {semesters.data.length === 0 ? (
        <p className="text-gray-500 mt-4">No semesters found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {semesters.data.map((s) => (
              <div key={s._id} className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-bold">Semester {s.number}</h3>
                <p className="text-sm text-gray-600">
                  <strong>Branch:</strong>{" "}
                  {s.branchId?.title || s.branchId}
                </p>
                <p className="text-sm mt-1">
                  <strong>Badge:</strong> {s.badge || "—"}
                </p>
                <div className="flex justify-end mt-3 space-x-2">
                  <button
                    onClick={() => {
                      setSelectedSemester(s);
                      setShowFormModal(true);
                    }}
                    className="text-sm px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSemesterToDelete(s);
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

          {semesters.total > itemsPerPage && (
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
                {Math.ceil(semesters.total / itemsPerPage)}
              </span>
              <button
                disabled={currentPage >= Math.ceil(semesters.total / itemsPerPage)}
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
        <SemesterFormModal
          isOpen={showFormModal}
          onClose={() => {
            setShowFormModal(false);
            setSelectedSemester(null);
          }}
          onSubmit={handleAddOrEdit}
          loading={isSubmitting}
          defaultValues={selectedSemester}
          branches={branches}
          universities={universities} // ✅ passed
          courses={courses} // ✅ passed
        />
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
        message={`Delete semester ${semesterToDelete?.number}?`}
      />
    </div>
  );
};

export default SemestersTab;
