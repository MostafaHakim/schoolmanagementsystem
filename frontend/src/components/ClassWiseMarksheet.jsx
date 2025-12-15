// src/components/ClassWiseMarksheet.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ClassWiseMarksheet = () => {
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);
  const { sessionName } = useParams();
  // সব এক্সাম fetch
  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/exams?sessionName=${sessionName}`)
      .then((res) => res.json())
      .then((data) => {
        setExams(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load exams");
        setLoading(false);
      });
  }, []);

  // ক্লাস fetch
  useEffect(() => {
    fetch(`${BASE_URL}/classes/${sessionName}`)
      .then((res) => res.json())
      .then((data) => {
        setClasses(data);
      })
      .catch((err) => {
        console.error("Failed to load classes");
      });
  }, []);

  // ক্লাস সিলেক্ট করলে ছাত্র fetch
  useEffect(() => {
    if (!selectedClass) {
      setStudents([]);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`${BASE_URL}/students/${selectedClass}?sessionName=${sessionName}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Students data:", data);
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(`Failed to load students: ${err.message}`);
        setStudents([]);
        setLoading(false);
      });
  }, [selectedClass]);

  // ছাত্রের ডিটেইলস পাওয়ার ফাংশন
  const getStudentExamDetails = (student) => {
    if (!selectedExam || !student || !student.studentExams) return null;

    // সিলেক্টেড এক্সাম খুঁজে বের করুন
    const exam = student.studentExams.find(
      (exam) => exam.examName === selectedExam
    );

    if (!exam) {
      console.log(
        `No exam data found for ${selectedExam} in student ${student.studentName}`
      );
      return null;
    }

    return exam;
  };

  // একটি সাবজেক্টের মার্ক এবং গ্রেড ক্যালকুলেশন
  const getSubjectMarksAndGrade = (subject) => {
    const gotMarks = subject.marks?.gotMarks || 0;
    const passMark = subject.marks?.passMark || 33;
    const totalMark = 100; // আপনি চাইলে পরিবর্তন করতে পারেন

    const getGrade = (marks) => {
      if (marks >= 80) return "A+";
      if (marks >= 70) return "A";
      if (marks >= 60) return "A-";
      if (marks >= 50) return "B";
      if (marks >= 40) return "C";
      if (marks >= 33) return "D";
      return "F";
    };

    const status = gotMarks >= passMark ? "Passed" : "Failed";

    return {
      subjectName: subject.subjectName,
      totalMark,
      passMark,
      gotMarks,
      grade: getGrade(gotMarks),
      status,
      percentage: ((gotMarks / totalMark) * 100).toFixed(1),
    };
  };

  // একটি ছাত্রের জন্য প্রিন্ট মার্কশিট
  const handlePrintStudent = (student) => {
    const examDetails = getStudentExamDetails(student);

    if (!examDetails) {
      alert(`No exam data found for ${student.studentName} in ${selectedExam}`);
      return;
    }

    // সব সাবজেক্টের তথ্য সংগ্রহ
    const allSubjects = examDetails.subjects.map((subject) =>
      getSubjectMarksAndGrade(subject)
    );

    // টোটাল মার্ক ক্যালকুলেশন
    const totalMarks = allSubjects.reduce(
      (sum, sub) => sum + (sub.gotMarks || 0),
      0
    );
    const totalPossible = allSubjects.length * 100;
    const overallPercentage = ((totalMarks / totalPossible) * 100).toFixed(1);
    const overallGrade = getGrade(totalMarks / allSubjects.length);

    function getGrade(average) {
      if (average >= 80) return "A+";
      if (average >= 70) return "A";
      if (average >= 60) return "A-";
      if (average >= 50) return "B";
      if (average >= 40) return "C";
      if (average >= 33) return "D";
      return "F";
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Marksheet - ${student.studentName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Arial', sans-serif; background: #f5f5f5; padding: 20px; }
          .marksheet-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            border-radius: 10px;
          }
          .header {
            text-align: center;
            border-bottom: 3px double #333;
            padding-bottom: 10px;
            margin-bottom: 10px;
          }
          .header h1 {
            color: #2c3e50;
            font-size: 28px;
            margin-bottom: 10px;
          }
          .header h3 {
            color: #3498db;
            font-size: 20px;
            margin-bottom: 5px;
          }
          .student-info {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 10px;
            border-left: 4px solid #3498db;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }
          .info-item { margin-bottom: 10px; }
          .info-item strong { color: #2c3e50; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
            box-shadow: 0 0 10px rgba(0,0,0,0.05);
          }
          th {
            background: #3498db;
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: bold;
          }
          td {
            padding: 12px 15px;
            border-bottom: 1px solid #ddd;
          }
          tr:hover { background: #f5f7fa; }
          .subject-name { font-weight: bold; color: #2c3e50; }
          .passed { color: #27ae60; font-weight: bold; }
          .failed { color: #e74c3c; font-weight: bold; }
          .summary {
            background: #ecf0f1;
            padding: 20px;
            border-radius: 8px;
            margin-top: 30px;
            text-align: center;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-top: 15px;
          }
          .summary-item {
            background: white;
            padding: 15px;
            border-radius: 6px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          .summary-item h4 {
            color: #7f8c8d;
            margin-bottom: 10px;
            font-size: 14px;
          }
          .summary-item p {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
          }
          .grade-A { color: #27ae60; }
          .grade-B { color: #f39c12; }
          .grade-C { color: #3498db; }
          .grade-D { color: #9b59b6; }
          .grade-F { color: #e74c3c; }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #7f8c8d;
            font-size: 14px;
          }
          .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #333;
          }
          .signature-box {
            text-align: center;
            width: 45%;
          }
          .signature-line {
            width: 200px;
            height: 1px;
            background: #333;
            margin: 40px auto 10px;
          }
          .print-button {
            text-align: center;
            margin-top: 30px;
            padding: 20px;
          }
          button {
            padding: 12px 30px;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 0 10px;
          }
          button:hover { background: #2980b9; }
          button.close { background: #e74c3c; }
          button.close:hover { background: #c0392b; }
          @media print {
            .print-button { display: none; }
            body { background: white; }
            .marksheet-container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="marksheet-container">
          <div class="header">
            <h1>📘 OFFICIAL MARKSHEET</h1>
            <h3>${student.studentName}'s Academic Report</h3>
            <p style="color: #7f8c8d;">${selectedClass} • ${selectedExam} • Session: ${
      student.studentSessions
    }</p>
          </div>

          <div class="student-info">
            <div class="info-grid">
              <div class="info-item">
                <strong>Student Name:</strong> ${student.studentName}
              </div>
              <div class="info-item">
                <strong>Roll Number:</strong> ${student.studentRoll}
              </div>
              <div class="info-item">
                <strong>Class:</strong> ${student.studentClass}
              </div>
              <div class="info-item">
                <strong>Group:</strong> ${student.studentGroup || "General"}
              </div>
              <div class="info-item">
                <strong>Exam:</strong> ${selectedExam}
              </div>
              <div class="info-item">
                <strong>Session:</strong> ${student.studentSessions}
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Total Marks</th>
                <th>Pass Marks</th>
                <th>Obtained</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${allSubjects
                .map(
                  (subject) => `
                <tr>
                  <td class="subject-name">${subject.subjectName}</td>
                  <td>${subject.totalMark}</td>
                  <td>${subject.passMark}</td>
                  <td><strong>${subject.gotMarks}</strong></td>
                  <td>${subject.percentage}%</td>
                  <td class="grade-${subject.grade.charAt(0)}">${
                    subject.grade
                  }</td>
                  <td class="${subject.status.toLowerCase()}">${
                    subject.status
                  }</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="summary">
            <h3 style="color: #2c3e50; margin-bottom: 20px;">📊 Performance Summary</h3>
            <div class="summary-grid">
              <div class="summary-item">
                <h4>Total Marks Obtained</h4>
                <p>${totalMarks} / ${totalPossible}</p>
              </div>
              <div class="summary-item">
                <h4>Overall Percentage</h4>
                <p style="color: #3498db;">${overallPercentage}%</p>
              </div>
              <div class="summary-item">
                <h4>Overall Grade</h4>
                <p class="grade-${overallGrade.charAt(0)}">${overallGrade}</p>
              </div>
            </div>
          </div>

          <div class="signatures">
            <div class="signature-box">
              <div class="signature-line"></div>
              <p style="margin-top: 5px; font-weight: bold;">Class Teacher</p>
              <p style="color: #7f8c8d; font-size: 12px;">Signature & Seal</p>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <p style="margin-top: 5px; font-weight: bold;">Principal</p>
              <p style="color: #7f8c8d; font-size: 12px;">Signature & Seal</p>
            </div>
          </div>

          <div class="footer">
            <p>Generated on: ${new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
            })}</p>
            <p style="margin-top: 5px; font-size: 12px;">© ${new Date().getFullYear()} School Management System | This is a computer generated document</p>
          </div>
        </div>

        <div class="print-button">
          <button onclick="window.print()">🖨️ Print Marksheet</button>
          <button onclick="window.close()" class="close">✖️ Close Window</button>
        </div>

        <script>
          // Automatically trigger print after 1 second
          setTimeout(() => {
            window.print();
          }, 1000);
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank", "width=900,height=700");
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // সব ছাত্রের মার্কশিট প্রিন্ট
  const handlePrintAll = () => {
    if (students.length === 0) {
      alert("No students found!");
      return;
    }

    if (!selectedExam) {
      alert("Please select an exam first!");
      return;
    }

    const confirmed = window.confirm(
      `Do you want to print marksheets for all ${students.length} students? This will open multiple print dialogs.`
    );

    if (confirmed) {
      students.forEach((student, index) => {
        setTimeout(() => {
          handlePrintStudent(student);
        }, index * 2000); // 2 second gap between each print
      });
    }
  };

  // ছাত্রের ডিটেইলস দেখানোর ফাংশন
  const showStudentDetails = (student) => {
    const examDetails = getStudentExamDetails(student);
    setSelectedStudentDetails({
      student,
      examDetails,
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🎓 Class-wise Marksheet Generator
        </h1>
        <p className="text-gray-600">
          Select exam and class to generate marksheets for students
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Exam Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 font-bold">📝</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Select Exam</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {exams.map((exam) => (
              <button
                key={exam._id}
                className={`px-4 py-3 rounded-lg transition-all ${
                  selectedExam === exam.examName
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
                onClick={() => setSelectedExam(exam.examName)}
              >
                {exam.examName}
              </button>
            ))}
          </div>
        </div>

        {/* Class Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600 font-bold">🏫</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Select Class
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {classes.map((cls) => (
              <button
                key={cls._id}
                className={`px-4 py-3 rounded-lg transition-all ${
                  selectedClass === cls.className
                    ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg scale-105"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
                onClick={() => {
                  setSelectedClass(cls.className);
                  setSelectedStudentDetails(null);
                }}
              >
                {cls.className}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Students Section */}
      {selectedClass && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                👥 Students of {selectedClass}
              </h2>
              <p className="text-gray-600">
                {selectedExam && `Exam: ${selectedExam} • `}
                Total Students: {students.length}
              </p>
            </div>
            {selectedExam && students.length > 0 && (
              <button
                onClick={handlePrintAll}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🖨️ Print All Marksheets
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-14 w-14 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading students data...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-gray-500 text-lg">
                No students found in {selectedClass}
              </p>
              <p className="text-gray-400 mt-2">
                Please check if students are enrolled in this class
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Roll
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Student Name
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Class
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Session
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((student) => {
                    const examDetails = getStudentExamDetails(student);
                    const hasExamData =
                      examDetails &&
                      examDetails.subjects &&
                      examDetails.subjects.length > 0;

                    return (
                      <tr key={student._id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-800 font-bold rounded-lg">
                            {student.studentRoll}
                          </span>
                        </td>
                        <td className="p-4 font-medium text-gray-800">
                          {student.studentName}
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                            {student.studentClass}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                            {student.studentSessions}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handlePrintStudent(student)}
                              disabled={!selectedExam || !hasExamData}
                              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                selectedExam && hasExamData
                                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                              }`}
                              title={
                                !selectedExam
                                  ? "Select an exam first"
                                  : !hasExamData
                                  ? "No exam data available"
                                  : "Print marksheet"
                              }
                            >
                              {hasExamData ? "📄 Print" : "No Data"}
                            </button>
                            <button
                              onClick={() => showStudentDetails(student)}
                              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all"
                            >
                              👁️ View
                            </button>
                          </div>
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

      {/* Student Details Modal */}
      {selectedStudentDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  📋 Student Details
                </h3>
                <button
                  onClick={() => setSelectedStudentDetails(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Name</p>
                    <p className="font-semibold">
                      {selectedStudentDetails.student.studentName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Roll No</p>
                    <p className="font-semibold">
                      {selectedStudentDetails.student.studentRoll}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Class</p>
                    <p className="font-semibold">
                      {selectedStudentDetails.student.studentClass}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Session</p>
                    <p className="font-semibold">
                      {selectedStudentDetails.student.studentSessions}
                    </p>
                  </div>
                </div>
              </div>

              {selectedStudentDetails.examDetails ? (
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-gray-700">
                    📊 Exam: {selectedStudentDetails.examDetails.examName}
                  </h4>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-3 text-left">Subject</th>
                          <th className="p-3 text-left">Pass Marks</th>
                          <th className="p-3 text-left">Got Marks</th>
                          <th className="p-3 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedStudentDetails.examDetails.subjects.map(
                          (subject, index) => {
                            const subjectDetails =
                              getSubjectMarksAndGrade(subject);
                            return (
                              <tr key={index} className="border-b">
                                <td className="p-3 font-medium">
                                  {subject.subjectName}
                                </td>
                                <td className="p-3">
                                  {subject.marks?.passMark || 33}
                                </td>
                                <td className="p-3">
                                  <span
                                    className={`font-bold ${
                                      subjectDetails.gotMarks >=
                                      subjectDetails.passMark
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {subjectDetails.gotMarks}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                      subjectDetails.status === "Passed"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {subjectDetails.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No exam data available for {selectedExam}
                  </p>
                </div>
              )}

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedStudentDetails(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
                {selectedStudentDetails.examDetails && (
                  <button
                    onClick={() =>
                      handlePrintStudent(selectedStudentDetails.student)
                    }
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700"
                  >
                    🖨️ Print Marksheet
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassWiseMarksheet;
