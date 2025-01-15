import React, { useState, useEffect } from 'react';
import placeholder_image from '../Assets/fruit-apple.png';
import '../Pagination/CatPagination.css';

const ProductsCatPage = ({ searchQuery, selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [cart, setCart] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc'); // State for sort order (ascending or descending)

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

  // Function to fetch products for a specific page and category
  const fetchProducts = async (page, query, category) => {
    try {
      console.log("Fetching products for query:", query, "and category:", category);  // Debug log
      const response = await fetch(`http://localhost:5000/getProducts?pageNum=${page}&searchQuery=${query}&category=${category}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Sorting function based on the sortOrder state
  const sortProducts = (products) => {
    return products.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[3] - b[3]; // Sort by price (ascending)
      } else {
        return b[3] - a[3]; // Sort by price (descending)
      }
    });
  };

  // Fetch and filter products based on category and sort them
  useEffect(() => {
    const fetchData = async () => {
      // Fetch all items when category is 'shop' or empty, otherwise fetch by category
      if (selectedCategory === "shop" || !selectedCategory) {
        await fetchProducts(pageNum, searchQuery, "");
      } else {
        await fetchProducts(pageNum, searchQuery, selectedCategory);
      }
    };
    
    fetchData();
  }, [pageNum, searchQuery, selectedCategory]);

  // Handle sorting
  const handleSort = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc')); // Toggle the sort order
  };

  const handleNextPage = () => setPageNum((prevPage) => prevPage + 1);
  const handlePrevPage = () => setPageNum((prevPage) => Math.max(prevPage - 1, 1));

  // Filter and sort the products
  const filteredAndSortedProducts = sortProducts(products.filter(product => {
    if (!selectedCategory || selectedCategory === "shop") {
      return true; // No category filter applied
    }
    return product[2] === selectedCategory; // Filter by category
  }));

  return (
    <div>
      <div className="pagination-controls">
        <button onClick={handlePrevPage} disabled={pageNum === 1}>Previous</button>
        <span>Page {pageNum}</span>
        <button onClick={handleNextPage}>Next</button>
      </div>
      <div className="shopcategory-sort" onClick={handleSort}>
        Sort by Price {sortOrder === 'asc' ? '🔼' : '🔽'}
      </div>
      <div className="product-list">
        {filteredAndSortedProducts.map((product) => (
          <div key={product[0]} className="product-item">
            <h2>{product[1]}</h2>
            <img className="product-image" src={placeholder_image} alt="" />
            <p><strong>Category:</strong> {product[2]}</p>
            <p><strong>Available Quantity:</strong> {product[4]}</p>
            <p><strong>Price:</strong> {product[3]} points</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsCatPage;
