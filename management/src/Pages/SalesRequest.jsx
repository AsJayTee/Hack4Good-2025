import React, { useState } from "react";
import "./CSS/SalesRequest.css";


const SalesRequest = () => {
  // Hardcoded list of sales requests
  const [requests, setRequests] = useState([
    { id: 1,name:"Alice", item: "Cheese",quantity: 3, nature: "Normal" },
    { id: 2, name:"Bob",item: "Toothpaste",quantity: 3, nature: "Pre-ordered" },
    { id: 3, name:"Cherry",item: "Apple",quantity:3, nature: "Normal" },
    { id: 4, name:"Daniel",item: "Banana",quantity:3, nature: "Pre-ordered" }
  ]);

  // Filter for nature type
  const [filter, setFilter] = useState("all");

  // State to track denied message popup
  const [showPopup, setShowPopup] = useState(false);
  const [deniedMessage, setDeniedMessage] = useState("");
  const [deniedRequest, setDeniedRequest] = useState(null);

  // Accept request
  const handleAccept = (id) => {
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  // Deny request
  const handleDeny = (id) => {
    setDeniedRequest(id);
    setShowPopup(true);
  };

  // Accept all requests
  const handleAcceptAll = () => {
    setRequests([]);
  };

  // Submit denied message
  const submitDeniedMessage = () => {
    setRequests((prev) => prev.filter((req) => req.id !== deniedRequest));
    setShowPopup(false);
    setDeniedMessage("");
  };

  // Close popup without action
  const closePopup = () => {
    setShowPopup(false);
    setDeniedMessage("");
  };

  // Filtered requests
  const filteredRequests =
    filter === "all" ? requests : requests.filter((req) => req.nature === filter);

  return (
    <div className="sales-request-container">
      {/* Current total number of requests */}
      <div className="header">
        <h1>Sales Requests</h1>
        <span>Total Requests: {requests.length}</span>
      </div>

      {/* Filter by nature */}
      <div className="filter-container">
        <label>Filter by Nature: </label>
        <select onChange={(e) => setFilter(e.target.value)} value={filter}>
          <option value="all">All</option>
          <option value="normal">Normal</option>
          <option value="pre-ordered">Pre-ordered</option>
        </select>
      </div>

      {/* List of requests */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Item</th>
            <th>Quantity</th>
            <th>Nature</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((request) => (
            <tr key={request.id}>
              <td>{request.name}</td>
              <td>{request.item}</td>
              <td>{request.quantity}</td>
              <td>{request.nature}</td>
              <td>
                <button
                  className="action-button accept"
                  onClick={() => handleAccept(request.id)}
                >
                  Accept
                </button>
                <button
                  className="action-button deny"
                  onClick={() => handleDeny(request.id)}
                >
                  Deny
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Accept All button */}
      <div className="accept-all-container">
        <button onClick={handleAcceptAll} className="accept-all-button">
          Accept all
        </button>
      </div>

      {/* Denied message popup */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Message to User</h3>
            <textarea
              value={deniedMessage}
              onChange={(e) => setDeniedMessage(e.target.value)}
              placeholder="Enter your message here..."
            />
            <div className="popup-actions">
              <button onClick={submitDeniedMessage} className="submit-button">
                Submit
              </button>
              <button onClick={closePopup} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



export default SalesRequest;
