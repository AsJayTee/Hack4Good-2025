const addToCart = async (residentId, productId, quantity = 1) => {
    try {
      const response = await fetch('http://localhost:5000/addToCart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resident_id: residentId, product_id: productId, quantity }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log(data.message);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  
  // Example usage
  addToCart('resident123', 'product456', 2);
  