// // import React, { useEffect, useState } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import {
// //   fetchStudents,
// //   addStudent,
// //   updateStudent,
// //   deleteStudent,
// // } from "../redux/studentsSlice";
// // import { useParams } from "react-router-dom";

// // const Students = () => {
// //   const dispatch = useDispatch();
// //   const { students, loading } = useSelector((state) => state.students);
// //   const { sessionName } = useParams();

// //   const [classes, setClasses] = useState([]);
// //   const [modalOpen, setModalOpen] = useState(false);
// //   const [editingStudent, setEditingStudent] = useState(null);

// //   const [formData, setFormData] = useState({
// //     studentName: "",
// //     studentClass: "",
// //     studentSessions: sessionName,
// //     studentGroup: "General",
// //   });

// //   // 🔹 Load students
// //   useEffect(() => {
// //     dispatch(fetchStudents());
// //   }, [dispatch]);

// //   // 🔹 Load classes
// //   useEffect(() => {
// //     fetchClass();
// //   }, []);

// //   const fetchClass = async () => {
// //     const res = await fetch(`${import.meta.env.VITE_BASE_URL}/classes`);
// //     const data = await res.json();
// //     setClasses(data);
// //   };

// //   // 🔹 Open modal
// //   const openModal = (student = null) => {
// //     if (student) {
// //       setEditingStudent(student);
// //       setFormData({
// //         studentName: student.studentName,
// //         studentClass: student.studentClass,
// //         studentGroup: student.studentGroup || "General",
// //         studentSessions: student.studentSessions || sessionName,
// //       });
// //     } else {
// //       setEditingStudent(null);
// //       setFormData({
// //         studentName: "",
// //         studentClass: "",
// //         studentSessions: sessionName,
// //         studentGroup: "General",
// //       });
// //     }
// //     setModalOpen(true);
// //   };

// //   // 🔹 Handle input change
// //   const handleChange = (e) =>
// //     setFormData({ ...formData, [e.target.name]: e.target.value });

// //   // 🔹 Submit form
// //   const handleSubmit = (e) => {
// //     e.preventDefault();

// //     if (editingStudent) {
// //       dispatch(updateStudent({ id: editingStudent._id, student: formData }))
// //         .unwrap()
// //         .then(() => dispatch(fetchStudents()));
// //     } else {
// //       dispatch(addStudent(formData))
// //         .unwrap()
// //         .then(() => dispatch(fetchStudents()));
// //     }

// //     setModalOpen(false);
// //   };

// //   // 🔹 Delete student
// //   const handleDelete = (id) => {
// //     if (window.confirm("Are you sure you want to delete this student?")) {
// //       dispatch(deleteStudent(id)).then(() => dispatch(fetchStudents()));
// //     }
// //   };

// //   // 🔹 Filter by session
// //   const filteredStudents = students.filter(
// //     (s) => s.studentSessions === sessionName
// //   );

// //   // 🔹 Group by class
// //   const studentsByClass = filteredStudents.reduce((acc, student) => {
// //     if (!acc[student.studentClass]) {
// //       acc[student.studentClass] = [];
// //     }
// //     acc[student.studentClass].push(student);
// //     return acc;
// //   }, {});

// //   return (
// //     <div className="p-6  mx-auto">
// //       <div className="flex flex-row items-center justify-between">
// //         <h2 className="text-3xl font-bold mb-6">
// //           Students — Session {sessionName}
// //         </h2>

// //         <button
// //           onClick={() => openModal()}
// //           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-6"
// //         >
// //           Add Student
// //         </button>
// //       </div>

// //       {/* 🔹 Class wise tables */}
// //       {loading ? (
// //         <p className="text-center text-gray-500">Loading students...</p>
// //       ) : Object.keys(studentsByClass).length === 0 ? (
// //         <p className="text-center text-gray-500 italic">No students found.</p>
// //       ) : (
// //         <div className="grid grid-cols-3 gap-4">
// //           {Object.entries(studentsByClass).map(([className, classStudents]) => (
// //             <div key={className} className="mb-10 col-span-1">
// //               <h3 className="text-xl font-bold mb-3 text-blue-600">
// //                 Class: {className}
// //               </h3>

