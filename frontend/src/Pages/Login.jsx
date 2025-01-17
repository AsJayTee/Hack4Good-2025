import React, { useState } from 'react';
import { supabase } from '../Components/user_auth/client'; // Import your Supabase client
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './CSS/LoginSignup.css'; // Import the CSS file

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);

    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      console.error('Error logging in:', error.message);
      alert(`Login failed: ${error.message}`);
    } else {
      console.log('Logged in successfully:', user);

      //userRole=getUserRole(user_ID) //implement flask
      const userRole = 'user'; // Hardcoding the user role

      if (userRole === 'admin') {
        // Redirect to Admin server
        window.location.href = 'http://localhost:3001/analytics'; // Assuming admin server is running on port 3001
      } else if (userRole === 'user') {
        navigate('/Shop'); // Redirect to Shop page
      } else {
        alert(`Unknown role: ${userRole}, please contact support.`);
      }
    }
  }

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>Login</h1>
        <form onSubmit={handleLogin} className="loginsignup-fields">
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
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;

//USE ONLY WHEN USER IS ADDED TO DATABASE IN ADMIN SIDE
/*
import React, { useState } from 'react';
import { supabase } from '../Components/user_auth/client'; // Import your Supabase client
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './CSS/LoginSignup.css'; // Import the CSS file

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
  
    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    setLoading(false);
  
    if (error) {
      console.error('Error logging in:', error.message);
      alert(`Login failed: ${error.message}`);
    } else {
      console.log('Logged in successfully:', user);
      console.log("User object:", user);  // Log the user object to see if resident_id is present
  
      const resident_id = user?.user_metadata?.resident_id;
      if (!resident_id) {
        console.error("Resident ID is missing from user metadata.");
        alert('Resident ID not found. Please try again.');
        return;
      }
  
      console.log("Resident ID:", resident_id);  // Log the resident ID
  
      try {
        const response = await fetch(`http://localhost:5000/get_user_role?resident_id=${resident_id}`);
        const data = await response.json();
        console.log('Role data:', data);  // Log the response from the backend
  
        if (response.ok) {
          const userRole = data.role;
  
          if (userRole === 'admin') {
            window.location.href = 'http://localhost:3001/analytics'; // Redirect to Admin server
          } else if (userRole === 'user') {
            navigate('/Shop'); // Redirect to Shop page
          } else {
            alert(`Unknown role: ${userRole}, please contact support.`);
          }
        } else {
          throw new Error(data.error || 'Failed to fetch user role');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        alert('Failed to fetch user role. Please try again.');
      }
    }
  }
  
  
  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>Login</h1>
        <form onSubmit={handleLogin} className="loginsignup-fields">
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
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
*/