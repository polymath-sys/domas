import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { MdOutlineLogout } from "react-icons/md";
import { FiHome, FiUsers, FiBookOpen, FiSettings, FiHelpCircle } from "react-icons/fi";
import { FaUserFriends, FaDoorOpen, FaInfoCircle, FaCalendarAlt, FaTools, FaShieldAlt, FaWrench, FaComments } from "react-icons/fa";
import Communication from './pages/Communication';
import Settings from './pages/settings';
import Family from './Cards/Family';
import { IoPersonCircleOutline } from "react-icons/io5";
import RightSidebar from './components/Rightsidebar';
import Help from './pages/Help';
import Accounts from './pages/Account';
import Events from './Cards/Events';
import Chats from './Cards/chats';
import Visitor from './Cards/Visitor';
import Directory from './Cards/Directory';
import Complain from './Cards/Complain';
import Security from './Cards/Security';
import Maintainance from './Cards/Maintainance';

const Homepage = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [activeSection, setActiveSection] = useState('home');
  const [sidebarVisible, setSidebarVisible] = useState(false); // Initially, the sidebar is hidden on small screens
  const [isSmallScreen, setIsSmallScreen] = useState(false); // Track if the screen size is small

  const goToProfile = () => {
    navigate('/profile');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/Login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  const boxData = [
    { title: "Family", author: "Connect Your Neighbours...", bgColor: "bg-pink-100", icon: <FaUserFriends className="w-12 h-12 text-pink-500" />, section: "family" },
    { title: "Visitors", author: "Welcome your Guests!!", bgColor: "bg-yellow-100", icon: <FaDoorOpen className="w-12 h-12 text-yellow-500" />, section: "visitors" },
    { title: "Directory", author: "Need any Info?", bgColor: "bg-blue-100", icon: <FaInfoCircle className="w-12 h-12 text-blue-500" />, section: "directory" },
    { title: "Events", author: "Ready for the Events", bgColor: "bg-green-100", icon: <FaCalendarAlt className="w-12 h-12 text-green-500" />, section: "events" },
    { title: "Complain Desk", author: "Have any Issue??", bgColor: "bg-red-100", icon: <FaTools className="w-12 h-12 text-red-500" />, section: "complain" },
    { title: "Security Desk", author: "Family Safety", bgColor: "bg-purple-100", icon: <FaShieldAlt className="w-12 h-12 text-purple-500" />, section: "security" },
    { title: "Maintenance", author: "Your Maintenance Data", bgColor: "bg-orange-100", icon: <FaWrench className="w-12 h-12 text-orange-500" />, section: "maintenance" },
    { title: "Chats and Polls", author: "Conversation things!!", bgColor: "bg-indigo-100", icon: <FaComments className="w-12 h-12 text-indigo-500" />, section: "chats" }
  ];

  const content = {
    home: (
      <div className="grid grid-cols-3 gap-6">
        {boxData.map((item, idx) => (
          <button
            key={idx}
            className={`${item.bgColor} p-10 rounded-lg shadow-md flex flex-col items-center space-y-4 transition duration-300 hover:shadow-lg focus:outline-none`}
            onClick={() => item.section && setActiveSection(item.section)}
          >
            {item.icon}
            <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
            <p className="text-gray-600 text-center">{item.author}</p>
          </button>
        ))}
      </div>
    ),
    communication: <Communication />,
    family: <Family />,
    visitors: <Visitor/>,
    directory: <Directory/>,
    complain: <Complain/>,
    events: <Events />,
    security: <Security/>,
    accounts: <Accounts />,
    settings: <Settings />,
    help: <Help />,
    chats: <Chats />,
    maintenance:<Maintainance/>
  };

  useEffect(() => {
    // Add resize event listener to detect screen size change
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768); // Consider screen size small if less than 768px
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check the screen size on component mount

    return () => {
      window.removeEventListener('resize', handleResize); // Clean up the event listener
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible); // Toggle the sidebar visibility
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Always visible on medium and large screens, hidden on small screens */}
      <div className={`lg:w-1/6 md:w-1/4 bg-white shadow-lg p-6 flex flex-col justify-between ${isSmallScreen && !sidebarVisible ? 'hidden' : 'block'} transition-all duration-300`}>
        <div>
          <h1 className="text-2xl text-blue-400 font-bold mb-8">My-Home</h1>
          <nav className="space-y-6">
            <button onClick={() => setActiveSection('home')} className={`flex items-center gap-4 text-gray-700 hover:text-blue-500 transition duration-300 ${activeSection === 'home' ? 'text-blue-500' : ''}`}>
              <FiHome className="w-5 h-5" /> Home
            </button>
            <button onClick={() => setActiveSection('communication')} className={`flex items-center gap-4 text-gray-700 hover:text-blue-500 transition duration-300 ${activeSection === 'communication' ? 'text-blue-500' : ''}`}>
              <FiUsers className="w-5 h-5" /> Communication
            </button>
            <button onClick={() => setActiveSection('accounts')} className={`flex items-center gap-4 text-gray-700 hover:text-blue-500 transition duration-300 ${activeSection === 'accounts' ? 'text-blue-500' : ''}`}>
              <FiBookOpen className="w-5 h-5" /> Accounts
            </button>
            <button onClick={() => setActiveSection('settings')} className={`flex items-center gap-4 text-gray-700 hover:text-blue-500 transition duration-300 ${activeSection === 'settings' ? 'text-blue-500' : ''}`}>
              <FiSettings className="w-5 h-5" /> Settings
            </button>
            <button onClick={() => setActiveSection('help')} className={`flex items-center gap-4 text-gray-700 hover:text-blue-500 transition duration-300 ${activeSection === 'help' ? 'text-blue-500' : ''}`}>
              <FiHelpCircle className="w-5 h-5" /> Help
            </button>
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-400 hover:bg-red-600 transition duration-300 ease-in-out focus:outline-none focus:ring-4"
        >
          <MdOutlineLogout className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Sidebar Toggle Icon (only visible on small screens) */}
      {isSmallScreen && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 bg-blue-400 text-white rounded-full p-3 shadow-md"
        >
          {sidebarVisible ? 'Hide' : 'Show'} Sidebar
        </button>
      )}

      {/* Main Content */}
      <div className="flex-1 p-6">
        {content[activeSection]}
      </div>

      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  );
};

export default Homepage;
