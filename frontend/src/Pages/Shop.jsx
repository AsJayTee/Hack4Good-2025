import React, { useState, useEffect } from 'react';
import all_product from '../Components/Assets/all_product';
import './CSS/Shop.css';
import Search from '../Components/Search/Search';
import Pages from '../Components/Pagination/Pagination';

function Shop() {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const addToCart = (product) => {
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex >= 0) {
      // If item already exists, increment quantity
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      // If item doesn't exist, add a new item with quantity 1
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      setCart(updatedCart);
      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart));
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
