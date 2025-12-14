import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { fetchSubjects, deleteSubject } from "../redux/subjectSlice";

const SubjectTable = () => {
  const dispatch = useDispatch();
  const { className } = useParams();

  const subjects = useSelector((state) => state.subjects.list);
  const loading = useSelector((state) => state.subjects.loading);

  // Load subjects
  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);

  // Filter subjects by class
  const filteredSubjects = subjects.filter((s) => s.subjectClass === className);

  if (loading) {
    return <p className="text-center py-5">Loading subjects...</p>;
  }

  return (
    <table className="w-full border text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="border p-2">Subject Name</th>
          <th className="border p-2">Action</th>
        </tr>
      </thead>

      <tbody>
        {filteredSubjects.length === 0 ? (
          <tr>
            <td colSpan="4" className="text-center p-4 text-gray-500">
              No subjects found for this class
            </td>
          </tr>
        ) : (
          filteredSubjects.map((subject) => (
            <tr key={subject._id} className="hover:bg-gray-50">
              <td className="border p-2">{subject.subjectName}</td>
              <td className="border p-2">
                <button
                  onClick={() => dispatch(deleteSubject(subject._id))}
                  className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default SubjectTable;
