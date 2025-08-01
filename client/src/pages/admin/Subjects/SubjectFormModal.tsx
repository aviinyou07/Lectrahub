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
import { Loader2 } from "lucide-react";

interface University {
  _id: string;
  title: string;
}

interface Course {
  _id: string;
  title: string;
  universityId: string | University;
}

interface Branch {
  _id: string;
  title: string;
  courseId: string | Course;
}

interface Semester {
  _id: string;
  number: number;
  branchId: string | Branch;
}

interface Subject {
  _id: string;
  title: string;
  description?: string;
  badge?: string;
  credits?: number;
  semesterId: string | Semester;
}

interface SubjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Subject, onSuccess: () => void) => void;
  loading?: boolean;
  defaultValues?: Subject;
  universities?: University[];
  courses?: Course[];
  branches?: Branch[];
  semesters?: Semester[];
}

const SubjectFormModal: React.FC<SubjectFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  defaultValues,
  universities = [],
  courses = [],
  branches = [],
  semesters = [],
}) => {
  const isEdit = Boolean(defaultValues);
  const titleRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    description: "",
    badge: "",
    credits: "",
    universityId: "",
    courseId: "",
    branchId: "",
    semesterId: "",
  });

  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
  const [filteredSemesters, setFilteredSemesters] = useState<Semester[]>([]);

  // Autofocus title input on open
  useEffect(() => {
    if (isOpen && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (defaultValues && courses.length && branches.length && semesters.length) {
      const { _id, title, description, badge, credits, semesterId } = defaultValues;

      const semester = semesters.find((s) => s._id === (typeof semesterId === "object" ? semesterId._id : semesterId));

      const branch = semester && branches.find(
        (b) => b._id === (typeof semester?.branchId === "object" ? semester.branchId._id : semester?.branchId)
      );

      const course = branch && courses.find(
        (c) => c._id === (typeof branch?.courseId === "object" ? branch.courseId._id : branch?.courseId)
      );

      const universityId = course && typeof course.universityId === "object"
        ? course.universityId._id
        : course?.universityId || "";

      setFormData({
        _id,
        title: title || "",
        description: description || "",
        badge: badge || "",
        credits: credits?.toString() || "",
        universityId,
        courseId: course?._id || "",
        branchId: branch?._id || "",
        semesterId: semester?._id || "",
      });

      setFilteredCourses(courses.filter((c) => {
        const uniId = typeof c.universityId === "object" ? c.universityId._id : c.universityId;
        return uniId === universityId;
      }));

      setFilteredBranches(branches.filter((b) => {
        const cId = typeof b.courseId === "object" ? b.courseId._id : b.courseId;
        return cId === course?._id;
      }));

      setFilteredSemesters(semesters.filter((s) => {
        const bId = typeof s.branchId === "object" ? s.branchId._id : s.branchId;
        return bId === branch?._id;
      }));
    }
  }, [defaultValues, courses, branches, semesters]);

  useEffect(() => {
    if (!isEdit) {
      const filtered = courses.filter((c) => {
        const uniId = typeof c.universityId === "object" ? c.universityId._id : c.universityId;
        return uniId === formData.universityId;
      });
      setFilteredCourses(filtered);
      setFormData((prev) => ({ ...prev, courseId: "", branchId: "", semesterId: "" }));
      setFilteredBranches([]);
      setFilteredSemesters([]);
    }
  }, [formData.universityId, courses, isEdit]);

  useEffect(() => {
    if (!isEdit) {
      const filtered = branches.filter((b) => {
        const cId = typeof b.courseId === "object" ? b.courseId._id : b.courseId;
        return cId === formData.courseId;
      });
      setFilteredBranches(filtered);
      setFormData((prev) => ({ ...prev, branchId: "", semesterId: "" }));
      setFilteredSemesters([]);
    }
  }, [formData.courseId, branches, isEdit]);

  useEffect(() => {
    if (!isEdit) {
      const filtered = semesters.filter((s) => {
        const bId = typeof s.branchId === "object" ? s.branchId._id : s.branchId;
        return bId === formData.branchId;
      });
      setFilteredSemesters(filtered);
      setFormData((prev) => ({ ...prev, semesterId: "" }));
    }
  }, [formData.branchId, semesters, isEdit]);

  // Clear form only in add mode
  useEffect(() => {
    if (!isOpen && !isEdit) {
      setFormData({
        _id: "",
        title: "",
        description: "",
        badge: "",
        credits: "",
        universityId: "",
        courseId: "",
        branchId: "",
        semesterId: "",
      });
      setFilteredCourses([]);
      setFilteredBranches([]);
      setFilteredSemesters([]);
    }
  }, [isOpen, isEdit]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.semesterId) {
      // replace with toast if preferred
      alert("Subject title and semester are required.");
      return;
    }

    const payload: Subject = {
      _id: isEdit ? formData._id : `${formData.semesterId}-${formData.title}`,
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      badge: formData.badge.trim() || undefined,
      credits: formData.credits ? Math.max(0, parseInt(formData.credits, 10)) : undefined,
      semesterId: formData.semesterId,
    };

    onSubmit(payload, () => {
      onClose();
    });
  };

  const isValid = formData.title.trim() && formData.semesterId;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Subject" : "Add Subject"}
    >
      <div className="space-y-4">
        <div>
          <Label>University</Label>
          <Select
            value={formData.universityId}
            onValueChange={(val) => handleChange("universityId", val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select university" />
            </SelectTrigger>
            <SelectContent>
              {universities.map((u) => (
                <SelectItem key={u._id} value={u._id}>
                  {u.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Course</Label>
          <Select
            value={formData.courseId}
            onValueChange={(val) => handleChange("courseId", val)}
            disabled={!formData.universityId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              {filteredCourses.map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Branch</Label>
          <Select
            value={formData.branchId}
            onValueChange={(val) => handleChange("branchId", val)}
            disabled={!formData.courseId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              {filteredBranches.map((b) => (
                <SelectItem key={b._id} value={b._id}>
                  {b.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Semester</Label>
          <Select
            value={formData.semesterId}
            onValueChange={(val) => handleChange("semesterId", val)}
            disabled={!formData.branchId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              {filteredSemesters.map((s) => {
                const branch = branches.find((b) => b._id === (typeof s.branchId === "object" ? s.branchId._id : s.branchId));
                return (
                  <SelectItem key={s._id} value={s._id}>
                    Semester {s.number}{branch ? ` - ${branch.title}` : ""}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Title</Label>
          <Input
            ref={titleRef}
            placeholder="Subject name"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>

        <div>
          <Label>Description</Label>
          <Input
            placeholder="Optional description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div>
          <Label>Credits</Label>
          <Input
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 3"
            value={formData.credits}
            onChange={(e) => handleChange("credits", e.target.value)}
          />
        </div>

        <div>
          <Label>Badge (optional)</Label>
          <Input
            placeholder="e.g. Elective"
            value={formData.badge}
            onChange={(e) => handleChange("badge", e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !isValid}>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </div>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SubjectFormModal;
