import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase'; // Adjust path as needed

const Events = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [showEventForm, setShowEventForm] = useState(false);

  const [form, setForm] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
  });

  // Fetch events from Firestore
  useEffect(() => {
    const fetchEvents = async () => {
      const snapshot = await getDocs(collection(db, 'events'));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(data);
    };

    fetchEvents();
  }, []);

  // Add new event to Firestore
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!form.name || !form.date || !form.time || !form.location) return;

    const docRef = await addDoc(collection(db, 'events'), form);
    setEvents([...events, { id: docRef.id, ...form }]);

    // Reset form
    setForm({ name: '', date: '', time: '', location: '' });
    setShowEventForm(false);
  };

  // Delete event
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'events', id));
    setEvents(events.filter((event) => event.id !== id));
  };

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(search.toLowerCase()) ||
      event.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Upcoming Events</h1>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search events by name or location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 w-full sm:w-80"
        />
        <button
          onClick={() => setShowEventForm(!showEventForm)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          {showEventForm ? 'Cancel Event' : 'Add Event'}
        </button>
      </div>

      {/* Event Form */}
      {showEventForm && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Create New Event</h2>
          <form onSubmit={handleAddEvent}>
            <div className="mb-4">
              <label className="block text-gray-700">Event Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border border-gray-300 p-3 w-full rounded"
                placeholder="Event name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="border border-gray-300 p-3 w-full rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Time</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="border border-gray-300 p-3 w-full rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="border border-gray-300 p-3 w-full rounded"
                placeholder="Event location"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Save Event
            </button>
          </form>
        </div>
      )}

      {/* Event List */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        {filteredEvents.length === 0 ? (
          <p className="text-gray-600">No events found.</p>
        ) : (
          <ul>
            {filteredEvents.map((event) => (
              <li
                key={event.id}
                className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-semibold">{event.name}</h3>
                  <p className="text-gray-600">
                    {event.date} at {event.time}
                  </p>
                  <p className="text-gray-600">{event.location}</p>
                </div>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Events;
