import React from 'react'
import './CSS/Userprofile.css'
import profile_icon from '../Components/Assets/profile-user.png'

const Userprofile = () => {

    const user={
      name:'Snoopy Jin Thau',
      id:'C8888',
      points:0
    };
    return (
        <div className='profile-container'>
          <div className='profile-card'>
            <img src={profile_icon} alt="" className="profile-icon"/>
            <h1 className="profile-name">{user.name}</h1>
            <p className='profile-id'>Customer ID: {user.id}</p>
            <p className='profile-points'>Points: {user.points}</p>
          </div>
        </div>
    )
}

export default Userprofile