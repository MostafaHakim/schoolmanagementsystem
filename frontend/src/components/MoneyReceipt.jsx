import React from "react";

const MoneyReceipt = React.forwardRef(
  ({ student, fee, schoolName = "Academic Excellence School" }, ref) => {
    return (
      <div
        ref={ref}
        className="p-4 w-full max-w-4xl mx-auto border border-gray-300 rounded-lg bg-white shadow-sm print:shadow-none print:border-gray-400 print:w-[210mm]"
      >
        {/* Main Grid Container */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left Column - School Header */}
          <div className="col-span-4 border-r border-gray-200 pr-4">
            {/* School Header */}
            <div className="text-center mb-4">
              <div className="mb-2">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-blue-800 font-bold text-xl">S</span>
                </div>
                <h1 className="text-lg font-bold text-blue-900">
                  {schoolName}
                </h1>
              </div>
              <p className="text-xs text-gray-600 mb-1">Academic Excellence</p>
              <p className="text-[10px] text-gray-500 leading-tight">
                123 Education Road, Academic City
                <br />
                Phone: 017XX-XXXXXX
              </p>
            </div>

            {/* Receipt Title */}
            <div className="text-center mt-6 mb-4">
              <div className="px-3 py-1 bg-blue-50 border border-blue-200 rounded">
                <h2 className="text-base font-bold text-blue-800">
                  MONEY RECEIPT
                </h2>
                <p className="text-[10px] text-gray-500">
                  Official Payment Acknowledgement
                </p>
              </div>
            </div>

            {/* Receipt Info */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Receipt No:</span>
                <span className="font-semibold">
                  {fee.receiptNo || `RCPT-${Date.now().toString().slice(-6)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Date:</span>
                <span>
                  {fee.paidDate
                    ? new Date(fee.paidDate).toLocaleDateString()
                    : new Date().toLocaleDateString()}
                </span>
              </div>
              {fee.paymentMethod && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Payment Method:
                  </span>
                  <span>{fee.paymentMethod}</span>
                </div>
              )}
            </div>

            {/* Footer Section */}
            <div className="mt-8 pt-4 border-t border-gray-200">
              <div className="space-y-3">
                <div className="text-center">
                  <div className="h-0.5 w-12 bg-gray-400 mx-auto mb-1"></div>
                  <p className="text-[10px] text-gray-500">
                    Cashier's Signature
                  </p>
                </div>
                <p className="text-[10px] text-gray-500 italic text-center">
                  Computer generated receipt
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Student & Payment Details */}
          <div className="col-span-8">
            {/* Student Details */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2 pb-1 border-b border-gray-300 text-sm">
                Student Information
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="font-medium text-gray-600">Name</p>
                  <p className="font-semibold text-sm">{student.studentName}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Roll No</p>
                  <p className="font-semibold text-sm">{student.studentRoll}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Class</p>
                  <p className="font-semibold">{student.studentClass}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Session</p>
                  <p className="font-semibold">{student.studentSessions}</p>
                </div>
                {student.studentGroup && (
                  <div>
                    <p className="font-medium text-gray-600">Group</p>
                    <p className="font-semibold">{student.studentGroup}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Details - Main Highlight */}
            <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
              <h3 className="font-semibold text-gray-700 mb-3 text-sm">
                Payment Details
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span className="font-medium text-gray-600">Fee Name:</span>
                  <span className="font-semibold">{fee.feesName}</span>
                </div>

                {/* Amount Highlight */}
                <div className="p-3 bg-white rounded border border-green-300 shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-600 text-sm">
                        Amount Paid
                      </p>
                      <p className="text-xs text-gray-500">
                        In Bangladeshi Taka
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-700">
                        ৳{fee.feeAmount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {fee.feeAmount.toLocaleString()} Taka Only
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Payment Info */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-white rounded border">
                    <p className="font-medium text-gray-600">Payment Date</p>
                    <p>
                      {fee.paidDate
                        ? new Date(fee.paidDate).toLocaleDateString("en-GB")
                        : new Date().toLocaleDateString("en-GB")}
                    </p>
                  </div>
                  {fee.transactionId && (
                    <div className="p-2 bg-white rounded border">
                      <p className="font-medium text-gray-600">
                        Transaction ID
                      </p>
                      <p className="font-mono text-[10px]">
                        {fee.transactionId}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notes and Thank You */}
            <div className="mt-4">
              <div className="p-2 bg-gray-50 rounded border border-gray-200 mb-3">
                <p className="text-[10px] text-gray-600 italic">
                  • Keep this receipt for future reference
                  <br />
                  • Payment once made is non-refundable
                  <br />• Contact accounts for any discrepancy
                </p>
              </div>

              <div className="text-center p-2 bg-blue-50 rounded border border-blue-100">
                <p className="font-bold text-blue-800">Thank You!</p>
                <p className="text-[10px] text-gray-600">
                  For queries: accounts@school.edu.bd | www.school.edu.bd
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default MoneyReceipt;
