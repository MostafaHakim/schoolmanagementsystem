import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import {
  ArrowLeft,
  Download,
  Printer,
  CheckCircle,
  AlertCircle,
  User,
  BookOpen,
  Calendar,
  DollarSign,
  Receipt,
  CreditCard,
} from "lucide-react";
import MoneyReceipt from "../components/MoneyReceipt";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [selectedFee, setSelectedFee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("due");

  const receiptRef = useRef();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/students/profile/${id}`
      );
      const data = await res.json();
      setStudent(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `${student?.studentName}_Receipt`,
  });

  const handlePayFee = async (feeId) => {
    if (!confirm("Are you sure you want to mark this fee as paid?")) return;

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

      const updatedFees = student.studentFees.map((fee) =>
        fee._id === feeId ? data.fee : fee
      );

      setStudent({ ...student, studentFees: updatedFees });
      setSelectedFee(data.fee);

      setTimeout(() => handlePrint(), 500);
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center capitalize">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">
            Student not found
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const dueFees = student.studentFees.filter((f) => f.status !== "paid");
  const paidFees = student.studentFees.filter((f) => f.status === "paid");
  const totalDue = dueFees.reduce(
    (sum, fee) => sum + parseFloat(fee.feeAmount),
    0
  );
  const totalPaid = paidFees.reduce(
    (sum, fee) => sum + parseFloat(fee.feeAmount),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 capitalize">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Student Profile
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              Roll: {student.studentRoll}
            </div>
          </div>
        </div>

        {/* Student Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-start space-x-4 mb-4 md:mb-0">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {student.studentName}
                </h2>
                <div className="flex flex-wrap gap-3 mt-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span>Class: {student.studentClass}</span>
                  </div>
                  {student.studentGroup && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <span>Group: {student.studentGroup}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-gray-600">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <Calendar className="w-4 h-4" />
                    <span>Session: {student.studentSessions}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-50 p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-1">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-red-600">Due</span>
                </div>
                <p className="text-2xl font-bold text-red-700">৳{totalDue}</p>
                <p className="text-xs text-red-500 mt-1">
                  {dueFees.length} fees pending
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-1">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    Paid
                  </span>
                </div>
                <p className="text-2xl font-bold text-green-700">
                  ৳{totalPaid}
                </p>
                <p className="text-xs text-green-500 mt-1">
                  {paidFees.length} fees paid
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fee Management Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === "due"
                  ? "border-b-2 border-red-500 text-red-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("due")}
            >
              <div className="flex items-center justify-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>Due Fees ({dueFees.length})</span>
              </div>
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === "paid"
                  ? "border-b-2 border-green-500 text-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("paid")}
            >
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Paid Fees ({paidFees.length})</span>
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "due" ? (
              <div>
                {dueFees.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No Due Fees
                    </h3>
                    <p className="text-gray-500">
                      All fees have been paid for this student.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {dueFees.map((fee) => (
                      <div
                        key={fee._id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-xl hover:border-red-300 transition"
                      >
                        <div className="mb-3 md:mb-0">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                              <DollarSign className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">
                                {fee.feesName}
                              </h4>
                              <p className="text-sm text-gray-500">
                                Due Date:{" "}
                                {new Date(fee.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-red-700">
                              ৳{fee.feeAmount}
                            </p>
                            <p className="text-sm text-gray-500">
                              {fee.status || "Pending"}
                            </p>
                          </div>
                          <button
                            onClick={() => handlePayFee(fee._id)}
                            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition flex items-center space-x-2"
                          >
                            <CreditCard className="w-4 h-4" />
                            <span>Pay Now</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {paidFees.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No Payment History
                    </h3>
                    <p className="text-gray-500">No fees have been paid yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-gray-600 font-medium">
                            Fee Name
                          </th>
                          <th className="text-left py-3 px-4 text-gray-600 font-medium">
                            Amount
                          </th>
                          <th className="text-left py-3 px-4 text-gray-600 font-medium">
                            Paid Date
                          </th>
                          <th className="text-left py-3 px-4 text-gray-600 font-medium">
                            Receipt
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paidFees.map((fee) => (
                          <tr
                            key={fee._id}
                            className="border-b hover:bg-gray-50 transition"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                                  <Receipt className="w-4 h-4 text-green-600" />
                                </div>
                                <span className="font-medium">
                                  {fee.feesName}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-bold text-green-700">
                                ৳{fee.feeAmount}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>
                                  {new Date(fee.paidDate).toLocaleDateString()}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    setSelectedFee(fee);
                                    setTimeout(() => handlePrint(), 300);
                                  }}
                                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition flex items-center space-x-2"
                                >
                                  <Printer className="w-4 h-4" />
                                  <span>Print</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedFee(fee);
                                    setTimeout(() => handlePrint(), 300);
                                  }}
                                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center space-x-2"
                                >
                                  <Download className="w-4 h-4" />
                                  <span>PDF</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Back to List
          </button>
        </div>
      </div>

      {/* Hidden Receipt for Printing */}
      <div className="hidden">
        {selectedFee && (
          <MoneyReceipt
            ref={receiptRef}
            student={student}
            fee={selectedFee}
            schoolName="Greenwood International School"
          />
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
