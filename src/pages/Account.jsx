import React, { useState } from "react";
import { FaPlus, FaTrash, FaCheckCircle, FaTimesCircle, FaWallet, FaQrcode } from "react-icons/fa";

const Accounts = () => {
  const [paymentHistory, setPaymentHistory] = useState([
    { id: 1, date: "2025-03-15", amount: "Rs.2500.00", status: "Completed" },
    { id: 2, date: "2025-03-12", amount: "Rs.1500.00", status: "Pending" },
    { id: 3, date: "2025-03-10", amount: "Rs.3500.00", status: "Failed" },
  ]);

  const [methods, setMethods] = useState([
    { id: 1, type: "Visa", last4: "1234", logo: "/visa-logo.png", bg: "bg-gradient-to-r from-blue-500 to-blue-700" },
    { id: 2, type: "MasterCard", last4: "5678", logo: "/mastercard-logo.png", bg: "bg-gradient-to-r from-red-500 to-yellow-500" },
  ]);

  const upiQR = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=example@upi&pn=FlowKraft&am=100";

  const handleAddMethod = () => {
    const newMethod = {
      id: Date.now(),
      type: "Amex",
      last4: "0000",
      logo: "/amex-logo.png",
      bg: "bg-gradient-to-r from-gray-500 to-gray-700"
    };
    setMethods((prev) => [...prev, newMethod]);
  };

  const handleDeleteMethod = (id) => {
    setMethods((prev) => prev.filter((method) => method.id !== id));
  };

  return (
    <div className=" bg-gray-50 text-gray-800 ">
      <div className="max-w-6xl mx-auto space-y-4">

        {/* Wallet Section */}
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
          <div className="flex items-center">
            <FaWallet className="text-blue-600 text-3xl mr-4" />
            <div>
              <p className="text-lg font-semibold text-gray-800">Wallet Balance</p>
              <p className="text-xl font-bold text-green-600">Rs.1,250.00</p>
            </div>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
            Add Funds
          </button>
        </div>

        {/* UPI Section */}
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-1">UPI Payment</h2>
            <p className="text-gray-600 text-sm">Scan the QR code below to pay using UPI.</p>
          </div>
          <div className="flex items-center gap-4">
            <img src={upiQR} alt="UPI QR Code" className="w-24 h-24 rounded-lg shadow-md" />
            <div>
              <p className="text-md font-medium">UPI ID:</p>
              <p className="text-gray-700 text-sm">example@upi</p>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-2">Payment History</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100 text-sm">
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-left">Amount</th>
                  <th className="px-3 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <tr key={payment.id} className="border-t text-sm">
                    <td className="px-3 py-2">{payment.date}</td>
                    <td className="px-3 py-2">{payment.amount}</td>
                    <td className="px-3 py-2">
                      {payment.status === "Completed" ? (
                        <FaCheckCircle className="text-green-500" />
                      ) : payment.status === "Pending" ? (
                        <FaTimesCircle className="text-yellow-500" />
                      ) : (
                        <FaTimesCircle className="text-red-500" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Methods with Graphics */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-2">Payment Methods</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {methods.map((method) => (
              <div
                key={method.id}
                className={`rounded-lg p-4 flex justify-between items-center shadow-md transition hover:shadow-lg ${method.bg}`}
                style={{ minHeight: "140px", backgroundSize: "cover", backgroundPosition: "center" }}
              >
                <div>
                  <img src={method.logo} alt={`${method.type} Logo`} className="w-12 h-12 mb-2" />
                  <p className="text-md font-semibold text-white">{method.type}</p>
                  <p className="text-gray-200 text-sm">**** {method.last4}</p>
                </div>
                <button
                  onClick={() => handleDeleteMethod(method.id)}
                  className="text-white hover:text-red-300"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            
            <div
              onClick={handleAddMethod}
              className="border rounded-lg p-4 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition"
            >
              <FaPlus className="text-blue-600" />
              <span className="ml-2">Add Method</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Accounts;
