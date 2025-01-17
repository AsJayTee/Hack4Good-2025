import React, { useState, useEffect } from 'react';
import './CSS/ShopCategory.css'
import Item from '../Components/Item/Item';
import Search from '../Components/Search/Search';

const ShopCategory = ({ category }) => {
    const [products, setProducts] = useState([]); // State to store products fetched from the server
    const [loading, setLoading] = useState(true); // State to track loading status
    const [error, setError] = useState(null); // State to store any error
    const [filteredProducts, setFilteredProducts] = useState([]); // State to store filtered products
    const [categoryProducts, setCategoryProducts] = useState([]); // State to store category-filtered products

    useEffect(() => {
        // Function to fetch data from the server
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/getAllProducts');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();

                // Transform the data into an array of objects
                const transformedData = data.map(item => ({
                    id: item[0],
                    name: item[1],
                    category: item[2],
                    price: item[3],
                    quantity: item[4],
                    image: `data:image/png;base64,${item[5]}` // Convert the blob to base64 image
                }));

                setProducts(transformedData); // Set products to the state
            } catch (err) {
                setError(err.message); // Handle error
            } finally {
                setLoading(false); // Set loading to false when done
            }
        };

        fetchProducts(); // Fetch products on component mount
    }, []); // Empty dependency array ensures this effect runs only once

    useEffect(() => {
        // Filter products based on category prop
        const categoryFiltered = products.filter(item => item.category === category);
        setCategoryProducts(categoryFiltered);
        setFilteredProducts(categoryFiltered); // Set filtered products initially
    }, [products, category]); // Run when products or category changes

    // Handle search functionality
    const handleSearch = (query) => {
        if (!query) {
            setFilteredProducts(categoryProducts); // Reset to all products in the category
        } else {
            const filtered = categoryProducts.filter(item =>
                item.name.toLowerCase().includes(query.toLowerCase()) ||
                item.category.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredProducts(filtered); // Set filtered products
        }
    };

    // Loading, error, or product display logic
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='shopcategory'>
            <h1>All Products in {category}</h1> {/* Dynamically display category */}
            <Search onSearch={handleSearch} /> {/* Search input for filtering */}
            <div className='shopcategory-indexSort'>
                <p>
                    <span>Showing {filteredProducts.length}</span> products in {category} category
                </p>
            </div>
            <div className='shopcategory-products'>
                {filteredProducts.map((item, i) => (
                    <Item key={i} id={item.id} name={item.name} image={item.image} price={item.price} />
                ))}
            </div>
            <div className='shopcategory-loadmore'>
                {/* Handle "View More" button visibility */}
                {filteredProducts.length < categoryProducts.length && (
                    <button onClick={() => { /* Implement load more logic here */ }}>
                        View More
                    </button>
                )}
            </div>
        </div>
    );
};

export default ShopCategory;
