import os
import math
import sqlite3
import datetime
import Levenshtein
from typing import Literal

class DatabaseInterface:
    connection : sqlite3.Connection
    cursor : sqlite3.Cursor
    inventory_table_name : str = "inventory_table"
    products_per_page : int = 8
    orders_table_name : str = "orders_table"
    users_table_name : str = "resident_accounts_info_table"
    carts : dict

    def __init__(self):
        self.connection = sqlite3.connect(os.environ.get("DATABASE_PATH"))
        self.connection.create_function('levenshtein', 2, Levenshtein.distance)
        self.cursor = self.connection.cursor()

    def get_number_of_pages(
            self, 
            description : str = None,
            categories : list[str] = None, 
            in_stock_only : bool = False
            ) -> int:
        queries = [f"SELECT COUNT(*) FROM {self.inventory_table_name}"]
        if in_stock_only:
            queries.append("WHERE Quantity > 0")
        if categories:
            formatted_string = "('" + "', '".join(categories) + "')"
            queries.append(f"WHERE Product_Category IN {formatted_string}")
        if description:
            queries.append("WHERE levenshtein(Product_Name, ?) <= 5")
            params = (description,)
        else:
            params = ()
        self.cursor.execute(" ".join(queries), params)
        row_count = self.cursor.fetchone()[0]
        return math.ceil(row_count / self.products_per_page)
    
    def get_product_categories(self) -> list[tuple[str]]:
        query = f"SELECT DISTINCT Product_Category FROM {self.inventory_table_name};"
        self.cursor.execute(query)
        return self.cursor.fetchall()

    def get_products(
            self, 
            page : int, 
            description : str = None,
            categories : list[str] = None, 
            in_stock_only : bool = False
            ) -> list[tuple[str, int]]:
        queries = [f"SELECT * FROM {self.inventory_table_name}"]
        if in_stock_only:
            queries.append("WHERE Quantity > 0")
        if categories:
            formatted_string = "('" + "', '".join(categories) + "')"
            queries.append(f"WHERE Product_Category IN {formatted_string}")
        if description:
            queries.append("WHERE levenshtein(Product_Name, ?) <= 5")
            params = (description,)
        else:
            params = ()
        queries.append(
            f"LIMIT {self.products_per_page} OFFSET {(page - 1) * self.products_per_page};"
        )
        self.cursor.execute(" ".join(queries), params)
        return self.cursor.fetchall()
    
    def add_product(self, product_id : int, quantity : int) -> None:
        query = f"UPDATE {self.inventory_table_name} " \
            "SET Quantity = Quantity + ? WHERE Product_ID = ?;"
        self.cursor.execute(query, (quantity, product_id))
        self.connection.commit()
    
    def remove_product(self, product_id : int, quantity : int) -> None:
        query = f"UPDATE {self.inventory_table_name} SET Quantity = CASE " \
            "WHEN Quantity - ? < 0 THEN 0 ELSE Quantity - ? END WHERE Product_ID = ?;"
        self.cursor.execute(query, (quantity, quantity, product_id))
        self.connection.commit()

    def get_product_stock(self, product_id : int) -> int:
        query = f"SELECT Quantity from {self.inventory_table_name} " \
            "WHERE Product_ID = ?"
        self.cursor.execute(query, (product_id,))
        return self.cursor.fetchone()[0]

    def get_number_of_pending_orders(self) -> int:
        query = f"SELECT COUNT(*) FROM {self.orders_table_name} " \
            "WHERE Status = 'Pending'"
        self.cursor.execute(query)
        return self.cursor.fetchone()[0]
    
    def get_pending_orders(self) -> list[tuple[str]]:
        query = \
        f"""
        SELECT 
            o.Voucher_Request_ID, 
            p.Product_Name, 
            r.Name AS Resident_Name, 
            o.Resident_ID
        FROM 
            {self.orders_table_name} o
        JOIN 
            {self.inventory_table_name} p ON o.Product_ID = p.Product_ID
        JOIN 
            {self.users_table_name} r ON o.Resident_ID = r.Resident_ID
        WHERE 
            o.Status = 'Pending'
        ORDER BY 
            o.Time ASC;
        """
        self.cursor.execute(query)
        return self.cursor.fetchall()

    def update_order(
            self, 
            order_id : str, 
            decision : Literal["Approved", "Denied"], 
            admin_id : str
            ) -> None:
        query = f"UPDATE {self.orders_table_name} " \
            "SET Status = ?, Admin = ? WHERE Voucher_Request_ID = ?"
        self.cursor.execute(query, (decision, admin_id, order_id))
    
    def approve_all_in_stock_items(self, admin_id: str) -> None:
        select_query = \
        f"""
        SELECT o.Voucher_Request_ID, o.Product_ID, p.Quantity
        FROM {self.orders_table_name} o
        JOIN {self.inventory_table_name} p
        ON o.Product_ID = p.Product_ID
        WHERE o.Status = 'Pending'
        ORDER BY o.Time ASC
        """
        self.cursor.execute(select_query)
        pending_orders = self.cursor.fetchall()
        stock_updates = {}
        for order in pending_orders:
            voucher_request_id, product_id, quantity_in_stock = order
            current_stock = stock_updates.get(product_id, quantity_in_stock)
            if current_stock > 0:
                update_order_query = \
                f"""
                UPDATE {self.orders_table_name}
                SET Status = 'Approved', Admin = ?
                WHERE Voucher_Request_ID = ?
                """
                self.cursor.execute(update_order_query, (admin_id, voucher_request_id))
                stock_updates[product_id] = current_stock - 1
        self.connection.commit()
    
    def get_admin_action_history(self, actions : int = None) -> list[tuple]:
        query = \
        f"""
        SELECT *
        FROM {self.orders_table_name}
        WHERE Status != 'Pending'
        ORDER BY Time DESC
        """
        if actions:
            query = query + f" LIMIT {actions}"
        self.cursor.execute(query)
        return self.cursor.fetchall()
    
    def create_new_cart(self, resident_id : str) -> None:
        self.carts[resident_id] = list()

    def add_to_cart(self, resident_id : str, product_id : int, quantity : int = 1) -> None:
        products_in_cart : list = self.carts.get(resident_id)
        for _ in range(quantity):
            products_in_cart.append(product_id)
    
    def remove_from_cart(self, resident_id : str, product_id : int, quantity : int = 1) -> None:
        products_in_cart : list = self.carts.get(resident_id)
        for _ in range(quantity):
            products_in_cart.remove(product_id)

    def checkout_cart(self, resident_id : str) -> None:
        self.__make_orders(resident_id, self.carts.pop(resident_id))

    def __make_orders(self, resident_id: str, product_ids: list[int]) -> None:
        select_max_query = \
        f"""
        SELECT MAX(CAST(SUBSTRING(Voucher_Request_ID, 2, LENGTH(Voucher_Request_ID)) AS UNSIGNED)) 
        FROM {self.orders_table_name}
        """
        self.cursor.execute(select_max_query)
        result = self.cursor.fetchone()
        if result and result[0] is not None:
            next_voucher_id_number = result[0] + 1
        else:
            next_voucher_id_number = 1
        for product_id in product_ids:
            voucher_request_id = f"V{next_voucher_id_number}"
            current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            insert_query = \
            f"""
            INSERT INTO {self.orders_table_name} (Voucher_Request_ID, Resident_ID, Product_ID, Status, Time)
            VALUES (?, ?, ?, 'Pending', ?)
            """
            self.cursor.execute(insert_query, (voucher_request_id, resident_id, product_id, current_time))
            next_voucher_id_number += 1
        self.connection.commit()
    
    def get_user_order_history(self, resident_id: str, orders: int = None):
        query = \
        f"""
        SELECT Voucher_Request_ID, Product_ID, Status, Time
        FROM {self.orders_table_name}
        WHERE Resident_ID = '{resident_id}'
        ORDER BY Time DESC
        """
        if orders:
            query = query + f" LIMIT {orders}"
        self.cursor.execute(query)
        return self.cursor.fetchall()
    
    def get_user_details(self, resident_id : str):
        query = \
        f"""
        SELECT Resident_ID, Name, Category, Points_Balance, Contact
        FROM {self.users_table_name}
        WHERE Resident_ID = ?
        """
        self.cursor.execute(query, (resident_id,))
        return self.cursor.fetchone()

if __name__ == '__main__':
    from dotenv import load_dotenv
    load_dotenv()
    di = DatabaseInterface()
    print(di.get_number_of_pages())
    print("---------------------")
    print(di.get_products(1))
    print("---------------------")
    print(di.get_user_order_history("A"))
