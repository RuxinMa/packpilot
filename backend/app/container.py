from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session

from backend.app.auth.auth import token_required

from backend.app.db.database import SessionLocal

from backend.app.models import Container

from backend.app.schemas import ContainerCreate


bp = Blueprint('container', __name__)

@bp.route("/api/manager/add_container", methods=["POST"])
@token_required
def add_container(token_data):
    print("DEBUG: token_data.role =", token_data.role)

    if token_data.role.value != "Manager":


        return jsonify({"status": "error", "message": "Forbidden"}), 403

    db: Session = SessionLocal()
    try:
        container_data = request.get_json()
        container = ContainerCreate(**container_data)

        db_container = Container(
            length=container.length,
            width=container.width,
            height=container.height,
            label=container.label
        )

        db.add(db_container)
        db.commit()
        db.refresh(db_container)

        return jsonify({
            "status": "success",
            "message": "Container added",
            "container_id": db_container.container_id
        }), 201

    except Exception as e:
        db.rollback()
        return jsonify({"status": "error", "message": str(e)}), 400

    finally:
        db.close()
