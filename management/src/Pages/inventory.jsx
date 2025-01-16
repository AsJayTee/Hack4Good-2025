import React, { useState } from "react";
import "./CSS/inventory.css";
import "../Components/Button/button.css"


const Inventory = () => {
  // Initial state for food items
  const [inventory, setInventory] = useState([
    { id: 1, name: "Apples",point: 3 ,quantity: 10 },
    { id: 2, name: "Bananas",point: 4, quantity: 20 },
    { id: 3, name: "Carrots",point: 5, quantity: 15 },
    { id: 4, name: "Carrotss",point:6, quantity: 16 },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", quantity: "" });
  const [customAmount, setCustomAmount] = useState({})

  // Function to handle increment by custom amount
  const incrementQuantity = (id) => {
    const amount = parseInt(customAmount[id], 10); // Get the amount from the input
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid number greater than zero.");
      return; // Don't apply the increment if the value is invalid
    }
    setInventory((prevInventory) =>
      prevInventory.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + amount }
          : item
      )
    );
  };

  // Function to handle decrement by custom amount
  const decrementQuantity = (id) => {
    const amount = parseInt(customAmount[id], 10); // Get the amount from the input
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid number greater than zero.");
      return; // Don't apply the decrement if the value is invalid
    }
    setInventory((prevInventory) =>
      prevInventory.map((item) =>
        item.id === id && item.quantity >= amount
          ? { ...item, quantity: item.quantity - amount }
          : item
      )
    );
  };
  // Handle the custom amount input change
  const handleCustomAmountChange = (id, value) => {
    setCustomAmount((prevState) => ({
      ...prevState,
      [id]: value ? parseInt(value, 10) : "",  // Ensure the value is a number
    }));
  };
  

  
  // Function to handle item removal
  const removeItem = (id) => {
    setInventory((prevInventory) =>
      prevInventory.filter((item) => item.id !== id)
    );
  };

  // Function to handle adding a new item
  const addItem = () => {
    if (newItem.name.trim() === "" || newItem.quantity === "" || isNaN(newItem.quantity) || !Number.isInteger(Number(newItem.quantity)) ) {
      alert("Please enter valid name and quantity.");
      return;
    }
    const newItemData = {
      id: inventory.length + 1,
      name: newItem.name,
      point:  parseInt(newItem.point, 10),
      quantity: parseInt(newItem.quantity, 10),
    };
    setInventory((prevInventory) => [...prevInventory, newItemData]);
    setNewItem({ name: "", quantity: "", point: "" });
    setShowModal(false);
  };

  

  return (
    <div className="inventory-container">
      <h1>Inventory</h1>
      <button className="primary-button" onClick={() => setShowModal(true)}>
        Add item
      </button>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Points required/ Item</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.point}</td>
              <td>{item.quantity}</td>
              <td>
                <button
                  onClick={() => decrementQuantity(item.id)}
                  className="decrement-button"
                >
                  -
                </button>
                <input
                  type="number"
                  placeholder="# of items"
                  value={customAmount[item.id] || ""}
                  onChange={(e) =>
                    handleCustomAmountChange(item.id, e.target.value)
                  }
                  className="quantity-input"
                  style={{ width: "80px" }}
                  min="0"
                />
                <button
                  onClick={() => incrementQuantity(item.id)}
                  className="increment-button"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="danger-button"
                >
                  Delete item
                </button>
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Item</h2>
            <div className="form-row">
              <label>
                Item name: <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                Points required/Item:  
                <input
                  type="number"
                  value={newItem.point}
                  onChange={(e) =>
                    setNewItem({ ...newItem, point: e.target.value })
              
                  }
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                Quantity: 
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem({ ...newItem, quantity: e.target.value })
              
                  }
                />
              </label>
            </div>
            <div className="modal-actions">
              <button onClick={addItem} className="primary-button">Add</button>
              <button onClick={() => setShowModal(false)} className="secondary-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
