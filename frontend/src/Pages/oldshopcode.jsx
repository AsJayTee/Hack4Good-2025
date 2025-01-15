import React, { useState, useEffect } from 'react';
import all_product from '../Components/Assets/all_product';
import './CSS/Shop.css';
import Search from '../Components/Search/Search';
import Pages from '../Components/Pagination/Pagination';

function Shop() {
  const [cart, setCart] = useState([]);
  const residentId = 'resident123'; // Replace with the actual residentId

  // Load cart from localStorage on component mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);

    // Create cart for the resident if it doesn't exist (optional: can be done on first interaction)
    createCart(residentId);
  }, []);

  // Create cart for the resident
  const createCart = async (residentId) => {
    try {
      const response = await fetch('http://localhost:5000/createCart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resident_id: residentId }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data.message);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error creating cart:', error);
    }
  };

  // Add product to cart
  const addToCart = async (product) => {
    try {
      const response = await fetch('http://localhost:5000/addToCart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resident_id: residentId,
          product_id: product.id,
          quantity: 1, // Default quantity is 1
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data.message);
        // Update cart after adding product
        const updatedCart = [...cart, { ...product, quantity: 1 }];
        setCart(updatedCart);
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="shop-container">
      <Search />
      <h1>All Products</h1>
      <Pages />
      <div className="product-list">
        {all_product.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>Category: {product.category}</p>
            <p>Point Cost: {product.price}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h2>Cart Summary</h2>
        <p>Total Items: {cart.reduce((total, item) => total + item.quantity, 0)}</p>
      </div>
    </div>
  );
}

export default Shop;