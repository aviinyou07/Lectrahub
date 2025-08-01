import { useEffect, useState } from "react";
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
  branchId: string | Branch | string;
  badge?: string;
}

interface SemesterFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Semester, onSuccess: () => void) => void;
  loading?: boolean;
  defaultValues?: Semester;
  universities?: University[];
  courses?: Course[];
  branches?: Branch[];
}

const SemesterFormModal: React.FC<SemesterFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  defaultValues,
  universities = [],
  courses = [],
  branches = [],
}) => {
  const isEdit = Boolean(defaultValues);

  const [formData, setFormData] = useState({
    _id: "",
    number: "",
    universityId: "",
    courseId: "",
    branchId: "",
    badge: "",
  });

  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);

  useEffect(() => {
    if (defaultValues) {
      const { _id, number, badge, branchId } = defaultValues;
      const branch =
        typeof branchId === "object"
          ? branches.find((b) => b._id === branchId._id)
          : branches.find((b) => b._id === branchId);
      const course =
        branch &&
        courses.find(
          (c) =>
            c._id ===
            (typeof branch.courseId === "object"
              ? branch.courseId._id
              : branch.courseId)
        );
      const universityId =
        course && typeof course.universityId === "object"
          ? course.universityId._id
          : course?.universityId || "";

      setFormData({
        _id,
        number: number.toString(),
        badge: badge || "",
        universityId,
        courseId: course?._id || "",
        branchId: branch?._id || "",
      });

      setFilteredCourses(
        courses.filter((c) => {
          const uniId =
            typeof c.universityId === "object"
              ? c.universityId._id
              : c.universityId;
          return uniId === universityId;
        })
      );

      setFilteredBranches(
        branches.filter((b) => {
          const cId =
            typeof b.courseId === "object" ? b.courseId._id : b.courseId;
          return cId === course?._id;
        })
      );
    } else {
      setFormData({
        _id: "",
        number: "",
        universityId: "",
        courseId: "",
        branchId: "",
        badge: "",
      });
      setFilteredCourses([]);
      setFilteredBranches([]);
    }
  }, [defaultValues, branches, courses]);

  useEffect(() => {
    if (!isEdit) {
      const filtered = courses.filter((c) => {
        const uniId =
          typeof c.universityId === "object"
            ? c.universityId._id
            : c.universityId;
        return uniId === formData.universityId;
      });
      setFilteredCourses(filtered);
      setFormData((prev) => ({ ...prev, courseId: "", branchId: "" }));
      setFilteredBranches([]);
    }
  }, [formData.universityId, courses, isEdit]);

  useEffect(() => {
    if (!isEdit) {
      const filtered = branches.filter((b) => {
        const courseId =
          typeof b.courseId === "object" ? b.courseId._id : b.courseId;
        return courseId === formData.courseId;
      });
      setFilteredBranches(filtered);
      setFormData((prev) => ({ ...prev, branchId: "" }));
    }
  }, [formData.courseId, branches, isEdit]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        _id: "",
        number: "",
        universityId: "",
        courseId: "",
        branchId: "",
        badge: "",
      });
      setFilteredCourses([]);
      setFilteredBranches([]);
    }
  }, [isOpen]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!formData.number || !formData.branchId) {
      return alert("Branch and semester number are required.");
    }

    const semNum = Number(formData.number);
    if (isNaN(semNum) || semNum < 1 || semNum > 12) {
      return alert("Semester number must be between 1 and 12.");
    }

    const payload: Semester = {
      _id: isEdit
        ? formData._id
        : `${formData.branchId}-sem${formData.number}`,
      number: semNum,
      branchId: formData.branchId,
      badge: formData.badge.trim() || undefined,
    };

    onSubmit(payload, () => {
      onClose();
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Semester" : "Add Semester"}
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
          <Label>Semester Number</Label>
          <Input
            type="number"
            min={1}
            max={12}
            placeholder="e.g. 1"
            value={formData.number}
            onChange={(e) => handleChange("number", e.target.value)}
          />
        </div>

        <div>
          <Label>Badge (optional)</Label>
          <Input
            placeholder="e.g. Fast-track"
            value={formData.badge}
            onChange={(e) => handleChange("badge", e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SemesterFormModal;
