import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Users,
  UserCheck,
  Calendar,
  BookOpen,
  TrendingUp,
  FileText,
  Settings,
  Mail,
  Phone,
  Clock,
  Award,
  Book,
  Filter,
  Download,
  Edit,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
const Display = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const { sessionName } = useParams();
  const [events, setEvents] = useState([]);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    fetchStudents();
    fetchClass();
    fetchEvents();
    fetchExams();
  }, [sessionName]);

  const fetchStudents = async () => {
    await fetch(
      `${import.meta.env.VITE_BASE_URL}/students/allstudents/${sessionName}`
    )
      .then((res) => res.json())
      .then((data) => setStudents(data));
  };
  const fetchClass = async () => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/classes/${sessionName}`)
      .then((res) => res.json())
      .then((data) => setClasses(data));
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/events/${sessionName}`
      );
      const data = await res.json();
      if (data.success) setEvents(data.data);
    } catch (err) {
      console.error(err);
    } finally {
    }
  };

  // Fetch exams from backend
  const fetchExams = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/exams/filter?sessionName=${sessionName}`
      );
      const data = await res.json();
      setExams(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Teachers data
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: "Md. Rafiqul Islam",
      subject: "Mathematics",
      contact: "01712345678",
      email: "rafiq@school.edu",
      status: "Active",
    },
    {
      id: 2,
      name: "Mrs. Selina Akter",
      subject: "English",
      contact: "01898765432",
      email: "selina@school.edu",
      status: "Active",
    },
    {
      id: 3,
      name: "Dr. Ahmed Hossain",
      subject: "Physics",
      contact: "01911223344",
      email: "ahmed@school.edu",
      status: "Active",
    },
    {
      id: 4,
      name: "Mrs. Farhana Yasmin",
      subject: "Chemistry",
      contact: "01677889900",
      email: "farhana@school.edu",
      status: "On Leave",
    },
    {
      id: 5,
      name: "Mr. Kamal Hossain",
      subject: "Biology",
      contact: "01555667788",
      email: "kamal@school.edu",
      status: "Active",
    },
  ]);

  // Dashboard stats
  const [stats, setStats] = useState({
    totalStudents: 1245,
    totalTeachers: 48,
    upcomingExams: 3,
    attendanceRate: "94%",
    passRate: "96%",
    classes: 36,
  });

  // Active tab state
  const [activeTab, setActiveTab] = useState("dashboard");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered data based on search
  const filteredStudents = students.filter(
    (student) =>
      student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentClass.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log(events);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {activeTab === "dashboard" && (
          <>
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 mb-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    Welcome to School Dashboard
                  </h2>
                  <p className="text-blue-100">
                    Manage your school's academic activities, monitor
                    performance, and access important information.
                  </p>
                </div>
                <div className="hidden md:block">
                  <BookOpen className="h-20 w-20 opacity-20" />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="bg-blue-500 bg-opacity-30 px-3 py-1 rounded-full text-sm">
                  {`${students && students.length} Students`}
                </span>
                <span className="bg-blue-500 bg-opacity-30 px-3 py-1 rounded-full text-sm">
                  48 Teachers
                </span>
                <span className="bg-blue-500 bg-opacity-30 px-3 py-1 rounded-full text-sm">
                  {`${classes.length} Classes`}
                </span>
                <span className="bg-blue-500 bg-opacity-30 px-3 py-1 rounded-full text-sm">
                  94% Attendance
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">Total Students</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {`${students && students.length}`}
                    </h3>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-500 text-sm">
                        +5% from last month
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">Total Teachers</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {stats.totalTeachers}
                    </h3>
                    <div className="flex items-center mt-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-500 text-sm">All Active</span>
                    </div>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <UserCheck className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">Upcoming Exams</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {stats.upcomingExams}
                    </h3>
                    <div className="flex items-center mt-2">
                      <Clock className="h-4 w-4 text-orange-500 mr-1" />
                      <span className="text-orange-500 text-sm">
                        Next 30 days
                      </span>
                    </div>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <FileText className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">Attendance Rate</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {stats.attendanceRate}
                    </h3>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-500 text-sm">
                        +2% from last month
                      </span>
                    </div>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Students Table */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <Users className="h-5 w-5 mr-2 text-blue-600" />
                      Recent Students
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Recently added students list
                    </p>
                  </div>
                  <button className="flex items-center text-blue-600 hover:text-blue-800">
                    <Plus className="h-4 w-4 mr-1" />
                    Add New
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Class
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Attendance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Performance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.slice(0, 5).map((student) => (
                        <tr key={student._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium mr-3">
                                {student.studentRoll}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {student.studentName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Roll: {student.studentRoll}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {student.studentClass}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ width: student.attendance }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">
                                {student.studentGroup}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full ${
                                student.performance === "Excellent" ||
                                student.performance === "Outstanding"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {student.studentSessions}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 text-center">
                  <Link
                    to="students"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View All Students →
                  </Link>
                </div>
              </div>

              {/* Teachers Table */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <UserCheck className="h-5 w-5 mr-2 text-green-600" />
                      Teaching Staff
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Active teaching staff members
                    </p>
                  </div>
                  <button className="flex items-center text-green-600 hover:text-green-800">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Teacher
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {teachers.slice(0, 5).map((teacher) => (
                        <tr key={teacher.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-medium mr-3">
                                {teacher.name.charAt(0)}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {teacher.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {teacher.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                              {teacher.subject}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`flex items-center ${
                                teacher.status === "Active"
                                  ? "text-green-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              {teacher.status === "Active" ? (
                                <CheckCircle className="h-4 w-4 mr-1" />
                              ) : (
                                <AlertCircle className="h-4 w-4 mr-1" />
                              )}
                              {teacher.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <a
                                href={`tel:${teacher.contact}`}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Phone className="h-4 w-4" />
                              </a>
                              <a
                                href={`mailto:${teacher.email}`}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Mail className="h-4 w-4" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 text-center">
                  <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                    View All Teachers →
                  </button>
                </div>
              </div>

              {/* Upcoming Exams */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-orange-600" />
                      Upcoming Exams
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Schedule of upcoming examinations
                    </p>
                  </div>
                  <button className="flex items-center text-orange-600 hover:text-orange-800">
                    <Download className="h-4 w-4 mr-1" />
                    Download Schedule
                  </button>
                </div>
                <div className="divide-y divide-gray-200">
                  {exams.slice(0, 4).map((exam) => (
                    <div key={exam._id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {exam.examName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            For {exam.sessionName} students
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {
                              new Date(exam.examDate.startDate)
                                .toLocaleDateString()
                                .split("T")[0]
                            }{" "}
                            to{" "}
                            {
                              new Date(exam.examDate.endDate)
                                .toLocaleDateString()
                                .split("T")[0]
                            }
                          </p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              exam.status === "Upcoming"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {exam.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 border-t border-gray-200 text-center">
                  <button className="text-orange-600 hover:text-orange-800 text-sm font-medium">
                    View All Exams →
                  </button>
                </div>
              </div>

              {/* Academic Calendar */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                      Academic Calendar
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Important dates and events
                    </p>
                  </div>
                  <Link
                    to="events"
                    className="flex items-center text-purple-600 hover:text-purple-800"
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    Full Calendar
                  </Link>
                </div>
                <div className="divide-y divide-gray-200">
                  {events.slice(0, 4).map((event) => {
                    const dateObj = new Date(event.startDate);
                    const day = dateObj.getDate(); // 1-31
                    const month = dateObj.toLocaleString("default", {
                      month: "short",
                    }); // Jan, Feb, etc.

                    // Type color mapping according to schema
                    const typeColors = {
                      Exam: "bg-yellow-100 text-yellow-800",
                      Holiday: "bg-red-100 text-red-800",
                      Program: "bg-blue-100 text-blue-800",
                      Meeting: "bg-green-100 text-green-800",
                    };

                    return (
                      <div
                        key={event._id}
                        className="px-6 py-4 hover:bg-gray-50"
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-16 text-center">
                            <div className="text-sm font-medium text-gray-900">
                              {day}
                            </div>
                            <div className="text-xs text-gray-500">{month}</div>
                          </div>
                          <div className="ml-4 flex-1">
                            <h4 className="font-medium text-gray-900">
                              {event.title}
                            </h4>
                            <span
                              className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                                typeColors[event.type] ||
                                "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {event.type}
                            </span>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(event.startDate).toLocaleDateString()}
                              {event.startDate !== event.endDate &&
                                ` → ${new Date(
                                  event.endDate
                                ).toLocaleDateString()}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="px-6 py-4 border-t border-gray-200 text-center">
                  <Link
                    to="events"
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                  >
                    View Full Calendar →
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Stats Section */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-blue-100">Pass Rate</p>
                    <h3 className="text-3xl font-bold mt-1">96%</h3>
                    <p className="text-blue-100 text-sm mt-2">
                      Higher than last year
                    </p>
                  </div>
                  <Award className="h-12 w-12 opacity-70" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-green-100">Total Classes</p>
                    <h3 className="text-3xl font-bold mt-1">{stats.classes}</h3>
                    <p className="text-green-100 text-sm mt-2">
                      Across 12 grades
                    </p>
                  </div>
                  <Book className="h-12 w-12 opacity-70" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-purple-100">Library Books</p>
                    <h3 className="text-3xl font-bold mt-1">5,234</h3>
                    <p className="text-purple-100 text-sm mt-2">
                      +234 this year
                    </p>
                  </div>
                  <BookOpen className="h-12 w-12 opacity-70" />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "students" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Student Management
                </h2>
                <p className="text-gray-600">
                  Manage student records, attendance, and performance
                </p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Add New Student
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        STU-{student.roll}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium mr-3">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {student.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Roll: {student.roll}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {student.class}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        student{student.id}@school.edu
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <XCircle className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "teachers" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Teacher Management
                </h2>
                <p className="text-gray-600">
                  Manage teaching staff and their schedules
                </p>
              </div>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Add New Teacher
              </button>
            </div>
            {/* Teacher management content */}
            <p className="text-gray-600 mb-4">
              Detailed teacher management interface will be implemented here.
            </p>
          </div>
        )}

        {activeTab === "exams" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Exam Management
                </h2>
                <p className="text-gray-600">
                  Create exam schedules, enter results and generate reports
                </p>
              </div>
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Schedule New Exam
              </button>
            </div>
            {/* Exam management content */}
            <p className="text-gray-600 mb-4">
              Detailed exam management interface will be implemented here.
            </p>
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Academic Calendar
                </h2>
                <p className="text-gray-600">
                  View and manage all important dates and events
                </p>
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Add New Event
              </button>
            </div>
            {/* Calendar content */}
            <p className="text-gray-600 mb-4">
              Interactive calendar interface will be implemented here.
            </p>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Reports & Analytics
                </h2>
                <p className="text-gray-600">
                  Generate detailed reports and analytics
                </p>
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center">
                <Download className="h-5 w-5 mr-2" />
                Generate Report
              </button>
            </div>
            {/* Reports content */}
            <p className="text-gray-600 mb-4">
              Advanced reporting and analytics interface will be implemented
              here.
            </p>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  System Settings
                </h2>
                <p className="text-gray-600">
                  Configure school management system settings
                </p>
              </div>
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Save Settings
              </button>
            </div>
            {/* Settings content */}
            <p className="text-gray-600 mb-4">
              System configuration interface will be implemented here.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
                <span className="font-semibold text-gray-800">
                  School Management System
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                © 2023 All rights reserved
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                Contact
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                Help Center
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Display;