// //               <div className="overflow-x-auto">
// //                 <table className="w-full border rounded">
// //                   <thead className="bg-gray-100">
// //                     <tr>
// //                       <th className="border px-4 py-2">Roll</th>
// //                       <th className="border px-4 py-2">Name</th>
// //                       <th className="border px-4 py-2">Group</th>
// //                       <th className="border px-4 py-2">Actions</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {classStudents
// //                       .sort((a, b) => a.studentRoll - b.studentRoll)
// //                       .map((student) => (
// //                         <tr key={student._id}>
// //                           <td className="border px-4 py-2">
// //                             {student.studentRoll}
// //                           </td>
// //                           <td className="border px-4 py-2">
// //                             {student.studentName}
// //                           </td>
// //                           <td className="border px-4 py-2">
// //                             {student.studentGroup}
// //                           </td>
// //                           <td className="border px-4 py-2">
// //                             <div className="flex gap-2">
// //                               <button
// //                                 className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
// //                                 onClick={() => openModal(student)}
// //                               >
// //                                 Edit
// //                               </button>
// //                               <button
// //                                 className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
// //                                 onClick={() => handleDelete(student._id)}
// //                               >
// //                                 Delete
// //                               </button>
// //                             </div>
// //                           </td>
// //                         </tr>
// //                       ))}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       )}

// //       {/* 🔹 Modal */}
// //       {modalOpen && (
// //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
// //           <div className="bg-white rounded-lg p-6 w-full max-w-md">
// //             <h3 className="text-xl font-bold mb-4">
// //               {editingStudent ? "Edit Student" : "Add Student"}
// //             </h3>

// //             <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
// //               <input
// //                 type="text"
// //                 name="studentName"
// //                 placeholder="Student Name"
// //                 value={formData.studentName}
// //                 onChange={handleChange}
// //                 required
// //                 className="border px-3 py-2 rounded"
// //               />

// //               <select
// //                 name="studentClass"
// //                 value={formData.studentClass}
// //                 onChange={handleChange}
// //                 required
// //                 className="border px-3 py-2 rounded"
// //               >
// //                 <option value="">--Select Class--</option>
// //                 {classes.map((cls) => (
// //                   <option key={cls._id} value={cls.className}>
// //                     {cls.className}
// //                   </option>
// //                 ))}
// //               </select>

// //               <input
// //                 type="text"
// //                 name="studentGroup"
// //                 placeholder="Group"
// //                 value={formData.studentGroup}
// //                 onChange={handleChange}
// //                 className="border px-3 py-2 rounded"
// //               />

// //               <div className="flex justify-end gap-2 mt-4">
// //                 <button
// //                   type="button"
// //                   className="px-4 py-2 rounded border"
// //                   onClick={() => setModalOpen(false)}
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
// //                 >
// //                   {editingStudent ? "Update" : "Add"}
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Students;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchStudents,
//   addStudent,
//   updateStudent,
//   deleteStudent,
// } from "../redux/studentsSlice";
// import { useParams, useNavigate } from "react-router-dom";

// const Students = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { students, loading } = useSelector((state) => state.students);
//   const { sessionName } = useParams();

//   const [classes, setClasses] = useState([]);
//   const [activeClass, setActiveClass] = useState(null);

//   // Modal state
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingStudent, setEditingStudent] = useState(null);
//   const [formData, setFormData] = useState({
//     studentName: "",
//     studentClass: "",
//     studentSessions: sessionName,
//     studentGroup: "General",
//   });

//   // 🔹 Load students
//   useEffect(() => {
//     dispatch(fetchStudents());
//   }, [dispatch]);

