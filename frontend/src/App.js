import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Footer from './Components/Footer/Footer';
import Userprofile from './Pages/Userprofile';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Shop/>}/>
        <Route path='/Food' element={<ShopCategory category="Food"/>}/>
        <Route path='/Fruits' element={<ShopCategory category="Fruits"/>}/>
        <Route path='/Snacks' element={<ShopCategory category="Snacks"/>}/>
        <Route path='/Drinks' element={<ShopCategory category="Drinks"/>}/>
        <Route path='/Toiletries' element={<ShopCategory category="Toiletries"/>}/>
        <Route path='/product' element={<Product/>}>
          <Route path=':productID' element={<Product/>}/>
        </Route>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/userprofile' element={<Userprofile/>}/>
        <Route path='/login' element={<LoginSignup/>}/>
      </Routes>
      <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
