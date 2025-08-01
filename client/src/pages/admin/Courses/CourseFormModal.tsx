import { useEffect, useRef, useState } from "react";
import { generateSlug } from "@/utils/slug";

const CourseFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  defaultValues = null,
  universities = [],
}) => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    badge: "",
    university: "",
  });

  const titleInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      titleInputRef.current?.focus();

      if (defaultValues) {
        setFormData({
          title: defaultValues.title || "",
          slug: defaultValues._id || "", // _id is the slug
          description: defaultValues.description || "",
          badge: defaultValues.badge || "",
          university: defaultValues.universityId || "", // match backend field
          _id: defaultValues._id, // necessary for edit
        });
      } else {
        setFormData({
          title: "",
          slug: "",
          description: "",
          badge: "",
          university: "",
        });
      }
    }
  }, [isOpen, defaultValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };

    // Only auto-generate slug if creating new and editing the title
    if (name === "title" && !defaultValues) {
      updated.slug = generateSlug(value);
    }

    setFormData(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.university) {
      return alert("Title, Slug, and University are required.");
    }

    const payload = {
      _id: formData.slug.trim(),
      universityId: formData.university,
      title: formData.title.trim(),
      description: formData.description?.trim(),
      badge: formData.badge?.trim(),
    };

    onSubmit(payload, () => {
      setFormData({
        title: "",
        slug: "",
        description: "",
        badge: "",
        university: "",
      });
      onClose();
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {defaultValues ? "Edit Course" : "Add Course"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Title *</label>
            <input
              type="text"
              name="title"
              ref={titleInputRef}
              value={formData.title}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Slug *</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
              disabled={!!defaultValues}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Badge</label>
            <input
              type="text"
              name="badge"
              value={formData.badge}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">University *</label>
            <select
              name="university"
              value={formData.university}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select a university</option>
              {universities.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Saving..." : defaultValues ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseFormModal;
