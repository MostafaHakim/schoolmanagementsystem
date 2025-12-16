import React from "react";
import { X } from "lucide-react";

const ExamModal = ({ open, onClose, formData, setFormData, onSubmit }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 relative animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-black transition"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-semibold mb-4">
          {formData._id ? "Edit Exam" : "Add Exam"}
        </h2>

        <input
          type="text"
          placeholder="Exam Name"
          value={formData.examName}
          onChange={(e) =>
            setFormData({ ...formData, examName: e.target.value })
          }
          className="w-full border p-3 rounded-lg mb-3 outline-none focus:border-blue-500 transition"
        />
        <input
          type="date"
          placeholder="Start Date"
          value={formData.startDate}
          onChange={(e) =>
            setFormData({ ...formData, startDate: e.target.value })
          }
          className="w-full border p-3 rounded-lg mb-3 outline-none focus:border-blue-500 transition"
        />
        <input
          type="date"
          placeholder="End Date"
          value={formData.endDate}
          onChange={(e) =>
            setFormData({ ...formData, endDate: e.target.value })
          }
          className="w-full border p-3 rounded-lg mb-3 outline-none focus:border-blue-500 transition"
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            Close
          </button>
          <button
            onClick={onSubmit}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition shadow-md"
          >
            {formData._id ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamModal;
