import React, { useState, useEffect } from "react";
import ExamModal from "../components/ExamModal"; // Modal component
import { FaEdit, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";

const Exam = () => {
  const [exams, setExams] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const { sessionName } = useParams();
  const [formData, setFormData] = useState({
    examName: "",
    startDate: "",
    endDate: "",
    sessionName: "",
  });

  // Fetch exams from backend
  const fetchExams = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/exams/filter?sessionName=${sessionName}`
      );
      const data = await res.json();
      setExams(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const openModal = (exam = null) => {
    if (exam) {
      setEditingExam(exam);
      setFormData(exam);
    } else {
      setEditingExam(null);
      setFormData({
        examName: "",
        startDate: "",
        endDate: "",
        sessionName: sessionName,
      });
    }
    setModalOpen(true);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingExam) {
      await fetch(`${import.meta.env.VITE_BASE_URL}/exams/${editingExam._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } else {
      await fetch(`${import.meta.env.VITE_BASE_URL}/exams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    }
    setModalOpen(false);
    fetchExams();
  };

  // Delete exam
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      await fetch(`${import.meta.env.VITE_BASE_URL}/exams/${id}`, {
        method: "DELETE",
      });
      fetchExams();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Exams</h2>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add Exam
        </button>
      </div>

      {exams.length === 0 ? (
        <p className="text-gray-500 text-center">No exams available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {exams.map((exam) => (
            <div
              key={exam._id}
              className="bg-white rounded-xl shadow-lg p-5 flex flex-col justify-between"
            >
              <h3 className="text-xl font-semibold mb-2">
                {exam.examName} {exam.sessionName}
              </h3>
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => openModal(exam)}
                  className="flex-1 px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition flex items-center justify-center gap-1"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(exam._id)}
                  className="flex-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center justify-center gap-1"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <ExamModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default Exam;
