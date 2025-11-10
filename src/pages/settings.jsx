import React, { useState } from 'react';
import {
  BellIcon,
  KeyIcon,
  ShieldCheckIcon,
  TrashIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [feedback, setFeedback] = useState('');

  return (
    <div className=" bg-gray-50 px-4 py-6 text-gray-800">
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Notification */}
        <section className="bg-white shadow-sm rounded-md p-4 space-y-2">
          <div className="flex items-center text-blue-600 mb-1">
            <BellIcon className="h-5 w-5 mr-2" />
            <h2 className="font-semibold text-sm">Notifications</h2>
          </div>
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={() => setNotificationsEnabled(!notificationsEnabled)}
              className="h-4 w-4 mr-2"
            />
            Receive society announcements
          </label>
        </section>

        {/* Password */}
        <section className="bg-white shadow-sm rounded-md p-4 space-y-2">
          <div className="flex items-center text-blue-600 mb-1">
            <KeyIcon className="h-5 w-5 mr-2" />
            <h2 className="font-semibold text-sm">Password</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            <input className="border p-2 rounded text-sm" type="password" placeholder="Current Password" />
            <input className="border p-2 rounded text-sm" type="password" placeholder="New Password" />
          </div>
          <button className="mt-2 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
            Update Password
          </button>
        </section>

        {/* Maintenance */}
        <section className="bg-white shadow-sm rounded-md p-4 space-y-2">
          <div className="flex items-center text-blue-600 mb-1">
            <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
            <h2 className="font-semibold text-sm">Maintenance</h2>
          </div>
          <label className="flex items-center text-sm">
            <input type="checkbox" className="h-4 w-4 mr-2" />
            Reminders for dues
          </label>
          <label className="flex items-center text-sm">
            <input type="checkbox" className="h-4 w-4 mr-2" />
            Enable Auto-pay
          </label>
        </section>

        {/* Feedback */}
        <section className="bg-white shadow-sm rounded-md p-4 space-y-2">
          <div className="flex items-center text-blue-600 mb-1">
            <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
            <h2 className="font-semibold text-sm">Feedback</h2>
          </div>
          <textarea
            className="border w-full p-2 rounded text-sm"
            rows="3"
            placeholder="Your feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>
          <button className="mt-1 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
            Submit
          </button>
        </section>

        {/* Privacy */}
        <section className="bg-white shadow-sm rounded-md p-4">
          <div className="flex items-center text-blue-600 mb-1">
            <ShieldCheckIcon className="h-5 w-5 mr-2" />
            <h2 className="font-semibold text-sm">Privacy & Data</h2>
          </div>
          <p className="text-xs text-gray-600 mb-2">Manage your data and account settings.</p>
          <button className="flex items-center text-sm text-red-600 hover:underline">
            <TrashIcon className="h-4 w-4 mr-1" />
            Delete my account
          </button>
        </section>
      </div>
    </div>
  );
};

export default Settings;
