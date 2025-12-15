import React from "react";

const StudentAdmitCard = ({ student }) => {
  return (
    <div className="w-full flex justify-center p-2 print:p-1 print:break-after-page">
      <div className="w-[800px] h-[500px] bg-white border-2 hidden border-black rounded-lg p-2 print:block print:p-1 print:w-full print:h-[480px]">
        {/* Header */}
        <div className="text-center border-b-2 border-black pb-1">
          <h1 className="text-xl font-bold uppercase">Your School Name</h1>
          <p className="text-sm text-gray-600">School Address, City, Country</p>
          <h2 className="mt-1 text-lg font-semibold underline">ADMIT CARD</h2>
        </div>

        {/* Student Info */}
        <div className="grid grid-cols-4 gap-4 mb-2">
          {/* Left Info */}
          <div className="col-span-3">
            <table className="w-full border border-black text-sm mt-1">
              <tbody>
                <tr>
                  <td className="border border-black px-2 py-1 font-semibold">
                    Student Name
                  </td>
                  <td className="border border-black px-2 py-1">
                    {student.studentName}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-1 font-semibold">
                    Father's Name
                  </td>
                  <td className="border border-black px-2 py-1">
                    {student.fatherName || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-1 font-semibold">
                    Class
                  </td>
                  <td className="border border-black px-2 py-1">
                    {student.studentClass}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-1 font-semibold">
                    Roll No
                  </td>
                  <td className="border border-black px-2 py-1">
                    {student.studentRoll}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-1 font-semibold">
                    Registration No
                  </td>
                  <td className="border border-black px-2 py-1">
                    {student.registrationNo || "—"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Photo */}
          <div className="col-span-1 flex items-center justify-center">
            <div className="w-28 h-32 border-2 border-black flex items-center justify-center text-xs text-gray-500">
              Student Photo
            </div>
          </div>
        </div>

        {/* Exam Info */}
        <div className="mb-2 w-full">
          <table className="w-full border border-black text-sm">
            <tbody>
              <tr>
                <td className="border border-black px-2 py-1 font-semibold">
                  Examination
                </td>
                <td className="border border-black px-2 py-1">
                  Annual Examination 2025
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 font-semibold">
                  Exam Center
                </td>
                <td className="border border-black px-2 py-1">
                  Your School Campus
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 font-semibold">
                  Exam Time
                </td>
                <td className="border border-black px-2 py-1">
                  10:00 AM – 1:00 PM
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Instructions */}
        <div className="mb-1 w-full ">
          <h3 className="font-bold underline mb-1">Instructions:</h3>
          <ul className="w-full grid grid-cols-2 list-decimal pl-5 text-sm">
            <li className="col-span-1">
              Admit card must be brought to the examination hall.
            </li>
            <li className="col-span-1">No electronic devices are allowed.</li>
            <li className="col-span-1">
              Student must arrive 30 minutes before exam time.
            </li>
            <li className="col-span-1">
              Without admit card, entry is strictly prohibited.
            </li>
          </ul>
        </div>

        {/* Signatures */}
        <div className="flex item justify-between items-center mt-6">
          <div className="text-center">
            <div className="w-40 border-t border-black mx-auto mb-1"></div>
            <p className="text-sm">Class Teacher</p>
          </div>

          <div className="text-center">
            <div className="w-40 border-t border-black mx-auto mb-1"></div>
            <p className="text-sm">Headmaster</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          This is a computer generated admit card.
        </div>
      </div>
    </div>
  );
};

export default StudentAdmitCard;
