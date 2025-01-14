import React, {useState} from 'react'
import './Sidebar.css'
import Logo from '../../imgs/logo.png'
import { SidebarData } from '../../Data/Data'
import {useNavigate} from 'react-router-dom';
const Sidebar = () => {
    const [selected, setSelected] = useState(0)
    const navigate = useNavigate();
    const handleNavigation = (index, path) => {
        setSelected(index);
        navigate(path); // Navigate to the specified route
    };
  return (
    <div className = "Sidebar">
        {/*logo*/}
        <div className = "logo">
            <img src = {Logo} alt = ""/>
        </div>
        {/*menu*/}
        <div className = "menu">
            {SidebarData.map((item,index)=>{
                return(
                    <div className= {selected === index?'menuItem active':"menuItem"}
                    key = {index}
                    onClick = {()=>handleNavigation(index,item.path)}
                    >
                        <span>{item.heading}</span>
                    </div>
                )
            })}
        </div>

    </div>


  )
}

export default Sidebar