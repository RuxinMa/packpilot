from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.auth.auth import token_required
from app.Item.models import Item
from app.Item.schemas import ItemCreate, ItemPlacementUpdate


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

# update item placement
@bp.route("/api/manager/update_item_placement", methods=["POST"])
@token_required
def update_item_placement(token_data):
    db: Session = SessionLocal()
    try:
        data = request.get_json()
        item_id = data.get("item_id")
        placement_data = ItemPlacementUpdate(**data)
        
        db_item = db.query(Item).filter(Item.item_id == item_id).first()
        if not db_item:
            return jsonify({"status": "error", "message": "Item not found"}), 404
            
        # update AI generated placement info
        db_item.x = placement_data.x
        db_item.y = placement_data.y
        db_item.z = placement_data.z
        db_item.placement_order = placement_data.placement_order
        
        db.commit()
        
        return jsonify({
            "status": "success", 
            "message": "Item placement updated successfully"
        }), 200
        
    except Exception as e:
        db.rollback()
        return jsonify({"status": "error", "message": str(e)}), 400
    finally:
        db.close()
