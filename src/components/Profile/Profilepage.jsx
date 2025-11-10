import { auth, db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { FiArrowLeft, FiEdit2 } from 'react-icons/fi';
import { IoPersonCircleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        mobile: '',
        apartment: '',
        wing: '',
        members: 0
    });

    const [iconColor, setIconColor] = useState('#6366f1');
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUserData = async (userId) => {
            try {
                const docRef = doc(db, 'user', userId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUserData({
                        name: data.name || 'No Name',
                        email: data.email || 'No Email',
                        mobile: data.mobile || 'No Phone',
                        apartment: data.apartment || 'No Apartment',
                        wing: data.wing || 'No Wing',
                        members: data.members ?? 0
                    });
                    setIconColor(data.iconColor || '#6366f1');
                } else {
                    console.log('No user document found!');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchUserData(user.uid);
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSave = async () => {
        const user = auth.currentUser;
        if (user) {
            const docRef = doc(db, 'user', user.uid);
            try {
                await updateDoc(docRef, {
                    name: userData.name,
                    apartment: userData.apartment,
                    wing: userData.wing,
                    members: userData.members,
                    mobile: userData.mobile,
                    iconColor: iconColor
                });
                setIsEditing(false);
            } catch (error) {
                console.error('Error updating document:', error);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-4 relative">

            <FiArrowLeft
                className="absolute top-6 left-6 text-gray-600 text-3xl cursor-pointer hover:text-gray-900"
                onClick={() => navigate(-1)}
            />

            <div className="bg-white shadow-2xl rounded-xl p-8 max-w-lg w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">User Profile</h2>
                    <FiEdit2
                        className="text-gray-600 text-xl cursor-pointer hover:text-gray-900"
                        onClick={() => setIsEditing(!isEditing)}
                    />
                </div>

                <div className="flex justify-center mb-6">
                    <IoPersonCircleOutline
                        className="w-36 h-36 cursor-pointer"
                        style={{ color: iconColor }}
                    />
                </div>

                {isEditing && (
                    <div className="flex justify-center mb-6">
                        <input
                            type="color"
                            value={iconColor}
                            onChange={(e) => setIconColor(e.target.value)}
                            className="border rounded-md p-1"
                        />
                    </div>
                )}

                <div className="mt-6 space-y-4">
                    {/* Name */}
                    <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-1/3">Name:</span>
                        {isEditing ? (
                            <input
                                type="text"
                                name="name"
                                value={userData.name}
                                onChange={handleChange}
                                className="border px-2 py-1 w-2/3 rounded-md"
                            />
                        ) : (
                            <span className="text-gray-900">{userData.name}</span>
                        )}
                    </div>

                    {/* Email */}
                    <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-1/3">Email:</span>
                        <span className="text-gray-900">{userData.email}</span>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-1/3">Phone:</span>
                        {isEditing ? (
                            <input
                                type="text"
                                name="mobile"
                                value={userData.mobile}
                                onChange={handleChange}
                                className="border px-2 py-1 w-2/3 rounded-md"
                            />
                        ) : (
                            <span className="text-gray-900">{userData.mobile}</span>
                        )}
                    </div>

                    {/* Apartment */}
                    <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-1/3">Apartment:</span>
                        {isEditing ? (
                            <input
                                type="text"
                                name="apartment"
                                value={userData.apartment}
                                onChange={handleChange}
                                className="border px-2 py-1 w-2/3 rounded-md"
                            />
                        ) : (
                            <span className="text-gray-900">{userData.apartment}</span>
                        )}
                    </div>

                    {/* Wing */}
                    <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-1/3">Wing:</span>
                        {isEditing ? (
                            <input
                                type="text"
                                name="wing"
                                value={userData.wing}
                                onChange={handleChange}
                                className="border px-2 py-1 w-2/3 rounded-md"
                            />
                        ) : (
                            <span className="text-gray-900">{userData.wing}</span>
                        )}
                    </div>

                    {/* Members */}
                    <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-1/3">Members:</span>
                        {isEditing ? (
                            <input
                                type="number"
                                name="members"
                                value={userData.members}
                                onChange={handleChange}
                                className="border px-2 py-1 w-2/3 rounded-md"
                            />
                        ) : (
                            <span className="text-gray-900">{userData.members}</span>
                        )}
                    </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleSave}
                            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                        >
                            Save
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
