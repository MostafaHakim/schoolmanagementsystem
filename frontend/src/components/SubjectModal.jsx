import React from "react";
import { X } from "lucide-react";

const SubjectModal = ({
  open,
  onClose,
  formData,
  setFormData,
  onSubmit,
  classes,
  sessionName,
}) => {
  if (!open) return null;

  const isAllSelected = formData.subjectClasses.length === classes.length;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[420px] relative">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500"
        >
          <X />
        </button>

        <h2 className="text-2xl font-semibold mb-4">Add Subject</h2>

        {/* Subject Name */}
        <input
          type="text"
          placeholder="Subject Name"
          value={formData.subjectName}
          onChange={(e) =>
            setFormData({ ...formData, subjectName: e.target.value })
          }
          className="w-full border p-2 rounded mb-3"
        />

        {/* Class Checkbox */}
        <div className="border rounded p-3 mb-3">
          <label className="flex items-center gap-2 mb-2 font-semibold">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subjectClasses: e.target.checked
                    ? classes.map((c) => c.className)
                    : [],
                })
              }
            />
            Select All Classes
          </label>

          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {classes
              .filter((cls) => cls.sessionName === sessionName)
              .map((c) => (
                <label key={c._id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.subjectClasses.includes(c.className)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...formData.subjectClasses, c.className]
                        : formData.subjectClasses.filter(
                            (cls) => cls !== c.className
                          );
                      setFormData({
                        ...formData,
                        subjectClasses: updated,
                      });
                    }}
                  />
                  {c.className}
                </label>
              ))}
          </div>
        </div>

        {/* Type */}
        <select
          value={formData.subjectType}
          onChange={(e) =>
            setFormData({ ...formData, subjectType: e.target.value })
          }
          className="w-full border p-2 rounded mb-4"
        >
          <option value="">Select Type</option>
          <option value="compulsory">Compulsory</option>
          <option value="optional">Optional</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectModal;
