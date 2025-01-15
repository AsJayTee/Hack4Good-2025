import './CSS/Shop.css';
import Search from '../Components/Search/Search';
import Pages from '../Components/Pagination/Pagination';
import { useState } from 'react';

function Shop() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch=(query)=>{
    setSearchQuery(query);
  }

  return (
    <div className="shop-container">
      <Search onSearch={handleSearch}/>
      <h1>All Products</h1>
      <Pages />
    </div>
  );
}

export default Shop;
