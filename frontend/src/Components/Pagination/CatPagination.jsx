import React, { useState, useEffect } from 'react';
import placeholder_image from '../Assets/fruit-apple.png';
import '../Pagination/Pagination.css';

const CatPagination = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [logMessage, setLogMessage] = useState('');
  const [pageNum, setPageNum] = useState(1);

  // Fetch products for a specific category
  const fetchProducts = async (page, category) => {
    try {
      const response = await fetch(`http://localhost:5000/getProductsByCategory?category=${category}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data.products);
      setLogMessage(data.log);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLogMessage(`Error: ${error.message}`);  // More detailed error
    }
    
    
  };

  useEffect(() => {
    fetchProducts(pageNum, category);
  }, [category, pageNum]);

  const handleNextPage = () => setPageNum((prevPage) => prevPage + 1);
  const handlePrevPage = () => setPageNum((prevPage) => Math.max(prevPage - 1, 1));

  return (
    <div>
      <div className="pagination-controls">
        <button onClick={handlePrevPage} disabled={pageNum === 1}>Previous</button>
        <span>Page {pageNum}</span>
        <button onClick={handleNextPage}>Next</button>
      </div>
      <div className="product-list">
        {products.map((product) => (
          <div key={product[0]} className="product-item">
            <h2>{product[1]}</h2>
            <img className="product-image" src={placeholder_image} alt="" />
            <p><strong>Category:</strong> {product[2]}</p>
            <p><strong>Available Quantity:</strong> {product[4]}</p>
            <p><strong>Price:</strong> {product[3]} points</p>
          </div>
        ))}
      </div>
      <div className="log-message">
        <h3>Server Log:</h3>
        <p>{logMessage}</p> {/* Display the server log */}
      </div>
    </div>
  );
};

export default CatPagination;
