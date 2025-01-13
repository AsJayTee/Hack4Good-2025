import React from 'react';
import all_product from '../Components/Assets/all_product'
import './CSS/Shop.css'
import Search from '../Components/Search/Search'


function Shop() {
  return (
    <div className="shop-container">
    <Search/>
      <h1>All Products</h1>
      <div className="product-list">
        {all_product.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>Category: {product.category}</p>
            <p>Price: ${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shop;
