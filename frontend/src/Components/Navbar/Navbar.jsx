import React,{useState} from 'react'
import './Navbar.css'
import logo from '../Assets/logo.png'
import profile_icon from '../Assets/profile-user.png'
import cart_icon from '../Assets/cart_icon.png'
import {Link} from 'react-router-dom';

const Navbar = () => {
        const [menu,setMenu]=useState("Shop");
    return (
        <div className='navbar'>
            <div className='nav-logo'>
                <img src={logo} alt=""/>
            </div>
            <ul className='nav-menu'>
                <li onClick={()=>{setMenu("Shop")}}><Link style={{textDecoration:'none'}} to="/">Shop</Link>{menu==="Shop"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("Food")}}><Link style={{textDecoration:'none'}} to="/Food">Food</Link>{menu==="Food"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("Fruits")}}><Link style={{textDecoration:'none'}} to="/Fruits">Fruits</Link>{menu==="Fruits"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("Snacks")}}><Link style={{textDecoration:'none'}} to="/Snacks">Snacks</Link>{menu==="Snacks"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("Drinks")}}><Link style={{textDecoration:'none'}} to="/Drinks">Drinks</Link>{menu==="Drinks"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("Toiletries")}}><Link style={{textDecoration:'none'}} to="/Toiletries">Toiletries</Link>{menu==="Toiletries"?<hr/>:<></>}</li>
            </ul>
            <div className='nav-login-cart'>
                <Link to="/login"><button>Login</button></Link>
                <Link to="/userprofile"><img src={profile_icon} alt=""/></Link>
                <Link to="/cart"><img src={cart_icon} alt=""/></Link>
                <div className='nav-cart-count'>0</div>
            </div>
        </div>
    )
}

export default Navbar