# Frontend Resident E-commerce Interface

This is an e-commerce platform designed for the residents of Muhammadiyah Welfare Home (MWH) to shop for food and daily necessities using a point-based currency system, ensuring a seamless and user-friendly experience.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Installation](#installation)
4. [Project Structure](#project-structure)
5. [Explanation](#explanation)

## Overview

The Resident E-Commerce Interface provides an intuitive platform for MWH residents to browse, shop, and manage their orders. It enables them to purchase items within their allocated point balance while ensuring they can easily track their order history and remaining balance.

---

## Features

- **Categorised Shopping Pages:** Shop by categories such as food, fruits, snacks, drinks, and toiletries.
- **Search Functionality:** Search for specific products across all categories.
- **Dynamic Cart Management** Add items to the cart, update quantities, and remove unwanted items.
- **Point-Based Checkout System:** Ensures orders cannot be placed if the resident’s remaining points fall below zero.
- **Pre-Order for Out-of-Stock Items:** Allows residents to place pre-orders for unavailable items.
- **User Profile Management:** View order history, remaining point balance, and resident ID in a dedicated profile page.
- **Error Notifications:** Displays user-friendly error messages for insufficient points or invalid operations.

---

## Installation

### 1. Install the relevant dependencies
```bash
npm install
npm install react-router-dom
```

### 2. Start the development server
```bash
npm start
```

---

## Project Structure

The project is organised in a modular and scalable way. Here's an overview of the directory structure 

```bash
src/
│
├── Components/
│   ├── Assets
├   ├── Breadcrums
│   ├── Footer
│   ├── Item
│   ├── Navbar
├   ├── Pagination
│   ├── Search
│   └── user_auth
│
├── Components/
│   └── ShopContext.jsx
│
└── Pages/
    ├── CSS
    ├── Cart.jsx
    ├── Login.jsx
    ├── Product.jsx
    ├── Shop.jsx
    ├── ShopCategory.jsx
    └── Userprofile.jsx
```


## Explanation:

- **`src/`**: This is the root folder for all source code files.
  - **`components/`**: Houses reusable components to ensure modularity.
    - **`Assets`**: Stores static files such as icons and images for use across the application.
    - **`Breadcrums`**: Provides navigational breadcrumbs for better user experience.
    - **`Footer`**: Displays a consistent footer at the bottom of each page.
    - **`Item`**: Manages the rendering of individual products with information like name, price, and availability.
    - **`Navbar`**: Top navigation bar for accessing shop categories, cart, and user profile.
    - **`Pagination`**: Facilitates navigation through multiple pages of products.
    - **`Search`**: Implements the search functionality to find items across categories.
    - **`user_auth`**: Manages user login, signup, and authentication-related workflows.
  
  - **`Context/`**: Implements global state management using React Context API to manage cart items, points, and shop states.

  - **`Pages/`**: Contains the different pages of the application.
    - **`CSS`**: This folder contains all the global and page-specific styles for the pages in the frontend management system. 
    - **`Cart.jsx`**: Displays the cart, allowing users to adjust quantities, remove items, and proceed to checkout.
    - **`Login.jsx`**: Handles user login and authentication workflows.
    - **`Product.jsx`**: Displays detailed information about a specific product.
    - **`Shop.jsx`**: The main shopping page, listing all available items for purchase.
    - **`ShopCategory.jsx`**: Displays products filtered by category, such as food or toiletries.
    - **`Userprofile.jsx`**: Displays resident-specific information, including their order history and point balance.
