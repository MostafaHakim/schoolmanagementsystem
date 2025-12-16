import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const formatDate = (date) => new Date(date).toLocaleDateString();

// Calculate total days between two dates (inclusive)
const calculateTotalDays = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime =
    endDate.setHours(0, 0, 0, 0) - startDate.setHours(0, 0, 0, 0);
  return diffTime / (1000 * 60 * 60 * 24) + 1;
};

// Get array of dates between start and end
const getDateRange = (start, end) => {
  const dates = [];
  let current = new Date(start);
  const last = new Date(end);
  while (current <= last) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

const Events = () => {
  const { sessionName } = useParams();
  const [events, setEvents] = useState([]);
  const [view, setView] = useState("table");
  const [loading, setLoading] = useState(false);

  // Add Event states
  const [showModal, setShowModal] = useState(false);
  const [multiDay, setMultiDay] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    startDate: "",
    endDate: "",
    eventSession: sessionName || "",
  });

  useEffect(() => {
    fetchEvents();
  }, [sessionName]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/events/${sessionName}`
      );
      const data = await res.json();
      if (data.success) setEvents(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalEndDate = multiDay ? formData.endDate : formData.startDate;
    const totalDays = calculateTotalDays(formData.startDate, finalEndDate);

    const payload = {
      title: formData.title,
      type: formData.type,
      startDate: formData.startDate,
      endDate: finalEndDate,
      eventSession: formData.eventSession,
      totalDays, // frontend calculated
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setFormData({
          title: "",
          type: "",
          startDate: "",
          endDate: "",
          eventSession: sessionName || "",
        });
        setMultiDay(false);
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Calendar grouping
  const groupedByDate = {};
  events.forEach((event) => {
    const start = event.startDate || event.date;
    const end = event.endDate || event.date;

    getDateRange(start, end).forEach((d) => {
      const key = formatDate(d);
      if (!groupedByDate[key]) groupedByDate[key] = [];
      groupedByDate[key].push(event);
    });
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📅 Events</h2>

        <div className="flex gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            ➕ Add Event
          </button>

          <button
            onClick={() => setView("table")}
            className={`px-4 py-2 rounded-lg text-sm ${
              view === "table" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Table
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`px-4 py-2 rounded-lg text-sm ${
              view === "calendar" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Calendar
          </button>
        </div>
      </div>

      {/* TABLE VIEW */}
      {!loading && view === "table" && (
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Total Days</th>
                <th className="px-4 py-3">Session</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e, i) => (
                <tr key={e._id} className="border-t">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2 font-medium">{e.title}</td>
                  <td className="px-4 py-2">{e.type}</td>
                  <td className="px-4 py-2">
                    {formatDate(e.startDate) === formatDate(e.endDate)
                      ? formatDate(e.startDate)
                      : `${formatDate(e.startDate)} → ${formatDate(e.endDate)}`}
                  </td>
                  <td className="px-4 py-2">{e.totalDays}</td>
                  <td className="px-4 py-2">{e.eventSession}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CALENDAR VIEW */}
      {!loading && view === "calendar" && (
        <div className="space-y-4">
          {Object.entries(groupedByDate).map(([date, events]) => (
            <div key={date} className="bg-white border rounded-xl p-4">
              <h3 className="font-semibold mb-2">📌 {date}</h3>
              {events.map((e) => (
                <div key={e._id} className="text-sm">
                  • {e.title} ({e.type}) [{e.eventSession}] ({e.totalDays} days)
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ADD EVENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-md rounded-xl p-6 space-y-4"
          >
            <h3 className="text-lg font-semibold">➕ Add Event</h3>

            <input
              required
              placeholder="Event title"
              className="w-full border p-2 rounded"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <select
              required
              className="w-full border p-2 rounded"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              <option value="">Select type</option>
              <option value="Exam">Exam</option>
              <option value="Holiday">Holiday</option>
              <option value="Program">Program</option>
              <option value="Meeting">Meeting</option>
            </select>

            <input
              type="date"
              required
              className="w-full border p-2 rounded"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={multiDay}
                onChange={() => setMultiDay(!multiDay)}
              />
              Multiple day event
            </label>

            {multiDay && (
              <input
                type="date"
                required
                className="w-full border p-2 rounded"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Events;
