// import React, { useEffect, useState } from "react";

// const TOTAL_MARK = 100;
// const PASS_MARK = 33;

// const Marksheet = () => {
//   const [exams, setExams] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [students, setStudents] = useState([]);

//   const [selectedExam, setSelectedExam] = useState(null);
//   const [selectedClass, setSelectedClass] = useState(null);
//   const [selectedSubject, setSelectedSubject] = useState(null);

//   const [marks, setMarks] = useState({});
//   const [locked, setLocked] = useState(false); // 🔒 lock after save

//   const BASE_URL = import.meta.env.VITE_BASE_URL;

//   const getGrade = (marks) => {
//     if (marks >= 80) return "A+";
//     if (marks >= 70) return "A";
//     if (marks >= 60) return "A-";
//     if (marks >= 50) return "B";
//     if (marks >= 40) return "C";
//     if (marks >= 33) return "D";
//     return "F";
//   };

//   useEffect(() => {
//     fetch(`${BASE_URL}/exams`)
//       .then((res) => res.json())
//       .then(setExams);
//   }, []);

//   useEffect(() => {
//     if (!selectedExam) return;
//     fetch(`${BASE_URL}/classes`)
//       .then((res) => res.json())
//       .then(setClasses);
//   }, [selectedExam]);

//   useEffect(() => {
//     if (!selectedClass) return;
//     fetch(`${BASE_URL}/subjects/filtersubject?subjectClass=${selectedClass}`)
//       .then((res) => res.json())
//       .then(setSubjects);
//   }, [selectedClass]);

//   useEffect(() => {
//     if (!selectedClass || !selectedSubject) return;
//     fetch(`${BASE_URL}/students?className=${selectedClass}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setStudents(data);
//         const init = {};
//         data.forEach((s) => (init[s.studentRoll] = ""));
//         setMarks(init);
//         setLocked(false);
//       });
//   }, [selectedClass, selectedSubject]);

//   const handleSaveMarks = async () => {
//     const marksList = students.map((s) => ({
//       studentRoll: s.studentRoll,
//       gotMarks: Number(marks[s.studentRoll]),
//     }));

//     const payload = {
//       studentClass: selectedClass,
//       examName: selectedExam,
//       subjectName: selectedSubject,
//       marksList,
//     };

//     await fetch(`${BASE_URL}/students/markentry`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     alert("Marks Saved Successfully");
//     setLocked(true); // 🔒 lock inputs
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-4">Marks Entry</h1>

//       {/* Exam */}
//       <div className="flex gap-2 mb-4 flex-wrap">
//         {exams.map((e) => (
//           <button
//             key={e._id}
//             onClick={() => setSelectedExam(e.examName)}
//             className={`px-4 py-2 rounded ${
//               selectedExam === e.examName
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-200"
//             }`}
//           >
//             {e.examName}
//           </button>
//         ))}
//       </div>

//       {/* Class */}
//       {selectedExam && (
//         <div className="flex gap-2 mb-4">
//           {classes.map((c) => (
//             <button
//               key={c._id}
//               onClick={() => setSelectedClass(c.className)}
//               className={`px-4 py-2 rounded ${
//                 selectedClass === c.className
//                   ? "bg-green-600 text-white"
//                   : "bg-gray-200"
//               }`}
//             >
//               {c.className}
//             </button>
//           ))}
//         </div>
//       )}

//       {/* Subject */}
//       {selectedClass && (
//         <div className="flex gap-2 mb-4">
//           {subjects.map((s) => (
//             <button
//               key={s._id}
//               onClick={() => setSelectedSubject(s.subjectName)}
//               className={`px-4 py-2 rounded ${
//                 selectedSubject === s.subjectName
//                   ? "bg-purple-600 text-white"
//                   : "bg-gray-200"
//               }`}
//             >
//               {s.subjectName}
//             </button>
//           ))}
//         </div>
//       )}

