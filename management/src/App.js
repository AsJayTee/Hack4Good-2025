import './App.css'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Inventory from './Components/Inventory/Inventory'
import Sidebar from './Components/Sidebar/Sidebar'
import MainDash from './Components/MainDash/MainDash';
import SalesHis from './Components/Sales History/SalesHis';
import SalesR from './Components/SalesRequest/SalesR';
import UserM from './Components/User Management/UserM';



function App() {
  return (
      <Router>
          <div className="App">
              <Sidebar/>
                  <Routes>
                      <Route path="/" element={<MainDash/>} />
                      <Route path="/user-management" element={<UserM/>} />
                      <Route path="/sales-history" element={<SalesHis/>} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/sales-request" element={<SalesR/>} />
                  </Routes>
              </div>
      </Router>
  );
}

export default App;
