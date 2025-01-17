import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import LoginSignup from './Pages/LoginSignup';
import Footer from './Components/Footer/Footer';
import Inventory from './Pages/inventory';
import SalesRequest from './Pages/SalesRequest';
import Analytics from './Pages/Analytics';
import InventoryHis from './Pages/inventoryhis';
import UserManage from './Pages/UserManage';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/login' element={<LoginSignup/>}/>
        <Route path='/inventory' element={<Inventory/>} />
        <Route path='/sales-request' element={<SalesRequest/>} />
        <Route path='/' element={<LoginSignup/>}/>
        <Route path='/analytics' element={<Analytics/>}/>
        <Route path='/inventory-history' element={<InventoryHis/>} />
        <Route path='/user-management' element={<UserManage />} />
        
      </Routes>
      <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
