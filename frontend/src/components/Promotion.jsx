import React, { useState, useEffect } from "react";
import {
  ArrowPathIcon,
  ChevronUpIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CalendarIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const Promotion = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [msg, setMsg] = useState(null);
  const [sessionName, setSessionName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(false);
  const [promotionLoading, setPromotionLoading] = useState(false);

  const [studentPromotionData, setStudentPromotionData] = useState({});

  const [bulkSettings, setBulkSettings] = useState({
    targetClass: "",
    targetSession: "",
    defaultGroup: "General",
  });

  /* ---------------- FETCH DATA ---------------- */

  const fetchSessions = async () => {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/sessions`);
    const data = await res.json();
    setSessions(data);
    if (data.length) setSessionName(data[0].sessionName);
  };

  const fetchClasses = async () => {
    if (!sessionName) return;
    setLoading(true);
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/classes/${sessionName}`
    );
    const data = await res.json();
    setClasses(data);
    setLoading(false);
  };

  const fetchStudentsByClass = async () => {
    if (!selectedClass || !sessionName) return;
    setLoading(true);

    const res = await fetch(
      `${
        import.meta.env.VITE_BASE_URL
      }/students/${selectedClass}?sessionName=${sessionName}`
    );
    const data = await res.json();
    setStudents(data);

    const initData = {};
    data.forEach((s) => {
      initData[s._id] = {
        targetClass: "",
        targetSession: "",
        roll: "",
        group: bulkSettings.defaultGroup,
        isSelected: false,
      };
    });

    setStudentPromotionData(initData);
    setLoading(false);
  };

  /* ---------------- HELPERS ---------------- */

  const updateStudent = (id, field, value) => {
    setStudentPromotionData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const toggleSelectAll = () => {
    const allSelected = Object.values(studentPromotionData).every(
      (s) => s.isSelected
    );
    const updated = {};
    Object.keys(studentPromotionData).forEach((id) => {
      updated[id] = {
        ...studentPromotionData[id],
        isSelected: !allSelected,
      };
    });
    setStudentPromotionData(updated);
  };

  const getSelectedCount = () =>
    Object.values(studentPromotionData).filter((s) => s.isSelected).length;

  /* ---------------- BULK APPLY ---------------- */

  const applyBulkToSelected = () => {
    const updated = { ...studentPromotionData };
    Object.keys(updated).forEach((id) => {
      if (updated[id].isSelected) {
        updated[id] = {
          ...updated[id],
          targetClass: bulkSettings.targetClass,
          targetSession: bulkSettings.targetSession,
          group: bulkSettings.defaultGroup,
        };
      }
      setMsg("Studets are ready for promote");
      setTimeout(() => {
        setMsg(null);
      }, 3000);
    });
    setStudentPromotionData(updated);
  };

  /* ---------------- PROMOTION ---------------- */

  const promoteStudents = async () => {
    const selected = Object.entries(studentPromotionData)
      .filter(([_, d]) => d.isSelected)
      .map(([id, d]) => ({ studentId: id, ...d }));

    if (!selected.length) {
      alert("Select at least one student");
      return;
    }

    const invalid = selected.filter(
      (s) => !s.targetClass || !s.targetSession || !s.roll
    );

    if (invalid.length) {
      alert("Each selected student must have Class, Session & Roll");
      return;
    }

    setPromotionLoading(true);

    const promotions = selected.map((s) => ({
      oldStudentId: s.studentId,
      studentClass: s.targetClass,
      studentSessions: s.targetSession,
      studentRoll: Number(s.roll),
      studentGroup: s.group,
      examSessionName: s.targetSession,
    }));

    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/students/promote`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promotions }),
      }
    );

    const result = await res.json();
    setPromotionLoading(false);

    if (result.success) {
      alert(`${result.promotedCount} students promoted`);
      fetchStudentsByClass();
    } else {
      alert(result.message || "Promotion failed");
    }
  };

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [sessionName]);

  useEffect(() => {
    fetchStudentsByClass();
  }, [selectedClass]);

  /* ---------------- UI ---------------- */

  return (
    <div className="p-6 bg-gray-50 min-h-screen capitalize">
      <h1 className="text-3xl font-bold mb-6">Student Promotion</h1>
      <div className="text-green-500">{msg && msg}</div>
      {/* Session & Class */}
      <div className="bg-white p-4 rounded shadow mb-6 grid md:grid-cols-3 gap-4">
        <select
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          className="border p-2 rounded"
        >
          {sessions.map((s) => (
            <option key={s._id}>{s.sessionName}</option>
          ))}
        </select>

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border p-2 rounded capitalize"
        >
          <option value="">Select Class</option>
          {classes.map((c) => (
            <option key={c._id}>{c.className}</option>
          ))}
        </select>

        <button
          onClick={fetchStudentsByClass}
          className="bg-blue-600 text-white rounded px-4"
        >
          Load Students
        </button>
      </div>

      {/* Bulk */}
      <div className="bg-white p-4 rounded shadow mb-6 grid md:grid-cols-3 gap-4">
        <select
          onChange={(e) =>
            setBulkSettings({ ...bulkSettings, targetClass: e.target.value })
          }
          className="border p-2 rounded capitalize"
        >
          <option value="">Target Class</option>
          {classes.map((c) => (
            <option key={c._id}>{c.className}</option>
          ))}
        </select>

        <select
          onChange={(e) =>
            setBulkSettings({ ...bulkSettings, targetSession: e.target.value })
          }
          className="border p-2 rounded"
        >
          <option value="">Target Session</option>
          {sessions.map((s) => (
            <option key={s._id}>{s.sessionName}</option>
          ))}
        </select>

        <button
          onClick={applyBulkToSelected}
          className="bg-purple-600 text-white rounded px-4"
        >
          Apply To Selected
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th>
                <input type="checkbox" onChange={toggleSelectAll} />
              </th>
              <th>Current Roll</th>
              <th>Name</th>
              <th>New Roll *</th>
              <th>Group</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => {
              const d = studentPromotionData[s._id] || {};
              return (
                <tr key={s._id} className={d.isSelected ? "bg-blue-50" : ""}>
                  <td>
                    <input
                      type="checkbox"
                      checked={d.isSelected || false}
                      onChange={() =>
                        updateStudent(s._id, "isSelected", !d.isSelected)
                      }
                    />
                  </td>
                  <td>{s.studentRoll}</td>
                  <td>{s.studentName}</td>
                  <td>
                    <input
                      type="number"
                      value={d.roll || ""}
                      onChange={(e) =>
                        updateStudent(s._id, "roll", e.target.value)
                      }
                      className="border p-1 w-20"
                    />
                  </td>
                  <td>
                    <select
                      value={d.group}
                      onChange={(e) =>
                        updateStudent(s._id, "group", e.target.value)
                      }
                      className="border p-1"
                    >
                      <option>General</option>
                      <option>Science</option>
                      <option>Commerce</option>
                      <option>Arts</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {getSelectedCount() > 0 && (
        <button
          onClick={promoteStudents}
          disabled={promotionLoading}
          className="mt-6 bg-green-600 text-white px-6 py-2 rounded"
        >
          Promote {getSelectedCount()} Students
        </button>
      )}
    </div>
  );
};

export default Promotion;
