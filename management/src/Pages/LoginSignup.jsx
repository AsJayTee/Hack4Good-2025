//USE ONLY WHEN USER IS ADDED TO DATABASE IN ADMIN SIDE
/*import React, { useState } from 'react';
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

      // Fetch the user role from Flask backend using resident_id (supabase user.id)
      const resident_id = user.id;

      try {
        const response = await fetch(`http://localhost:5000/get_user_role?resident_id=${resident_id}`);
        const data = await response.json();

        if (response.ok) {
          const userRole = data.role; // Assuming the role is returned in the response

          if (userRole === 'admin') {
            navigate('/analytics'); // Redirect to analytics page
          } else if (userRole === 'user') {
            // Redirect to user server
            window.location.href = 'http://localhost:3000/Shop'; // Assuming user server is running on port 3000
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

export default LoginPage;*/


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
      const userRole = 'admin'; // Hardcoding the user role

      if (userRole === 'admin') {
        navigate('/analytics'); // Redirect to Admin page
      } else if (userRole === 'user') {
        // Redirect to user server
        window.location.href = 'http://localhost:3000/Shop'; // Assuming admin server is running on port 3000
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


