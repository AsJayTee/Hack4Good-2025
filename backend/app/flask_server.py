from flask import Flask, request, jsonify
import database #imports the database.py file
app = Flask(__name__)

@app.route('/getProducts', methods=['GET']) 
#GET here means only HTTP GET requests are allowed for this URL ending with /getProducts 

#these functions run when the appropriate request is made to the corresponding endpoint
#in this case, when GET request is made to /getProducts end point

def get_products():
    from dotenv import load_dotenv
    load_dotenv()
    pageNum = request.args.get('pageNum', default=1, type=int) # Extract pageNum from query parameters, with a default value of 1 if not provided
    products = database.DatabaseInterface().get_products(pageNum)
    response = jsonify(products)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
#eg for default to page 1: http://127.0.0.1:5000/getProducts
#eg for page 2:  http://127.0.0.1:5000/getProducts?pageNum=2
#but specifying page 1 would also work


if __name__ == "__main__":
    print("Starting Python Flask Server For Grocery Store Management System")
    app.run(port=5000)