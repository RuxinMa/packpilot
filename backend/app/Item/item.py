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
        # Optionally filter items by assignment status
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

@bp.route("/api/manager/update_item/<int:item_id>", methods=["PUT"])
@token_required
def update_item(token_data, item_id):
    db: Session = SessionLocal()
    try:
        item = db.query(Item).filter(Item.item_id == item_id).first()
        if not item:
            return jsonify({"status": "error", "message": "Item not found"}), 404
        
        if item.is_assigned:
            return jsonify({"status": "error", "message": "Cannot update assigned item"}), 400
        
        item_data = request.get_json()
        
        # Update fields (note: frontend's 'length' corresponds to backend's 'depth')
        if 'width' in item_data:
            item.width = item_data['width']
        if 'height' in item_data:
            item.height = item_data['height']
        if 'length' in item_data:  # frontend sends 'length'
            item.depth = item_data['length']  # backend uses 'depth'
        if 'orientation' in item_data:
            item.orientation = item_data['orientation']
        if 'remarks' in item_data:
            item.remarks = item_data['remarks']
        if 'is_fragile' in item_data:
            item.is_fragile = item_data['is_fragile']
        
        db.commit()
        return jsonify({"status": "success", "message": "Item updated successfully"}), 200

    except Exception as e:
        db.rollback()
        return jsonify({"status": "error", "message": str(e)}), 400
    finally:
        db.close()

@bp.route("/api/manager/delete_item/<int:item_id>", methods=["DELETE"])
@token_required
def delete_item(token_data, item_id):
    db: Session = SessionLocal()
    try:
        item = db.query(Item).filter(Item.item_id == item_id).first()
        if not item:
            return jsonify({"status": "error", "message": "Item not found"}), 404
        
        if item.is_assigned:
            return jsonify({"status": "error", "message": "Cannot delete assigned item"}), 400
        
        item_name = item.item_name
        db.delete(item)
        db.commit()
        
        return jsonify({"status": "success", "message": f"Item {item_name} deleted successfully"}), 200

    except Exception as e:
        db.rollback()
        return jsonify({"status": "error", "message": str(e)}), 400
    finally:
        db.close()

@bp.route("/api/manager/batch_delete_items", methods=["POST"])
@token_required
def batch_delete_items(token_data):
    db: Session = SessionLocal()
    try:
        request_data = request.get_json()
        if not request_data or 'item_ids' not in request_data:
            return jsonify({"status": "error", "message": "Missing item_ids parameter"}), 400
        
        item_ids = request_data['item_ids']
        if not isinstance(item_ids, list) or not item_ids:
            return jsonify({"status": "error", "message": "item_ids must be a non-empty list"}), 400
        
        # Query items to delete
        items_to_delete = db.query(Item).filter(Item.item_id.in_(item_ids)).all()
        
        if not items_to_delete:
            return jsonify({"status": "error", "message": "No items found with the provided IDs"}), 404
        
        # Allow deletion of assigned items (managers may want them removed from the list)
        # Delete all items
        deleted_items = []
        for item in items_to_delete:
            deleted_items.append(item.item_name)
            # Clear foreign key references
            item.task_id = None
            item.is_assigned = False
            db.delete(item)
        
        db.commit()
        
        return jsonify({
            "status": "success",
            "message": f"Successfully deleted {len(deleted_items)} items",
            "deleted_items": deleted_items
        }), 200

    except Exception as e:
        db.rollback()
        print(f"Error batch deleting items: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 400
    finally:
        db.close()
