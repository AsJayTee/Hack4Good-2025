import React, { useContext } from 'react'
import './CSS/ShopCategory.css'
import { ShopContext } from '../Context/ShopContext'
import dropdown_icon from '../Components/Assets/dropdown_icon.png'
import Item from '../Components/Item/Item'
import Search from '../Components/Search/Search'


const ShopCategory = (props) => {
    const {all_product} = useContext(ShopContext);
    return (
        <div className='shop-category'>
                  <Search/>
            <div className='shopcategory-indexSort'>
                <p>
                    <span>Showing 1-8</span> out of 50 products
                </p>
                <div className='shopcategory-sort'>
                    Sort by <img src={dropdown_icon} alt=""/>
                </div>
            </div>
            <div className="shopcategory-products">
                {all_product.map((item,i)=>{
                    if(props.category===item.category){
                        return <Item key={i} id={item.id} name={item.name} image={item.image} price = {item.price}/>
                    }
                    else{
                        return null;
                    }
                })}
            </div>
            <div className='shopcategory-loadmore'>
                View More
            </div>
        </div>
    )
}

export default ShopCategory