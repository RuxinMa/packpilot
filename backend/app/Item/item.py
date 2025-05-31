from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.auth.auth import token_required
from app.Item.models import Item
from app.Item.schemas import ItemCreate


bp = Blueprint('item', __name__)

@bp.route("/api/manager/add_item", methods=["POST"])
@token_required
def add_item(token_data):
    db: Session = SessionLocal()
    try:
        item_data = request.get_json()
        item = ItemCreate(**item_data)

        # Auto-generate item name
        last_item = db.query(Item).order_by(Item.item_id.desc()).first()
        next_id = 1 if not last_item else last_item.item_id + 1
        item_name = f"Item{next_id:04d}"

        db_item = Item(
            item_name=item_name,
            width=item.width,
            height=item.height,
            depth=item.depth,
            orientation=item.orientation,
            remarks=item.remarks,
            is_fragile=item.is_fragile,
            is_assigned=False
        )

        db.add(db_item)
        db.commit()
        db.refresh(db_item)

        return jsonify({
            "status": "success",
            "message": "Item added successfully",
            "item_id": db_item.item_id,
            "item_name": db_item.item_name
        }), 201

    except Exception as e:
        db.rollback()
        return jsonify({"status": "error", "message": str(e)}), 400

    finally:
        db.close()

@bp.route("/api/manager/get_items", methods=["GET"])
@token_required
def get_items(token_data):
    db: Session = SessionLocal()
    try:
        # can filter items by assigned or not
        show_assigned = request.args.get('assigned', default=None)
        
        query = db.query(Item)
        if show_assigned is not None:
            is_assigned = show_assigned.lower() == 'true'
            query = query.filter(Item.is_assigned == is_assigned)
        
        items = query.all()
        
        return jsonify({
            "status": "success",
            "items": [
                {
                    "item_id": item.item_id,
                    "item_name": item.item_name,
                    "width": float(item.width),
                    "height": float(item.height),
                    "depth": float(item.depth),
                    "orientation": item.orientation,
                    "remarks": item.remarks,
                    "is_fragile": item.is_fragile,
                    "is_assigned": item.is_assigned
                }
                for item in items
            ]
        }), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400
    finally:
        db.close()


@bp.route("/api/manager/get_item/<int:item_id>", methods=["GET"])
@token_required
def get_item(token_data, item_id):
    db: Session = SessionLocal()
    try:
        item = db.query(Item).filter(Item.item_id == item_id).first()
        
        if not item:
            return jsonify({"status": "error", "message": "Item not found"}), 404
        
        return jsonify({
            "status": "success",
            "item": {
                "item_id": item.item_id,
                "item_name": item.item_name,
                "width": float(item.width),
                "height": float(item.height),
                "depth": float(item.depth),
                "orientation": item.orientation,
                "remarks": item.remarks,
                "is_fragile": item.is_fragile,
                "is_assigned": item.is_assigned
            }
        }), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400
    finally:
        db.close()
