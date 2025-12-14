import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import Teachers from "./pages/Teachers";
import Home from "./pages/Home";
import Classes from "./pages/Classes";
import ClassesDetails from "./components/ClassesDetails";
import StudentProfile from "./components/StudentProfile";
import Students from "./pages/Students";
import Exam from "./components/Exam";
import Fees from "./components/Fees";
import Marksheet from "./pages/Marksheet";
import ClassWiseMarksheet from "./components/ClassWiseMarksheet";
import AllExamResults from "./components/AllExamResults";

function App() {
  return (
    <Routes>
      {/* Home Page */}
      <Route path="/" element={<Home />} />

      {/* Dashboard & nested pages */}
      <Route path="/dashboard/:sessionName" element={<Dashboard />}>
        <Route path="subjects" element={<Subjects />} />
        <Route path="students" element={<Students />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="classes" element={<Classes />} />
        <Route path="exam" element={<Exam />} />
        <Route path="marks-entry" element={<Marksheet />} />
        <Route path="marksheet" element={<ClassWiseMarksheet />} />
        <Route path="finalresult" element={<AllExamResults />} />
        <Route path="fees" element={<Fees />} />
        <Route path="admit" element={<Marksheet />} />
        <Route path="classdetails/:className" element={<ClassesDetails />} />
      </Route>

      {/* Individual student profile */}
      <Route path="student/:studentId" element={<StudentProfile />} />
    </Routes>
  );
}

export default App;
