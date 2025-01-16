import React from 'react';
import './CSS/Userprofile.css';
import profile_icon from '../Components/Assets/profile-user.png';

const Userprofile = () => {
    const user = {
        name: 'Snoopy',
        id: 'C8888',
        points: 80
    };

    const orders = [
        {
            orderId: 1,
            points: 20,
            date: '2025-01-01',
            productType: 'Apple',
            category: 'Fruits'
        },
        {
            orderId: 2,
            points: 15,
            date: '2025-01-10',
            productType: 'Chocolate',
            category: 'Snacks'
        }
    ];

    return (
        <div className='dashboard'>
            {/* Profile Section */}
            <div className='profile-container'>
                <div className='profile-card'>
                    <img src={profile_icon} alt="" className="profile-icon" />
                    <h1 className="profile-name">{user.name}</h1>
                    <p className='profile-id'>Customer ID: {user.id}</p>
                    <p className='profile-points'>Points: {user.points}</p>
                </div>
                <div className="profile-options">
                    <button className="option-button">Log Out</button>
                </div>
            </div>
            
            {/* Order History Section */}
            <div className='order-history'>
                <h2>Order History</h2>
                <ul className='order-list'>
                    {orders.map(order => (
                        <li key={order.orderId} className='order-item'>
                            <p><strong>Order ID:</strong> #{order.orderId}</p>
                            <p><strong>Points:</strong> {order.points}</p>
                            <p><strong>Date:</strong> {order.date}</p>
                            <p><strong>Product Type:</strong> {order.productType}</p>
                            <p><strong>Category:</strong> {order.category}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Userprofile;