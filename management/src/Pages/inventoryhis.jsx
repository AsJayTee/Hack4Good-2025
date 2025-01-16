import React from "react";
import "./CSS/inventoryhis.css"
// Sample data for admin updates to the inventory
const inventoryUpdates = [
  { adminId: 1,  itemName: "Apple", quantity: 10, action: "Added" },
  { adminId: 2,  itemName: "Banana", quantity: 5, action: "Added" },
  { adminId: 4,  itemName: "Cheese", quantity: 0, action: "Approved" },
  { adminId: 3, itemName: "Soap", quantity: 20, action: "Denied" },
  { adminId: 5, itemName: "Milk", quantity: 0, action: "Removed" },
];

const InventoryHistory = () => {
  return (
    <div>
      <h1>Inventory History</h1>
      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Admin ID</th>
            <th>Item Name</th>
            <th>Quantity Changed</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {inventoryUpdates.map((update, index) => (
            <tr key={index}>
              <td>{update.adminId}</td>
              <td>{update.itemName}</td>
              <td>{update.action === "Removed" ? "-" : update.quantity}</td>
              <td>
              {update.action === "Added"
                ? `Admin ${update.adminId} added ${update.itemName} to the inventory.`
                : update.action === "Accepted"
                ? `Admin ${update.adminId} accepted request from resident.`
                : update.action === "Declined"
                ? `Admin ${update.adminId} declined request from resident.`
                : `Admin ${update.adminId} removed ${update.itemName} from the inventory.`}

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryHistory;
