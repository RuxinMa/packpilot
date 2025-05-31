from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from app.auth.auth import token_required
from app.db.database import SessionLocal
from app.Container.models import Container
from app.Container.schemas import ContainerCreate

bp = Blueprint('container', __name__)

# create container
@bp.route("/api/manager/add_container", methods=["POST"])
@token_required
def add_container(token_data):
    if token_data.role.value != "Manager":
        return jsonify({"status": "error", "message": "Forbidden"}), 403

    db: Session = SessionLocal()
    try:
        container_data = request.get_json()
        container = ContainerCreate(**container_data)

        db_container = Container(
            width=container.width,
            height=container.height,
            depth=container.depth,
            label=container.label
        )

        db.add(db_container)
        db.commit()
        db.refresh(db_container)

        return jsonify({
            "status": "success",
            "message": "Container added successfully",
            "container": {
                "container_id": db_container.container_id,
                "width": float(db_container.width),
                "height": float(db_container.height),
                "depth": float(db_container.depth),
                "label": db_container.label
            }
        }), 201

    except Exception as e:
        db.rollback()
        return jsonify({"status": "error", "message": str(e)}), 400
    finally:
        db.close()

@bp.route("/api/manager/get_containers", methods=["GET"])
@token_required
def get_containers(token_data):
    db: Session = SessionLocal()
    try:
        containers = db.query(Container).all()
        
        return jsonify({
            "status": "success",
            "containers": [
                {
                    "container_id": container.container_id,
                    "width": float(container.width),
                    "height": float(container.height),
                    "depth": float(container.depth),
                    "label": container.label
                }
                for container in containers
            ]
        }), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400
    finally:
        db.close()


@bp.route("/api/manager/get_container/<int:container_id>", methods=["GET"])
@token_required
def get_container(token_data, container_id):
    db: Session = SessionLocal()
    try:
        container = db.query(Container).filter(Container.container_id == container_id).first()
        
        if not container:
            return jsonify({"status": "error", "message": "Container not found"}), 404
        
        return jsonify({
            "status": "success",
            "container": {
                "container_id": container.container_id,
                "width": float(container.width),
                "height": float(container.height),
                "depth": float(container.depth),
                "label": container.label
            }
        }), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400
    finally:
        db.close()