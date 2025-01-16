import React, { useState } from "react";
import "./CSS/UserManage.css"; // Importing the CSS file
import "../Components/Button/button.css"


const UserManagementPage = () => {
  const initialUsers = [
    { group: 1, id: "4", name: "John Doe", points: 200, contact: "91234567", Suspended:false },
    { group: 1, id: "2", name: "Jane Smith", points: 150, contact: "92345678", Suspended: false},
    { group: 2, id: "1", name: "Alex Johnson", points: 300, contact: "93456789",Suspended: true },
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
  const [globalPoints, setGlobalPoints] = useState(0);
  const [selectedGroups, setSelectedGroups] = useState({});
  const [selectAll, setSelectAll] = useState(false);

 
  const handleCreateUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };


  const handleCreateUserSubmit = () => {
    if (!newUser.group || !newUser.name || !newUser.points || !newUser.contact|| !newUser.id) {
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
    setNewUser({ group: "", name: "", id: "", points: "", contact: "" });
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


  // Function to suspend a user
  const suspendUser = (userId) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, Suspended: true } : user
    );
    setUsers(updatedUsers);
    alert(`User with ID ${userId} has been suspended.`);
  };

  // Function to unsuspend a user
  const unsuspendUser = (userId) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, Suspended: false } : user
    );
    setUsers(updatedUsers);
    alert(`User with ID ${userId} has been unsuspended.`);
  };

  const handleAdjustPoints = (index, adjustment) => {
    const input = document.getElementById(`points-input-${index}`);
    const adjustmentValue = parseInt(input.value) || 0;
    if (adjustmentValue <= 0) {
      alert("Please enter a valid number to adjust points.");
      return;
    }
    const updatedUsers = [...users];
    updatedUsers[index].points += adjustment === "add" ? adjustmentValue : -adjustmentValue;
    setUsers(updatedUsers);
    input.value = ""; // Clear the input after adjustment
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

  const handleGlobalPointsChange = (e) => {
    setGlobalPoints(Number(e.target.value));
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const updatedSelections = Object.keys(groupedUsers).reduce((acc, group) => {
      acc[group] = newSelectAll;
      return acc;
    }, {});
    setSelectedGroups(updatedSelections);
  };

  const handleGroupSelection = (group) => {
    setSelectedGroups({
      ...selectedGroups,
      [group]: !selectedGroups[group],
    });
    if (!selectedGroups[group]) {
      setSelectAll(false); // Deselect "Select All" if one is unchecked
    }
  };

  const applyPointsToGroups = (adjustment, group) => {
    if (globalPoints <= 0) {
      alert("Please enter a valid number of points.");
      return;
    }

    const updatedUsers = users.map((user) => {
      if (selectedGroups[user.group] || user.group === group) {
        return {
          ...user,
          points: adjustment === "add" ? user.points + globalPoints : user.points - globalPoints,
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    alert(
      `${globalPoints} points ${adjustment === "add" ? "added to" : "subtracted from"} ${
        group ? `Group ${group}` : "selected groups"
      }.`
    );
    setGlobalPoints(0); // Reset the input field
  };


  return (
    <div className = "user-management-container">
      <h1>User Management</h1>
      <button className="primary-button" onClick={() => setShowCreateUserModal(true)}>
        Create New User
      </button>
      
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Group Management</h2>
        <div className="global-points">
          <input
            type="number"
            placeholder="Points to Adjust"
            style={{ width: "60px" }}
            value={globalPoints}
            onChange={handleGlobalPointsChange}
          />
          <button
            className="primary-button"
            onClick={() => applyPointsToGroups("add", null)}
          >
            Apply Points
          </button>
        </div>
        <div className="select-all">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          <label>Select All Groups</label>
        </div>
        <div className="group-list">
          {Object.keys(groupedUsers).map((group) => (
            <div key={group} className="group-item">
              <input
                type="checkbox"
                checked={!!selectedGroups[group]}
                onChange={() => handleGroupSelection(group)}
              />
              <label>
                Group {group} ({groupedUsers[group].length} members)
              </label>
            </div>
              
           
          ))}
        </div>
      </div>
      
     
      {/* Table to display users */}
      <table className="user-table">
        <thead>
          <tr>
            <th>Group</th>
            <th>Name</th>
            <th>User ID</th>
            <th>Points Balance</th>
            <th>Contact Number</th>
            <th>Actions</th>
            <th>Points Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.group}</td>
              <td>{user.name}</td>
              <td>{user.id}</td>
              <td>{user.points}</td>
              <td>{user.contact}</td>
              <td>
                <button className="danger-button" onClick={() => handleDeleteUser(user)}>
                  Delete
                </button>
                <button className="warning-button" onClick={() => handleResetPassword(user)}>
                  Reset Password
                </button>
                {user.Suspended ? (
                  <button className="unsuspend-button" onClick={() => unsuspendUser(user.id)}>
                    Unsuspend
                  </button>
                ) : (
                  <button className="suspend-button" onClick={() => suspendUser(user.id)}>
                    Suspend
                  </button>
                )}
              </td>
              <td>
                <button
                  className="increment-button"
                  onClick={() => handleAdjustPoints(index, "add")}
                >
                  +
                </button>
                <input
                  id={`points-input-${index}`}
                  type="number"
                  placeholder="Points"
                  style={{ width: "50px", margin: "0 5px" }}
                />
                <button
                  className="decrement-button"
                  onClick={() => handleAdjustPoints(index, "subtract")}
                >
                  -
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


        {/* ID Row */}
        <div className="form-row">
          <label>ID:  </label>
          <input
            type="text"
            name="id"
            value={newUser.id}
            onChange={handleCreateUserChange}
          />
        </div>


        {/* Blank Row */}
        <div className="form-row"></div>
        
        {/* Points Row */}
        <div className="form-row">
          <label>Points: </label>
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
