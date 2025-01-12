import React from 'react'
import './Footer.css'
import footer_logo from '../Assets/logo.png'
import instagram_icon from '../Assets/instagram_icon.png'
import facebook_icon from '../Assets/facebook_icon.png'
import website_icon from '../Assets/footerlogo.png'

const Footer = () => {
    return (
        <div className='footer'>
            <div className='footer-logo'>
                <img src={footer_logo} alt=""/>
            </div>
            <ul className='footer-links'>
                <li>About Us</li>
                <li>Minimart</li>
                <li>Contact Us</li>
            </ul>
            <div className="footer-social-icon">
                <div className='footer-icons-container'>
                    <img src={website_icon} alt=""/>
                </div>    
                <div className='footer-icons-container'>
                    <img src={instagram_icon} alt=""/>
                </div>     
                <div className='footer-icons-container'>
                    <img src={facebook_icon} alt=""/>
                </div>                   
            </div>
            <div className='footer-copyright'>
                <hr/>
                <p>Copyright @ 2025 - All Rights Reserved.</p>
            </div>

        </div>
    )
}

export default Footer