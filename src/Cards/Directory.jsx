import React, { useState } from 'react';

const Directory = () => {
  // Sample contacts for society staff (watchman, manager, etc.)
  const [contacts] = useState([
    {
      name: 'John Doe',
      designation: 'Watchman',
      phone: '9876543210',
      email: 'john.doe@watchman.com',
    },
    {
      name: 'Mary Jane',
      designation: 'Security Guard',
      phone: '9876543211',
      email: 'mary.jane@security.com',
    },
    {
      name: 'Ravi Kumar',
      designation: 'Manager',
      phone: '9876543212',
      email: 'ravi.kumar@manager.com',
    },
    {
      name: 'Anjali Singh',
      designation: 'Cleaner',
      phone: '9876543213',
      email: 'anjali.singh@cleaner.com',
    },
    {
      name: 'Vikram Sharma',
      designation: 'Electrician',
      phone: '9876543214',
      email: 'vikram.sharma@electrician.com',
    },
    {
      name: 'Priya Patel',
      designation: 'Plumber',
      phone: '9876543215',
      email: 'priya.patel@plumber.com',
    },
  ]);

  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  // Filter and sort contacts based on search input
  const filteredContacts = contacts
    .filter(
      (contact) =>
        contact.name.toLowerCase().includes(search.toLowerCase()) ||
        contact.designation.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortAsc
        ? a.designation.localeCompare(b.designation)
        : b.designation.localeCompare(a.designation)
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Society Contact Directory</h1>

      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or designation"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 w-full sm:w-80"
        />
        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Sort by Designation {sortAsc ? '↑' : '↓'}
        </button>
      </div>

      {/* Contact List */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        {filteredContacts.length === 0 ? (
          <p className="text-gray-600">No contacts found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Designation</th>
                  <th className="py-2 px-4">Phone</th>
                  <th className="py-2 px-4">Email</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact, idx) => (
                  <tr
                    key={idx}
                    className="border-b last:border-none hover:bg-gray-50"
                  >
                    <td className="py-2 px-4">{contact.name}</td>
                    <td className="py-2 px-4">{contact.designation}</td>
                    <td className="py-2 px-4">{contact.phone}</td>
                    <td className="py-2 px-4">{contact.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Directory;
