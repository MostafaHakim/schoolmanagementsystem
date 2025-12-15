import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents } from "../redux/studentsSlice";
import { useReactToPrint } from "react-to-print";
import StudentAdmitCard from "../components/StudentAdmitCard";

const StudentAdmitPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const printRef = useRef();

  const { students } = useSelector((state) => state.students);

  useEffect(() => {
    if (students.length === 0) {
      dispatch(fetchStudents());
    }
  }, [dispatch, students.length]);

  const student = students.find((s) => s._id === id);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Admit-${student?.studentRoll}`,
  });

  if (!student) {
    return <p className="text-center mt-20">Loading Admit Card...</p>;
  }

  return (
    <div>
      {/* 🔹 Print Button */}
      <div className="flex justify-end p-4 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Download / Print Admit
        </button>
      </div>

      {/* 🔹 Admit Card */}
      <div ref={printRef}>
        <StudentAdmitCard student={student} />
      </div>
    </div>
  );
};

export default StudentAdmitPage;
