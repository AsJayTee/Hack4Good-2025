# Documentation for `database.py`

`database.py` contains the `DatabaseInterface` class, which provides an abstraction layer for interacting with a SQL database that manages an inventory system, user accounts, and order processing. It simplifies database interactions by encapsulating SQL queries within a set of intuitive methods. This allows developers to perform common database operations without directly writing or managing raw SQL code, improving maintainability and reducing the likelihood of errors.

---

## Key Functionalities

### 1. Inventory Management
Manages products, stock levels, and inventory insights.

- **`get_products`**: Retrieves a list of products based on various criteria, such as category, availability, and search terms, with support for pagination.
- **`get_categories`**: Returns a list of all unique product categories.
- **`adjust_stock`**: Updates the stock level for a specific product.  
- **`create_product`**: Adds a new product with details like name, category, and stock.  
- **`delete_product`**: Removes a product from the inventory.

---

### 2. Order Management
Handles order creation, approval, and tracking.

- **`get_pending_orders`**: Retrieves all orders currently awaiting approval, with details about products and the requesting users.
- **`approve_order`**: Approves a specific order, adjusting stock levels as needed.
- **`deny_order`**: Rejects a specific order and updates its status accordingly.
- **`bulk_approve_orders`**: Approves all pending orders where stock levels are sufficient.

---

### 3. User and Group Management
Supports user accounts and group-based features.

- **`get_list_of_users`**: Returns a list of n users.
- **`get_user_details`**: Retrieves information about a specific user.
- **`add_user`**: Adds a new user with details like contact, name, etc.
- **`suspend_user`**: Temporarily disables a user account.
- **`unsuspend_user`**: Reactivates a user account.  
- **`set_user_group`**: Assigns a user to a specific group.  
- **`rename_group`**: Updates the name of an existing group.  
- **`give_user_points`**: Adds coupon points to an individual.  
- **`give_group_points`**: Adds coupon points to a group.  
- **`get_user_order_history`**: Fetches the complete order history for a specific user.
- **`get_received_points`**: Check if a user has been given coupon points while they were offline.

---

### 4. Cart Management
Enables users to manage their shopping carts.

- **`create_new_cart`**: Creates a user's cart to store serverside.
- **`add_to_cart`**: Adds products to a user’s cart.
- **`remove_from_cart`**: Removes products from a user’s cart.  
- **`checkout_cart`**: Converts cart items into a confirmed order.

---

### 5. Administrative Tools
Provides system oversight and logging capabilities.

- **`__record_admin_action`**: Records admin actions for auditing purposes.  
- **`get_admin_action_history`**: Retrieves a history of logged actions.

---

### 6. Analytics & Reporting
Provides analytics for admins to view summarised reports.

- **`get_in_demand_products`**: Generates a visual representation of the most ordered products within the past week.
- **`get_low_stock_products`**: Fetches information about items below a defined stock threshold.  

---

## Performance and Scalability

- **Efficient Data Retrieval**: Queries only the necessary data to minimize resource usage.  
- **Adaptability**: Currently connected to a local database for development. To be switched to a remote SQL database for production environments.

---

The `DatabaseInterface` class simplifies database interactions, ensures efficient data handling, and supports scalability, making it ideal for the inventory and order management system in our local, and future web-based application.
