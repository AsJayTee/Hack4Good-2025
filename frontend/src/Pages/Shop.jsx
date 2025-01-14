import React, { useState } from 'react';
import all_product from '../Components/Assets/all_product';
import './CSS/Shop.css';
import Search from '../Components/Search/Search';
import Pages from '../Components/Pagination/Pagination';

function Shop() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
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
        {cart.map((item, index) => (
          <p key={index}>{item.name}</p>
        ))}
        <p>Total Items: {cart.length}</p>
      </div>
    </div>
  );
}

export default Shop;
