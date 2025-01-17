from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import io
import database #imports the database.py file
import base64
app = Flask(__name__)
CORS(app)
#db_interface = database.DatabaseInterface() #doesnt work
def convert_blob_to_base64(product_list):
    converted_products = []
    for product in product_list:
        # Convert the blob data to a base64 encoded string
        base64_image = base64.b64encode(product[-1]).decode('utf-8')
        # Create a new product tuple with the base64 encoded image
        product_tuple = product[:-1] + (base64_image,)
        converted_products.append(product_tuple)
    return converted_products

@app.route('/get_user_role', methods=['GET'])
def get_user_role():
    resident_id = request.args.get('resident_id')
    if not resident_id:
        return jsonify({"error": "resident_id is required"}), 400
    
    try:
        role = database.DatabaseInterface().get_user_role(resident_id)
        return jsonify({"resident_id": resident_id, "role": role})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
#test
@app.route('/getProducts', methods=['GET']) 
#GET here means only HTTP GET requests are allowed for this URL ending with /getProducts 

#these functions run when the appropriate request is made to the corresponding endpoint
#in this case, when GET request is made to /getProducts end point

def get_products():
    pageNum = request.args.get('pageNum', default=1, type=int) # Extract pageNum from query parameters, with a default value of 1 if not provided
    products = database.DatabaseInterface().get_products(pageNum)
    products=convert_blob_to_base64(products)
    response = jsonify(products)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

#eg for default to page 1: http://127.0.0.1:5000/getProducts
#eg for page 2:  http://127.0.0.1:5000/getProducts?pageNum=2
#but specifying page 1 would also work
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
        # Parse the JSON payload from the request body
        request_payload = request.json
        
        # Extract product_id and quantity from the request payload
        product_id = request_payload.get('product_id')
        quantity = request_payload.get('quantity')
        
        if product_id is None or quantity is None:
            return jsonify({"error": "Product ID and quantity are required."}), 400
        
        # Call the add_product method from the database interface
        database.DatabaseInterface().add_product(product_id, quantity)
        
        # Return success response
        response = jsonify({
            'message': 'Product quantity updated successfully',
            'product_id': product_id,
            'quantity': quantity
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    except Exception as e:
        # Return error message if something goes wrong
        return jsonify({"error": str(e)}), 500

@app.route('/createCart', methods=['POST'])
def create_new_cart():
    try:
        resident_id = request.json.get('resident_id')
        if not resident_id:
            return jsonify({"error": "Resident ID is required."}), 400
        
        database.DatabaseInterface().create_new_cart(resident_id)
        return jsonify({"message": "New cart created successfully."})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/addToCart', methods=['POST'])
def add_to_cart():
    try:
        data = request.json
        resident_id = data.get('resident_id')
        product_id = data.get('product_id')
        quantity = data.get('quantity', 1)

        if not resident_id or not product_id:
            return jsonify({"error": "Resident ID and Product ID are required."}), 400

        database.DatabaseInterface().add_to_cart(resident_id, product_id, quantity)
        return jsonify({"message": f"Added {quantity} of product {product_id} to cart."}) #might not need this msg

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/make_orders', methods=['POST'])
def make_orders():
    try:
        # Extract data from the request
        data = request.get_json()
        resident_id = data.get('resident_id')
        product_ids = data.get('product_ids')

        if not resident_id or not product_ids:
            return jsonify({"error": "Missing required fields"}), 400
        
        # Call the method to make orders
        database.DatabaseInterface().make_orders(resident_id, product_ids)

        return jsonify({"message": "Orders placed successfully"}), 200

    except Exception as e:
        print(e)
        return jsonify({"error": "Something went wrong"}), 500

@app.route('/getProductsByCategory', methods=['GET'])
def get_products_by_category():
    category = request.args.get('category')
    if not category:
        return jsonify({'error': 'Category is required'}), 400
    products = database.DatabaseInterface().get_products_by_category(category)
    products=convert_blob_to_base64(products)
    return jsonify(products)

@app.route('/getAllProducts', methods=['GET'])
def get_all_products():
    try:
        products = database.DatabaseInterface().get_all_products()
        products=convert_blob_to_base64(products)
        response = jsonify(products)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/get_in_demand_products', methods=['GET'])
def get_in_demand_products():
    try:
        image_blob = database.DatabaseInterface().get_in_demand_products()
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
        products = database.DatabaseInterface().get_low_stock_products()
        return jsonify(products)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
#Inventory methods

@app.route('/delete_product', methods=['POST'])
def delete_product():
    try:
        admin_id = request.json['admin_id']
        product_id = request.json['product_id']
        database.DatabaseInterface().delete_product_from_inventory(admin_id, product_id)
        return jsonify({"message": "Product deleted successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/remove_inventory_stock', methods=['POST'])
def remove_inventory_stock():
    try:
        admin_id = request.json['admin_id']
        product_id = request.json['product_id']
        quantity = request.json['quantity']
        database.DatabaseInterface().remove_inventory_stock(admin_id, product_id, quantity)
        return jsonify({"message": "Inventory stock removed successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/create_product', methods=['POST'])
def create_product():
    try:
        data = request.json
        admin_id = data['admin_id']
        product_id = data['product_id']
        product_name = data['product_name']
        product_category = data['product_category']
        point_cost = data['point_cost']
        quantity = data['quantity']
        image = base64.b64decode(data['image'])  # Image is assumed to be in base64
        database.DatabaseInterface().create_new_product(admin_id, product_id, product_name, product_category, point_cost, quantity, image)
        return jsonify({"message": "New product created successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/add_inventory_stock', methods=['POST'])
def add_inventory_stock():
    try:
        admin_id = request.json['admin_id']
        product_id = request.json['product_id']
        quantity = request.json['quantity']
        database.DatabaseInterface().add_inventory_stock(admin_id, product_id, quantity)
        return jsonify({"message": "Inventory stock added successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/get_inventory_items', methods=['GET'])
def get_inventory_items():
    try:
        inventory_items = database.DatabaseInterface().get_inventory_items()
        return jsonify(inventory_items), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()   
    print("Starting Python Flask Server For Grocery Store Management System")
    app.run(port=5000)
