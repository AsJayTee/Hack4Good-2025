import React, { useState } from 'react';
import { supabase } from '../Components/user_auth/client'; // Import your Supabase client
import '../Components/Button/button.css';

function AddUser() {
  // User input state
  const [groupNum, setGroupNum] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [id, setId] = useState('');
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

  // Function to handle the SignUp
  async function handleSignUp(event) {
    event.preventDefault();

    const userData = {
      groupNum,
      phoneNum,
      name,
      id,
      points: 0, // default points
    };

    const data = await signUpUser(email, password, userData);
    if (data) {
      console.log('User signed up:', data);
    } else {
      alert('Sign-up failed. Please try again.');
    }
  }

  // Function to sign up the user and add additional info to Supabase
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
        alert(`Sign-up failed: ${error.message}`);
        return null;
      }

      // Log and return the data on success
      console.log('Sign-up success:', data);
      return data;
    } catch (err) {
      console.error('Unexpected error during sign-up:', err);
      alert(`Unexpected error: ${err.message}`);
    }
  }

  // Function to handle the Create User button click
  const handleCreateUserSubmit = async () => {
    setShowCreateUserModal(true);

    // Add logic to add user to JT's SQL (in your case, it's Supabase)
    const userData = {
      groupNum,
      name,
      id,
      phoneNum,
      email,
      points: 0,  // Set points to 0 for new user
    };

    const result = await signUpUser(email, password, userData);

    if (result) {
      alert('User created successfully');
      setShowCreateUserModal(false);  // Close modal after success
    } else {
      alert('Error creating user. Please try again.');
    }
  };

  return (
    <>
      {/* Form for User Registration */}
      <form onSubmit={handleSignUp}>
        <div className="form-row">
          <label>Group Number: </label>
          <input
            type="text"
            name="groupNum"
            value={groupNum}
            onChange={(e) => setGroupNum(e.target.value)} 
          />
        </div>

        <div className="form-row"></div>

        <div className="form-row">
          <label>Name: </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)} 
          />
        </div>

        <div className="form-row"></div>

        <div className="form-row">
          <label>User ID: </label>
          <input
            type="text"
            name="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>

        <div className="form-row"></div>

        <div className="form-row">
          <label>Email: </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-row"></div>

        <div className="form-row">
          <label>Password: </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-row"></div>

        <div className="form-row">
          <label>Contact Number: </label>
          <input
            type="text"
            name="phoneNum"
            value={phoneNum}
            onChange={(e) => setPhoneNum(e.target.value)}
          />
        </div>

        <div className="modal-footer">
          <button 
            type="button" 
            className="secondary-button" 
            onClick={() => setShowCreateUserModal(false)}  // Close modal
          >
            Close
          </button>
          <button 
            type="button" 
            className="primary-button" 
            onClick={handleCreateUserSubmit}  // Handle user creation
          >
            Create User
          </button>
        </div>
      </form>

      {/* Conditional modal rendering */}
      {showCreateUserModal && (
        <div className="modal">
          {/* Modal content can go here */}
        </div>
      )}
    </>
  );
}

export default AddUser;
