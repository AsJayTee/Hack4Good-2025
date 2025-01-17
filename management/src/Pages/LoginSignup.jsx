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
