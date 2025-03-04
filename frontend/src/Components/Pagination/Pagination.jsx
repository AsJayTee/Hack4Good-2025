import React, { useState, useEffect } from 'react';
import '../Pagination/Pagination.css';
import Search from '../Search/Search'; // Import your Search component

const ProductsPage = ({ selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Store search query

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const addToCart = (product) => {
    const newProduct = {
      id: product[0],
      name: product[1],
      category: product[2],
      quantity: 1,
      price: product[3],
    };

    const existingItemIndex = cart.findIndex(item => item.id === newProduct.id);

    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      const updatedCart = [...cart, newProduct];
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://localhost:5000/getAllProducts`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const convertToBase64 = (imageBlob) => {
    return `data:image/png;base64,${imageBlob}`;
  };

  // Function to update the search query
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product[1].toLowerCase().includes(searchQuery.toLowerCase()) || 
    product[2].toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Search onSearch={handleSearch} />

      <div className="product-list">
        {filteredProducts.map((product) => (
          <div key={product[0]} className="product-item">
            <h2>{product[1]}</h2>
            <img
              className="product-image"
              src={convertToBase64(product[5])}
              alt={product[1]}
            />
            <p><strong>Category:</strong> {product[2]}</p>
            <p><strong>Available Quantity:</strong> {product[4]}</p>
            <p><strong>Price:</strong> {product[3]} points</p>
            <button onClick={() => addToCart(product)}>
              {product[4] === 0 ? "Pre-order" : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;