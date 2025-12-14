import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const StudentProfile = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  // Example: Fetch student data from API based on studentId
  // For now, dummy data:
  const student = {
    id: studentId,
    name: "Student Name",
    roll: 1,
    age: 15,
    className: "10A",
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">{student.name}</h2>
      <p className="text-gray-700 mb-2">Roll No: {student.roll}</p>
      <p className="text-gray-700 mb-2">Class: {student.className}</p>
      <p className="text-gray-700 mb-2">Age: {student.age}</p>

      <button
        onClick={() => navigate(-1)}
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Back
      </button>
    </div>
  );
};

export default StudentProfile;
