import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents } from "../redux/studentsSlice";
import ClassAdmitBulk from "../components/ClassAdmitBulk";
import { useReactToPrint } from "react-to-print";
import StudentAdmitCard from "../components/StudentAdmitCard";

const Admit = () => {
  const { sessionName } = useParams();
  const dispatch = useDispatch();

  const { students, loading } = useSelector((state) => state.students);

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  // 🔹 Single student print ref
  const singlePrintRef = useRef(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleSinglePrint = useReactToPrint({
    contentRef: singlePrintRef,
  });

  // 🔹 fetch students
  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  // 🔹 fetch classes by session
  useEffect(() => {
    fetchClass();
  }, []);

  const fetchClass = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/classes/${sessionName}`
    );
    const data = await res.json();
    setClasses(data);
  };

  // 🔹 filter students by session + class
  const filteredStudents = students.filter(
    (s) => s.studentSessions === sessionName && s.studentClass === selectedClass
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Admit Card — Session {sessionName}
      </h2>

      {/* 🔹 Class Selection */}
      <h3 className="text-lg font-semibold mb-2">Select Class</h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
        {classes.map((cls) => (
          <button
            key={cls._id}
            onClick={() => setSelectedClass(cls.className)}
            className={`border rounded px-4 py-2 text-center hover:bg-blue-100
              ${
                selectedClass === cls.className
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
          >
            {cls.className}
          </button>
        ))}
      </div>

      {/* 🔹 Student Section */}
      {selectedClass && (
        <>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold">Class: {selectedClass}</h3>

            {/* 🔹 Whole Class Download */}
            {filteredStudents.length > 0 && (
              <ClassAdmitBulk
                students={filteredStudents}
                className={selectedClass}
              />
            )}
          </div>

          {loading ? (
            <p>Loading students...</p>
          ) : filteredStudents.length === 0 ? (
            <p className="text-gray-500 italic">
              No students found for this class.
            </p>
          ) : (
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2">Roll</th>
                  <th className="border px-3 py-2">Name</th>
                  <th className="border px-3 py-2">Group</th>
                  <th className="border px-3 py-2">Admit</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents
                  .sort((a, b) => a.studentRoll - b.studentRoll)
                  .map((student) => (
                    <tr key={student._id}>
                      <td className="border px-3 py-2">
                        {student.studentRoll}
                      </td>
                      <td className="border px-3 py-2">
                        {student.studentName}
                      </td>
                      <td className="border px-3 py-2">
                        {student.studentGroup}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setTimeout(() => handleSinglePrint(), 100);
                          }}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* 🔹 Hidden Single Student Admit Card for print */}
      {selectedStudent && (
        <div className="hidden">
          <div ref={singlePrintRef}>
            <StudentAdmitCard student={selectedStudent} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Admit;
