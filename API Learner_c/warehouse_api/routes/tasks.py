from flask import Blueprint, request, jsonify
from models import db, Task, TaskItem, Item
from functools import wraps
import jwt
from config import SECRET_KEY

task_bp = Blueprint('task_bp', __name__)

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

@task_bp.route('/api/manager/assign_task', methods=['POST'])
@token_required
def assign_task():
    if request.user.get("role") != "Manager":
        return jsonify({"status": "error", "message": "Unauthorized: Manager role required"}), 403

    data = request.get_json()

    try:
        last_task = Task.query.order_by(Task.task_id.desc()).first()
        next_id = 1 if not last_task else last_task.task_id + 1
        task_name = f"Task{next_id:04d}"

        task = Task(
            task_name=task_name,
            worker_id=data['worker_id'],
            status='Assigned'
        )
        db.session.add(task)
        db.session.commit()

        for item_id in data['item_ids']:
            task_item = TaskItem(task_id=task.task_id, item_id=item_id)
            db.session.add(task_item)
            item = Item.query.get(item_id)
            if item:
                item.is_assigned = True

        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Task assigned successfully",
            "task_id": task.task_id
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 400
