import React,{useState} from 'react'
import './Navbar.css'
import logo from '../Assets/logo.png'
import {Link} from 'react-router-dom';

const Navbar = () => {
        const [menu,setMenu]=useState("Shop");
    return (
        <div className='navbar'>
            <div className='nav-logo'>
                <img src={logo} alt=""/>
            </div>
            <ul className='nav-menu'>
                <li onClick={()=>{setMenu("Analytics")}}><Link style={{textDecoration:'none'}} to="/">Analytics</Link>{menu==="Analytics"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("User Management")}}><Link style={{textDecoration:'none'}} to="/user-management">User Management</Link>{menu==="User Management"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("Inventory")}}><Link style={{textDecoration:'none'}} to="/inventory">Inventory</Link>{menu==="Inventory"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("Inventory History")}}><Link style={{textDecoration:'none'}} to="/inventory-history">Inventory History</Link>{menu==="Inventory History"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("Sales Request")}}><Link style={{textDecoration:'none'}} to="/sales-request">Sales Request</Link>{menu==="Sales Request"?<hr/>:<></>}</li>
            </ul>
            <div className='nav-login-cart'>
                <Link to="/login"><button> Admin Login</button></Link>
            </div>


        </div>
    )
}

export default Navbar