import React, { useState } from 'react';

const EditProfile = () => {
    const [profilePicture, setProfilePicture] = useState(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfilePicture(URL.createObjectURL(file)); // Preview the selected image
            // Here, you would upload the image to Firebase Storage
        }
    };

    const removeProfilePicture = () => {
        setProfilePicture(null); // Remove the profile picture
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
                <div className="flex items-center space-x-4 mb-6">
                    <img
                        src={profilePicture || "/default-profile-pic.png"} // Display uploaded image or default
                        alt="Profile"
                        className="w-16 h-16 rounded-full"
                    />
                    <div>
                        <input
                            type="file"
                            onChange={handleImageUpload}
                            accept="image/*"    
                            className="hidden"
                            id="upload-button"
                        />
                        <label htmlFor="upload-button" className="bg-blue-500 text-white px-4 py-2 rounded-full cursor-pointer">
                            Upload
                        </label>
                        <button onClick={removeProfilePicture} className="ml-2 bg-red-500 text-white px-4 py-2 rounded-full">
                            Remove
                        </button>
                    </div>
                </div>
                {/* Add form fields for other profile details here */}
            </div>
        </div>
    );
};

export default EditProfile;
