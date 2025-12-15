// src/components/CompactMoneyReceipt.jsx
import React from "react";

const CompactMoneyReceipt = React.forwardRef(
  ({ student, fee, schoolName = "Academic Excellence School" }, ref) => {
    return (
      <div
        ref={ref}
        className="p-3 w-full max-w-3xl mx-auto border border-gray-300 rounded bg-white print:shadow-none print:border-gray-400 print:w-[180mm]"
      >
        {/* Header Row */}
        <div className="flex justify-between items-start border-b border-gray-300 pb-2 mb-3">
          <div className="flex-1">
            <h1 className="text-lg font-bold text-blue-900">{schoolName}</h1>
            <p className="text-[10px] text-gray-500">Official Money Receipt</p>
          </div>
          <div className="text-right">
            <div className="px-2 py-1 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm font-bold text-blue-800">RECEIPT</p>
              <p className="text-[10px] text-gray-500">
                #{fee.receiptNo || Date.now().toString().slice(-6)}
              </p>
            </div>
            <p className="text-[10px] text-gray-600 mt-1">
              Date:{" "}
              {fee.paidDate
                ? new Date(fee.paidDate).toLocaleDateString()
                : new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Two Column Content */}
        <div className="flex gap-4">
          {/* Left - Student Info */}
          <div className="flex-1">
            <div className="mb-3">
              <h3 className="font-semibold text-gray-700 text-sm mb-1">
                STUDENT
              </h3>
              <div className="space-y-1 text-xs">
                <p>
                  <span className="font-medium text-gray-600">Name:</span>{" "}
                  {student.studentName}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Roll:</span>{" "}
                  {student.studentRoll}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Class:</span>{" "}
                  {student.studentClass}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Session:</span>{" "}
                  {student.studentSessions}
                </p>
                {student.studentGroup && (
                  <p>
                    <span className="font-medium text-gray-600">Group:</span>{" "}
                    {student.studentGroup}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-2">
              <h3 className="font-semibold text-gray-700 text-sm mb-1">
                PAYMENT INFO
              </h3>
              <div className="space-y-1 text-xs">
                <p>
                  <span className="font-medium text-gray-600">Fee:</span>{" "}
                  {fee.feesName}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Method:</span>{" "}
                  {fee.paymentMethod || "Cash"}
                </p>
                {fee.transactionId && (
                  <p>
                    <span className="font-medium text-gray-600">Txn ID:</span>{" "}
                    <span className="font-mono">{fee.transactionId}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right - Payment Amount */}
          <div className="flex-1">
            <div className="bg-blue-50 border border-blue-200 rounded p-3 h-full">
              <h3 className="font-semibold text-gray-700 text-sm mb-2">
                PAYMENT RECEIVED
              </h3>

              <div className="bg-white p-3 rounded border border-green-300 mb-2">
                <p className="text-[10px] text-gray-500 mb-1">Amount in Taka</p>
                <p className="text-xl font-bold text-green-700">
                  ৳{fee.feeAmount.toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-500 mt-1">
                  ({fee.feeAmount.toLocaleString()} Taka Only)
                </p>
              </div>

              <div className="text-center mt-4 pt-2 border-t border-blue-200">
                <div className="flex justify-around mb-2">
                  <div>
                    <div className="h-0.5 w-10 bg-gray-400 mx-auto mb-1"></div>
                    <p className="text-[9px] text-gray-500">Cashier</p>
                  </div>
                  <div>
                    <div className="h-0.5 w-10 bg-gray-400 mx-auto mb-1"></div>
                    <p className="text-[9px] text-gray-500">Seal</p>
                  </div>
                </div>
                <p className="text-[9px] text-gray-500 italic">
                  Computer generated - Valid without signature
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 pt-2 border-t border-gray-200">
          <div className="flex justify-between items-center text-[10px] text-gray-500">
            <p>Thank you for your payment</p>
            <p>Contact: accounts@school.edu.bd</p>
          </div>
        </div>
      </div>
    );
  }
);

export default CompactMoneyReceipt;
