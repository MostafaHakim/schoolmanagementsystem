import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents } from "../redux/studentsSlice";
import ClassAdmitBulk from "../components/ClassAdmitBulk";
import { useReactToPrint } from "react-to-print";
import StudentAdmitCard from "../components/StudentAdmitCard";

const Admit = () => {
  const dispatch = useDispatch();
  const { students, loading } = useSelector((state) => state.students);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [classes, setClasses] = useState([]);
  const [exams, setExams] = useState([]);
  const [settings, setSettings] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const { sessionName } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  // 🔹 Single student print ref
  const singlePrintRef = useRef(null);

  const handleSinglePrint = useReactToPrint({
    contentRef: singlePrintRef,
  });

  // 🔹 fetch all data
  useEffect(() => {
    const loadData = async () => {
      try {
        dispatch(fetchStudents());
        await fetchClass();
        await fetchExams();
        await fetchSettings();
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [dispatch]);

  const fetchClass = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/classes/${sessionName}`
    );
    const data = await res.json();
    setClasses(data);
  };

  const fetchExams = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/exams?sessionName=${sessionName}`
      );
      const data = await res.json();
      setExams(data);
      // Set first exam as default if available
      if (data.length > 0 && !selectedExam) {
        setSelectedExam(data[0].examName);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/usersettings`);
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setSettings(data.data[0]);
      } else {
        // Set default settings if none found
        setSettings({
          schoolName: "Your School Name",
          schoolAddress: "Your School Address",
          defaultExamTime: "09:00 AM - 12:00 PM",
        });
      }
    } catch (err) {
      console.error(err);
      // Set default settings on error
      setSettings({
        schoolName: "Your School Name",
        schoolAddress: "Your School Address",
        defaultExamTime: "09:00 AM - 12:00 PM",
      });
    }
  };

  // 🔹 Reset selected class when exam changes (optional)
  useEffect(() => {
    if (selectedExam && selectedClass) {
      // Keep both selected
    }
  }, [selectedExam, selectedClass]);

  // 🔹 filter students by session + class
  const filteredStudents = students.filter(
    (s) => s.studentSessions === sessionName && s.studentClass === selectedClass
  );
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Admit Card — Session {sessionName}
      </h2>

      {/* 🔹 Exam Selection */}
      <h3 className="text-lg font-semibold mb-2">Select Exam</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
        {exams.length > 0 ? (
          exams.map((exam) => (
            <button
              key={exam._id}
              onClick={() => setSelectedExam(exam.examName)}
              className={`border rounded px-4 py-2 text-center hover:bg-blue-600 hover:text-white
                ${
                  selectedExam === exam.examName
                    ? "bg-blue-500 text-white"
                    : "bg-white"
                }`}
            >
              {exam.examName}
            </button>
          ))
        ) : (
          <p className="col-span-full text-gray-500 italic">
            No exams found for this session.
          </p>
        )}
      </div>

      {/* 🔹 Class Selection - Only enabled if exam is selected */}
      <h3 className="text-lg font-semibold mb-2">Select Class</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
        {classes.map((cls) => (
          <button
            key={cls._id}
            onClick={() => setSelectedClass(cls.className)}
            disabled={!selectedExam}
            className={`border rounded capitalize px-4 py-2 text-center 
              ${
                selectedClass === cls.className ? "bg-blue-500 text-white " : ""
              }`}
          >
            {cls.className}
          </button>
        ))}
      </div>

      {/* 🔹 Student Section */}
      {selectedClass && selectedExam && (
        <>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold capitalize">
              Class: {selectedClass} | Exam: {selectedExam}
            </h3>

            {/* 🔹 Whole Class Download */}
            {filteredStudents.length > 0 && (
              <ClassAdmitBulk
                students={filteredStudents}
                className={selectedClass}
                selectedExam={selectedExam}
                sessionName={sessionName}
                settings={settings}
                user={user}
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
                      <td className="border px-3 py-2 text-center">
                        {student.studentRoll}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {student.studentName}
                      </td>
                      <td className="border px-3 py-2 text-center ">
                        <span className="px-8 py-1 rounded-full bg-orange-300  border border-orange-500 shadow-lg text-sm">
                          {student.studentGroup}
                        </span>
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
      {selectedStudent && selectedExam && settings && user && (
        <div className="hidden">
          <div ref={singlePrintRef}>
            <StudentAdmitCard
              student={selectedStudent}
              selectedExam={selectedExam}
              sessionName={sessionName}
              settings={settings}
              user={user}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Admit;
