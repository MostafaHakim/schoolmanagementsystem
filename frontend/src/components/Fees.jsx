import React, { useEffect, useState } from "react";
import FeeModal from "../components/FeeModal";
import { FaEdit, FaTrash } from "react-icons/fa";

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [classes, setClasses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [formData, setFormData] = useState({
    feeName: "",
    feeType: "Compulsory",
    feeAmount: "",
    applicableClasses: [],
  });

  // Fetch fees from backend
  const fetchFees = async () => {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/fees`);
    const data = await res.json();
    setFees(data);
  };

  // Fetch classes for multi-select
  const fetchClasses = async () => {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/classes`);
    const data = await res.json();
    setClasses(data);
  };

  useEffect(() => {
    fetchFees();
    fetchClasses();
  }, []);

  const openModal = (fee = null) => {
    if (fee) {
      setEditingFee(fee);
      setFormData(fee);
    } else {
      setEditingFee(null);
      setFormData({
        feeName: "",
        feeType: "Compulsory",
        feeAmount: "",
        applicableClasses: [],
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingFee) {
      await fetch(`${import.meta.env.VITE_BASE_URL}/fees/${editingFee._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } else {
      await fetch(`${import.meta.env.VITE_BASE_URL}/fees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    }
    setModalOpen(false);
    fetchFees();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this fee?")) {
      await fetch(`${import.meta.env.VITE_BASE_URL}/fees/${id}`, {
        method: "DELETE",
      });
      fetchFees();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-3xl font-bold">Fees</h2>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add Fee
        </button>
      </div>

      {fees.length === 0 ? (
        <p className="text-gray-500 text-center">No fees available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fees.map((fee) => (
            <div
              key={fee._id}
              className="bg-white p-4 rounded-xl shadow-md flex flex-col justify-between"
            >
              <h3 className="text-xl font-semibold mb-2">{fee.feeName}</h3>
              <p>Type: {fee.feeType}</p>
              <p>Amount: {fee.feeAmount}</p>
              <p>
                Classes:{" "}
                {fee.applicableClasses.length === 0
                  ? "All Classes"
                  : fee.applicableClasses.join(", ")}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => openModal(fee)}
                  className="flex-1 px-3 py-1 bg-yellow-400 text-white rounded flex items-center justify-center gap-1 hover:bg-yellow-500 transition"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(fee._id)}
                  className="flex-1 px-3 py-1 bg-red-500 text-white rounded flex items-center justify-center gap-1 hover:bg-red-600 transition"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <FeeModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          classes={classes}
        />
      )}
    </div>
  );
};

export default Fees;
