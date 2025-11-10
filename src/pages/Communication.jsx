// Communication.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  limit,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

const Communication = () => {
  const auth = getAuth();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [polls, setPolls] = useState([]);
  const [newPoll, setNewPoll] = useState({ question: '', options: [''] });
  const [announcement, setAnnouncement] = useState('');
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUserId(user ? user.uid : null);
    });

    // Polls Query: Order by creation date (newest first)
    const pollsQuery = query(
      collection(db, 'polls'),
      orderBy('createdAt', 'desc'), // Order by createdAt in descending order
      limit(3) // Limit to 3 polls
    );
    
    const unsubscribePolls = onSnapshot(pollsQuery, (snapshot) => {
      const updatedPolls = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPolls(updatedPolls);
    });

    // Announcements Query: Get the 2 most recent announcements
    const announcementsRef = query(
      collection(db, 'announcements'),
      orderBy('createdAt', 'desc'),
      limit(2)
    );
    
    const unsubscribeAnnouncements = onSnapshot(announcementsRef, (snapshot) => {
      const updatedAnnouncements = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAnnouncements(updatedAnnouncements);
    });

    return () => {
      unsubscribeAuth();
      unsubscribePolls();
      unsubscribeAnnouncements();
    };
  }, []);

  const handleAddOption = () => {
    setNewPoll((prev) => ({
      ...prev,
      options: [...prev.options, ''],
    }));
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newPoll.options];
    updatedOptions[index] = value;
    setNewPoll((prev) => ({
      ...prev,
      options: updatedOptions,
    }));
  };

  const handleCreatePoll = async () => {
    const pollData = {
      question: newPoll.question,
      options: newPoll.options.map((opt) => ({ text: opt, votes: [] })),
      createdAt: serverTimestamp(), // Store creation timestamp
    };
    await addDoc(collection(db, 'polls'), pollData);
    setNewPoll({ question: '', options: [''] });
  };

  const handleVote = async (pollId, optionIndex) => {
    if (!currentUserId) return;

    const pollRef = doc(db, 'polls', pollId);
    const pollSnap = await getDoc(pollRef);
    const poll = pollSnap.data();
    if (!poll) return;

    const hasUserVoted = poll.options.some((opt) =>
      Array.isArray(opt.votes) && opt.votes.some((v) => v.userId === currentUserId)
    );
    if (hasUserVoted) return;

    const updatedOptions = poll.options.map((opt, idx) => {
      const votes = Array.isArray(opt.votes) ? opt.votes : [];
      if (idx === optionIndex) {
        return {
          ...opt,
          votes: [...votes, { userId: currentUserId }],
        };
      }
      return opt;
    });

    await updateDoc(pollRef, { options: updatedOptions });
  };

  const handleDeletePoll = async (pollId) => {
    await deleteDoc(doc(db, 'polls', pollId));
  };

  const handleCreateAnnouncement = async () => {
    if (announcement.trim() === '') return;

    await addDoc(collection(db, 'announcements'), {
      content: announcement,
      createdAt: serverTimestamp(),
      userId: currentUserId,
    });

    setAnnouncement('');
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    await deleteDoc(doc(db, 'announcements', announcementId));
  };

  if (currentUserId === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800 text-base">
        Please log in to participate in polls and make announcements.
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div
          className="p-8 space-y-10"
          style={{
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto',
          }}
        >
          {/* Announcements */}
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">📣 Announcements</h2>
            <textarea
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder="Write an announcement"
              rows="4"
              className="w-full p-4 border border-gray-300 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={handleCreateAnnouncement}
                className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Post Announcement
              </button>
            </div>
          </div>

          {/* Display Announcements */}
          <div className="space-y-4 mt-6">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm"
              >
                <p className="text-gray-700 text-sm">{announcement.content}</p>
                <div className="flex justify-end mt-3">
                  <button
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <hr className="my-8 border-t-2 border-gray-200" />

          {/* Poll Creation */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🗳️ Create a Poll</h2>
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <input
              type="text"
              placeholder="Enter your question"
              value={newPoll.question}
              onChange={(e) =>
                setNewPoll((prev) => ({ ...prev, question: e.target.value }))
              }
              className="w-full p-4 border border-gray-300 rounded-md text-gray-700 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {newPoll.options.map((opt, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Option ${index + 1}`}
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-md text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={handleAddOption}
                className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 focus:outline-none"
              >
                ➕ Add Option
              </button>
              <button
                onClick={handleCreatePoll}
                className="px-6 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                ✅ Create Poll
              </button>
            </div>
          </div>

          {/* Poll Display */}
          <div className="space-y-6 mt-6">
            {polls.map((poll) => {
              const totalVotes = poll.options.reduce(
                (sum, opt) => sum + (Array.isArray(opt.votes) ? opt.votes.length : 0),
                0
              );
              const hasUserVoted = poll.options.some(
                (opt) =>
                  Array.isArray(opt.votes) &&
                  opt.votes.some((v) => v.userId === currentUserId)
              );

              return (
                <div
                  key={poll.id}
                  className="bg-white p-6 border border-gray-200 rounded-lg shadow-md"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-700">{poll.question}</h3>
                    <button
                      onClick={() => handleDeletePoll(poll.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="space-y-3">
                    {poll.options.map((opt, index) => {
                      const votesArray = Array.isArray(opt.votes) ? opt.votes : [];
                      const percent =
                        totalVotes > 0
                          ? Math.round((votesArray.length / totalVotes) * 100)
                          : 0;
                      const hasVotedThis = votesArray.some(
                        (v) => v.userId === currentUserId
                      );

                      return (
                        <button
                          key={index}
                          onClick={() => handleVote(poll.id, index)}
                          disabled={hasUserVoted}
                          className={`w-full flex justify-between items-center px-4 py-3 rounded-md text-sm border ${
                            hasVotedThis
                              ? 'bg-green-100 border-green-300 text-green-700 font-semibold'
                              : 'bg-white hover:bg-gray-100 border-gray-300'
                          }`}
                        >
                          <span>{opt.text}</span>
                          <span className="text-gray-500 text-xs">{percent}%</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Communication;
