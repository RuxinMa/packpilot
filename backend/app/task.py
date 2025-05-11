from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from ..db.database import SessionLocal
from ..auth.auth import token_required
from ..models import Task, TaskItem, Item
from ..schemas import TaskCreate

bp = Blueprint('task', __name__)

@bp.route("/api/manager/assign_task", methods=["POST"])
@token_required
def assign_task(token_data):
    db: Session = SessionLocal()
    try:
        task_data = request.get_json()
        task = TaskCreate(**task_data)

        last_task = db.query(Task).order_by(Task.task_id.desc()).first()
        next_id = 1 if not last_task else last_task.task_id + 1
        task_name = f"Task{next_id:04d}"

        db_task = Task(
            task_name=task_name,
            worker_id=task.worker_id
        )
        db.add(db_task)
        db.commit()
        db.refresh(db_task)

        for item_id in task.item_ids:
            db.add(TaskItem(task_id=db_task.task_id, item_id=item_id))
            item = db.query(Item).filter(Item.item_id == item_id).first()
            if item:
                item.is_assigned = True

        db.commit()

        return jsonify({
            "status": "success",
            "message": "Task assigned",
            "task_id": db_task.task_id,
            "task_name": db_task.task_name
        }), 201

    except Exception as e:
        db.rollback()
        return jsonify({"status": "error", "message": str(e)}), 400

    finally:
        db.close()
