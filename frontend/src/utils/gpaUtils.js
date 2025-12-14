// src/utils/gpaUtils.js

export const getGradeAndGPA = (marks) => {
  if (marks >= 80) return { grade: "A+", gpa: 5.0 };
  if (marks >= 70) return { grade: "A", gpa: 4.0 };
  if (marks >= 60) return { grade: "A-", gpa: 3.5 };
  if (marks >= 50) return { grade: "B", gpa: 3.0 };
  if (marks >= 40) return { grade: "C", gpa: 2.0 };
  if (marks >= 33) return { grade: "D", gpa: 1.0 };
  return { grade: "F", gpa: 0.0 };
};

export const calculateFinalGPA = (subjects) => {
  let totalGPA = 0;
  let failed = false;

  subjects.forEach((sub) => {
    const { gpa } = getGradeAndGPA(sub.gotMarks);
    if (gpa === 0) failed = true;
    totalGPA += gpa;
  });

  if (failed) {
    return { gpa: 0, result: "Fail" };
  }

  return {
    gpa: (totalGPA / subjects.length).toFixed(2),
    result: "Pass",
  };
};
