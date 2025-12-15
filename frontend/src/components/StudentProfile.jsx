import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import MoneyReceipt from "../components/MoneyReceipt";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [selectedFee, setSelectedFee] = useState(null);

  const receiptRef = useRef();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudent();
  }, []);

  // 🔹 Fetch student
  const fetchStudent = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/students/profile/${id}`
      );
      const data = await res.json();
      setStudent(data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Print receipt
  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
  });

  // 🔥 PAY FEE (CORRECT WAY)
  const handlePayFee = async (feeId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/students/fees/pay/${
          student._id
        }/${feeId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Payment failed");
        return;
      }

      // ✅ update frontend state from backend response
      const updatedFees = student.studentFees.map((fee) =>
        fee._id === feeId ? data.fee : fee
      );

      setStudent({ ...student, studentFees: updatedFees });
      setSelectedFee(data.fee);

      // auto print
      setTimeout(() => handlePrint(), 300);
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong");
    }
  };

  if (!student) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  const dueFees = student.studentFees.filter((f) => f.status !== "paid");
  const paidFees = student.studentFees.filter((f) => f.status === "paid");

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white shadow rounded space-y-8">
      {/* Student Info */}
      <div>
        <h2 className="text-3xl font-bold">{student.studentName}</h2>
        <p>Roll: {student.studentRoll}</p>
        <p>Class: {student.studentClass}</p>
      </div>

      {/* 🔴 DUE FEES */}
      <div>
        <h3 className="text-2xl font-semibold mb-2 text-red-600">Due Fees</h3>

        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Fee</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {dueFees.map((fee) => (
              <tr key={fee._id} className="text-center">
                <td className="border p-2">{fee.feesName}</td>
                <td className="border p-2">৳{fee.feeAmount}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handlePayFee(fee._id)}
                    className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Pay
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🟢 PAID FEES */}
      <div>
        <h3 className="text-2xl font-semibold mb-2 text-green-600">
          Paid Fees
        </h3>

        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Fee</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Paid Date</th>
              <th className="border p-2">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {paidFees.map((fee) => (
              <tr key={fee._id} className="text-center">
                <td className="border p-2">{fee.feesName}</td>
                <td className="border p-2">৳{fee.feeAmount}</td>
                <td className="border p-2">
                  {new Date(fee.paidDate).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => {
                      setSelectedFee(fee);
                      setTimeout(() => handlePrint(), 200);
                    }}
                    className="text-blue-600 underline"
                  >
                    Print
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="px-6 py-2 bg-blue-500 text-white rounded"
      >
        Back
      </button>

      {/* 🧾 Hidden Receipt */}
      <div className="hidden">
        {selectedFee && (
          <MoneyReceipt ref={receiptRef} student={student} fee={selectedFee} />
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
