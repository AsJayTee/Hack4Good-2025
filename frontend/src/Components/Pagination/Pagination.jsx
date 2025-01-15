import React, { useState, useEffect } from 'react';
import placeholder_image from '../Assets/fruit-apple.png'
import '../Pagination/Pagination.css'

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [pageNum, setPageNum] = useState(1);
    const [cart, setCart] = useState([]);    
  
    // Load cart from localStorage on component mount
    useEffect(() => {
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCart(storedCart);
    }, []);
  
    const addToCart = (product) => {
      const newProduct = {
        id: product[0],
        name: product[1],
        category: product[2],
        quantity: 1, // Start with quantity 1 for the cart
        pointCost: product[4],
      };
    
      const existingItemIndex = cart.findIndex(item => item.id === newProduct.id);
    
      if (existingItemIndex >= 0) {
        // If item already exists, increment quantity
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += 1;
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      } else {
        // If item doesn't exist, add it as a new item
        const updatedCart = [...cart, newProduct];
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
    };
    

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
          <p><strong>Quantity:</strong> {product[3]}</p>
          <p><strong>Point Cost:</strong> {product[4]}</p>
          <button onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      ))}
    </div>
  </div>

  );
};

export default ProductsPage;
