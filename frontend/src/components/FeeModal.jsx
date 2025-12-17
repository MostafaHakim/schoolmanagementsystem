import React from "react";
import { X } from "lucide-react";

const FeeModal = ({
  open,
  onClose,
  formData,
  setFormData,
  onSubmit,
  errorMsg,
  editingFee,
  classes,
}) => {
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
          {editingFee ? "Edit Fee" : "Add Fee"}
        </h2>

        <input
          type="text"
          placeholder="Fee Name"
          value={formData.feesName}
          onChange={(e) =>
            setFormData({ ...formData, feesName: e.target.value })
          }
          className="w-full border p-3 rounded-lg mb-3 outline-none focus:border-blue-500 transition"
        />
        <input
          type="text"
          placeholder="Fee Amount"
          value={formData.feesAmount}
          onChange={(e) =>
            setFormData({ ...formData, feesAmount: e.target.value })
          }
          className="w-full border p-3 rounded-lg mb-3 outline-none focus:border-blue-500 transition"
        />
        <select
          value={formData.feesClass}
          onChange={(e) =>
            setFormData({ ...formData, feesClass: e.target.value })
          }
          className="w-full border p-3 rounded-lg mb-3 outline-none focus:border-blue-500 transition capitalize"
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls.className}>
              {cls.className}
            </option>
          ))}
        </select>

        {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}

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
            {editingFee ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeeModal;
