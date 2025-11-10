import React from 'react';

const Security = () => {
  const guards = [
    { name: 'Ramesh Kumar', shift: 'Day', status: 'On Duty' },
    { name: 'Suresh Patel', shift: 'Night', status: 'Off Duty' },
  ];

  return (
    <div className=" p-4 bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-4">Security Dashboard</h1>

        {/* Guards Status */}
        <section className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Guard Shift Status</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {guards.map((guard, i) => (
              <div key={i} className="p-3 border border-gray-200 rounded-md shadow-sm">
                <p className="text-sm font-semibold">{guard.name}</p>
                <p className="text-xs text-gray-500">Shift: {guard.shift}</p>
                <p className={`text-xs font-medium mt-1 ${guard.status === 'On Duty' ? 'text-green-600' : 'text-red-500'}`}>
                  Status: {guard.status}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Emergency Contacts */}
        <section className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Emergency Contacts</h2>
          <ul className="text-sm space-y-2">
            <li><span className="font-semibold">Security Head:</span> +91 9876543210</li>
            <li><span className="font-semibold">Local Police:</span> 100</li>
            <li><span className="font-semibold">Fire Station:</span> 101</li>
            <li><span className="font-semibold">Ambulance:</span> 102</li>
          </ul>
        </section>

        {/* Dummy Gate Pass Generator */}
        <section className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Gate Pass Generator</h2>
          <p className="text-sm text-gray-500 mb-2">Feature coming soon! You’ll be able to generate digital gate passes here.</p>
          <button
            disabled
            className="bg-gray-300 text-gray-600 py-2 px-4 rounded-md text-sm cursor-not-allowed"
          >
            Generate Gate Pass (Disabled)
          </button>
        </section>
      </div>
    </div>
  );
};

export default Security;
