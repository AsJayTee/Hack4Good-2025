import './CSS/Shop.css';
import Search from '../Components/Search/Search';
import Pages from '../Components/Pagination/Pagination';

function Shop() {
  return (
    <div className="shop-container">
      <Search />
      <h1>All Products</h1>
      <Pages />
    </div>
  );
}

export default Shop;
