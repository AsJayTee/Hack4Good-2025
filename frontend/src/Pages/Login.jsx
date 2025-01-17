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

    // Log in the user using email and password
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

      try {
        // Query the database to find the UID (resident ID) using the email address
        const { data, error } = await supabase
          .from('"Users"') // Replace "Users" with the exact table name; wrap in double quotes for case-sensitive names
          .select('"UID"') // Replace "UID" with the exact column name
          .eq('"Email"', email); // Replace "Email" with the exact column name

        if (error) {
          console.error('Error retrieving UID:', error.message);
          alert(`Failed to retrieve UID from database. Error: ${error.message}`);
          return;
        }

        const residentId = data[0]?.UID; // Extract the UID value
        if (!residentId) {
          console.error('Resident ID not found in the database for the provided email.');
          alert('Resident ID not found. Please check your credentials and try again.');
          return;
        }
        console.log('Resident ID (UID):', residentId);

        // Call your backend to fetch user role using the residentId
        const response = await fetch(`http://localhost:5000/get_user_role?resident_id=${residentId}`);
        const roleData = await response.json();
        console.log('Role data:', roleData);

        if (response.ok) {
          const userRole = roleData.role;

          if (userRole === 'admin') {
            window.location.href = 'http://localhost:3001/analytics'; // Redirect to Admin server
          } else if (userRole === 'user') {
            navigate('/Shop'); // Redirect to Shop page
          } else {
            alert(`Unknown role: ${userRole}, please contact support.`);
          }
        } else {
          throw new Error(roleData.error || 'Failed to fetch user role');
        }
      } catch (err) {
        console.error('Error fetching Resident ID or role:', err.message);
        alert(`Error fetching Resident ID or role: ${err.message}. Please try again.`);
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