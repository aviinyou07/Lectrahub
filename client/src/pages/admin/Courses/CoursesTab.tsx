import { useEffect, useState } from "react";
import { COURSES, UNIVERSITY_API } from "@/utils/apis";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { showError, showSuccess } from "@/utils/toast";
import CourseFormModal from "./CourseFormModal";

const CoursesTab = () => {
  const [courses, setCourses] = useState({ courses: [], total: 0, page: 1 });
  const [universities, setUniversities] = useState([]);
  const [selectedUniversityId, setSelectedUniversityId] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    fetchUniversities();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [currentPage, searchQuery, selectedUniversityId]);

 const fetchUniversities = async () => {
  try {
    const res = await fetch(UNIVERSITY_API.GET_ALL);
    const data = await res.json();

    if (res.ok) {
      setUniversities(data.data);
    } else {
      showError(data.message || "Failed to fetch universities");
    }
  } catch (error) {
    showError("Error fetching universities");
  }
};


  const fetchCourses = async () => {
    try {
      const query = new URLSearchParams({
        page: String(currentPage),
        limit: String(itemsPerPage),
        search: searchQuery,
        universityId: selectedUniversityId,
      });

      const res = await fetch(`${COURSES.GET_ALL}?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setCourses({
          courses: data.data,
          total: data.total,
          page: data.currentPage,
        });
      }

      else {
        setCourses({ courses: [], total: 0, page: 1 });
        showError(data.message || "Failed to fetch courses.");
      }
    } catch {
      showError("Error fetching courses.");
      setCourses({ courses: [], total: 0, page: 1 });
    }
  };

  const handleAddOrEdit = async (formData, onSuccess) => {
    setIsSubmitting(true);
    const url = selectedCourse ? COURSES.EDIT(formData._id) : COURSES.ADD;

    try {
      const res = await fetch(url, {
        method: selectedCourse ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        showSuccess(selectedCourse ? "Course updated!" : "Course added!");
        fetchCourses();
        setSelectedCourse(null);
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
    if (!courseToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(COURSES.DELETE(courseToDelete._id), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        showSuccess("Course deleted!");
        fetchCourses();
      } else {
        showError(data.message || "Delete failed.");
      }
    } catch {
      showError("Server error.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setCourseToDelete(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Courses</h2>
        <button
          onClick={() => {
            setSelectedCourse(null);
            setShowFormModal(true);
          }}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700"
        >
          Add Course
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded w-full max-w-md"
        />

        <select
          value={selectedUniversityId}
          onChange={(e) => {
            setSelectedUniversityId(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Universities</option>
          {(universities || []).map((u) => (
            <option key={u._id} value={u._id}>
              {u.title}
            </option>
          ))}
        </select>
      </div>

      {(courses?.courses || []).length === 0 ? (
        <p className="text-gray-500 mt-4">No courses found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(courses?.courses || []).map((c) => (
              <div key={c._id} className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-bold">{c.title}</h3>
                <p className="text-sm text-gray-600">{c.description}</p>
                <p className="text-sm mt-1">
                  <strong>Badge:</strong> {c.badge}
                </p>
                <p className="text-sm mt-1">
                  <strong>University:</strong> {c.universityId?.title
}
                </p>

                <div className="flex justify-end mt-3 space-x-2">
                  <button
                    onClick={() => {
                      setSelectedCourse(c);
                      setShowFormModal(true);
                    }}
                    className="text-sm px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setCourseToDelete(c);
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

          {courses.total > itemsPerPage && (
            <div className="mt-6 flex justify-center items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {Math.ceil(courses.total / itemsPerPage)}
              </span>
              <button
                disabled={currentPage >= Math.ceil(courses.total / itemsPerPage)}
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
        <CourseFormModal
          isOpen={showFormModal}
          onClose={() => {
            setShowFormModal(false);
            setSelectedCourse(null);
          }}
          onSubmit={handleAddOrEdit}
          loading={isSubmitting}
          defaultValues={selectedCourse}
          universities={universities}
        />
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
        message={`Delete course "${courseToDelete?.title}"?`}
      />
    </div>
  );
};

export default CoursesTab;
