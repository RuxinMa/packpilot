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
        item = ItemCreate(**item_data)  # validate with Pydantic

        # Auto-generate item name like Item0001
        last_item = db.query(Item).order_by(Item.item_id.desc()).first()
        next_id = 1 if not last_item else last_item.item_id + 1
        item_name = f"Item{next_id:04d}"

        db_item = Item(
            item_name=item_name,
            length=item.length,
            width=item.width,
            height=item.height,
            orientation=item.orientation,
            remarks=item.remarks,
            is_fragile=False,
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
