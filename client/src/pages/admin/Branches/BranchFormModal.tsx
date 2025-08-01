import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { generateSlug } from "@/utils/slug";

const BranchFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  defaultValues,
  universities,
  courses,
}) => {
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    description: "",
    badge: "",
    universityId: "",
    courseId: "",
  });

  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    if (defaultValues) {
      const { _id, title, description, badge, courseId } = defaultValues;

      const matchedCourse = courses.find(
        (c) => c._id === (courseId._id || courseId)
      );

      const universityId =
        typeof matchedCourse?.universityId === "object"
          ? matchedCourse.universityId._id
          : matchedCourse?.universityId || "";

      setFormData({
        _id,
        title,
        description: description || "",
        badge: badge || "",
        universityId,
        courseId: courseId._id || courseId,
      });
    } else {
      setFormData({
        _id: "",
        title: "",
        description: "",
        badge: "",
        universityId: "",
        courseId: "",
      });
    }
  }, [defaultValues, courses]);

  useEffect(() => {
    if (formData.universityId) {
      const filtered = courses.filter((c) => {
        const courseUniId =
          typeof c.universityId === "object"
            ? c.universityId._id
            : c.universityId;
        return courseUniId === formData.universityId;
      });
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses([]);
    }
  }, [formData.universityId, courses]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "title") {
      setFormData((prev) => ({
        ...prev,
        title: value,
        _id: generateSlug(value),
      }));
    } else if (name === "universityId") {
      setFormData((prev) => ({
        ...prev,
        universityId: value,
        courseId: "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.courseId || !formData.title || !formData._id) return;

    const payload = {
      _id: formData._id,
      title: formData.title,
      description: formData.description,
      badge: formData.badge,
      courseId: formData.courseId,
    };

    onSubmit(payload, () => {
      onClose();
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={defaultValues ? "Edit Branch" : "Add Branch"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">University</label>
          <select
            name="universityId"
            value={formData.universityId}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select University</option>
            {universities.map((u) => (
              <option key={u._id} value={u._id}>
                {u.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Course</label>
          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
            disabled={!formData.universityId}
          >
            <option value="">Select Course</option>
            {filteredCourses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
          {filteredCourses.length === 0 && formData.universityId && (
            <p className="text-sm text-red-500 mt-1">
              No courses found for this university.
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1">Title</label>
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
            autoFocus={!defaultValues}
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Badge</label>
          <input
            name="badge"
            value={formData.badge}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : defaultValues
              ? "Update Branch"
              : "Add Branch"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BranchFormModal;
