const createCart = async (residentId) => {
    try {
      const response = await fetch('http://localhost:5000/createCart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resident_id: residentId }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log(data.message);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error creating cart:', error);
    }
  };
  
  // Example usage
  createCart('resident123');
  