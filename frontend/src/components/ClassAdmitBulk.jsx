import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import StudentAdmitCard from "./StudentAdmitCard";

const ClassAdmitBulk = ({
  students,
  selectedClass,
  selectedExam,
  sessionName,
  settings,
  user,
}) => {
  // ❗ Safety guard
  if (!students || students.length === 0) return null;

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  return (
    <div>
      {/* 🔹 Print Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handlePrint}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
        >
          Download Whole Class Admit
        </button>
      </div>

      {/* 🔹 Printable Content */}
      <div
        ref={componentRef}
        className="print:grid print:grid-rows-2 print:gap-0"
      >
        {students
          .slice()
          .sort((a, b) => a.studentRoll - b.studentRoll)
          .map((student) => (
            <div key={student._id} className="admit-card-wrapper">
              <StudentAdmitCard
                student={student}
                selectedClass={selectedClass}
                selectedExam={selectedExam}
                sessionName={sessionName}
                settings={settings}
                user={user}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ClassAdmitBulk;
