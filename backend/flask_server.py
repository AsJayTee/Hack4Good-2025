from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/hello')

def hello():
    return

if __name__ == "__main__":
    print("Starting Python Flask Server For Grocery Store Management System")
    app.run(port=5000)