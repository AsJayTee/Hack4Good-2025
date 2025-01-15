import React from "react";
import "./CSS/inventoryhis.css"
// Sample data for admin updates to the inventory
const inventoryUpdates = [
  { adminId: 1, adminName: "Admin1", itemName: "Apple", quantity: 10, action: "added" },
  { adminId: 2, adminName: "Admin2", itemName: "Banana", quantity: 5, action: "added" },
  { adminId: 1, adminName: "Admin1", itemName: "Cheese", quantity: 0, action: "removed" },
  { adminId: 3, adminName: "Admin3", itemName: "Soap", quantity: 20, action: "added" },
  { adminId: 2, adminName: "Admin2", itemName: "Milk", quantity: 0, action: "removed" },
];

const InventoryHistory = () => {
  return (
    <div>
      <h1>Inventory History</h1>
      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Admin ID</th>
            <th>Admin Name</th>
            <th>Item Name</th>
            <th>Quantity Changed</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {inventoryUpdates.map((update, index) => (
            <tr key={index}>
              <td>{update.adminId}</td>
              <td>{update.adminName}</td>
              <td>{update.itemName}</td>
              <td>{update.action === "removed" ? "-" : update.quantity}</td>
              <td>
                {update.action === "added"
                  ? `${update.adminName} added ${(update.itemName)} to the inventory.`
                  : `${update.adminName} removed ${(update.itemName)} from the inventory.`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryHistory;
