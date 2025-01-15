import React, { useContext, useState } from 'react';
import './CSS/ShopCategory.css';
import { ShopContext } from '../Context/ShopContext';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import Item from '../Components/Item/Item';
import Search from '../Components/Search/Search';

const ShopCategory = (props) => {
    const { all_product } = useContext(ShopContext);
    const [sortOrder, setSortOrder] = useState('asc'); // State to manage sort order (ascending or descending)

    // Function to handle sorting
    const handleSort = () => {
        setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc')); // Toggle the sort order
    };

    // Filter and sort the products for the current category
    const filteredProducts = all_product.filter(item => item.category === props.category);
    const sortedProducts = filteredProducts.sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.price - b.price; // Ascending order
        } else {
            return b.price - a.price; // Descending order
        }
    });

    return (
        <div className='shop-category'>
            <Search />
            <div className='shopcategory-indexSort'>
                <p>
                    <span>Showing 1-8</span> out of 50 products
                </p>
                <div className='shopcategory-sort' onClick={handleSort}>
                    Sort by Price {sortOrder === 'asc' ? '🔼' : '🔽'} <img src={dropdown_icon} alt="" />
                </div>
            </div>
            <div className="shopcategory-products">
                {sortedProducts.map((item, i) => (
                    <Item key={i} id={item.id} name={item.name} image={item.image} price={item.price} />
                ))}
            </div>
            <div className='shopcategory-loadmore'>
                View More
            </div>
        </div>
    );
};

export default ShopCategory;
