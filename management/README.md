# Frontend Management System

This system is desiged to support admins working in Muhammadiyah Welfare Home (MWH), providing them with an easy-to-use website to manage the web-based Minimart and Voucher System in MWH.   

 Built with React, it provides an intuitive interface for managing data, performing CRUD operations, and interacting with backend APIs.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Installation](#installation)
4. [Project Structure](#project-structure)
5. [Explanation](#explanation)

## Overview

This frontend management system provides a user-friendly interface for managing the residents at the welfare home, the inventory of the minimart and sales request done by the residents. 

---

## Features

- **Responsive UI:** Built with CSS framework.
- **Reusable Components:** Modular components that can be reused across the app.
- **API Integration:** Communicates with backend APIs for data retrieval and updates.
- **Dynamic Routing:** Supports navigation between different views/pages using React Router.
- **Error Handling:** Displays user-friendly error messages in case of API failures or other issues.

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
├   ├── Button
│   ├── Footer
├   ├── Navbar
│   └── user_auth
│
└── Pages/
    ├── CSS
    ├── Analytics.jsx
    ├── inventory.jsx
    ├── inventoryhis.jsx
    ├── LoginSignup.jsx
    ├── SalesRequest.jsx
    └── UserManage.jsx
```



## Explanation:

- **`src/`**: This is the root folder for all source code files.
  - **`components/`**: Contains reusable UI components like navigation bar, footer and buttons. 
    - **`Assets`**: This folder contains static assets such as images, logos and icons.
    - **`Button`**: Defines a reusable button component, the folder contains the css file for the component.
    - **`Footer`**: Defines the footer component, the folder contains both the jsx and css file for the component.
    - **`Navbar`**: Defines the navigation bar component, the folder contains both the jsx and css file for the component.
    - **`user_auth`**: This folder handles user authentication and authorization functionalities.
    

  - **`Pages/`**: Contains the different pages of the application.
    - **`CSS`**: This folder contains all the global and page-specific styles for the pages in the frontend management system. 
    - **`Analytics.jsx`**: Handles data visualization and reporting, providing insights into the weekly sales of the web-based minimart in MWH.
    - **`inventory.jsx`**: Manages the inventory system, allowing admins to add new inventory items, delete current inventory items and make changes to the quantity of existing inventory items.
    - **`inventoryhis.jsx`**: Maintains a history of inventory changes, tracking stock movements, past transactions and admin actions.
    - **`LoginSignup.jsx`**: Implements user authentication, including login and signup functionality.
    - **`SalesRequest.jsx`**: Manages sales-related requests, such as accepting or denying product requests done by residents.
    - **`UserManage.jsx`**: Handles user management features, such as helping residents to reset his/her password, suspending residents, deleting residents, adding points to a specific resident or to residents in a specific group.
