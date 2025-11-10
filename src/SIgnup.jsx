import React, { useState } from 'react';
import { auth } from './firebase'; // Import the auth instance
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Signed up user:', userCredential.user);
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
};

export default Signup;
