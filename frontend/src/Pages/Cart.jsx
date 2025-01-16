import React, { useEffect, useState } from 'react';
import './CSS/Cart.css';

const CartPage = ({ setCartCount }) => {
  const [cartItems, setCartItems] = useState([]);
  const [originalPoints, setOriginalPoints] = useState(80);
  const [remainingPoints, setRemainingPoints] = useState(originalPoints);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartWithQuantity = storedCart.map(item => ({
      ...item,
      quantity: item.quantity || 1,
    }));
    setCartItems(cartWithQuantity);

    const totalCost = cartWithQuantity.reduce((total, item) => total + (item.price * item.quantity), 0);
    setRemainingPoints(originalPoints - totalCost);

    // Update cart count in Navbar
    const totalItems = cartWithQuantity.reduce((total, item) => total + item.quantity, 0);
    setCartCount(totalItems);
  }, [setCartCount]);

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    const removedItem = cartItems.find(item => item.id === id);
    const updatedRemainingPoints = remainingPoints + (removedItem ? removedItem.price * removedItem.quantity : 0);

    setCartItems(updatedCart);
    setRemainingPoints(updatedRemainingPoints);

    localStorage.setItem('cart', JSON.stringify(updatedCart));

    const totalItems = updatedCart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(totalItems);
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    const updatedCart = cartItems.map(item => item.id === id ? { ...item, quantity } : item);
    setCartItems(updatedCart);

    const totalCost = updatedCart.reduce((total, item) => total + (item.price * item.quantity), 0);
    setRemainingPoints(originalPoints - totalCost);

    localStorage.setItem('cart', JSON.stringify(updatedCart));

    const totalItems = updatedCart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(totalItems);
  };

  const totalCost = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (remainingPoints < 0) {
      setErrorMessage('Insufficient points to complete the purchase.');
    } else {
      setErrorMessage('');
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
              <p className="quantity-control">
                Quantity: 
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
