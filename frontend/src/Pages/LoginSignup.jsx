import React, { useState } from 'react';
import { supabase } from '../Components/user_auth/client'; // Import your Supabase client

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [role, setRole] = useState('user'); // or 'admin'

  async function handleSignUp(event) {
    event.preventDefault();
    const userData = {
      phoneNum,
      role,
      name,
      points: 0, // default points
    };
    
    const data = await signUpUser(email, password, userData);
    if (data) {
      console.log('User signed up:', data);
    } else {
      alert('Sign-up failed. Please try again.');
    }
  }

  async function signUpUser(email, password, userData) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) {
        console.error('Error signing up user:', error.message);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  }

  return (
    <form onSubmit={handleSignUp}>
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNum}
        onChange={(e) => setPhoneNum(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignUpPage;
