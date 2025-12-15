import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSubjects,
  addSubject,
  deleteSubject,
  updateSubject,
} from "../redux/subjectSlice";
import SubjectModal from "../components/SubjectModal";
import { useParams } from "react-router-dom";

const Subjects = () => {
  const dispatch = useDispatch();
  const subjects = useSelector((state) => state.subjects.list);

  const [classes, setClasses] = useState([]);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    subjectName: "",
    subjectClasses: [],
    subjectType: "",
  });
  const { sessionName } = useParams();
  // Load classes
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/classes`)
      .then((res) => res.json())
      .then((data) => setClasses(data));
  }, []);

  // Load subjects
  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);

  const handleAdd = () => {
    setFormData({
      subjectName: "",
      subjectClasses: [],
      subjectType: "",
    });
    setOpen(true);
  };

  const handleSubmit = () => {
    dispatch(addSubject(formData));
    setOpen(false);
  };

  // Group subjects class-wise
  const getSubjectsByClass = (className) => {
    return subjects.filter((s) => s.subjectClass === className);
  };

  return (
    <div className="mx-auto p-6 bg-white shadow rounded-lg mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Subjects</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          Add Subject
        </button>
      </div>

      {classes
        .filter((cls) => cls.sessionName === sessionName)
        .map((cls) => {
          const list = getSubjectsByClass(cls.className);
          return (
            <div key={cls._id} className="mb-8">
              <h3 className="text-xl font-semibold mb-2">
                Class: {cls.className}
              </h3>

              {list.length === 0 ? (
                <p className="text-gray-500 italic">
                  No subjects for this class
                </p>
              ) : (
                <table className="w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Subject</th>
                      <th className="border p-2">Type</th>
                      <th className="border p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((s) => (
                      <tr key={s._id}>
                        <td className="border p-2">{s.subjectName}</td>
                        <td className="border p-2">{s.subjectType}</td>
                        <td className="border p-2 text-center">
                          <button
                            onClick={() => dispatch(deleteSubject(s._id))}
                            className="px-3 py-1 bg-red-500 text-white rounded"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}

      <SubjectModal
        open={open}
        onClose={() => setOpen(false)}
        formData={formData}
        setFormData={setFormData}
        classes={classes}
        onSubmit={handleSubmit}
        sessionName={sessionName}
      />
    </div>
  );
};

export default Subjects;
