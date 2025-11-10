import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

import Login from './Login';
import Register from './Register';
import Homepage from './Homepage';
import ProfilePage from './components/Profile/Profilepage';
import EditProfile from './components/Profile/EditProfilePage';
import Communication from './pages/Communication';
import Settings from './pages/settings';

const App = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div className="h-screen flex justify-center items-center text-2xl font-semibold">Loading...</div>;  
  }

  return (
    <Router>
      <Routes>
        {/* Protected Routes */}
        <Route 
          path="/" 
          element={user ? <Homepage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/profile" 
          element={user ? <ProfilePage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/edit-profile" 
          element={user ? <EditProfile /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/communication" 
          element={user ? <Communication /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/settings" 
          element={user ? <Settings /> : <Navigate to="/login" />} 
        />

        {/* Public Routes */}
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/" />} 
        />
        <Route 
          path="/register" 
          element={!user ? <Register /> : <Navigate to="/" />} 
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
