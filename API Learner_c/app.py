from flask import Flask, jsonify, request

app = Flask(__name__)

# GET request (already working)
@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello, Calvin!"})

# POST request (new)
@app.route('/api/greet', methods=['POST'])
def greet():
    data = request.get_json()  # Read JSON from request body
    name = data.get("name", "Stranger")  # Default to "Stranger" if name not sent
    return jsonify({"message": f"Hello, {name}!"}), 200

if __name__ == '__main__':
    app.run(debug=True)
