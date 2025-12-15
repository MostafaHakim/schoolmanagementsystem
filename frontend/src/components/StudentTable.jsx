import { useNavigate } from "react-router-dom";

const StudentTable = ({ students }) => {
  const navigate = useNavigate();
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left py-2 px-4 border-b">Roll No</th>
            <th className="text-left py-2 px-4 border-b">Name</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr
              key={student.id}
              className="hover:bg-gray-50 cursor-pointer transition"
            >
              <td className="py-2 px-4 border-b">{student.studentRoll}</td>
              <td className="py-2 px-4 border-b">{student.studentName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
