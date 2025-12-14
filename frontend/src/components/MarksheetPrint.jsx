// src/components/MarksheetPrint.jsx
import React from "react";

const MarksheetPrint = ({ student, examName, className }) => {
  const getGrade = (marks) => {
    const numMarks = Number(marks) || 0;
    if (numMarks >= 80) return "A+";
    if (numMarks >= 70) return "A";
    if (numMarks >= 60) return "A-";
    if (numMarks >= 50) return "B";
    if (numMarks >= 40) return "C";
    if (numMarks >= 33) return "D";
    return "F";
  };

  const status = (marks) => {
    const numMarks = Number(marks) || 0;
    return numMarks >= 33 ? "Passed" : "Failed";
  };

  const getStatusColor = (marks) => {
    const numMarks = Number(marks) || 0;
    return numMarks >= 33 ? "text-green-700" : "text-red-700";
  };

  // Print date
  const printDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="p-8 bg-white"
      style={{ width: "210mm", minHeight: "297mm", margin: "0 auto" }}
    >
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-gray-800 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          OFFICIAL MARKSHEET
        </h1>
        <h2 className="text-xl font-semibold text-gray-700">
          Bangladesh Education Board
        </h2>
        <p className="text-gray-600 mt-1">Academic Year 2024-2025</p>
      </div>

      {/* Student Information */}
      <div className="mb-8">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-700">
              <strong>Student Name:</strong> {student.studentName}
            </p>
            <p className="text-gray-700">
              <strong>Roll Number:</strong> {student.studentRoll}
            </p>
            <p className="text-gray-700">
              <strong>Student ID:</strong> {student._id}
            </p>
          </div>
          <div>
            <p className="text-gray-700">
              <strong>Class:</strong> {className}
            </p>
            <p className="text-gray-700">
              <strong>Exam:</strong> {examName}
            </p>
            <p className="text-gray-700">
              <strong>Date:</strong> {printDate}
            </p>
          </div>
        </div>
      </div>

      {/* Marks Table */}
      <div className="mb-8">
        <table className="w-full border-collapse border border-gray-800">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-800 p-3 text-left">
                Subject/Details
              </th>
              <th className="border border-gray-800 p-3 text-center">
                Total Marks
              </th>
              <th className="border border-gray-800 p-3 text-center">
                Pass Marks
              </th>
              <th className="border border-gray-800 p-3 text-center">
                Obtained Marks
              </th>
              <th className="border border-gray-800 p-3 text-center">Grade</th>
              <th className="border border-gray-800 p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-800 p-3 font-medium">
                Overall Result
              </td>
              <td className="border border-gray-800 p-3 text-center font-bold">
                100
              </td>
              <td className="border border-gray-800 p-3 text-center font-bold">
                33
              </td>
              <td className="border border-gray-800 p-3 text-center font-bold text-lg">
                {student.gotMarks || "N/A"}
              </td>
              <td className="border border-gray-800 p-3 text-center font-bold text-lg">
                {student.gotMarks ? getGrade(student.gotMarks) : "N/A"}
              </td>
              <td
                className={`border border-gray-800 p-3 text-center font-bold text-lg ${getStatusColor(
                  student.gotMarks
                )}`}
              >
                {student.gotMarks ? status(student.gotMarks) : "N/A"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Grading System */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-2 text-gray-800">Grading System</h3>
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-400 p-2">Marks Range</th>
              <th className="border border-gray-400 p-2">Grade</th>
              <th className="border border-gray-400 p-2">Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 p-2">80-100</td>
              <td className="border border-gray-400 p-2">A+</td>
              <td className="border border-gray-400 p-2">Outstanding</td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-2">70-79</td>
              <td className="border border-gray-400 p-2">A</td>
              <td className="border border-gray-400 p-2">Excellent</td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-2">60-69</td>
              <td className="border border-gray-400 p-2">A-</td>
              <td className="border border-gray-400 p-2">Very Good</td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-2">50-59</td>
              <td className="border border-gray-400 p-2">B</td>
              <td className="border border-gray-400 p-2">Good</td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-2">40-49</td>
              <td className="border border-gray-400 p-2">C</td>
              <td className="border border-gray-400 p-2">Satisfactory</td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-2">33-39</td>
              <td className="border border-gray-400 p-2">D</td>
              <td className="border border-gray-400 p-2">Pass</td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-2">0-32</td>
              <td className="border border-gray-400 p-2">F</td>
              <td className="border border-gray-400 p-2">Fail</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer with Signatures */}
      <div className="mt-12">
        <div className="flex justify-between">
          <div className="text-center">
            <div className="border-t border-gray-800 pt-2 mt-12 w-48">
              <p className="font-semibold">Class Teacher</p>
              <p className="text-sm text-gray-600">Signature & Seal</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-gray-800 pt-2 mt-12 w-48">
              <p className="font-semibold">Principal</p>
              <p className="text-sm text-gray-600">Signature & Seal</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 pt-4 border-t border-gray-300">
          <p className="text-sm text-gray-600">
            This is a computer generated marksheet. No signature required for
            digital copies.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Generated on: {printDate} | © {new Date().getFullYear()} School
            Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarksheetPrint;
