import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AllExamResults = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [printingAll, setPrintingAll] = useState(false);
  const { sessionName } = useParams();
  const printRef = useRef();

  // Grade calculation functions
  const getSimpleGrade = (percentage) => {
    const percent = Number(percentage);
    if (percent >= 80) return "A+";
    if (percent >= 70) return "A";
    if (percent >= 60) return "A-";
    if (percent >= 50) return "B";
    if (percent >= 40) return "C";
    if (percent >= 33) return "D";
    return "F";
  };

  const getGradeObject = (percentage) => {
    const percent = Number(percentage);
    if (percent >= 80)
      return { grade: "A+", color: "text-green-700", bgColor: "bg-green-100" };
    if (percent >= 70)
      return { grade: "A", color: "text-green-600", bgColor: "bg-green-50" };
    if (percent >= 60)
      return { grade: "A-", color: "text-blue-700", bgColor: "bg-blue-100" };
    if (percent >= 50)
      return { grade: "B", color: "text-blue-600", bgColor: "bg-blue-50" };
    if (percent >= 40)
      return { grade: "C", color: "text-yellow-700", bgColor: "bg-yellow-100" };
    if (percent >= 33)
      return { grade: "D", color: "text-orange-600", bgColor: "bg-orange-50" };
    return { grade: "F", color: "text-red-700", bgColor: "bg-red-100" };
  };

  // সব ক্লাস fetch
  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/classes/${sessionName}`)
      .then((res) => res.json())
      .then((data) => {
        setClasses(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load classes");
        setLoading(false);
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
        const sortedStudents = data.sort(
          (a, b) => a.studentRoll - b.studentRoll
        );
        setStudents(sortedStudents);
        setLoading(false);
      })
      .catch((err) => {
        setError(`Failed to load students: ${err.message}`);
        setStudents([]);
        setLoading(false);
      });
  }, [selectedClass]);

  // একটি ছাত্রের সব এক্সামের তথ্য পাওয়া
  const getAllExamsData = useCallback((student) => {
    if (!student || !student.studentExams) return [];

    return student.studentExams.map((exam) => {
      let totalMarks = 0;
      let totalPossible = 0;
      let passedSubjects = 0;
      let failedSubjects = 0;
      let hasFGrade = false;

      if (exam.subjects && Array.isArray(exam.subjects)) {
        exam.subjects.forEach((subject) => {
          const gotMarks = subject.marks?.gotMarks || 0;
          const passMark = subject.marks?.passMark || 33;
          totalMarks += gotMarks;
          totalPossible += 100;

          const percentage = (gotMarks / 100) * 100;
          const grade = getSimpleGrade(percentage);

          if (gotMarks >= passMark && grade !== "F") {
            passedSubjects++;
          } else {
            failedSubjects++;
            if (grade === "F") {
              hasFGrade = true;
            }
          }
        });
      }

      const percentage =
        totalPossible > 0 ? ((totalMarks / totalPossible) * 100).toFixed(1) : 0;
      const grade = getSimpleGrade(percentage);

      return {
        examName: exam.examName,
        totalSubjects: exam.subjects?.length || 0,
        passedSubjects,
        failedSubjects,
        hasFGrade,
        totalMarks,
        totalPossible,
        percentage,
        grade: hasFGrade ? "F" : grade,
        subjects: exam.subjects || [],
      };
    });
  }, []);

  // একটি ছাত্রের সামগ্রিক পারফরমেন্স
  const getStudentOverallPerformance = useCallback(
    (student) => {
      const allExams = getAllExamsData(student);

      if (allExams.length === 0) return null;

      let totalMarksAllExams = 0;
      let totalPossibleAllExams = 0;
      let totalPassedSubjects = 0;
      let totalFailedSubjects = 0;
      let totalSubjects = 0;
      let failedExams = 0;
      let hasAnyFGrade = false;

      allExams.forEach((exam) => {
        totalMarksAllExams += exam.totalMarks;
        totalPossibleAllExams += exam.totalPossible;
        totalPassedSubjects += exam.passedSubjects;
        totalFailedSubjects += exam.failedSubjects;
        totalSubjects += exam.totalSubjects;

        if (exam.hasFGrade) {
          failedExams++;
          hasAnyFGrade = true;
        }
      });

      const overallPercentage =
        totalPossibleAllExams > 0
          ? ((totalMarksAllExams / totalPossibleAllExams) * 100).toFixed(1)
          : 0;

      const overallGrade = hasAnyFGrade
        ? "F"
        : getSimpleGrade(overallPercentage);
      const passRate =
        totalSubjects > 0
          ? ((totalPassedSubjects / totalSubjects) * 100).toFixed(1)
          : 0;

      return {
        totalExams: allExams.length,
        failedExams,
        totalSubjects,
        totalPassedSubjects,
        totalFailedSubjects,
        passRate,
        totalMarksAllExams,
        totalPossibleAllExams,
        overallPercentage,
        overallGrade,
        hasAnyFGrade,
        exams: allExams,
      };
    },
    [getAllExamsData]
  );

  // Individual student print
  const handleIndividualPrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: selectedStudent
      ? `${selectedStudent.studentName}_Report`
      : "Student_Report",
    pageStyle: `
      @page {
        size: A4 landscape;
        margin: 5mm;
      }
      @media print {
        body {
          margin: 0;
          padding: 0;
          -webkit-print-color-adjust: exact;
        }
      }
    `,
  });

  // ছাত্রের প্রিন্ট ট্রিগার
  const triggerStudentPrint = (student) => {
    setSelectedStudent(student);
    setTimeout(() => {
      handleIndividualPrint();
    }, 100);
  };

  // সব ছাত্রের মার্কশিট প্রিন্ট
  const printAllStudents = () => {
    if (students.length === 0) {
      alert("No students to print!");
      return;
    }

    setPrintingAll(true);

    // Open print dialog with all mark sheets
    const printWindow = window.open("", "_blank");

    // Create the HTML content for all mark sheets
    let content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${selectedClass} - All Students Mark Sheets</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 5mm;
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            margin: 0;
            padding: 0;
            font-size: 12px;
            line-height: 1.3;
            background: white;
            -webkit-print-color-adjust: exact;
          }
          .marksheet-page {
            width: 100%;
            height: 100vh;
            page-break-after: always;
            padding: 5mm;
            box-sizing: border-box;
          }
          .marksheet-page:last-child {
            page-break-after: auto;
          }
          .marksheet-container {
            width: 100%;
            max-width: 270mm;
            margin: 0 auto;
            page-break-inside: avoid;
          }
          .header {
            text-align: center;
            padding-bottom: 10px;
            margin-bottom: 15px;
            border-bottom: 3px double #333;
          }
          .school-name {
            font-size: 24px;
            font-weight: bold;
            color: #000;
            margin: 2px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .school-address {
            font-size: 14px;
            color: #333;
            margin: 2px 0;
          }
          .report-title {
            font-size: 16px;
            font-weight: bold;
            color: #000;
            margin: 2px 0;
            text-decoration: underline;
          }
          .student-details {
            width: 100%;
            border-collapse: collapse;
            margin: 2px 0;
            page-break-inside: avoid;
            text-transform: capitalize;
          }
          .student-details td {
            padding: 2px 2px;
            border: 1px solid #000;
          }
          .student-details .label {
            font-weight: bold;
            background: #f0f0f0;
            width: 25%;
            
          }
          .marks-table {
            width: 100%;
            border-collapse: collapse;
            margin: 5px 0;
            font-size: 11px;
            page-break-inside: avoid;
          }
          .marks-table th {
            background: #4a90e2;
            color: white;
            padding: 4px 2px;
            text-align: center;
            font-weight: bold;
            border: 1px solid #333;
            vertical-align: middle;
          }
          .marks-table td {
            padding: 6px 2px;
            border: 1px solid #333;
            text-align: center;
            vertical-align: middle;
          }
          .subject-row {
            background: #fff;
          }
          .subject-row:nth-child(even) {
            background: #f9f9f9;
          }
          .subject-name {
            text-align: left;
            padding-left: 10px;
            font-weight: bold;
            background: #f0f0f0;
          }
          .exam-header {
            background: #2c5282 !important;
            text-align: center;
            font-size: 12px;
          }
          .exam-subheader {
            background: #4299e1 !important;
            font-size: 11px;
          }
          .total-row {
            background: #e6f7ff;
            font-weight: bold;
          }
          .grade-cell {
            font-weight: bold;
          }
          .grade-A-plus { color: #27ae60; }
          .grade-A { color: #2ecc71; }
          .grade-A-minus { color: #3498db; }
          .grade-B { color: #9b59b6; }
          .grade-C { color: #f39c12; }
          .grade-D { color: #e67e22; }
          .grade-F {
            color: #e74c3c;
            font-weight: bold;
          }
          .failed-cell {
            background: #f8d7da;
          }
          .passed-cell {
            background: #d4edda;
          }
          .attendance-section {
            margin-top: 30px;
            width: 100%;
            border-collapse: collapse;
            page-break-inside: avoid;
          }
          .attendance-section td {
            padding: 8px 15px;
            border: 1px solid #000;
            vertical-align: top;
          }
          .attendance-label {
            font-weight: bold;
            background: #f0f0f0;
            width: 30%;
          }
          .grading-system {
            background: #f8f9fa;
            padding: 15px;
            border: 1px solid #ddd;
            margin: 5px 0;
            border-radius: 5px;
            page-break-inside: avoid;
          }
          .grading-system h4 {
            margin-top: 0;
            color: #2c3e50;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
          }
          .grade-item {
            display: inline-block;
            margin: 5px 10px;
            padding: 3px 10px;
            border-radius: 3px;
            font-weight: bold;
          }
          .grade-A-plus-item { background: #27ae60; color: white; }
          .grade-A-item { background: #2ecc71; color: white; }
          .grade-A-minus-item { background: #3498db; color: white; }
          .grade-B-item { background: #9b59b6; color: white; }
          .grade-C-item { background: #f1c40f; color: #2c3e50; }
          .grade-D-item { background: #e67e22; color: white; }
          .grade-F-item { background: #e74c3c; color: white; }
          .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 5px;
            padding-top: 20px;
            border-top: 2px solid #333;
            page-break-inside: avoid;
          }
          .signature-box {
            text-align: center;
            width: 30%;
          }
          .signature-line {
            width: 200px;
            height: 1px;
            background: #000;
            margin: 40px auto 10px;
          }
          .footer {
            margin-top: 1px;
            text-align: center;
            color: #666;
            font-size: 10px;
            border-top: 1px solid #ddd;
            padding-top: 1px;
          }
          .page-number {
            position: absolute;
            bottom: 5mm;
            right: 10mm;
            font-size: 10px;
            color: #666;
          }
        </style>
      </head>
      <body>
    `;

    // Add each student's mark sheet
    students.forEach((student, index) => {
      const overallPerformance = getStudentOverallPerformance(student);
      const displayExams = overallPerformance ? overallPerformance.exams : [];

      // Get all unique subjects
      const allSubjects = [];
      displayExams.forEach((exam) => {
        exam.subjects.forEach((subject) => {
          if (!allSubjects.find((s) => s.subjectName === subject.subjectName)) {
            allSubjects.push(subject);
          }
        });
      });

      content += `
        <div class="marksheet-page">
          <div class="marksheet-container">
           
            <table class="student-details">
              <tr>
                <td class="label">Student Name:</td>
                <td colspan="3"><strong>${student.studentName}</strong></td>
                <td class="label">Class:</td>
                <td><strong>${student.studentClass}</strong></td>
                <td class="label">Roll No:</td>
                <td><strong>${student.studentRoll}</strong></td>
              </tr>
              <tr>
                <td class="label">Session:</td>
                <td colspan="3"><strong>${
                  student.studentSessions || "N/A"
                }</strong></td>
                <td class="label">Section:</td>
                <td><strong>${student.studentSection || "N/A"}</strong></td>
                <td class="label">Group:</td>
                <td><strong>${student.studentGroup || "N/A"}</strong></td>
              </tr>
            </table>

            <div class="grading-system">
              <h4>📊 Grading System:</h4>
              <div class="grade-item grade-A-plus-item">80-100: A+</div>
              <div class="grade-item grade-A-item">70-79: A</div>
              <div class="grade-item grade-A-minus-item">60-69: A-</div>
              <div class="grade-item grade-B-item">50-59: B</div>
              <div class="grade-item grade-C-item">40-49: C</div>
              <div class="grade-item grade-D-item">33-39: D</div>
              <div class="grade-item grade-F-item">0-32: F (Fail)</div>
            </div>

            ${
              displayExams.length > 0
                ? `
              <table class="marks-table">
                <thead>
                  <tr>
                    <th rowspan="2">Subject</th>
                    ${displayExams
                      .map(
                        (exam) => `
                      <th colspan="4" class="exam-header">${
                        exam.examName + " " + sessionName
                      }</th>
                    `
                      )
                      .join("")}
                  </tr>
                  <tr>
                    ${displayExams
                      .map(
                        () => `
                      <th class="exam-subheader">Total Mark</th>
                      <th class="exam-subheader">Pass Mark</th>
                      <th class="exam-subheader">Obtain Mark</th>
                      <th class="exam-subheader">Grade</th>
                    `
                      )
                      .join("")}
                  </tr>
                </thead>
                <tbody>
                  ${allSubjects
                    .map(
                      (subject) => `
                    <tr class="subject-row">
                      <td class="subject-name">${subject.subjectName}</td>
                      ${displayExams
                        .map((exam) => {
                          const subjectInExam = exam.subjects.find(
                            (s) => s.subjectName === subject.subjectName
                          );
                          if (subjectInExam) {
                            const gotMarks = subjectInExam.marks?.gotMarks || 0;
                            const passMark =
                              subjectInExam.marks?.passMark || 33;
                            const percentage = (gotMarks / 100) * 100;
                            const grade = getSimpleGrade(percentage);
                            const passed =
                              gotMarks >= passMark && grade !== "F";

                            return `
                            <td>100</td>
                            <td>${passMark}</td>
                            <td class="${
                              passed ? "passed-cell" : "failed-cell"
                            }">
                              ${gotMarks}
                            </td>
                            <td class="grade-cell grade-${grade}">
                              ${grade}
                            </td>
                          `;
                          } else {
                            return `
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                          `;
                          }
                        })
                        .join("")}
                    </tr>
                  `
                    )
                    .join("")}

                  <tr class="total-row">
                    <td class="subject-name"><strong>Total / Average</strong></td>
                    ${displayExams
                      .map((exam) => {
                        const percentage = exam.percentage;
                        const grade = exam.grade;
                        const totalObtained = exam.totalMarks;
                        const totalPossible = exam.totalPossible;

                        return `
                        <td>${totalPossible}</td>
                        <td>-</td>
                        <td><strong>${totalObtained}</strong></td>
                        <td class="grade-cell grade-${grade}">
                          <strong>${grade} (${percentage}%)</strong>
                        </td>
                      `;
                      })
                      .join("")}
                  </tr>
                </tbody>
              </table>

              <table class="attendance-section">
                <tr>
                  <td class="attendance-label">Total Class Days</td>
                  <td>__________________</td>
                  <td class="attendance-label">Present Days</td>
                  <td>__________________</td>
                  <td class="attendance-label">Percentage</td>
                  <td>__________________</td>
                </tr>
                <tr>
                  <td class="attendance-label">Absent Days</td>
                  <td>__________________</td>
                  <td class="attendance-label">Leave Days</td>
                  <td>__________________</td>
                  <td class="attendance-label">Holiday</td>
                  <td>__________________</td>
                </tr>
              </table>

              ${
                overallPerformance
                  ? `
                <div style="margin-top: 2px; padding: 15px; background: ${
                  overallPerformance.hasAnyFGrade ? "#f8d7da" : "#d4edda"
                }; border: 2px solid ${
                      overallPerformance.hasAnyFGrade ? "#f5c6cb" : "#c3e6cb"
                    }; border-radius: 8px; page-break-inside: avoid;">
                  <h3 style="margin: 0 0 10px 0; color: ${
                    overallPerformance.hasAnyFGrade ? "#721c24" : "#155724"
                  };">
                    📌 OVERALL RESULT:
                    <span class="grade-${overallPerformance.overallGrade}">
                      ${overallPerformance.overallGrade} (${
                      overallPerformance.overallPercentage
                    }%)
                    </span>
                    ${
                      overallPerformance.hasAnyFGrade
                        ? '<span style="color: #721c24; font-weight: bold;"> - FAILED</span>'
                        : '<span style="color: #155724; font-weight: bold;"> - PASSED</span>'
                    }
                  </h3>
                  <div style="display: flex; justify-content: space-between; font-size: 11px;">
                    <span>Total Exams: ${overallPerformance.totalExams}</span>
                    <span>Passed Subjects: ${
                      overallPerformance.totalPassedSubjects
                    }/${overallPerformance.totalSubjects}</span>
                    <span>Pass Rate: ${overallPerformance.passRate}%</span>
                    <span>Total Marks: ${
                      overallPerformance.totalMarksAllExams
                    }/${overallPerformance.totalPossibleAllExams}</span>
                  </div>
                </div>
              `
                  : ""
              }

              <div style="margin-top: 5px; padding: 5px; border: 1px dashed #999; page-break-inside: avoid;">
                <strong>Remarks:</strong>
                ${
                  overallPerformance
                    ? overallPerformance.hasAnyFGrade
                      ? "Student has failed in one or more subjects. Needs improvement."
                      : "Good performance. Keep it up!"
                    : "No remarks available."
                }
                _________________________________________________________
              </div>
            `
                : `
              <div style="text-align: center; padding: 50px; border: 2px dashed #ccc; border-radius: 10px; margin: 20px 0;">
                <h3 style="color: #666; margin-bottom: 10px;">No Exam Data Available</h3>
                <p>This student has no examination records.</p>
              </div>
            `
            }

            <div class="signatures">
              <div class="signature-box">
                <div class="signature-line"></div>
                <div>Class Teacher</div>
                <div style="font-size: 10px; color: #666;">Signature with Date</div>
              </div>
              <div class="signature-box">
                <div class="signature-line"></div>
                <div>Head of Department</div>
                <div style="font-size: 10px; color: #666;">Signature with Date</div>
              </div>
              <div class="signature-box">
                <div class="signature-line"></div>
                <div>Principal</div>
                <div style="font-size: 10px; color: #666;">Signature with Date</div>
              </div>
            </div>

            <div class="footer">
              Generated on: ${new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })} • This is a computer generated mark sheet.
            </div>

            <div class="page-number">
              Page ${index + 1} of ${students.length}
            </div>
          </div>
        </div>
      `;
    });

    content += `
        <script>
          // Auto print after loading
          setTimeout(() => {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          }, 1000);
        </script>
      </body>
      </html>
    `;

    // Write the content to the new window
    printWindow.document.write(content);
    printWindow.document.close();

    // Reset printing state after a delay
    setTimeout(() => {
      setPrintingAll(false);
    }, 3000);
  };

  // সার্চ ফাংশন
  const filteredStudents = students.filter(
    (student) =>
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentRoll.toString().includes(searchTerm)
  );

  // Individual mark sheet component
  const MarkSheet = ({ student }) => {
    if (!student) return null;

    const overallPerformance = getStudentOverallPerformance(student);
    const displayExams = overallPerformance ? overallPerformance.exams : [];
    const allSubjects = [];

    displayExams.forEach((exam) => {
      exam.subjects.forEach((subject) => {
        if (!allSubjects.find((s) => s.subjectName === subject.subjectName)) {
          allSubjects.push(subject);
        }
      });
    });

    return (
      <div
        className="marksheet-container"
        style={{
          width: "100%",
          maxWidth: "270mm",
          margin: "0 auto",
          padding: "5mm",
          fontFamily: "'Times New Roman', Times, serif",
          fontSize: "12px",
          lineHeight: "1.3",
          backgroundColor: "white",
        }}
      >
        <div
          style={{
            textAlign: "center",
            paddingBottom: "10px",
            marginBottom: "15px",
            borderBottom: "3px double #333",
          }}
        >
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#000",
              margin: "2px 0",
              textTransform: "uppercase",
            }}
          >
            SCHOOL NAME
          </h1>
          <p style={{ fontSize: "14px", color: "#333", margin: "2px 0" }}>
            School Address, City, Country
          </p>
          <h2
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: "#000",
              margin: "5px 0",
            }}
          >
            📝 EXAMINATION MARK SHEET
          </h2>
        </div>

        <table
          style={{ width: "100%", borderCollapse: "collapse", margin: "2px 0" }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  padding: "2px",
                  border: "1px solid #000",
                  fontWeight: "bold",
                  background: "#f0f0f0",
                  width: "25%",
                }}
              >
                Student Name:
              </td>
              <td
                colSpan="3"
                style={{ padding: "2px", border: "1px solid #000" }}
              >
                <strong>{student.studentName}</strong>
              </td>
              <td
                style={{
                  padding: "2px",
                  border: "1px solid #000",
                  fontWeight: "bold",
                  background: "#f0f0f0",
                }}
              >
                Class:
              </td>
              <td style={{ padding: "2px", border: "1px solid #000" }}>
                <strong>{student.studentClass}</strong>
              </td>
              <td
                style={{
                  padding: "2px",
                  border: "1px solid #000",
                  fontWeight: "bold",
                  background: "#f0f0f0",
                }}
              >
                Roll No:
              </td>
              <td style={{ padding: "2px", border: "1px solid #000" }}>
                <strong>{student.studentRoll}</strong>
              </td>
            </tr>
          </tbody>
        </table>

        {displayExams.length > 0 ? (
          <>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                margin: "5px 0",
                fontSize: "11px",
              }}
            >
              <thead>
                <tr>
                  <th
                    rowSpan="2"
                    style={{
                      background: "#4a90e2",
                      color: "white",
                      padding: "4px 2px",
                      border: "1px solid #333",
                      verticalAlign: "middle",
                    }}
                  >
                    Subject
                  </th>
                  {displayExams.map((exam) => (
                    <th
                      key={exam.examName}
                      colSpan="4"
                      style={{
                        background: "#2c5282",
                        color: "white",
                        padding: "4px 2px",
                        border: "1px solid #333",
                        textAlign: "center",
                        fontSize: "12px",
                      }}
                    >
                      {exam.examName}
                    </th>
                  ))}
                </tr>
                <tr>
                  {displayExams.map((_, idx) => (
                    <React.Fragment key={idx}>
                      <th
                        style={{
                          background: "#4299e1",
                          color: "white",
                          padding: "4px 2px",
                          border: "1px solid #333",
                          fontSize: "11px",
                        }}
                      >
                        Total Mark
                      </th>
                      <th
                        style={{
                          background: "#4299e1",
                          color: "white",
                          padding: "4px 2px",
                          border: "1px solid #333",
                          fontSize: "11px",
                        }}
                      >
                        Pass Mark
                      </th>
                      <th
                        style={{
                          background: "#4299e1",
                          color: "white",
                          padding: "4px 2px",
                          border: "1px solid #333",
                          fontSize: "11px",
                        }}
                      >
                        Obtain Mark
                      </th>
                      <th
                        style={{
                          background: "#4299e1",
                          color: "white",
                          padding: "4px 2px",
                          border: "1px solid #333",
                          fontSize: "11px",
                        }}
                      >
                        Grade
                      </th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allSubjects.map((subject, idx) => (
                  <tr
                    key={subject.subjectName}
                    style={{ background: idx % 2 === 0 ? "#fff" : "#f9f9f9" }}
                  >
                    <td
                      style={{
                        textAlign: "left",
                        paddingLeft: "10px",
                        fontWeight: "bold",
                        background: "#f0f0f0",
                        padding: "6px 2px",
                        border: "1px solid #333",
                      }}
                    >
                      {subject.subjectName}
                    </td>
                    {displayExams.map((exam) => {
                      const subjectInExam = exam.subjects.find(
                        (s) => s.subjectName === subject.subjectName
                      );
                      if (subjectInExam) {
                        const gotMarks = subjectInExam.marks?.gotMarks || 0;
                        const passMark = subjectInExam.marks?.passMark || 33;
                        const percentage = (gotMarks / 100) * 100;
                        const grade = getSimpleGrade(percentage);
                        const passed = gotMarks >= passMark && grade !== "F";

                        return (
                          <React.Fragment
                            key={`${exam.examName}-${subject.subjectName}`}
                          >
                            <td
                              style={{
                                padding: "6px 2px",
                                border: "1px solid #333",
                                textAlign: "center",
                              }}
                            >
                              100
                            </td>
                            <td
                              style={{
                                padding: "6px 2px",
                                border: "1px solid #333",
                                textAlign: "center",
                              }}
                            >
                              {passMark}
                            </td>
                            <td
                              style={{
                                padding: "6px 2px",
                                border: "1px solid #333",
                                textAlign: "center",
                                background: passed ? "#d4edda" : "#f8d7da",
                              }}
                            >
                              {gotMarks}
                            </td>
                            <td
                              style={{
                                padding: "6px 2px",
                                border: "1px solid #333",
                                textAlign: "center",
                                fontWeight: "bold",
                                color:
                                  grade === "A+"
                                    ? "#27ae60"
                                    : grade === "A"
                                    ? "#2ecc71"
                                    : grade === "A-"
                                    ? "#3498db"
                                    : grade === "B"
                                    ? "#9b59b6"
                                    : grade === "C"
                                    ? "#f39c12"
                                    : grade === "D"
                                    ? "#e67e22"
                                    : "#e74c3c",
                              }}
                            >
                              {grade}
                            </td>
                          </React.Fragment>
                        );
                      } else {
                        return (
                          <React.Fragment
                            key={`${exam.examName}-${subject.subjectName}`}
                          >
                            <td
                              style={{
                                padding: "6px 2px",
                                border: "1px solid #333",
                                textAlign: "center",
                              }}
                            >
                              -
                            </td>
                            <td
                              style={{
                                padding: "6px 2px",
                                border: "1px solid #333",
                                textAlign: "center",
                              }}
                            >
                              -
                            </td>
                            <td
                              style={{
                                padding: "6px 2px",
                                border: "1px solid #333",
                                textAlign: "center",
                              }}
                            >
                              -
                            </td>
                            <td
                              style={{
                                padding: "6px 2px",
                                border: "1px solid #333",
                                textAlign: "center",
                              }}
                            >
                              -
                            </td>
                          </React.Fragment>
                        );
                      }
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "50px",
              border: "2px dashed #ccc",
              borderRadius: "10px",
              margin: "20px 0",
            }}
          >
            <h3 style={{ color: "#666", marginBottom: "10px" }}>
              No Exam Data Available
            </h3>
            <p>This student has no examination records.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          📚 Comprehensive Exam Results
        </h1>
        <p className="text-gray-600 text-lg">
          View all examination results for students in one place
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <p className="text-red-700 flex items-center">
            <span className="mr-2">⚠️</span>
            {error}
          </p>
        </div>
      )}

      {/* Print Progress */}
      {printingAll && (
        <div className="fixed top-4 right-4 bg-white shadow-2xl rounded-xl p-4 z-50 min-w-64">
          <div className="flex items-center gap-3 mb-3">
            <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <span className="font-semibold text-gray-800">
              Generating PDF...
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: "100%",
              }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Preparing {students.length} mark sheets...
          </p>
          <p className="text-xs text-gray-500 mt-2">
            A new window will open with all mark sheets
          </p>
        </div>
      )}

      {/* Class Selection */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
            <span className="text-2xl text-white">🏫</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Select Class</h2>
            <p className="text-gray-600">
              Choose a class to view all students' exam results
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {classes.map((cls) => (
            <button
              key={cls._id}
              className={`px-6 py-4 rounded-xl transition-all transform hover:scale-105 ${
                selectedClass === cls.className
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl"
                  : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 shadow-lg"
              }`}
              onClick={() => {
                setSelectedClass(cls.className);
                setSelectedStudent(null);
                setSearchTerm("");
              }}
            >
              <div className="text-center">
                <div className="text-lg font-bold">{cls.className}</div>
                <div className="text-sm opacity-80">Class</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Students Section */}
      {selectedClass && (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                👥 Students of {selectedClass}
                <span className="ml-3 text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-sm">
                  {students.length} students
                </span>
              </h2>
              <p className="text-gray-600 mt-2">
                Showing comprehensive exam results for all students in this
                class
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or roll..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
                <span className="absolute left-3 top-3.5 text-gray-400">
                  🔍
                </span>
              </div>

              {/* Print All Button */}
              <button
                onClick={printAllStudents}
                disabled={students.length === 0 || printingAll}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {printingAll ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Generating PDF...
                  </>
                ) : (
                  <>📥 DOWNLOAD ALL PDF ({students.length})</>
                )}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-6 text-gray-600 text-lg">
                Loading students' exam data...
              </p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
              <div className="text-6xl mb-6 opacity-50">📭</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">
                No Students Found
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? `No students match "${searchTerm}" in ${selectedClass}`
                  : `No students found in ${selectedClass}`}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredStudents.map((student) => {
                const overallPerformance =
                  getStudentOverallPerformance(student);
                const gradeInfo = overallPerformance
                  ? getGradeObject(overallPerformance.overallPercentage)
                  : {
                      grade: "N/A",
                      color: "text-gray-500",
                      bgColor: "bg-gray-100",
                    };

                return (
                  <div
                    key={student._id}
                    className={`bg-gradient-to-r from-gray-50 to-white border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 ${
                      overallPerformance?.hasAnyFGrade
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      {/* Student Info */}
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div
                            className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                              overallPerformance?.hasAnyFGrade
                                ? "bg-gradient-to-br from-red-500 to-red-600"
                                : "bg-gradient-to-br from-blue-500 to-blue-600"
                            }`}
                          >
                            <span className="text-2xl text-white font-bold">
                              {student.studentRoll}
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-gray-800">
                              {student.studentName}
                            </h3>
                            {overallPerformance?.hasAnyFGrade && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">
                                ⚠️ FAILED
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                              Roll: {student.studentRoll}
                            </span>
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                              Session: {student.studentSessions}
                            </span>
                            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                              Class: {student.studentClass}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Performance Summary */}
                      <div className="flex flex-wrap gap-4">
                        {overallPerformance ? (
                          <>
                            <div className="text-center">
                              <div className="text-sm text-gray-500 mb-1">
                                Exams
                              </div>
                              <div className="text-2xl font-bold text-blue-600">
                                {overallPerformance.totalExams}
                              </div>
                            </div>

                            <div className="text-center">
                              <div className="text-sm text-gray-500 mb-1">
                                Failed Exams
                              </div>
                              <div
                                className={`text-2xl font-bold ${
                                  overallPerformance.failedExams > 0
                                    ? "text-red-600"
                                    : "text-green-600"
                                }`}
                              >
                                {overallPerformance.failedExams}
                              </div>
                            </div>

                            <div className="text-center">
                              <div className="text-sm text-gray-500 mb-1">
                                Overall Grade
                              </div>
                              <div
                                className={`text-2xl font-bold ${gradeInfo.color}`}
                              >
                                {gradeInfo.grade}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-2 px-4 bg-yellow-50 text-yellow-700 rounded-lg">
                            <span className="font-medium">
                              No exam data available
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                        >
                          👁️ View Details
                        </button>

                        <button
                          onClick={() => triggerStudentPrint(student)}
                          disabled={
                            !overallPerformance ||
                            overallPerformance.totalExams === 0 ||
                            printingAll
                          }
                          className={`px-5 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl ${
                            overallPerformance &&
                            overallPerformance.totalExams > 0 &&
                            !printingAll
                              ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          📄 Print Mark Sheet
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Hidden Print Content */}
      <div style={{ display: "none" }}>
        <div ref={printRef}>
          {selectedStudent && <MarkSheet student={selectedStudent} />}
        </div>
      </div>
    </div>
  );
};

export default AllExamResults;