//   // 🔹 Load classes
//   useEffect(() => {
//     fetchClass();
//   }, []);

//   const fetchClass = async () => {
//     const res = await fetch(`${import.meta.env.VITE_BASE_URL}/classes`);
//     const data = await res.json();
//     setClasses(data);
//     if (data.length > 0) setActiveClass(data[0].className);
//   };

//   // 🔹 Filter students by session
//   const filteredStudents = students.filter(
//     (s) => s.studentSessions === sessionName
//   );

//   // 🔹 Students by class
//   const studentsByClass = filteredStudents.reduce((acc, student) => {
//     if (!acc[student.studentClass]) acc[student.studentClass] = [];
//     acc[student.studentClass].push(student);
//     return acc;
//   }, {});

//   // 🔹 Modal handlers
//   const openModal = (student = null) => {
//     if (student) {
//       setEditingStudent(student);
//       setFormData({
//         studentName: student.studentName,
//         studentClass: student.studentClass,
//         studentGroup: student.studentGroup || "General",
//         studentSessions: student.studentSessions || sessionName,
//       });
//     } else {
//       setEditingStudent(null);
//       setFormData({
//         studentName: "",
//         studentClass: activeClass || "",
//         studentSessions: sessionName,
//         studentGroup: "General",
//       });
//     }
//     setModalOpen(true);
//   };

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (editingStudent) {
//       dispatch(updateStudent({ id: editingStudent._id, student: formData }))
//         .unwrap()
//         .then(() => dispatch(fetchStudents()));
//     } else {
//       dispatch(addStudent(formData))
//         .unwrap()
//         .then(() => dispatch(fetchStudents()));
//     }
//     setModalOpen(false);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this student?")) {
//       dispatch(deleteStudent(id)).then(() => dispatch(fetchStudents()));
//     }
//   };

//   return (
//     <div className="p-6 mx-auto max-w-5xl">
//       <h2 className="text-3xl font-bold mb-6">
//         Students — Session {sessionName}
//       </h2>

//       {/* 🔹 Class Tabs + Add Student */}
//       <div className="flex items-center gap-2 overflow-x-auto mb-6">
//         {classes.map((cls) => (
//           <button
//             key={cls._id}
//             className={`px-4 py-2 rounded border ${
//               activeClass === cls.className
//                 ? "bg-blue-500 text-white"
//                 : "bg-white text-gray-700"
//             }`}
//             onClick={() => setActiveClass(cls.className)}
//           >
//             {cls.className}
//           </button>
//         ))}

//         <button
//           onClick={() => openModal()}
//           className="ml-auto bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//         >
//           Add Student
//         </button>
//       </div>

//       {/* 🔹 Students Table */}
//       {loading ? (
//         <p className="text-center text-gray-500">Loading students...</p>
//       ) : !activeClass || !studentsByClass[activeClass] ? (
//         <p className="text-center text-gray-500 italic">No students found.</p>
//       ) : (
//         <div className="overflow-x-auto border rounded">
//           <table className="w-full border-collapse">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="border px-4 py-2">Roll</th>
//                 <th className="border px-4 py-2">Name</th>
//                 <th className="border px-4 py-2">Group</th>
//                 <th className="border px-4 py-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {studentsByClass[activeClass]
//                 .sort((a, b) => a.studentRoll - b.studentRoll)
//                 .map((student) => (
//                   <tr
//                     key={student._id}
//                     className="cursor-pointer hover:bg-gray-100"
//                   >
//                     <td className="border px-4 py-2">{student.studentRoll}</td>
//                     <td
//                       className="border px-4 py-2 text-blue-600 underline"
//                       onClick={() =>
//                         navigate(`/students/profile/${student._id}`)
//                       }
//                     >
//                       {student.studentName}
//                     </td>
//                     <td className="border px-4 py-2">{student.studentGroup}</td>
//                     <td className="border px-4 py-2">
//                       <div className="flex gap-2">
//                         <button
//                           className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
//                           onClick={() => openModal(student)}
//                         >
//                           Edit
//                         </button>
//                         <button
//                           className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
//                           onClick={() => handleDelete(student._id)}
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* 🔹 Modal */}
//       {modalOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h3 className="text-xl font-bold mb-4">
//               {editingStudent ? "Edit Student" : "Add Student"}
//             </h3>

