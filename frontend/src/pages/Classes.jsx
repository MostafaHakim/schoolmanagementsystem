import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");
  const [msg, setMag] = useState("");
  const { sessionName } = useParams();
  useEffect(() => {
    fetchClass();
  }, []);

  const fetchClass = async () => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/classes/${sessionName}`)
      .then((res) => res.json())
      .then((data) => setClasses(data));
  };

  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudentsByClasses();
  }, []);

  const fetchStudentsByClasses = async () => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/students/`)
      .then((res) => res.json())
      .then((data) => setStudents(data));
  };

  const addClass = async () => {
    try {
      if (!className.trim()) {
        setMag("Class name is required");
        setTimeout(() => setMag(""), 3000);
        return;
      }

      const newClass = className.trim().toLowerCase();

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/classes?sessionName=${sessionName}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ className: newClass }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add class");
      }

      setClassName("");
      fetchClass();

      setMag(data.message);
      setTimeout(() => setMag(""), 3000);
    } catch (error) {
      setMag(error.message);
      setTimeout(() => setMag(""), 3000);
    }
  };

  const deleteClass = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/classes/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete class");
      const data = await response.json();
      console.log("Class deleted:", data);
      fetchClass();
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  return (
    <div className=" mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Classes</h2>
        <h2
          className={`${
            msg &&
            "text-xl text-red-500 font-bold px-8 py-4 rounded-full bg-green-500/50 border border-green-500"
          }`}
        >
          {msg && msg}
        </h2>
        <div className="flex w-full md:w-auto">
          <input
            type="text"
            placeholder="Enter class name"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addClass}
            className="bg-blue-500 text-white px-6 py-2 rounded-r-lg hover:bg-blue-600 transition"
          >
            Add
          </button>
        </div>
      </div>

      {classes.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No classes added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {classes.map((cls) => {
            const totalStudents = students.filter(
              (stu) =>
                stu.studentClass === cls.className &&
                stu.studentSessions === sessionName
            ).length;

            return (
              <div
                key={cls._id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition"
              >
                <Link
                  to={`/dashboard/${sessionName}/classdetails/${cls.className}`}
                  className="mb-4 hover:text-blue-600 transition"
                >
                  <h3 className="text-xl font-semibold">{cls.className}</h3>
                  <p className="text-gray-600 mt-1">
                    Total Students:{" "}
                    <span className="font-medium">{totalStudents}</span>
                  </p>
                </Link>

                <button
                  onClick={() => deleteClass(cls._id)}
                  className="self-start text-red-500 hover:text-red-700 flex items-center gap-2 font-semibold"
                >
                  <FaRegTrashAlt /> Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Classes;
