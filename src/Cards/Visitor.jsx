import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from 'firebase/firestore';

const Visitor = () => {
  const [visitor, setVisitor] = useState({
    name: '',
    purpose: '',
    flatNumber: '',
    vehicleNumber: '',
  });

  const [visitorsList, setVisitorsList] = useState([]);

  const handleChange = (e) => {
    setVisitor({ ...visitor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!visitor.name || !visitor.purpose || !visitor.flatNumber) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await addDoc(collection(db, 'visitors'), {
        ...visitor,
        status: 'Entered',
        timestamp: serverTimestamp(),
      });
      setVisitor({
        name: '',
        purpose: '',
        flatNumber: '',
        vehicleNumber: '',
      });
    } catch (error) {
      console.error('Error adding visitor:', error);
    }
  };

  const markExit = async (id) => {
    try {
      const docRef = doc(db, 'visitors', id);
      await updateDoc(docRef, {
        status: 'Exited',
        exitTime: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating visitor:', error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'visitors'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVisitorsList(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Visitor Management</h1>

      {/* Visitor Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 mb-10 space-y-4"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Visitor Name*"
            value={visitor.name}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg w-full"
          />
          <input
            type="text"
            name="flatNumber"
            placeholder="Flat Number*"
            value={visitor.flatNumber}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg w-full"
          />
          <input
            type="text"
            name="purpose"
            placeholder="Purpose of Visit*"
            value={visitor.purpose}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg w-full"
          />
          <input
            type="text"
            name="vehicleNumber"
            placeholder="Vehicle Number (optional)"
            value={visitor.vehicleNumber}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Register Visitor
        </button>
      </form>

      {/* Visitor List */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Recent Visitors</h2>
        {visitorsList.length === 0 ? (
          <p>No visitors yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Flat</th>
                  <th className="py-2 px-4">Purpose</th>
                  <th className="py-2 px-4">Vehicle</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {visitorsList.map((visitor) => (
                  <tr
                    key={visitor.id}
                    className="border-b last:border-none hover:bg-gray-50"
                  >
                    <td className="py-2 px-4">{visitor.name}</td>
                    <td className="py-2 px-4">{visitor.flatNumber}</td>
                    <td className="py-2 px-4">{visitor.purpose}</td>
                    <td className="py-2 px-4">{visitor.vehicleNumber || '-'}</td>
                    <td
                      className={`py-2 px-4 font-semibold ${
                        visitor.status === 'Entered'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {visitor.status}
                    </td>
                    <td className="py-2 px-4">
                      {visitor.status === 'Entered' ? (
                        <button
                          onClick={() => markExit(visitor.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Mark Exit
                        </button>
                      ) : (
                        <span className="text-gray-400">Exited</span>
                      )}
                    </td>
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

export default Visitor;
