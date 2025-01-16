
# Documentation: Grocery Store Management System Flask API

This Flask application provides endpoints for managing a grocery store system. It includes features for product retrieval, cart management, and low-stock monitoring.

## Table of Contents
1. **Endpoints Overview**
2. **Helper Functions**
3. **Running the Application**

---

## 1. Endpoints Overview

### **1.1 GET `/getProducts`**
- **Description**: Retrieves a paginated list of products.
- **Query Parameters**:
  - `pageNum` (int, optional): Page number (default is 1).
- **Response**:
  - JSON array of products with images converted to Base64.
- **Example**:
  ```
  GET /getProducts?pageNum=2
  ```

---

### **1.2 POST `/insertProduct`**
- **Description**: Updates the quantity of a product in the database.
- **Request Body** (JSON):
  ```json
  {
    "product_id": "<product_id>",
    "quantity": <quantity>
  }
  ```
- **Response**:
  - Success message with updated product details.
- **Example**:
  ```
  POST /insertProduct
  {
    "product_id": "P123",
    "quantity": 10
  }
  ```

---

### **1.3 POST `/createCart`**
- **Description**: Creates a new cart for a resident.
- **Request Body** (JSON):
  ```json
  {
    "resident_id": "<resident_id>"
  }
  ```
- **Response**:
  - Success message for cart creation.
- **Example**:
  ```
  POST /createCart
  {
    "resident_id": "R456"
  }
  ```

---

### **1.4 POST `/addToCart`**
- **Description**: Adds a product to a resident's cart.
- **Request Body** (JSON):
  ```json
  {
    "resident_id": "<resident_id>",
    "product_id": "<product_id>",
    "quantity": <quantity (optional, default=1)>
  }
  ```
- **Response**:
  - Success message for adding the product to the cart.
- **Example**:
  ```
  POST /addToCart
  {
    "resident_id": "R456",
    "product_id": "P123",
    "quantity": 2
  }
  ```

---

### **1.5 GET `/getProductsByCategory`**
- **Description**: Retrieves products by category.
- **Query Parameters**:
  - `category` (string): The product category to filter by.
- **Response**:
  - JSON array of products with images converted to Base64.
- **Example**:
  ```
  GET /getProductsByCategory?category=Fruits
  ```

---

### **1.6 GET `/get_low_stock_products`**
- **Description**: Retrieves products with low stock.
- **Response**:
  - JSON array of low-stock products.
- **Example**:
  ```
  GET /get_low_stock_products
  ```

---

## 2. Helper Functions

### **`convert_blob_to_base64(product_list)`**
- **Purpose**: Converts binary image data (blob) in the product list to Base64 strings.
- **Parameters**:
  - `product_list`: List of tuples where the last element is a blob.
- **Returns**:
  - A list of tuples with the last element converted to a Base64 string.

---

## 3. Running the Application

1. **Install Dependencies**:
   - Ensure Flask and other required libraries are installed.
   - Use `.env` for environment variable configuration.

2. **Run the Server**:
   - Execute the script:  
     ```
     python run.py
     ```
   - The server will start on port `5000`.

3. **Testing Endpoints**:
   - Use tools like Postman or `curl` to interact with the API.
   - Example:  
     ```
     curl http://127.0.0.1:5000/getProducts?pageNum=1
     ```

---

### Notes
- **CORS Support**: The `Access-Control-Allow-Origin: *` header is added to allow cross-origin requests.
- **Error Handling**: Returns a JSON error response with a 500 status code for server-side exceptions.
