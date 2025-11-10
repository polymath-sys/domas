import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";

const Chats = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Handle user authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const uid = firebaseUser.uid;
        const userRef = doc(db, "user", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const name = userSnap.data().name || "Anonymous";
          setUser({ uid, name });
        } else {
          console.warn("⚠️ No user document found in Firestore for this UID.");
        }
      } else {
        console.warn("⚠️ User is not authenticated.");
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetching messages data
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          sender: data.name || "Unknown",
          text: data.text,
          time: data.timestamp?.toDate().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          role: user && data.uid === user.uid ? "me" : "other",
        };
      });
      setMessages(chatList);
    });

    return () => unsubscribe();
  }, [user]);

  // Send normal messages
  const sendMessage = async () => {
    if (!input.trim() || !user) return;
    try {
      await addDoc(collection(db, "messages"), {
        uid: user.uid,
        name: user.name,
        text: input.trim(),
        timestamp: serverTimestamp(),
      });
      setInput(""); // Clear the input after sending the message
    } catch (err) {
      console.error("❌ Error sending message:", err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <motion.div
      className="flex flex-col items-center w-full h-[90vh] px-4 py-6 bg-gradient-to-r from-gray-50 to-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Chat Section */}
      <motion.div
        className="w-full max-w-6xl bg-white rounded-3xl shadow-lg border border-gray-200 flex flex-col h-full"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <div className="bg-blue-700 text-white px-6 py-4 rounded-t-3xl shadow-md">
          <h2 className="text-2xl font-semibold tracking-tight">Society Group Chat</h2>
          <p className="text-sm opacity-80">All users can send and receive messages</p>
        </div>

        {/* Messages Section */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50 space-y-5">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                className={`flex flex-col ${msg.role === "me" ? "items-end" : "items-start"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <span
                  className={`text-xs font-medium mb-1 ${
                    msg.role === "me" ? "text-blue-600" : "text-gray-700"
                  }`}
                >
                  {msg.sender}
                </span>
                <div
                  className={`max-w-xs px-5 py-3 rounded-2xl text-sm shadow-md relative ${
                    msg.role === "me"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800 border border-gray-300"
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="flex items-center p-4 border-t border-gray-300 bg-gray-100 rounded-b-3xl">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border border-gray-300 rounded-2xl py-3 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            placeholder="Type your message..."
          />
          <motion.button
            onClick={sendMessage}
            className="bg-blue-600 text-white p-3 rounded-full ml-3 shadow-md transform hover:scale-105 transition duration-200"
          >
            <FaPaperPlane />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Chats;
