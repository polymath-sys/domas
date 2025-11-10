import React, { useState } from 'react';
import { CloudArrowUpIcon, CurrencyRupeeIcon, InboxIcon } from '@heroicons/react/24/outline';

const Maintainance = () => {
  const [payments] = useState([
    { month: 'Mar 2025', amount: 1500, status: 'Paid', date: 'Mar 5, 2025' },
    { month: 'Apr 2025', amount: 1500, status: 'Unpaid', due: 'Apr 10, 2025' },
  ]);

  return (
    <div className=" bg-gray-50 px-4 py-6 text-gray-800">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <h1 className="text-2xl font-bold text-center text-blue-800">Maintenance Overview</h1>

        {/* Summary + Upload */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-md shadow p-4 space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium text-gray-600">Next Due</h2>
                <p className="text-sm text-gray-800">Apr 10, 2025</p>
              </div>
              <div className="flex items-center text-blue-600">
                <CurrencyRupeeIcon className="h-5 w-5 mr-1" />
                <span className="font-semibold">1500</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md shadow p-4">
            <h2 className="text-sm font-medium text-gray-600 mb-2">Upload Receipt</h2>
            <label className="flex flex-col items-center justify-center border border-dashed border-blue-400 py-4 rounded cursor-pointer hover:bg-blue-50 transition">
              <CloudArrowUpIcon className="h-6 w-6 text-blue-500 mb-1" />
              <span className="text-xs text-blue-700">Click to upload</span>
              <input type="file" className="hidden" />
            </label>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-md shadow p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Payment History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 border-b">
                <tr>
                  <th className="py-2">Month</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-2">{p.month}</td>
                    <td>₹{p.amount}</td>
                    <td className={`${p.status === 'Paid' ? 'text-green-600' : 'text-red-500'}`}>{p.status}</td>
                    <td>{p.date || p.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Contact Office */}
        <div className="bg-white rounded-md shadow p-4 text-center">
          <InboxIcon className="h-5 w-5 text-indigo-500 mx-auto mb-1" />
          <p className="text-xs text-gray-600 mb-2">Need help or clarification?</p>
          <button className="text-sm bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700">
            Contact Office
          </button>
        </div>

      </div>
    </div>
  );
};

export default Maintainance;
