import React, { useEffect, useState } from "react";
import FeeModal from "../components/FeeModal";
import { FaEdit, FaTrash } from "react-icons/fa";

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [classes, setClasses] = useState([]); // ক্লাস ফেচ করার জন্য
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [formData, setFormData] = useState({
    feesName: "",
    feesAmount: "",
    feesClass: "",
  });

  // 🔹 Fees ফেচ
  const fetchFees = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/fees`);
      const data = await res.json();
      setFees(data);
    } catch (error) {
      console.error("Failed to fetch fees:", error);
    }
  };

  // 🔹 Classes ফেচ
  const fetchClasses = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/classes`);
      const data = await res.json();
      setClasses(data); // assume API returns [{ _id, className }]
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    }
  };

  useEffect(() => {
    fetchFees();
    fetchClasses();
  }, []);

  const openModal = (fee = null) => {
    if (fee) {
      setEditingFee(fee);
      setFormData({
        feesName: fee.feesName || "",
        feesAmount: fee.feesAmount || "",
        feesClass: fee.feesClass || "",
      });
    } else {
      setEditingFee(null);
      setFormData({ feesName: "", feesAmount: "", feesClass: "" });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.feesName || !formData.feesAmount || !formData.feesClass) {
      setErrorMsg("Please fill all required fields.");
      return;
    }

    try {
      const res = await fetch(
        editingFee
          ? `${import.meta.env.VITE_BASE_URL}/fees/${editingFee._id}`
          : `${import.meta.env.VITE_BASE_URL}/fees`,
        {
          method: editingFee ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Something went wrong!");
      } else {
        setSuccessMsg(data.message || "Saved successfully!");
        setModalOpen(false);
        fetchFees(); // refresh fees list
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (error) {
      setErrorMsg(error.message);
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this fee?")) {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/fees/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const data = await res.json();
          alert(data.message || "Failed to delete fee");
        } else {
          fetchFees(); // Refresh fee list
        }
      } catch (error) {
        console.error("Failed to delete fee:", error);
        alert("Failed to delete fee");
      }
    }
  };

  return (
    <div className="mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Fees</h2>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add Fee
        </button>
      </div>

      {successMsg && <p className="text-green-500 mb-2">{successMsg}</p>}

      {/* Fees List */}
      {fees.length === 0 ? (
        <p className="text-gray-500 text-center">No fees available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fees.map((fee) => (
            <div
              key={fee._id}
              className="bg-white p-4 rounded-xl shadow-md flex flex-col justify-between"
            >
              <h3 className="text-xl font-semibold mb-2">{fee.feesName}</h3>
              <p className="text-gray-600 mb-1">Amount: {fee.feesAmount}</p>
              <p className="text-gray-600 mb-2 capitalize">
                Class: {fee.feesClass}
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
          errorMsg={errorMsg}
          editingFee={editingFee}
          classes={classes} // pass classes to modal
        />
      )}
    </div>
  );
};

export default Fees;
