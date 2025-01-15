// CartPage.js
import React, { useEffect, useState } from 'react';
import './CSS/Cart.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [originalPoints, setOriginalPoints] = useState(80); // Set the original points balance
  const [remainingPoints, setRemainingPoints] = useState(originalPoints); // This will be updated dynamically
  const [errorMessage, setErrorMessage] = useState('');

  // Load cart from localStorage when CartPage is loaded
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Initialize the quantity for each item if it doesn't exist
    const cartWithQuantity = storedCart.map(item => ({
      ...item,
      quantity: item.quantity || 1, // default quantity is 1
    }));
    setCartItems(cartWithQuantity);
    
    // Recalculate remaining points based on the cart items
    const totalCost = cartWithQuantity.reduce((total, item) => total + (item.price * item.quantity), 0);
    setRemainingPoints(originalPoints - totalCost);
  }, []);

  // Function to remove an item from the cart
  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    const removedItem = cartItems.find(item => item.id === id);

    // Recalculate remaining points after removal
    const updatedRemainingPoints = remainingPoints + (removedItem ? removedItem.price * removedItem.quantity : 0);
    
    setCartItems(updatedCart);
    setRemainingPoints(updatedRemainingPoints); // Update remaining points after removal
    // Save the updated cart and points to localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Function to update item quantity
  const updateQuantity = (id, quantity) => {
    // Prevent quantity from going below 1
    if (quantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    );
    setCartItems(updatedCart);
    // Recalculate total cost and update remaining points
    const totalCost = updatedCart.reduce((total, item) => total + (item.price * item.quantity), 0);
    setRemainingPoints(originalPoints - totalCost);
    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Calculate total cost of the cart
  const totalCost = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Handle checkout
  const handleCheckout = () => {
    if (remainingPoints < 0) {
      setErrorMessage('Insufficient points to complete the purchase.');
    } else {
      setErrorMessage('');
      // Proceed to checkout logic here (e.g., redirect to payment page)
    }
  };

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <h2>{item.name}</h2>
              <p>Category: {item.category}</p>
              <p>Unit Cost: {item.price} points</p>
              <p>Total Cost: {item.price * item.quantity} points</p>
              <p>Quantity: 
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                 {item.quantity} 
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </p>
              <button className="remove-button" onClick={() => removeItem(item.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="cart-summary">
        <h2>Cart Summary</h2>
        <p>Total Items: {cartItems.reduce((total, item) => total + item.quantity, 0)}</p>
        <p>Total Cost: {totalCost} points</p>
        <p>Original Point Balance: {originalPoints} points</p>
        <p>Remaining Point Balance: {remainingPoints} points</p>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button className="checkout-button" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;