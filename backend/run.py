import io
import base64
from app.database import DatabaseInterface 
from flask import Flask, request, jsonify, send_file

app = Flask(__name__)
db = DatabaseInterface()

def convert_blob_to_base64(product_list : bytes) -> str:
    converted_products = []
    for product in product_list:
        base64_image = base64.b64encode(product[-1]).decode('utf-8')
        product_tuple = product[:-1] + (base64_image,)
        converted_products.append(product_tuple)
    return converted_products

@app.route('/get_user_role', methods=['GET'])
def get_user_role():
    resident_id = request.args.get('resident_id')
    if not resident_id:
        return jsonify({"error": "resident_id is required"}), 400
    try:
        role = db.get_user_role(resident_id)
        return jsonify({"resident_id": resident_id, "role": role})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/getProducts', methods=['GET']) 
def get_products():
    pageNum = request.args.get('pageNum', default = 1, type = int) 
    products = db.get_products(pageNum)
    products=convert_blob_to_base64(products)
    response = jsonify(products)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

"""
@app.route('/insertProduct', methods=['POST'])
def insert_product():
    request_payload = json.loads(request.form['data'])
    product_id = products_dao.insert_new_product(connection, request_payload)
    response = jsonify({
        'product_id': product_id
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/insertOrder', methods=['POST'])
def insert_order():
    request_payload = json.loads(request.form['data'])
    order_id = orders_dao.insert_order(connection, request_payload)
    response = jsonify({
        'order_id': order_id
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

"""

@app.route('/insertProduct', methods=['POST'])
def insert_product():
    try:
        data : dict = request.json
        product_id = data.get('product_id')
        quantity = data.get('quantity')
        if product_id is None or quantity is None:
            return jsonify({"error": "Product ID and quantity are required."}), 400
        db.add_product(product_id, quantity)
        response = jsonify({
            'message': 'Product quantity updated successfully',
            'product_id': product_id,
            'quantity': quantity
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/createCart', methods=['POST'])
def create_new_cart():
    try:
        data : dict = request.json
        resident_id = data.get('resident_id')
        if not resident_id:
            return jsonify({"error": "Resident ID is required."}), 400
        db.create_new_cart(resident_id)
        return jsonify({"message": "New cart created successfully."})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/addToCart', methods=['POST'])
def add_to_cart():
    try:
        data : dict = request.json
        resident_id = data.get('resident_id')
        product_id = data.get('product_id')
        quantity = data.get('quantity', 1)
        if not resident_id or not product_id:
            return jsonify({"error": "Resident ID and Product ID are required."}), 400
        db.add_to_cart(resident_id, product_id, quantity)
        return jsonify({"message": f"Added {quantity} of product {product_id} to cart."}) 

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/make_orders', methods=['POST'])
def make_orders():
    try:
        data : dict = request.get_json()
        resident_id = data.get('resident_id')
        product_ids = data.get('product_ids')
        if not resident_id or not product_ids:
            return jsonify({"error": "Missing required fields"}), 400
        db.make_orders(resident_id, product_ids)
        return jsonify({"message": "Orders placed successfully"}), 200

    except Exception as e:
        print(e)
        return jsonify({"error": "Something went wrong"}), 500

@app.route('/getProductsByCategory', methods=['GET'])
def get_products_by_category():
    category = request.args.get('category')
    if not category:
        return jsonify({'error': 'Category is required'}), 400
    products = db.get_products_by_category(category)
    products=convert_blob_to_base64(products)
    return jsonify(products)

@app.route('/getAllProducts', methods=['GET'])
def get_all_products():
    try:
        products = db.get_all_products()
        products=convert_blob_to_base64(products)
        response = jsonify(products)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/get_in_demand_products', methods=['GET'])
def get_in_demand_products():
    try:
        image_blob = db.get_in_demand_products()
        if not image_blob:
            return jsonify({"error": "No image data found."}), 404
        base64_image = base64.b64encode(image_blob).decode('utf-8')
        return jsonify({"image": base64_image})
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/get_low_stock_products', methods=['GET'])
def get_low_stock_products():
    try:
        products = db.get_low_stock_products()
        return jsonify(products)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
#Inventory methods

@app.route('/delete_product', methods=['POST'])
def delete_product():
    try:
        data : dict = request.json
        db.delete_product_from_inventory(**data)
        return jsonify({"message": "Product deleted successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/remove_inventory_stock', methods=['POST'])
def remove_inventory_stock():
    try:
        data : dict = request.json
        db.remove_inventory_stock(**data)
        return jsonify({"message": "Inventory stock removed successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/create_product', methods=['POST'])
def create_product():
    try:
        data : dict = request.json
        image = base64.b64decode(data.pop('image'))  # Image is assumed to be in base64
        db.create_new_product(**data, image = image)
        return jsonify({"message": "New product created successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/add_inventory_stock', methods=['POST'])
def add_inventory_stock():
    try:
        data : dict = request.json
        db.add_inventory_stock(**data)
        return jsonify({"message": "Inventory stock added successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/get_inventory_items', methods=['GET'])
def get_inventory_items():
    try:
        inventory_items = db.get_inventory_items()
        return jsonify(inventory_items), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_list_of_users', methods = ['GET'])
def get_users_for_management():
    try:
        users = db.get_list_of_users()
        return jsonify(users), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/modify_points', methods = ['post'])
def modify_points():
    pass

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()   
    print("Starting Python Flask Server For Grocery Store Management System")
    app.run(port=5000)
