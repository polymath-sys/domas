import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc, collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { IoPersonCircleOutline } from 'react-icons/io5';  // <-- Profile icon

const RightSidebar = () => {
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({ name: '', apartment: '', numMembers: '', iconColor: '#4c73e6' });
  const [announcements, setAnnouncements] = useState([]);
  const [userError, setUserError] = useState(null);
  const [announceError, setAnnounceError] = useState(null);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = getAuth().currentUser;

        if (!user) {
          console.log('No user is logged in');
          setUserError('No user is logged in');
          setLoading(false);
          return;
        }

        const docRef = doc(db, 'user', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserDetails({
            name: data.name || 'Not available',
            apartment: data.apartment || 'Not available',
            numMembers: data.members || 'Not available',
            iconColor: data.iconColor || '#4c73e6',
          });
        } else {
          setUserError('User data not found');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        setUserError('Failed to fetch user details');
      }
    };

    // Setup announcements listener safely — some browser extensions or network
    // issues may throw synchronously when trying to attach the listener.
    let unsubscribe = null;
    try {
      unsubscribe = onSnapshot(
        query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(3)),
        async (querySnapshot) => {
          try {
            const fetchedAnnouncements = await Promise.all(
              querySnapshot.docs.map(async (docSnap) => {
                const announcementData = docSnap.data();
                const userId = announcementData.userId;

                const userDocRef = doc(db, 'user', userId);
                const userDocSnap = await getDoc(userDocRef);

                return {
                  content: announcementData.content,
                  userName: userDocSnap.exists() ? userDocSnap.data().name : 'Unknown User',
                };
              })
            );

            setAnnouncements(fetchedAnnouncements);
            setAnnouncementsLoading(false);
            setAnnounceError(null);
          } catch (error) {
            console.error('Error processing announcements:', error);
            setAnnounceError('Failed to process announcements');
            setAnnouncementsLoading(false);
          }
        },
        (error) => {
          console.error('Error listening to announcements:', error);
          setAnnounceError('Failed to fetch announcements in real-time');
          setAnnouncementsLoading(false);
        }
      );
    } catch (err) {
      // onSnapshot can throw synchronously if the request is blocked by client
      console.error('Failed to initialize announcements listener:', err);
      setAnnounceError('Failed to initialize announcements listener');
      setAnnouncementsLoading(false);
    }

    fetchUserDetails();

    return () => {
      try {
        if (typeof unsubscribe === 'function') unsubscribe();
      } catch (e) {
        console.warn('Error during unsubscribe:', e);
      }
    };
  }, []);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  // Render the sidebar even if parts fail; show inline errors instead of bailing out

  return (
    <div className="hidden lg:block w-full lg:w-1/4 p-6 bg-white shadow-lg relative">
      {/* Profile Icon Button */}
      <button
        onClick={handleProfileClick}
        className="absolute top-4 right-4 text-6xl cursor-pointer transition duration-200 hover:scale-105"
        title="Go to Profile"
      >
        <IoPersonCircleOutline style={{ color: userDetails.iconColor }} />
      </button>

      {/* User Details */}
      <div className="mb-8 p-6 bg-gray-100 rounded-lg shadow-lg mt-16">
        <h3 className="text-xl font-bold mb-6 text-gray-800">Your Details:</h3>

        {userError ? (
          <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{userError}</p>
        ) : (
          <>
            <div className="mb-4 text-center items-center flex flex-col sm:flex-row sm:justify-between">
              <h2 className="text-lg font-semibold text-gray-700">Name:</h2>
              <p className="text-md text-gray-600 ml-2">{userDetails.name}</p>
            </div>

            <div className="mb-4 flex text-center items-center flex-col sm:flex-row sm:justify-between">
              <h2 className="text-lg font-semibold text-gray-700">Apartment Number:</h2>
              <p className="text-md text-gray-600 ml-2">{userDetails.apartment}</p>
            </div>

            <div className="mb-4 flex text-center items-center flex-col sm:flex-row sm:justify-between">
              <h2 className="text-lg font-semibold text-gray-700">Number of Members:</h2>
              <p className="text-md text-gray-600 ml-2">{userDetails.numMembers}</p>
            </div>
          </>
        )}
      </div>

      {/* Recent Announcements */}
      <div className="mb-8 p-6 bg-gray-100 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-6 text-gray-800">Recent Announcements</h3>
        {announceError ? (
          <p className="text-red-500 bg-red-100 p-3 rounded">{announceError}</p>
        ) : announcementsLoading ? (
          <p>Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <p>No recent announcements</p>
        ) : (
          <ul className="space-y-4">
            {announcements.map((announcement, idx) => (
              <li key={idx} className="bg-gray-100 p-4 rounded-lg shadow-md">
                <p className="text-gray-700">{announcement.content}</p>
                <p className="text-gray-500 text-sm">by: {announcement.userName}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
