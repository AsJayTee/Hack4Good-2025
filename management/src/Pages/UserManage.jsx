import React, { useState } from "react";
import "./CSS/UserManage.css"; // Importing the CSS file

const UserManagementPage = () => {
  const initialUsers = [
    { group: 1, name: "John Doe", points: 200, contact: "91234567" },
    { group: 1, name: "Jane Smith", points: 150, contact: "92345678" },
    { group: 2, name: "Alex Johnson", points: 300, contact: "93456789" },
    // Add more users here
  ];

  const [users, setUsers] = useState(initialUsers);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    group: "",
    name: "",
    points: "",
    contact: "",
  });
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [userToResetPassword, setUserToResetPassword] = useState(null);
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);

  const handleCreateUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleCreateUserSubmit = () => {
    if (!newUser.group || !newUser.name || !newUser.points || !newUser.contact) {
        alert("All fields are required.");
        return;
      }
    const phoneRegex = /^[689][0-9]{7}$/;
    if (!phoneRegex.test(newUser.contact)) {
        alert("Phone number must be 8 digits long and start with 6, 8, or 9.");
        return;
      }
    setUsers([...users, newUser]);
    setShowCreateUserModal(false);
    setNewUser({ group: "", name: "", points: "", contact: "" });
  };

  const handleResetPassword = (user) => {
    setUserToResetPassword(user);
    setShowResetPasswordModal(true);
  };

  const handleConfirmResetPassword = () => {
    alert(`Password for ${userToResetPassword.name} reset to default.`);
    setShowResetPasswordModal(false);
  };

  const handleCancelResetPassword = () => {
    setShowResetPasswordModal(false);
  };

  const handleDeleteUser = (user) => {
    const updatedUsers = users.filter((u) => u !== user);
    setUsers(updatedUsers);
    // Check if group is empty
    const groupMembers = updatedUsers.filter((u) => u.group === user.group);
    if (groupMembers.length === 0) {
      setGroupToDelete(user.group);
      setShowDeleteGroupModal(true);
    }
  };

  const handleConfirmDeleteGroup = () => {
    const updatedUsers = users.filter((u) => u.group !== groupToDelete);
    setUsers(updatedUsers);
    setShowDeleteGroupModal(false);
    setGroupToDelete(null);
  };

  const handleCancelDeleteGroup = () => {
    setShowDeleteGroupModal(false);
    setGroupToDelete(null);
  };

  // Grouping users by their group number
  const groupedUsers = users.reduce((acc, user) => {
    if (!acc[user.group]) {
      acc[user.group] = [];
    }
    acc[user.group].push(user);
    return acc;
  }, {});

  return (
    <div>
      <h1>User Management</h1>
      {/* Replace react-bootstrap Button with plain HTML button */}
      <button className="primary-button" onClick={() => setShowCreateUserModal(true)}>
        Create New User
      </button>
      
      {/* Display total members per group */}
      <div className="group-stats">
        {Object.keys(groupedUsers).map((groupNumber) => (
          <div key={groupNumber}>
            <strong>Group {groupNumber}:</strong> {groupedUsers[groupNumber].length} members
          </div>
        ))}
      </div>
      
      {/* Table to display users */}
      <table className="user-table">
        <thead>
          <tr>
            <th>Group</th>
            <th>Name</th>
            <th>Points Balance</th>
            <th>Contact Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.group}</td>
              <td>{user.name}</td>
              <td>{user.points}</td>
              <td>{user.contact}</td>
              <td>
                <button className="danger-button" onClick={() => handleDeleteUser(user)}>
                  Delete
                </button>
                <button className="warning-button" onClick={() => handleResetPassword(user)}>
                  Reset Password
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showCreateUserModal && (
  <div className="modal">
    <div className="modal-content">
      <span className="close" onClick={() => setShowCreateUserModal(false)}>&times;</span>
      <h2>Create New User</h2>
      <form>
        {/* Group Number Row */}
        <div className="form-row">
          <label>Group Number: </label>
          <input
            type="text"
            name="group"
            value={newUser.group}
            onChange={handleCreateUserChange}
          />
        </div>

        {/* Blank Row */}
        <div className="form-row"></div>

        {/* Name Row */}
        <div className="form-row">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={newUser.name}
            onChange={handleCreateUserChange}
          />
        </div>

        {/* Blank Row */}
        <div className="form-row"></div>

        {/* Points Row */}
        <div className="form-row">
          <label>Points Balance: </label>
          <input
            type="text"
            name="points"
            value={newUser.points}
            onChange={handleCreateUserChange}
          />
        </div>

        {/* Blank Row */}
        <div className="form-row"></div>

        {/* Contact Row */}
        <div className="form-row">
          <label>Contact Number: </label>
          <input
            type="text"
            name="contact"
            value={newUser.contact}
            onChange={handleCreateUserChange}
          />
        </div>

        <div className="modal-footer">
          <button type="button" className="secondary-button" onClick={() => setShowCreateUserModal(false)}>
            Close
          </button>
          <button type="button" className="primary-button" onClick={handleCreateUserSubmit}>
            Create User
          </button>
        </div>
      </form>
    </div>
  </div>
)} 
      
      {/* Reset Password Confirmation Modal */}
      {showResetPasswordModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCancelResetPassword}>&times;</span>
            <h2>Confirm Password Reset</h2>
            <p>
              Are you sure you want to reset the password for {userToResetPassword ? userToResetPassword.name : ""} to the default password?
            </p>
            <div className="modal-footer">
              <button className="secondary-button" onClick={handleCancelResetPassword}>
                Cancel
              </button>
              <button className="danger-button" onClick={handleConfirmResetPassword}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Group Confirmation Modal */}
      {showDeleteGroupModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCancelDeleteGroup}>&times;</span>
            <h2>Delete Group</h2>
            <p>
              Group {groupToDelete} has no members. Would you like to delete this group?
            </p>
            <div className="modal-footer">
              <button className="secondary-button" onClick={handleCancelDeleteGroup}>
                Cancel
              </button>
              <button className="danger-button" onClick={handleConfirmDeleteGroup}>
                Delete Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
