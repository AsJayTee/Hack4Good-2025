import React from 'react'
import  './Item.css'
import {Link} from 'react-router-dom'

const Item = (props) => {
    return (
        <div className='item'>
            <img src={props.image} alt=""/>
            <p>{props.name}</p>
            <div className='item-price'>
                {props.price}
            </div>
        </div>
    )
}

export default Item