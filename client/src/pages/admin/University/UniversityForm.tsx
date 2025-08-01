import { useEffect, useState } from "react";
import slugify from "slugify";

const initialForm = {
  _id: "",
  title: "",
  description: "",
  badge: "",
  students: "",
  faculty: "",
  imageFile: null,
  imageUrl: "",
};

const UniversityForm = ({
  onSubmit,
  loading,
  isEditing = false,
  defaultValues = null,
  onClear,
  takenIds = [], // Optional: for showing slug conflict warning
}) => {
  const [formData, setFormData] = useState(initialForm);
  const [previewUrl, setPreviewUrl] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Set default values in edit mode
  useEffect(() => {
    if (defaultValues) {
      setFormData({
        ...defaultValues,
        imageFile: null,
        imageUrl: defaultValues.imageUrl || "",
      });
      setPreviewUrl(defaultValues.imageUrl || "");
      setSlugManuallyEdited(true); // Don't overwrite on edit
    }
  }, [defaultValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "title" && !isEditing && !slugManuallyEdited) {
        updated._id = slugify(value, { lower: true, strict: true });
      }

      return updated;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imageUrl: "",
      }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || (!formData.imageFile && !formData.imageUrl)) {
      console.log("Please fill in all required fields");
      return;
    }

    if (!isEditing && takenIds.includes(formData._id)) {
      alert("This ID is already taken. Please choose a different one.");
      return;
    }

    const submissionData = {
      ...formData,
      imageUrl: formData.imageUrl || previewUrl,
    };

    onSubmit(submissionData, () => {
      setFormData(initialForm);
      setPreviewUrl("");
      setSlugManuallyEdited(false);
      onClear?.();
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-md shadow space-y-4 border"
    >
      <h3 className="text-xl font-bold">
        {isEditing ? "Edit University" : "Add University"}
      </h3>

      {!isEditing && (
        <div>
          <label className="block font-medium">University ID (slug)</label>
          <input
            type="text"
            name="_id"
            placeholder="Auto-generated from title"
            value={formData._id}
            onChange={(e) => {
              setSlugManuallyEdited(true);
              handleChange(e);
            }}
            required
            className={`w-full border px-3 py-2 rounded mt-1 ${
              takenIds.includes(formData._id) ? "border-red-500" : ""
            }`}
          />
          {takenIds.includes(formData._id) && (
            <p className="text-red-500 text-sm">This ID is already taken.</p>
          )}
        </div>
      )}

      <div>
        <label className="block font-medium">Title</label>
        <input
          type="text"
          name="title"
          placeholder="University name"
          value={formData.title}
          onChange={handleChange}
          required
          autoFocus 
          className="w-full border px-3 py-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="block font-medium">Description</label>
        <textarea
          name="description"
          placeholder="Short description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded mt-1"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-medium">Badge</label>
          <input
            type="text"
            name="badge"
            placeholder="e.g. Ivy League"
            value={formData.badge}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>

        <div>
          <label className="block font-medium">Students</label>
          <input
            type="text"
            name="students"
            value={formData.students}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>

        <div>
          <label className="block font-medium">Faculty</label>
          <input
            type="text"
            name="faculty"
            value={formData.faculty}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>
      </div>

      <div>
        <label className="block font-medium">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full mt-1"
        />
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="mt-2 w-40 h-28 object-contain border rounded"
          />
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 text-white rounded ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading
            ? isEditing
              ? "Updating..."
              : "Submitting..."
            : isEditing
            ? "Update University"
            : "Add University"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setFormData(initialForm);
              setPreviewUrl("");
              setSlugManuallyEdited(false);
              onClear?.();
            }}
            className="px-4 py-2 text-gray-600 hover:text-black"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default UniversityForm;
