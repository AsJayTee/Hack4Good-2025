import os
import math
import sqlite3
import Levenshtein

class DatabaseInterface:
    connection : sqlite3.Connection
    cursor : sqlite3.Cursor
    inventory_table_name : str = "inventory_table"
    products_per_page : int = 8

    def __init__(self):
        self.connection = sqlite3.connect(os.environ.get("DATABASE_PATH"))
        self.connection.create_function('levenshtein', 2, Levenshtein.distance)
        self.cursor = self.connection.cursor()

    def get_number_of_pages(
            self, 
            categories : list[str] = None, 
            in_stock_only : bool = False
            ) -> int:
        query = f"SELECT COUNT(*) FROM {self.inventory_table_name} "
        if in_stock_only:
            query = query + f"WHERE Quantity > 0 "
        if categories:
            formatted_string = "('" + "', '".join(categories) + "')"
            query = query + f"WHERE Product_Category IN {formatted_string} "
        self.cursor.execute(query)
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
        query = f"SELECT * FROM {self.inventory_table_name} "
        if in_stock_only:
            query = query + f"WHERE Quantity > 0 "
        if categories:
            formatted_string = "('" + "', '".join(categories) + "')"
            query = query + f"WHERE Product_Category IN {formatted_string} "
        if description:
            query = query + "WHERE levenshtein(Product_Name, ?) <= 5 "
        query_tail = f"LIMIT {self.products_per_page} " \
            f"OFFSET {(page - 1) * self.products_per_page};"
        params = (description,) if description else ()
        self.cursor.execute(query + query_tail, params)
        rows = self.cursor.fetchall()
        return rows

if __name__ == '__main__':
    from dotenv import load_dotenv
    load_dotenv()
    di = DatabaseInterface()
    print(di.get_number_of_pages())
    print(di.get_products(1, description="Bottled "))
    print(di.get_products(2))
    print(di.get_product_categories())