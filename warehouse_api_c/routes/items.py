from flask import Blueprint, request, jsonify
from models import db, Item
from functools import wraps
import jwt
from config import SECRET_KEY

item_bp = Blueprint('item_bp', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'status': 'error', 'message': 'Token is missing'}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user = data
        except Exception as e:
            return jsonify({'status': 'error', 'message': 'Token is invalid'}), 401

        return f(*args, **kwargs)
    return decorated

@item_bp.route('/api/manager/add_item', methods=['POST'])
@token_required
def add_item():
    data = request.get_json()

    if request.user.get("role") != "Manager":
        return jsonify({"status": "error", "message": "Unauthorized: Manager role required"}), 403

    try:
        last_item = Item.query.order_by(Item.item_id.desc()).first()
        next_id = 1 if not last_item else last_item.item_id + 1
        item_name = f"Item{next_id:04d}"

        item = Item(
            item_name=item_name,
            length=data['length'],
            width=data['width'],
            height=data['height'],
            orientation=data.get('orientation', 'Face Up'),
            remarks=data.get('remarks', ''),
            is_fragile=False,
            is_assigned=False
        )

        db.session.add(item)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Item added successfully",
            "item_id": item.item_id,
            "item_name": item.item_name
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 400
