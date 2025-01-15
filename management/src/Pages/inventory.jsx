import React, { useState } from "react";
import "./CSS/inventory.css";

const Inventory = () => {
  // Initial state for food items
  const [inventory, setInventory] = useState([
    { id: 1, name: "Apples", quantity: 10 },
    { id: 2, name: "Bananas", quantity: 20 },
    { id: 3, name: "Carrots", quantity: 15 },
    { id: 4, name: "Carrotss", quantity: 16 },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", quantity: "" });

  // Function to handle increment
  const incrementQuantity = (id) => {
    setInventory((prevInventory) =>
      prevInventory.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Function to handle decrement
  const decrementQuantity = (id) => {
    setInventory((prevInventory) =>
      prevInventory.map((item) =>
        item.id === id && item.quantity > 0
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Function to handle item removal
  const removeItem = (id) => {
    setInventory((prevInventory) =>
      prevInventory.filter((item) => item.id !== id)
    );
  };

  // Function to handle adding a new item
  const addItem = () => {
    if (newItem.name.trim() === "" || newItem.quantity === "" || isNaN(newItem.quantity) || !Number.isInteger(newItem.quantity) ) {
      alert("Please enter valid name and quantity.");
      return;
    }
    const newItemData = {
      id: inventory.length + 1,
      name: newItem.name,
      quantity: parseInt(newItem.quantity, 10),
    };
    setInventory((prevInventory) => [...prevInventory, newItemData]);
    setNewItem({ name: "", quantity: "" });
    setShowModal(false);
  };

  return (
    <div className="inventory-container">
      <h1>Inventory</h1>
      <button className="add-button" onClick={() => setShowModal(true)}>
        Add item
      </button>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>
                <button
                  onClick={() => decrementQuantity(item.id)}
                  className="quantity-button"
                >
                  -
                </button>
                <button
                  onClick={() => incrementQuantity(item.id)}
                  className="quantity-button"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="delete-button"
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
                Quantity: <input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem({ ...newItem, quantity: e.target.value })
                  }
                />
              </label>
            </div>
            <div className="modal-actions">
              <button onClick={addItem} className="add-button">Add</button>
              <button onClick={() => setShowModal(false)} className="cancel-button">
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
