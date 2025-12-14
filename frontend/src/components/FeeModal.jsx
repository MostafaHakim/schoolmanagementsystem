import React from "react";
import { X } from "lucide-react";

const FeeModal = ({
  open,
  onClose,
  formData,
  setFormData,
  onSubmit,
  classes,
}) => {
  if (!open) return null;

  const handleClassSelect = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData({ ...formData, applicableClasses: value });
  };

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
          {formData._id ? "Edit Fee" : "Add Fee"}
        </h2>

        <input
          type="text"
          placeholder="Fee Name"
          value={formData.feeName}
          onChange={(e) =>
            setFormData({ ...formData, feeName: e.target.value })
          }
          className="w-full border p-3 rounded-lg mb-3 outline-none focus:border-blue-500 transition"
        />

        <input
          type="number"
          placeholder="Amount"
          value={formData.feeAmount}
          onChange={(e) =>
            setFormData({ ...formData, feeAmount: e.target.value })
          }
          className="w-full border p-3 rounded-lg mb-3 outline-none focus:border-blue-500 transition"
        />

        <select
          value={formData.feeType}
          onChange={(e) =>
            setFormData({ ...formData, feeType: e.target.value })
          }
          className="w-full border p-3 rounded-lg mb-3 outline-none focus:border-blue-500 transition"
        >
          <option value="Compulsory">Compulsory</option>
          <option value="Optional">Optional</option>
        </select>

        <select
          multiple
          value={formData.applicableClasses}
          onChange={handleClassSelect}
          className="w-full border p-3 rounded-lg mb-5 outline-none focus:border-blue-500 transition h-28"
        >
          {classes.map((c) => (
            <option key={c._id} value={c.className}>
              {c.className}
            </option>
          ))}
        </select>

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

export default FeeModal;
