// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchStudents,
//   addStudent,
//   updateStudent,
//   deleteStudent,
// } from "../redux/studentsSlice";
// import { useParams } from "react-router-dom";

// const Students = () => {
//   const dispatch = useDispatch();
//   const { students, loading } = useSelector((state) => state.students);
//   const { sessionName } = useParams();

//   const [classes, setClasses] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingStudent, setEditingStudent] = useState(null);
//   const [formData, setFormData] = useState({
//     studentName: "",
//     studentClass: "",
//     studentSessions: sessionName,
//     studentGroup: "general",
//   });

//   useEffect(() => {
//     dispatch(fetchStudents());
//   }, [dispatch]);

//   useEffect(() => {
//     fetchClass();
//   }, []);

//   const fetchClass = async () => {
//     const res = await fetch(`${import.meta.env.VITE_BASE_URL}/classes`);
//     const data = await res.json();
//     setClasses(data);
//   };

//   // Open modal for add or edit
//   const openModal = (student = null) => {
//     if (student) {
//       setEditingStudent(student);
//       setFormData({
//         studentName: student.studentName,
//         studentClass: student.studentClass,
//         studentGroup: student.studentGroup || "general",
//         studentSessions: student.studentSessions || sessionName,
//       });
//     } else {
//       setEditingStudent(null);
//       setFormData({
//         studentName: "",
//         studentClass: "",
//         studentSessions: sessionName,
//         studentGroup: "general",
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
//         .then(() => dispatch(fetchStudents())); // reload
//     } else {
//       dispatch(addStudent(formData))
//         .unwrap()
//         .then(() => dispatch(fetchStudents())); // reload
//     }
//     setModalOpen(false);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this student?")) {
//       dispatch(deleteStudent(id));
//     }
//   };

//   // Filter students by session
//   const filteredStudents = students.filter(
//     (s) => s.studentSessions === sessionName
//   );

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h2 className="text-3xl font-bold mb-6">Students</h2>
//       <button
//         onClick={() => openModal()}
//         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
//       >
//         Add Student
//       </button>

//       {loading ? (
//         <p className="text-center text-gray-500">Loading students...</p>
//       ) : filteredStudents.length === 0 ? (
//         <p className="text-center text-gray-500 italic">No students found.</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full border rounded">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="border px-4 py-2">Roll</th>
//                 <th className="border px-4 py-2">Name</th>
//                 <th className="border px-4 py-2">Class</th>
//                 <th className="border px-4 py-2">Group</th>
//                 <th className="border px-4 py-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredStudents.map((student) => (
//                 <tr key={student._id}>
//                   <td className="border px-4 py-2">{student.studentRoll}</td>
//                   <td className="border px-4 py-2">{student.studentName}</td>
//                   <td className="border px-4 py-2">{student.studentClass}</td>
//                   <td className="border px-4 py-2">{student.studentGroup}</td>
//                   <td className="border px-4 py-2 flex gap-2">
//                     <button
//                       className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
//                       onClick={() => openModal(student)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
//                       onClick={() => handleDelete(student._id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modal */}
//       {modalOpen && (
//         <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
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
//                 <option>--Select Class--</option>
//                 {classes.map((cls) => (
//                   <option key={cls._id}>{cls.className}</option>
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
import { useParams } from "react-router-dom";

const Students = () => {
  const dispatch = useDispatch();
  const { students, loading } = useSelector((state) => state.students);
  const { sessionName } = useParams();

  const [classes, setClasses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

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
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/classes`);
    const data = await res.json();
    setClasses(data);
  };

  // 🔹 Open modal
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
        studentClass: "",
        studentSessions: sessionName,
        studentGroup: "General",
      });
    }
    setModalOpen(true);
  };

  // 🔹 Handle input change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // 🔹 Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingStudent) {
      dispatch(updateStudent({ id: editingStudent._id, student: formData }))
        .unwrap()
        .then(() => dispatch(fetchStudents()));
    } else {
      dispatch(addStudent(formData))
        .unwrap()
        .then(() => dispatch(fetchStudents()));
    }

    setModalOpen(false);
  };

  // 🔹 Delete student
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      dispatch(deleteStudent(id)).then(() => dispatch(fetchStudents()));
    }
  };

  // 🔹 Filter by session
  const filteredStudents = students.filter(
    (s) => s.studentSessions === sessionName
  );

  // 🔹 Group by class
  const studentsByClass = filteredStudents.reduce((acc, student) => {
    if (!acc[student.studentClass]) {
      acc[student.studentClass] = [];
    }
    acc[student.studentClass].push(student);
    return acc;
  }, {});

  return (
    <div className="p-6  mx-auto">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-3xl font-bold mb-6">
          Students — Session {sessionName}
        </h2>

        <button
          onClick={() => openModal()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-6"
        >
          Add Student
        </button>
      </div>

      {/* 🔹 Class wise tables */}
      {loading ? (
        <p className="text-center text-gray-500">Loading students...</p>
      ) : Object.keys(studentsByClass).length === 0 ? (
        <p className="text-center text-gray-500 italic">No students found.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(studentsByClass).map(([className, classStudents]) => (
            <div key={className} className="mb-10 col-span-1">
              <h3 className="text-xl font-bold mb-3 text-blue-600">
                Class: {className}
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full border rounded">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2">Roll</th>
                      <th className="border px-4 py-2">Name</th>
                      <th className="border px-4 py-2">Group</th>
                      <th className="border px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classStudents
                      .sort((a, b) => a.studentRoll - b.studentRoll)
                      .map((student) => (
                        <tr key={student._id}>
                          <td className="border px-4 py-2">
                            {student.studentRoll}
                          </td>
                          <td className="border px-4 py-2">
                            {student.studentName}
                          </td>
                          <td className="border px-4 py-2">
                            {student.studentGroup}
                          </td>
                          <td className="border px-4 py-2">
                            <div className="flex gap-2">
                              <button
                                className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                                onClick={() => openModal(student)}
                              >
                                Edit
                              </button>
                              <button
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                onClick={() => handleDelete(student._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editingStudent ? "Edit Student" : "Add Student"}
            </h3>

            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <input
                type="text"
                name="studentName"
                placeholder="Student Name"
                value={formData.studentName}
                onChange={handleChange}
                required
                className="border px-3 py-2 rounded"
              />

              <select
                name="studentClass"
                value={formData.studentClass}
                onChange={handleChange}
                required
                className="border px-3 py-2 rounded"
              >
                <option value="">--Select Class--</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls.className}>
                    {cls.className}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="studentGroup"
                placeholder="Group"
                value={formData.studentGroup}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded border"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  {editingStudent ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
