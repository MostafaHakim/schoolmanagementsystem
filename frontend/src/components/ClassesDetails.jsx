import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StudentTable from "./StudentTable";
import SubjectTable from "./SubjectTable";

const ClassDetails = () => {
  const { className } = useParams();
  const [activeTab, setActiveTab] = useState("students");

  const [students, setStudents] = useState([]);
  const { sessionName } = useParams();
  useEffect(() => {
    fetchStudentsByClasses();
  }, []);

  const fetchStudentsByClasses = async () => {
    await fetch(
      `${
        import.meta.env.VITE_BASE_URL
      }/students/${className}?sessionName=${sessionName}`
    )
      .then((res) => res.json())
      .then((data) => setStudents(data));
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white shadow rounded-lg p-6">
      {/* Header */}
      <h2 className="text-3xl font-bold mb-6">Class Details : {className}</h2>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("students")}
          className={`px-6 py-2 font-medium ${
            activeTab === "students"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
        >
          Students
        </button>

        <button
          onClick={() => setActiveTab("subjects")}
          className={`px-6 py-2 font-medium ${
            activeTab === "subjects"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
        >
          Subjects
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "students" && <StudentTable students={students} />}
      {activeTab === "subjects" && <SubjectTable />}
    </div>
  );
};

export default ClassDetails;
