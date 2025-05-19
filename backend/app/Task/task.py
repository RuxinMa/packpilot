from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
# from ..db.database import SessionLocal
# from ..auth.auth import token_required
# from ..models import Task, TaskItem, Item
# from ..schemas import TaskCreate
from datetime import datetime
from backend.app.db.database import SessionLocal
from backend.app.auth.auth import token_required
from backend.app.Task.models import Task, TaskStatus,TaskItem, Item
from backend.app.Task.schemas import TaskCreate
from backend.app.core.config import ACCESS_TOKEN_EXPIRE_MINUTES
from backend.app.auth.models import UserRole
# bp = Blueprint('task', __name__)

# @bp.route("/api/manager/assign_task", methods=["POST"])
# @token_required
# def assign_task(token_data):
#     db: Session = SessionLocal()
#     try:
#         task_data = request.get_json()
#         task = TaskCreate(**task_data)

#         last_task = db.query(Task).order_by(Task.task_id.desc()).first()
#         next_id = 1 if not last_task else last_task.task_id + 1
#         task_name = f"Task{next_id:04d}"

#         db_task = Task(
#             task_name=task_name,
#             worker_id=task.worker_id
#         )
#         db.add(db_task)
#         db.commit()
#         db.refresh(db_task)

#         for item_id in task.item_ids:
#             db.add(TaskItem(task_id=db_task.task_id, item_id=item_id))
#             item = db.query(Item).filter(Item.item_id == item_id).first()
#             if item:
#                 item.is_assigned = True

#         db.commit()

#         return jsonify({
#             "status": "success",
#             "message": "Task assigned",
#             "task_id": db_task.task_id,
#             "task_name": db_task.task_name
#         }), 201

#     except Exception as e:
#         db.rollback()
#         return jsonify({"status": "error", "message": str(e)}), 400

#     finally:
#         db.close()

bp = Blueprint('task', __name__)

@bp.route("/api/manager/assign_task", methods=["POST"])
@token_required
def assign_task(token_data):
    if token_data.role != UserRole.Manager:
        return jsonify({"status": "error", "message": "Forbidden"}), 403

    db: Session = SessionLocal()
    try:
        data = request.get_json()

        # Generate task_name if not provided (e.g. based on timestamp)
        task_name = data.get("task_name", f"Task-{datetime.utcnow().isoformat()}")

        task = Task(
            task_name=task_name,
            container_id=data["container_id"],
            assigned_to=data["assigned_to"],
            manager_name=token_data.sub,  # from token
            deadline=datetime.fromisoformat(data["deadline"]) if data.get("deadline") else None,
            status=TaskStatus.Assigned
        )
        db.add(task)
        db.commit()
        db.refresh(task)

        return jsonify({
            "status": "success",
            "message": "Task assigned",
            "task_id": task.task_id
        }), 200

    except Exception as e:
        db.rollback()
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400
    finally:
        db.close()


@bp.route("/api/manager/task_history", methods=["GET"])
@token_required
def get_task_history(token_data):
    if token_data.role != UserRole.Manager:

        return jsonify({"status": "error", "message": "Forbidden"}), 403

    db: Session = SessionLocal()
    try:
        tasks = db.query(Task).filter(Task.manager_name == token_data.sub).all()

        history = []
        for task in tasks:
            history.append({
                "task_name": task.task_name,
                "worker": task.assigned_to,
                "workload": len(task.items),
                "status": task.status.value,
                "items": [
                    {
                        "item_id": item.item_id,
                        "length": item.length,
                        "width": item.width,
                        "height": item.height,
                        "orientation": item.orientation,
                        "remarks": item.remarks,
                        "order": item.order,
                        "position": item.position
                    }
                    for item in task.items
                ]
            })

        return jsonify(history), 200

    finally:
        db.close()
