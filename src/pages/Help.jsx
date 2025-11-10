import React, { useState } from 'react';
import { FaQuestionCircle, FaPhone, FaEnvelope, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Help = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "How do I add a family member?",
      answer: "Go to the 'Family' section and click on 'Add Member'. Fill in the required details and submit."
    },
    {
      question: "How do I submit a maintenance request?",
      answer: "Visit the 'Complain Desk' section, click on 'New Request', and describe your issue. You can also attach images if necessary."
    },
    {
      question: "How can I view upcoming events?",
      answer: "Go to the 'Events' section to see a list of all scheduled events with their date, time, and location."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, all your data is encrypted and stored securely in Firebase, accessible only by authorized users."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className=" bg-gray-50 p-0">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-blue-500 mb-6">Help Center</h1>

        {/* FAQ Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4 border-b pb-4">
              <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center w-full text-left text-lg font-medium text-gray-700 hover:text-blue-500"
              >
                {faq.question}
                {openFAQ === index ? (
                  <FaChevronUp className="text-blue-500" />
                ) : (
                  <FaChevronDown className="text-gray-500" />
                )}
              </button>
              {openFAQ === index && (
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>

        {/* Support Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Support */}
          <div className="bg-blue-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Contact Support</h2>
            <p className="text-gray-700 mb-4">Need assistance? Reach out to us!</p>
            <div className="flex items-center gap-4 mb-2">
              <FaPhone className="text-blue-500 w-6 h-6" />
              <p className="text-gray-800">+91 98765 43210</p>
            </div>
            <div className="flex items-center gap-4">
              <FaEnvelope className="text-blue-500 w-6 h-6" />
              <p className="text-gray-800">support@society.com</p>
            </div>
          </div>

          {/* Tips and Tricks */}
          <div className="bg-green-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Tips & Tricks</h2>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Use the 'Directory' to find contact details of residents quickly.</li>
              <li>Enable notifications in the settings to stay updated with announcements.</li>
              <li>Use 'Chats and Polls' to engage with your community efficiently.</li>
              <li>Regularly update your contact details to receive emergency alerts.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
