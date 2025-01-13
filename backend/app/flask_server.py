from flask import Flask, request, jsonify
import database #imports the database.py file
app = Flask(__name__)

@app.route('/getProducts', methods=['GET']) 
#GET here means only HTTP GET requests are allowed for this URL ending with /getProducts 


def get_products():
    from dotenv import load_dotenv
    load_dotenv()
    products = database.DatabaseInterface().get_products(1)
    response = jsonify(products)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == "__main__":
    print("Starting Python Flask Server For Grocery Store Management System")
    app.run(port=5000)