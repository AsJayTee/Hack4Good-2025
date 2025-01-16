import io
import os
import math
import sqlite3
import Levenshtein
from typing import Literal
import matplotlib.pyplot as plt
from datetime import datetime, timedelta

class DatabaseInterface:
    connection : sqlite3.Connection
    cursor : sqlite3.Cursor
    inventory_table_name : str = "inventory_table"
    products_per_page : int = 8
    orders_table_name : str = "orders_table"
    users_table_name : str = "resident_accounts_info_table"
    carts : dict = dict()
    admin_actions_table_name : str = "admin_actions_table"
    new_coupons_table_name : str = "new_coupons_table"

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

    def get_all_products(self) -> list[tuple[str, int]]:
        query = f"SELECT * FROM {self.inventory_table_name}"
        self.cursor.execute(query)
        return self.cursor.fetchall()

    def get_products_by_category(self, category: str) -> list[tuple]:
        query = f"SELECT * FROM {self.inventory_table_name} WHERE Product_Category = ?;"
        self.cursor.execute(query, (category,))
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
            order_id: str, 
            decision: Literal["Approved", "Denied"], 
            admin_id: str
            ) -> None:
        self.__record_admin_action(admin_id, f"{decision} order for ORDER_ID : {order_id}")
        select_query = f"""
        SELECT o.Product_ID, p.Quantity
        FROM {self.orders_table_name} o
        JOIN {self.inventory_table_name} p
        ON o.Product_ID = p.Product_ID
        WHERE o.Voucher_Request_ID = ?
        """
        self.cursor.execute(select_query, (order_id,))
        order = self.cursor.fetchone()
        if order:
            product_id, quantity_in_stock = order
            if decision == "Approved" and quantity_in_stock > 0:
                update_order_query = f"""
                UPDATE {self.orders_table_name}
                SET Status = ?, Admin = ?
                WHERE Voucher_Request_ID = ?
                """
                self.cursor.execute(update_order_query, (decision, admin_id, order_id))
                self.remove_inventory_stock(product_id, 1)
        self.connection.commit()
    
    def approve_all_in_stock_items(self, admin_id: str) -> None:
        self.__record_admin_action(admin_id, "Approved all in-stock items")
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
                self.__record_admin_action(
                    admin_id, 
                    f"Approved order for ORDER_ID : {voucher_request_id}"
                )
                stock_updates[product_id] = current_stock - 1
                self.remove_inventory_stock(product_id, 1)
        self.connection.commit()
    
    def get_admin_action_history(self, actions : int = None) -> list[tuple]:
        query = \
        f"""
        SELECT *
        FROM {self.admin_actions_table_name}
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

    def make_orders(self, resident_id: str, product_ids: list[int]) -> None:
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
            INSERT INTO {self.orders_table_name} (Voucher_Request_ID, Resident_ID, Product_ID, Status, Time, Admin)
            VALUES (?, ?, ?, 'Pending', ?, ?)
            """
            self.cursor.execute(insert_query, (voucher_request_id, resident_id, product_id, current_time, None))
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
    
    def get_user_details(self, resident_id : str) -> list[tuple[str, int]]:
        query = \
        f"""
        SELECT * 
        FROM {self.users_table_name}
        WHERE Resident_ID = ?
        """
        self.cursor.execute(query, (resident_id,))
        return self.cursor.fetchone()
    
    def get_list_of_users(self, users : int = None, admin_mode : bool = False):
        queries = [
            f"""
            SELECT Resident_ID, Name, Category, Suspended
            FROM {self.users_table_name}
            """
        ]
        if admin_mode:
            queries.append("WHERE Category = 'admin'")
        else:
            queries.append("WHERE Category != 'admin'")
        if users:
            queries.append(f"LIMIT {users}")
        self.cursor.execute(" ".join(queries))
        return self.cursor.fetchall()
    
    def add_user(
            self, 
            user_id : str, 
            user_name : str, 
            user_category : str | int | Literal["admin"], 
            contact : int,
            email : str
            ) -> None:
        query = f"""
        INSERT INTO {self.users_table_name} (Resident_ID, Name, Category, Points_Balance, Contact, Suspended, Email)
        VALUES (?, ?, ?, 0, ?, FALSE, ?, ?)
        """
        self.cursor.execute(query, (user_id, user_name, user_category, contact, email))
        self.connection.commit()

    def suspend_user(self, resident_id : str) -> None:
        query = \
        f"""
        UPDATE {self.users_table_name}
        SET Suspended = TRUE
        WHERE Resident_ID = '{resident_id}'
        """
        self.cursor.execute(query)
        self.connection.commit()
    
    def unsuspend_user(self, resident_id : str) -> None:
        query = \
        f"""
        UPDATE {self.users_table_name}
        SET Suspended = FALSE
        WHERE Resident_ID = '{resident_id}'
        """
        self.cursor.execute(query)
        self.connection.commit()

    def get_user_group_options(self) -> list[tuple[str]]:
        query = \
        f"""
        SELECT DISTINCT Category
        FROM {self.users_table_name}
        WHERE Category != 'admin'
        """
        self.cursor.execute(query)
        return self.cursor.fetchall()
    
    def set_user_group(self, resident_id : str, group : str) -> None:
        assert group != 'admin'
        query = \
        f"""
        UPDATE {self.users_table_name}
        SET Category = ?
        WHERE Resident_ID = '{resident_id}'
        """
        self.cursor.execute(query, (group,))
        self.connection.commit()

    def rename_group(self, old_group : str, new_group : str) -> None:
        assert old_group != 'admin' or new_group != 'admin'
        query = \
        f"""
        UPDATE {self.users_table_name}
        SET Category = CASE
            WHEN Category = ? THEN ?
            ELSE Category
        END;
        """
        self.cursor.execute(query, (old_group, new_group))
        self.connection.commit()
    
    def give_user_points(self, user_id : str, points : int) -> None:
        query = \
        f"""
        UPDATE {self.users_table_name} 
        SET Points_Balance = Points_Balance + ?
        WHERE Resident_ID = ?
        """
        self.cursor.execute(query, (points, user_id))
        self.connection.commit()
        insert_query = f"""
        INSERT INTO {self.new_coupons_table_name} (Resident_ID, New_Coupon_Amount)
        VALUES (?, ?)
        """
        self.cursor.execute(insert_query, (user_id, points))
        self.connection.commit()
    
    def give_group_points(self, group : str | int, points : int) -> None:
        query = \
        f"""
        UPDATE {self.users_table_name} 
        SET Points_Balance = Points_Balance + ?
        WHERE Category = ?
        """
        self.cursor.execute(query, (points, group))
        self.connection.commit()
        insert_query = f"""
        INSERT INTO {self.new_coupons_table_name} (Resident_ID, New_Coupon_Amount)
        SELECT Resident_ID, ? 
        FROM {self.users_table_name}
        WHERE Category = ?
        """
        self.cursor.execute(insert_query, (points, group))
        self.connection.commit()

    def get_received_coupons(self, user_id: str) -> list[int]:
        query = f"""
        SELECT New_Coupon_Amount
        FROM {self.new_coupons_table_name}
        WHERE Resident_ID = ?
        """
        self.cursor.execute(query, (user_id,))
        coupons = self.cursor.fetchall() 
        if coupons:
            delete_query = f"""
            DELETE FROM {self.new_coupons_table_name}
            WHERE Resident_ID = ?
            """
            self.cursor.execute(delete_query, (user_id,))
            self.connection.commit()
        return [coupon[0] for coupon in coupons]

    def get_inventory_items(self) -> list[tuple[str, int]]:
        query = \
        f"""
        SELECT Product_ID, Product_Name, Product_Category, Quantity, 
        CASE 
            WHEN Quantity = 0 THEN 'Yes'
            ELSE 'No'
        END AS Out_of_Stock
        FROM {self.inventory_table_name}
        """
        self.cursor.execute(query)
        return self.cursor.fetchall()

    def add_inventory_stock(self, admin_id : str | int, product_id : int, quantity : int) -> None:
        self.__record_admin_action(
            admin_id, 
            f"Incremented inventory count for product with PRODUCT ID: {product_id} by {quantity}"
        )
        query = f"""
        UPDATE {self.inventory_table_name} 
        SET Quantity = Quantity + ? 
        WHERE Product_ID = ?;
        """
        self.cursor.execute(query, (quantity, product_id))
        self.connection.commit()

    def remove_inventory_stock(self, admin_id : str | int, product_id : int, quantity : int) -> None:
        self.__record_admin_action(
            admin_id, 
            f"Deducted inventory count for product with PRODUCT ID: {product_id} by {quantity}"
        )
        query = f"""
        UPDATE {self.inventory_table_name} 
        SET Quantity = Quantity - ? 
        WHERE Product_ID = ?;
        """
        self.cursor.execute(query, (quantity, product_id))
        self.connection.commit()

    def create_new_product(
            self,
            admin_id : str | int, 
            product_id: str | int,
            product_name: str,
            product_category: str,
            point_cost: int,
            quantity: int,
            image: bytes
            ) -> None:
        self.__record_admin_action(
            admin_id, 
            f"Created new product with PRODUCT ID: {product_id}"
        )
        query = f"""
        INSERT INTO {self.inventory_table_name} (Product_ID, Product_Name, Product_Category, Point_Cost, Quantity, Image)
        VALUES (?, ?, ?, ?, ?, ?)
        """
        self.cursor.execute(query, (product_id, product_name, product_category, point_cost, quantity, image))
        self.connection.commit()

    def delete_product_from_inventory(self, admin_id : str | int, product_id : str | int) -> None:
        self.__record_admin_action(
            admin_id, 
            f"Deleted old product with PRODUCT ID: {product_id}"
        )
        query = \
        f"""
        DELETE FROM {self.inventory_table_name}
        WHERE Product_ID = ?
        """
        self.cursor.execute(query, (product_id,))
        self.connection.commit()
    
    def __record_admin_action(self, admin_id: str | int, message: str) -> None:
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S') 
        query = f"""
        INSERT INTO {self.admin_actions_table_name} (Admin_ID, Action_Desc, Time)
        VALUES (?, ?, ?)
        """
        self.cursor.execute(query, (admin_id, message, current_time))
        self.connection.commit()

    def get_low_stock_products(self) -> list[tuple[str | int]]:
        query = f"""
        SELECT Product_Name, Product_Category, Quantity
        FROM {self.inventory_table_name}
        WHERE Quantity < 10
        ORDER BY Quantity ASC
        """
        self.cursor.execute(query)
        return self.cursor.fetchall()
    
    def get_in_demand_products(self) -> bytes: 
        one_week_ago = datetime.now() - timedelta(weeks=1)
        one_week_ago_str = one_week_ago.strftime('%Y-%m-%d %H:%M:%S')
        query = f"""
        SELECT o.Product_ID, p.Product_Name, COUNT(*) as product_count
        FROM {self.orders_table_name} o
        JOIN {self.inventory_table_name} p ON o.Product_ID = p.Product_ID
        WHERE o.Time >= ?
        GROUP BY o.Product_ID, p.Product_Name
        ORDER BY product_count DESC
        """
        self.cursor.execute(query, (one_week_ago_str,))
        product_counts = self.cursor.fetchall()
        if not product_counts:
            fig, ax = plt.subplots()
            ax.pie([1], labels=["No Data"], autopct='%1.1f%%')
            ax.set_title("No orders in the last week")
            return self.figure_to_blob(fig)
        product_names = [product[1] for product in product_counts]
        counts = [product[2] for product in product_counts]
        fig, ax = plt.subplots()
        ax.pie(counts, labels=product_names, autopct='%1.1f%%', startangle=90)
        ax.set_title("Most Popular Products in the Last Week")
        return self.figure_to_blob(fig)

    def figure_to_blob(self, fig : plt.Figure) -> bytes:
        buf = io.BytesIO()
        fig.savefig(buf, format="png")
        buf.seek(0) 
        return buf.read()
    
    def print_carts(self):
        print(self.carts)

if __name__ == '__main__':
    from pprint import pprint
    from dotenv import load_dotenv
    load_dotenv()
    di = DatabaseInterface()
<<<<<<< Updated upstream
    print(di.get_number_of_pages())
    print("---------------------")
=======
    print(di.get_products(1))
    """print("---------------------")
>>>>>>> Stashed changes
    print(di.get_products(1))
    print("---------------------")
    di.rename_group(1, 'A')
    pprint(di.get_list_of_users())
    print("---------------------")
    print(di.get_user_details('A'))
    di.give_user_points('A', 3)
    print(di.get_user_details('A'))
    print("---------------------")
    di.give_user_points('C', 3)
    di.give_user_points('C', 3)
    print(di.get_received_coupons('A'))
    print(di.get_received_coupons('A'))
    print(di.get_received_coupons('C'))
    print(di.get_received_coupons('C'))
    print(di.get_received_coupons('C'))
<<<<<<< Updated upstream
    print(di.get_received_coupons('B'))
=======
    print(di.get_received_coupons('B'))
    di.add_inventory_stock(50, 3)"""
    print(di.get_low_stock_products())
>>>>>>> Stashed changes
