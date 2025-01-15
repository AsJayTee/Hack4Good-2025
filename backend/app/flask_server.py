from flask import Flask, request, jsonify
import database #imports the database.py file
app = Flask(__name__)
#db_interface = database.DatabaseInterface()

@app.route('/getProducts', methods=['GET']) 
#GET here means only HTTP GET requests are allowed for this URL ending with /getProducts 

#these functions run when the appropriate request is made to the corresponding endpoint
#in this case, when GET request is made to /getProducts end point

def get_products():
    pageNum = request.args.get('pageNum', default=1, type=int) # Extract pageNum from query parameters, with a default value of 1 if not provided
    products = database.DatabaseInterface().get_products(pageNum)
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
        return jsonify({"message": f"Added {quantity} of product {product_id} to cart."})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()   
    print("Starting Python Flask Server For Grocery Store Management System")
    app.run(port=5000)