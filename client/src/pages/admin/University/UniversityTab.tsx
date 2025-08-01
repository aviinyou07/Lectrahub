import { useEffect, useState } from "react";
import { UNIVERSITY_API } from "@/utils/apis";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { showError, showSuccess } from "@/utils/toast";
import UniversityForm from "./UniversityForm";

const UniversityTab = () => {
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [universityToDelete, setUniversityToDelete] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);


  // Pagination & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    fetchUniversities();
  }, []);

 const fetchUniversities = async () => {
  try {
    const res = await fetch(UNIVERSITY_API.GET_ALL);
    const data = await res.json();

    if (res.ok) {
      setUniversities(data.data); // ✅ correctly set to array
    } else {
      showError(data.message || "Failed to fetch universities");
    }
  } catch (error) {
    showError("Error fetching universities");
  }
};


  const handleAddOrEdit = async (formData, onSuccess) => {
    setIsSubmitting(true);

    try {
      const payload = new FormData();
      for (let key in formData) {
        if (key === "imageFile" && formData.imageFile) {
          payload.append("image", formData.imageFile);
        } else if (key !== "imageFile" && formData[key]) {
          payload.append(key, formData[key]);
        }
      }

      const url = selectedUniversity
        ? UNIVERSITY_API.EDIT(formData._id)
        : UNIVERSITY_API.ADD;

      const res = await fetch(url, {
        method: selectedUniversity ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      const data = await res.json();

      if (res.ok) {
        showSuccess(
          selectedUniversity ? "University updated!" : "University added!"
        );
        fetchUniversities();
        setSelectedUniversity(null);
        onSuccess?.();
      } else {
        showError(data.message || "Operation failed");
      }
    } catch (err) {
      showError("Server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!universityToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(
        UNIVERSITY_API.DELETE(universityToDelete._id),
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        showSuccess("University deleted!");
        fetchUniversities();
      } else {
        showError(data.message || "Delete failed");
      }
    } catch (err) {
      showError("Server error");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setUniversityToDelete(null);
    }
  };

  // Filter and paginate universities
  const filteredUniversities = universities.filter((u) =>
    u.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUniversities.length / itemsPerPage);
  const paginated = filteredUniversities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Universities</h2>
        <button
          onClick={() => {
            setSelectedUniversity(null);
            setShowFormModal(true);
          }}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700"
        >
          Add University
        </button>
      </div>


      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button
              onClick={() => {
                setShowFormModal(false);
                setSelectedUniversity(null);
              }}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✕
            </button>

            <UniversityForm
              onSubmit={handleAddOrEdit}
              loading={isSubmitting}
              isEditing={!!selectedUniversity}
              defaultValues={selectedUniversity}
              onClear={() => setSelectedUniversity(null)}
            />
          </div>
        </div>
      )}



      <div className="mt-6 mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search universities..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset page when searching
          }}
          className="border px-3 py-2 rounded w-full max-w-sm"
        />
      </div>

      {filteredUniversities.length === 0 ? (
        <p className="text-gray-500 mt-4">No universities found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((u) => (
              <div key={u._id} className="bg-white rounded-lg shadow p-4">
                <img
                  src={u.imageUrl}
                  alt={u.title}
                  className="w-full h-32 object-contain mb-2"
                />
                <h3 className="text-lg font-bold">{u.title}</h3>
                <p className="text-sm text-gray-600">{u.description}</p>
                <p className="text-sm mt-1">
                  <strong>Badge:</strong> {u.badge}
                </p>
                <p className="text-sm">
                  <strong>Students:</strong> {u.students}
                </p>
                <p className="text-sm">
                  <strong>Faculty:</strong> {u.faculty}
                </p>

                <div className="flex justify-end mt-3 space-x-2">
                  <button
                    onClick={() => {
                      setSelectedUniversity(u);
                      setShowFormModal(true);
                    }}

                    className="text-sm px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setUniversityToDelete(u);
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

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        message={`Delete university "${universityToDelete?.title}"?`}
        loading={isDeleting}
      />
    </div>
  );
};

export default UniversityTab;
