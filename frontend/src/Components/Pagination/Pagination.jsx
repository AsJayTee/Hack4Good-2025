import React, { useState, useEffect } from 'react';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [pageNum, setPageNum] = useState(1);

  // Function to fetch products for a specific page
  const fetchProducts = async (page) => {
    try {
      const response = await fetch(`http://localhost:5000/getProducts?pageNum=${page}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fetch products when the component mounts and when pageNum changes
  useEffect(() => {
    fetchProducts(pageNum);
  }, [pageNum]);

  // Pagination controls
  const handleNextPage = () => setPageNum((prevPage) => prevPage + 1);
  const handlePrevPage = () => setPageNum((prevPage) => Math.max(prevPage - 1, 1));

  return (
    <div>
      <h1>Products</h1>
      <div className="product-list">
        {products.map((product) => (
          <div key={product[0]} className="product-item">
            <h2>{product[1]}</h2>
            <p><strong>Category:</strong> {product[2]}</p>
            <p><strong>Quantity:</strong> {product[3]}</p>
            <p><strong>Point Cost:</strong> {product[4]}</p>
          </div>
        ))}
      </div>
      <div className="pagination-controls">
        <button onClick={handlePrevPage} disabled={pageNum === 1}>Previous</button>
        <span>Page {pageNum}</span>
        <button onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
};

export default ProductsPage;