//             <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
//               <input
//                 type="text"
//                 name="studentName"
//                 placeholder="Student Name"
//                 value={formData.studentName}
//                 onChange={handleChange}
//                 required
//                 className="border px-3 py-2 rounded"
//               />

//               <select
//                 name="studentClass"
//                 value={formData.studentClass}
//                 onChange={handleChange}
//                 required
//                 className="border px-3 py-2 rounded"
//               >
//                 <option value="">--Select Class--</option>
//                 {classes.map((cls) => (
//                   <option key={cls._id} value={cls.className}>
//                     {cls.className}
//                   </option>
//                 ))}
//               </select>

//               <input
//                 type="text"
//                 name="studentGroup"
//                 placeholder="Group"
//                 value={formData.studentGroup}
//                 onChange={handleChange}
//                 className="border px-3 py-2 rounded"
//               />

//               <div className="flex justify-end gap-2 mt-4">
//                 <button
//                   type="button"
//                   className="px-4 py-2 rounded border"
//                   onClick={() => setModalOpen(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
//                 >
//                   {editingStudent ? "Update" : "Add"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Students;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} from "../redux/studentsSlice";
import { useParams, useNavigate } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  User,
  Users,
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  Download,
  Eye,
  BookOpen,
  GraduationCap,
  Calendar,
  MoreVertical,
  UserPlus,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const Students = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { students, loading } = useSelector((state) => state.students);
  const { sessionName } = useParams();

  const [classes, setClasses] = useState([]);
  const [activeClass, setActiveClass] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 8;

  const [formData, setFormData] = useState({
    studentName: "",
    studentClass: "",
    studentSessions: sessionName,
    studentGroup: "General",
  });

  // 🔹 Load students
  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  // 🔹 Load classes
  useEffect(() => {
    fetchClass();
  }, []);

  const fetchClass = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/classes`);
      const data = await res.json();
      setClasses(data);
      if (data.length > 0) setActiveClass(data[0].className);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    }
  };

  // 🔹 Filter students by session and search
  const filteredStudents = students
    .filter((s) => s.studentSessions === sessionName)
    .filter((student) => {
      const matchesSearch =
        student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentRoll.toString().includes(searchTerm) ||
        student.studentGroup.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass =
        activeClass === "all" || student.studentClass === activeClass;
      return matchesSearch && matchesClass;
    });

  // 🔹 Pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // 🔹 Statistics
  const totalStudents = filteredStudents.length;
  const byClassCount = filteredStudents.reduce((acc, student) => {
    acc[student.studentClass] = (acc[student.studentClass] || 0) + 1;
    return acc;
  }, {});

  // 🔹 Modal handlers
  const openModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        studentName: student.studentName,
        studentClass: student.studentClass,
        studentGroup: student.studentGroup || "General",
        studentSessions: student.studentSessions || sessionName,
      });
    } else {
      setEditingStudent(null);
      setFormData({
        studentName: "",
        studentClass: activeClass !== "all" ? activeClass : "",
        studentSessions: sessionName,
        studentGroup: "General",
      });
    }
    setModalOpen(true);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStudent) {
      dispatch(updateStudent({ id: editingStudent._id, student: formData }))
        .unwrap()
        .then(() => {
          dispatch(fetchStudents());
          setModalOpen(false);
        });
    } else {
      dispatch(addStudent(formData))
        .unwrap()
        .then(() => {
          dispatch(fetchStudents());
          setModalOpen(false);
        });
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteStudent(id))
      .unwrap()
      .then(() => {
        dispatch(fetchStudents());
        setShowDeleteConfirm(null);
      });
  };

  // 🔹 Export students
  const handleExport = () => {
    const data = filteredStudents.map((student) => ({
      Roll: student.studentRoll,
      Name: student.studentName,
      Class: student.studentClass,
      Group: student.studentGroup,
      Session: student.studentSessions,
    }));

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        Object.keys(data[0]).join(","),
        ...data.map((row) => Object.values(row).join(",")),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `students_${sessionName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Student Management
              </h1>
              <div className="flex items-center gap-2 mt-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Session: {sessionName}</span>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <Users className="w-4 h-4" />
                <span>{totalStudents} Students</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => dispatch(fetchStudents())}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => openModal()}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Student</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Students</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {totalStudents}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Classes</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {Object.keys(byClassCount).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Session</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {sessionName}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Groups</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {new Set(filteredStudents.map((s) => s.studentGroup)).size}
                  </p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students by name, roll, or group..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Class Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  activeClass === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveClass("all")}
              >
                All Classes
              </button>
              {classes.map((cls) => (
                <button
                  key={cls._id}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    activeClass === cls.className
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveClass(cls.className)}
                >
                  {cls.className}
                  <span className="ml-2 text-xs bg-gray-200 px-1.5 py-0.5 rounded">
                    {byClassCount[cls.className] || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Students List
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Filter className="w-4 h-4" />
                <span>
                  Showing {indexOfFirstStudent + 1}-
                  {Math.min(indexOfLastStudent, filteredStudents.length)} of{" "}
                  {filteredStudents.length} students
                </span>
              </div>
            </div>
          </div>

          {/* Table Content */}
          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading students...</p>
            </div>
          ) : currentStudents.length === 0 ? (
            <div className="py-12 text-center">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No Students Found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                {searchTerm
                  ? `No students match "${searchTerm}"`
                  : `No students found for ${
                      activeClass === "all" ? "this session" : activeClass
                    }`}
              </p>
              <button
                onClick={() => openModal()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Plus className="w-4 h-4" />
                Add First Student
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Roll No
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Class
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Group
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentStudents.map((student) => (
                      <tr
                        key={student._id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() =>
                          navigate(`/students/profile/${student._id}`)
                        }
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-blue-700 font-bold text-sm">
                                #{student.studentRoll}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mr-3">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {student.studentName}
                              </p>
                              <p className="text-sm text-gray-500">
                                Session: {student.studentSessions}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                            {student.studentClass}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              student.studentGroup === "Science"
                                ? "bg-purple-100 text-purple-800"
                                : student.studentGroup === "Commerce"
                                ? "bg-green-100 text-green-800"
                                : student.studentGroup === "Arts"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {student.studentGroup}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div
                            className="flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() =>
                                navigate(`/students/profile/${student._id}`)
                              }
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="View Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openModal(student)}
                              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(student._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-10 h-10 rounded-lg ${
                                currentPage === pageNum
                                  ? "bg-blue-600 text-white"
                                  : "border border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add/Edit Student Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md animate-fadeIn">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {editingStudent ? "Edit Student" : "Add New Student"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {editingStudent
                      ? "Update student information"
                      : "Enter student details"}
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <span className="text-2xl text-gray-500">&times;</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Name
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class
                  </label>
                  <select
                    name="studentClass"
                    value={formData.studentClass}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls.className}>
                        {cls.className}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group
                  </label>
                  <input
                    type="text"
                    name="studentGroup"
                    value={formData.studentGroup}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="General, Science, Commerce, Arts"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition"
                  >
                    {editingStudent ? "Update Student" : "Add Student"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md animate-fadeIn">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Delete Student
                </h3>
                <p className="text-gray-600">
                  Are you sure you want to delete this student? This action
                  cannot be undone.
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
