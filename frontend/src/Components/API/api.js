const product_url='http://127.0.0.1:5000';

export const getProducts = async(pageNum = 1)=>{
    const response = await fetch(`${product_url}/getProducts?pageNum=${pageNum}`);
    if (!response.ok){
        throw new Error('Failed to fetch products');
    }
    return response.json();
};