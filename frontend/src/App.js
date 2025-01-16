import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart'; // Import the Cart component
import Login from './Pages/Login';
import Footer from './Components/Footer/Footer';
import Userprofile from './Pages/Userprofile';
import { useState, useEffect } from 'react';

function App() {
  const [cartCount, setCartCount] = useState(0);

  // Update cartCount from localStorage on app load
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = storedCart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(totalItems);
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Navbar cartCount={cartCount} /> {/* Pass cartCount to Navbar */}
        <Routes>
          {/* Define Routes */}
          <Route path='/' element={<Shop />} />
          <Route path='/Shop' element={<Shop />} />
          <Route path='/Food' element={<ShopCategory category="Food" />} />
          <Route path='/Fruit' element={<ShopCategory category="Fruit" />} />
          <Route path='/Snacks' element={<ShopCategory category="Snacks" />} />
          <Route path='/Drinks' element={<ShopCategory category="Drinks" />} />
          <Route path='/Toiletries' element={<ShopCategory category="Toiletries" />} />
          <Route path='/product' element={<Product />}>
            <Route path=':productID' element={<Product />} />
          </Route>
          <Route path='/cart' element={<Cart setCartCount={setCartCount} />} /> {/* Pass setCartCount to Cart */}
          <Route path='/userprofile' element={<Userprofile />} />
          <Route path='/login' element={<Login />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
