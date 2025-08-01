import { useEffect, useState, useRef } from "react";
import Modal from "@/components/Modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { CONTENTS } from "@/utils/apis"

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any, onSuccess: () => void) => void;
  loading?: boolean;
  defaultValues?: any;
  universities?: any[];
  courses?: any[];
  branches?: any[];
  semesters?: any[];
  subjects?: any[];
}

const ContentFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  defaultValues,
  universities = [],
  courses = [],
  branches = [],
  semesters = [],
  subjects = [],
}) => {
  const isEdit = Boolean(defaultValues);
  const titleRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    description: "",
    type: "",
    universityId: "",
    courseId: "",
    branchId: "",
    semesterId: "",
    subjectId: "",
    items: [],
  });

  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [filteredSemesters, setFilteredSemesters] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [internalLoading, setInternalLoading] = useState(false);



  useEffect(() => {
    if (isOpen && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (defaultValues) {
      const subject = subjects.find(
        (s) => s._id === (typeof defaultValues.subjectId === "object" ? defaultValues.subjectId._id : defaultValues.subjectId)
      );

      const semester = semesters.find((s) =>
        subject?.semesterId === s._id || (typeof subject?.semesterId === "object" && subject?.semesterId._id === s._id)
      );

      const branch = branches.find((b) =>
        semester?.branchId === b._id || (typeof semester?.branchId === "object" && semester?.branchId._id === b._id)
      );

      const course = courses.find((c) =>
        branch?.courseId === c._id || (typeof branch?.courseId === "object" && branch?.courseId._id === c._id)
      );

      const universityId =
        typeof course?.universityId === "object" ? course?.universityId._id : course?.universityId;

      setFormData({
        _id: defaultValues._id,
        title: defaultValues.title,
        description: defaultValues.description || "",
        type: defaultValues.type,
        universityId,
        courseId: course?._id || "",
        branchId: branch?._id || "",
        semesterId: semester?._id || "",
        subjectId: subject?._id || "",
        items: defaultValues.items || [],
      });

      setFilteredCourses(courses.filter((c) => (c.universityId === universityId || c.universityId?._id === universityId)));
      setFilteredBranches(branches.filter((b) => (b.courseId === course?._id || b.courseId?._id === course?._id)));
      setFilteredSemesters(semesters.filter((s) => (s.branchId === branch?._id || s.branchId?._id === branch?._id)));
      setFilteredSubjects(subjects.filter((s) => (s.semesterId === semester?._id || s.semesterId?._id === semester?._id)));
    }
  }, [defaultValues]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCascade = (key: string, value: string) => {
    handleChange(key, value);
    if (key === "universityId") {
      const filtered = courses.filter((c) => (c.universityId === value || c.universityId?._id === value));
      setFilteredCourses(filtered);
      setFilteredBranches([]);
      setFilteredSemesters([]);
      setFilteredSubjects([]);
      setFormData((p) => ({ ...p, courseId: "", branchId: "", semesterId: "", subjectId: "" }));
    } else if (key === "courseId") {
      const filtered = branches.filter((b) => (b.courseId === value || b.courseId?._id === value));
      setFilteredBranches(filtered);
      setFilteredSemesters([]);
      setFilteredSubjects([]);
      setFormData((p) => ({ ...p, branchId: "", semesterId: "", subjectId: "" }));
    } else if (key === "branchId") {
      const filtered = semesters.filter((s) => (s.branchId === value || s.branchId?._id === value));
      setFilteredSemesters(filtered);
      setFilteredSubjects([]);
      setFormData((p) => ({ ...p, semesterId: "", subjectId: "" }));
    } else if (key === "semesterId") {
      const filtered = subjects.filter((s) => (s.semesterId === value || s.semesterId?._id === value));
      setFilteredSubjects(filtered);
      setFormData((p) => ({ ...p, subjectId: "" }));
    }
  };

  const handleDeleteItem = (index: number) => {
    const updated = [...formData.items];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, items: updated }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.subjectId || !formData.type) {
      toast.error("Title, Type, and Subject are required.");
      return;
    }

    const payload = {
      ...formData,
      _id: isEdit
        ? formData._id
        : `${formData.type}-${formData.title.toLowerCase().replace(/\s+/g, "-")}`,
    };

    const form = new FormData();
    form.append("subjectId", payload.subjectId);
    form.append("title", payload.title);
    form.append("description", payload.description || "");
    form.append("type", payload.type);
    form.append("_id", payload._id);

    if (formData.items.length > 0) {
      form.append("items", JSON.stringify(formData.items));
    }

    uploadedFiles.forEach((file) => form.append("files", file));

    const token = localStorage.getItem("admin_token");
    const url = isEdit ? `${CONTENTS.EDIT(payload._id)}` : CONTENTS.ADD;
    setInternalLoading(true);

    try {
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        body: form,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to save content.");
      }

      toast.success(isEdit ? "Content updated successfully!" : "Content created successfully!");

      onSubmit(result, () => {
        onClose();
      });
    } catch (err) {
      console.error("❌ Content save error:", err);
      toast.error("Failed to save content.");
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit Content" : "Add Content"}>
      <div className="space-y-6">
        {/* Selects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>University</Label>
            <Select value={formData.universityId} onValueChange={(v) => handleCascade("universityId", v)}>
              <SelectTrigger><SelectValue placeholder="Select university" /></SelectTrigger>
              <SelectContent>
                {universities.map(u => <SelectItem key={u._id} value={u._id}>{u.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Course</Label>
            <Select value={formData.courseId} onValueChange={(v) => handleCascade("courseId", v)} disabled={!formData.universityId}>
              <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
              <SelectContent>
                {filteredCourses.map(c => <SelectItem key={c._id} value={c._id}>{c.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Branch</Label>
            <Select value={formData.branchId} onValueChange={(v) => handleCascade("branchId", v)} disabled={!formData.courseId}>
              <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
              <SelectContent>
                {filteredBranches.map(b => <SelectItem key={b._id} value={b._id}>{b.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 2: Semester, Subject, Type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Semester</Label>
            <Select value={formData.semesterId} onValueChange={(v) => handleCascade("semesterId", v)} disabled={!formData.branchId}>
              <SelectTrigger><SelectValue placeholder="Select semester" /></SelectTrigger>
              <SelectContent>
                {filteredSemesters.map(s => <SelectItem key={s._id} value={s._id}>Semester {s.number}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Subject</Label>
            <Select value={formData.subjectId} onValueChange={(v) => handleChange("subjectId", v)} disabled={!formData.semesterId}>
              <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
              <SelectContent>
                {filteredSubjects.map(s => <SelectItem key={s._id} value={s._id}>{s.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Type</Label>
            <Select value={formData.type} onValueChange={(v) => handleChange("type", v)}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {["notes", "videos", "syllabus", "extras"].map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Title</Label>
            <Input ref={titleRef} value={formData.title} onChange={(e) => handleChange("title", e.target.value)} />
          </div>
          <div>
            <Label>Description</Label>
            <Input value={formData.description} onChange={(e) => handleChange("description", e.target.value)} />
          </div>
        </div>
        {/* Upload */}
        <div>
          <Label>Upload Files</Label>
          <Input
            type="file"
            multiple
            onChange={(e) => {
              const selected = Array.from(e.target.files || []);
              setUploadedFiles((prev) => [...prev, ...selected]);
            }}
          />
          {uploadedFiles.length > 0 && (
            <div className="mt-3 space-y-2">
              <Label className="text-sm text-gray-600">Selected Files</Label>
              {uploadedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 border rounded bg-gray-50 text-sm"
                >
                  <div className="flex items-center gap-2">
                    {/* File Preview Icon (based on type) */}
                    {file.type.startsWith("image/") && (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <span className="truncate max-w-xs">{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setUploadedFiles((prev) =>
                        prev.filter((_, index) => index !== idx)
                      );
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="mt-2 space-y-1 text-sm text-gray-600">
            {formData.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                <span>{item.name} ({item.size})</span>
                <button type="button" onClick={() => handleDeleteItem(idx)}><Trash2 className="w-4 h-4 text-red-500" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={internalLoading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={internalLoading || !formData.title || !formData.subjectId}>
            {internalLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                {isEdit ? "Updating..." : "Saving..."}
              </>
            ) : (
              isEdit ? "Update" : "Save"
            )}
          </Button>

        </div>
      </div>
    </Modal>
  );
};

export default ContentFormModal;
