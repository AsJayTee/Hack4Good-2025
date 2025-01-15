import React, { useEffect, useState } from 'react';
import './CSS/Cart.css';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
  
    // Load cart from localStorage when CartPage is loaded
    useEffect(() => {
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      
      // Initialize the quantity for each item if it doesn't exist
      const cartWithQuantity = storedCart.map(item => ({
        ...item,
        quantity: item.quantity || 1, // default quantity is 1
      }));
      setCartItems(cartWithQuantity);
    }, []);
  
    // Function to remove an item from the cart
    const removeItem = (id) => {
      const updatedCart = cartItems.filter(item => item.id !== id);
      setCartItems(updatedCart);
      // Save the updated cart to localStorage
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
      // Save the updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart));
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
          <p>Total Points: {cartItems.reduce((total, item) => total + item.price * item.quantity, 0)} points</p>
          <button className="checkout-button">Proceed to Checkout</button>
        </div>
      </div>
    );
};

export default CartPage;
