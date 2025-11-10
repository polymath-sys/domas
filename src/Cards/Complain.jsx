import React, { useState, useEffect } from 'react';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const Complain = () => {
  const [complaints, setComplaints] = useState([]);
  const [newComplain, setNewComplain] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "complaints"));
      const allComplaints = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComplaints(allComplaints);
      setLoading(false);
    };

    fetchComplaints();
  }, []);

  const handleAddComplaint = async (e) => {
    e.preventDefault();
    if (newComplain.trim() === '') return;

    const complaint = {
      description: newComplain,
      status: 'Pending',
      timestamp: new Date(),
    };

    try {
      await addDoc(collection(db, "complaints"), complaint);
      setComplaints([...complaints, complaint]);
      setNewComplain('');
    } catch (error) {
      console.error("Error adding complaint:", error);
    }
  };

  return (
    <div className=" bg-gradient-to-tr from-blue-50 to-purple-100 p-4">
      <div className="max-w-3xl mx-auto rounded-xl shadow-lg bg-white/70 backdrop-blur-md border border-white/30 p-4">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-4">Complaint Desk</h1>

        {/* Complaint Form */}
        <div className="bg-white/80 rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Submit Complaint</h2>
          <form onSubmit={handleAddComplaint} className="space-y-3">
            <textarea
              placeholder="What's bothering you?"
              value={newComplain}
              onChange={(e) => setNewComplain(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none text-sm"
              rows="3"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-md text-sm font-medium hover:scale-[1.01] hover:shadow transition"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Complaint List */}
        <div className="mt-5 bg-white/80 rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">All Complaints</h2>
          {loading ? (
            <p className="text-center text-gray-500 text-sm">Loading complaints...</p>
          ) : complaints.length === 0 ? (
            <p className="text-center text-gray-500 text-sm">No complaints yet.</p>
          ) : (
            <div className="overflow-y-auto max-h-64 pr-2 custom-scroll">
              <ul className="space-y-3">
                {complaints.map((complaint) => (
                  <li
                    key={complaint.id}
                    className="bg-white p-3 rounded-md shadow-sm border border-gray-200 transition hover:shadow-sm"
                  >
                    <p className="text-gray-800 text-sm">{complaint.description}</p>
                    <div className="text-xs flex justify-between text-gray-500 mt-1">
                      <span>Status: <span className="font-semibold text-blue-600">{complaint.status}</span></span>
                      <span>{new Date(complaint.timestamp?.seconds * 1000).toLocaleString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Custom Scrollbar */}
      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #6366f1;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default Complain;