//       {/* Table */}
//       {selectedSubject && (
//         <>
//           <table className="w-full border">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th>Roll</th>
//                 <th>Name</th>
//                 <th>Pass</th>
//                 <th>Total</th>
//                 <th>Got</th>
//                 <th>Grade</th>
//                 <th>Edit</th>
//               </tr>
//             </thead>
//             <tbody>
//               {students.map((s) => (
//                 <tr key={s._id} className="text-center">
//                   <td>{s.studentRoll}</td>
//                   <td>{s.studentName}</td>
//                   <td>{PASS_MARK}</td>
//                   <td>{TOTAL_MARK}</td>
//                   <td>
//                     <input
//                       disabled={locked}
//                       type="number"
//                       value={marks[s.studentRoll]}
//                       onChange={(e) =>
//                         setMarks({
//                           ...marks,
//                           [s.studentRoll]: e.target.value,
//                         })
//                       }
//                       className={`border w-20 text-center ${
//                         locked ? "bg-white border-0" : "border-gray-400"
//                       }`}
//                     />
//                   </td>
//                   <td className="font-bold">
//                     {marks[s.studentRoll] !== ""
//                       ? getGrade(Number(marks[s.studentRoll]))
//                       : "-"}
//                   </td>
//                   <td>
//                     {locked && (
//                       <button
//                         onClick={() => setLocked(false)}
//                         className="text-blue-600 underline"
//                       >
//                         Edit
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {!locked && (
//             <button
//               onClick={handleSaveMarks}
//               className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
//             >
//               Save Marks
//             </button>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default Marksheet;
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TOTAL_MARK = 100;
const PASS_MARK = 33;

const Marksheet = () => {
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [marks, setMarks] = useState({});
  const [locked, setLocked] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { sessionName } = useParams();
  const getGrade = (marks) => {
    if (marks >= 80) return { grade: "A+", color: "text-green-600" };
    if (marks >= 70) return { grade: "A", color: "text-green-500" };
    if (marks >= 60) return { grade: "A-", color: "text-blue-600" };
    if (marks >= 50) return { grade: "B", color: "text-blue-500" };
    if (marks >= 40) return { grade: "C", color: "text-yellow-600" };
    if (marks >= 33) return { grade: "D", color: "text-orange-500" };
    return { grade: "F", color: "text-red-600" };
  };

  const getStatusColor = (marks) => {
    const numMarks = Number(marks);
    if (marks === "") return "bg-gray-100";
    if (numMarks >= 80) return "bg-green-50";
    if (numMarks >= 60) return "bg-blue-50";
    if (numMarks >= 33) return "bg-yellow-50";
    return "bg-red-50";
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/exams?sessionName=${sessionName}`)
      .then((res) => res.json())
      .then((data) => {
        setExams(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedExam) return;
    setLoading(true);
    fetch(`${BASE_URL}/classes`)
      .then((res) => res.json())
      .then((data) => {
        setClasses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedExam]);

  useEffect(() => {
    if (!selectedClass) return;
    setLoading(true);
    fetch(`${BASE_URL}/subjects/filtersubject?subjectClass=${selectedClass}`)
      .then((res) => res.json())
      .then((data) => {
        setSubjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedClass]);

  useEffect(() => {
    if (!selectedClass || !selectedSubject || !selectedExam) return;

    const fetchStudentsAndMarks = async () => {
      const studentRes = await fetch(`${BASE_URL}/students/${selectedClass}`);
      const studentData = await studentRes.json();
      setStudents(studentData);

      const marksRes = await fetch(
        `${BASE_URL}/students/existing-marks?studentClass=${selectedClass}&examName=${selectedExam}&subjectName=${selectedSubject}&sessionName=${sessionName}`
      );
      const marksData = await marksRes.json();

      const finalMarks = {};
      studentData.forEach((s) => {
        finalMarks[s.studentRoll] = marksData[s.studentRoll] ?? "";
      });
      console.log(finalMarks);
      setMarks(finalMarks);
    };

    fetchStudentsAndMarks();
  }, [selectedClass, selectedSubject, selectedExam]);

  const handleSaveMarks = async () => {
    const marksList = students.map((s) => ({
      studentRoll: s.studentRoll,
      gotMarks: Number(marks[s.studentRoll]) || 0,
    }));

    const payload = {
      studentClass: selectedClass,
      examName: selectedExam,
      subjectName: selectedSubject,
      sessionName,
      marksList,
    };

    setSaveLoading(true);
    try {
      await fetch(`${BASE_URL}/students/markentry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setLocked(true);
      alert("✅ Marks Saved Successfully!");
    } catch (error) {
      alert("❌ Failed to save marks");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleUnlockAll = () => {
    if (
      window.confirm("Are you sure you want to unlock all marks for editing?")
    ) {
      setLocked(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Student Marks Entry
            </h1>
            <div className="flex items-center gap-2">
              {locked && (
                <button
                  onClick={handleUnlockAll}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                    />
                  </svg>
                  Unlock All
                </button>
              )}
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  locked
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {locked ? "🔒 Locked" : "✏️ Editable"}
              </div>
            </div>
          </div>
          <p className="text-gray-600">
            Select exam, class, and subject to enter marks for students
          </p>
        </div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Exam Selection */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Select Exam
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {loading && !exams.length ? (
                <div className="animate-pulse space-y-2 w-full">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              ) : (
                exams.map((e) => (
                  <button
                    key={e._id}
                    onClick={() => setSelectedExam(e.examName)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      selectedExam === e.examName
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md transform scale-105"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    {e.examName}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Class Selection */}
          {selectedExam && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Select Class
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {loading && !classes.length ? (
                  <div className="animate-pulse space-y-2 w-full">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-10 bg-gray-200 rounded-lg"
                      ></div>
                    ))}
                  </div>
                ) : (
                  classes.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => {
                        setSelectedClass(c.className);
                        setSelectedSubject(null);
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        selectedClass === c.className
                          ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md transform scale-105"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      {c.className}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Subject Selection */}
          {selectedClass && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Select Subject
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {loading && !subjects.length ? (
                  <div className="animate-pulse space-y-2 w-full">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-10 bg-gray-200 rounded-lg"
                      ></div>
                    ))}
                  </div>
                ) : (
                  subjects.map((s) => (
                    <button
                      key={s._id}
                      onClick={() => setSelectedSubject(s.subjectName)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        selectedSubject === s.subjectName
                          ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md transform scale-105"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      {s.subjectName}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Marks Table */}
        {selectedSubject && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Marks Entry: {selectedSubject}
                  </h2>
                  <p className="text-blue-100">
                    Class: {selectedClass} | Exam: {selectedExam}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  {!locked && (
                    <button
                      onClick={handleSaveMarks}
                      disabled={saveLoading}
                      className="px-6 py-3 bg-white text-blue-600 hover:bg-gray-100 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                      {saveLoading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Save All Marks
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="p-12">
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-4 text-left font-semibold text-gray-700">
                        Roll
                      </th>
                      <th className="p-4 text-left font-semibold text-gray-700">
                        Student Name
                      </th>
                      <th className="p-4 text-left font-semibold text-gray-700">
                        Pass Mark
                      </th>
                      <th className="p-4 text-left font-semibold text-gray-700">
                        Total Mark
                      </th>
                      <th className="p-4 text-left font-semibold text-gray-700">
                        Obtained Mark
                      </th>
                      <th className="p-4 text-left font-semibold text-gray-700">
                        Grade
                      </th>
                      <th className="p-4 text-left font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="p-4 text-left font-semibold text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {students.map((s) => {
                      const gradeInfo =
                        marks[s.studentRoll] !== ""
                          ? getGrade(Number(marks[s.studentRoll]))
                          : null;
                      return (
                        <tr
                          key={s._id}
                          className={`hover:bg-gray-50 transition-colors ${getStatusColor(
                            marks[s.studentRoll]
                          )}`}
                        >
                          <td className="p-4">
                            <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-800 rounded-lg font-bold">
                              {s.studentRoll}
                            </span>
                          </td>
                          <td className="p-4 font-medium text-gray-800">
                            {s.studentName}
                          </td>
                          <td className="p-4">
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full font-semibold">
                              {PASS_MARK}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
                              {TOTAL_MARK}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="relative">
                              <input
                                disabled={locked}
                                type="number"
                                min="0"
                                max={TOTAL_MARK}
                                value={marks[s.studentRoll]}
                                onChange={(e) => {
                                  const value = Math.min(
                                    Math.max(0, e.target.value),
                                    TOTAL_MARK
                                  );
                                  setMarks({
                                    ...marks,
                                    [s.studentRoll]: value,
                                  });
                                }}
                                className={`w-24 px-4 py-2 text-center font-bold rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  locked
                                    ? "bg-gray-100 border-gray-300 text-gray-600"
                                    : "bg-white border-blue-300 hover:border-blue-400"
                                }`}
                              />
                              {locked && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <svg
                                    className="w-5 h-5 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            {gradeInfo ? (
                              <span
                                className={`text-lg font-bold ${gradeInfo.color}`}
                              >
                                {gradeInfo.grade}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="p-4">
                            {marks[s.studentRoll] !== "" ? (
                              Number(marks[s.studentRoll]) >= PASS_MARK ? (
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                                  Passed
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full font-medium">
                                  Failed
                                </span>
                              )
                            ) : (
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
                                Not Entered
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            {locked && (
                              <button
                                onClick={() => setLocked(false)}
                                className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                                Edit
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Summary Stats */}
        {selectedSubject && !loading && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Students</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {students.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Marks Entered</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {Object.values(marks).filter((m) => m !== "").length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Average Marks</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {(() => {
                      const enteredMarks = Object.values(marks)
                        .filter((m) => m !== "")
                        .map(Number);
                      return enteredMarks.length > 0
                        ? (
                            enteredMarks.reduce((a, b) => a + b, 0) /
                            enteredMarks.length
                          ).toFixed(1)
                        : "0.0";
                    })()}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <svg
                    className="w-8 h-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Status</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {locked ? "Locked" : "Open"}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl ${
                    locked ? "bg-red-100" : "bg-green-100"
                  }`}
                >
                  <svg
                    className={`w-8 h-8 ${
                      locked ? "text-red-600" : "text-green-600"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {locked ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                      />
                    )}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marksheet;
