from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from datetime import datetime
from app.db.database import SessionLocal
from app.auth.auth import token_required
from app.Task.models import Task, TaskStatus
from app.auth.models import UserRole

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

@bp.route("/api/manager/get_tasks", methods=["GET"])
@token_required
def get_tasks(token_data):
    """Manager 获取所有任务"""
    if token_data.role != UserRole.Manager:
        return jsonify({"status": "error", "message": "Forbidden"}), 403

    db: Session = SessionLocal()
    try:
        # 支持状态筛选
        status_filter = request.args.get('status')
        assigned_to_filter = request.args.get('assigned_to')
        
        query = db.query(Task)
        
        if status_filter:
            try:
                status_enum = TaskStatus(status_filter)
                query = query.filter(Task.status == status_enum)
            except ValueError:
                return jsonify({"status": "error", "message": "Invalid status"}), 400
        
        if assigned_to_filter:
            query = query.filter(Task.assigned_to == assigned_to_filter)
        
        tasks = query.all()
        
        return jsonify({
            "status": "success",
            "tasks": [
                {
                    "task_id": task.task_id,
                    "task_name": task.task_name,
                    "container_id": task.container_id,
                    "assigned_to": task.assigned_to,
                    "manager_name": task.manager_name,
                    "status": task.status.value,
                    "deadline": task.deadline.isoformat() if task.deadline else None,
                    "created_at": task.created_at.isoformat() if task.created_at else None,
                    "workload": len(task.items)
                }
                for task in tasks
            ]
        }), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400
    finally:
        db.close()


@bp.route("/api/manager/get_task/<int:task_id>", methods=["GET"])
@token_required
def get_task(token_data, task_id):
    """Manager 获取单个任务详情"""
    if token_data.role != UserRole.Manager:
        return jsonify({"status": "error", "message": "Forbidden"}), 403

    db: Session = SessionLocal()
    try:
        task = db.query(Task).filter(Task.task_id == task_id).first()
        
        if not task:
            return jsonify({"status": "error", "message": "Task not found"}), 404
        
        return jsonify({
            "status": "success",
            "task": {
                "task_id": task.task_id,
                "task_name": task.task_name,
                "container_id": task.container_id,
                "assigned_to": task.assigned_to,
                "manager_name": task.manager_name,
                "status": task.status.value,
                "deadline": task.deadline.isoformat() if task.deadline else None,
                "created_at": task.created_at.isoformat() if task.created_at else None,
                "items": [
                    {
                        "item_id": item.item_id,
                        "item_name": item.item_name,
                        "width": float(item.width),
                        "height": float(item.height),
                        "depth": float(item.depth),
                        "x": float(item.x) if item.x is not None else None,
                        "y": float(item.y) if item.y is not None else None,
                        "z": float(item.z) if item.z is not None else None,
                        "placement_order": item.placement_order,
                        "orientation": item.orientation,
                        "remarks": item.remarks,
                        "is_fragile": item.is_fragile,
                        "is_assigned": item.is_assigned
                    }
                    for item in task.items
                ]
            }
        }), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400
    finally:
        db.close()


@bp.route("/api/worker/my_tasks", methods=["GET"])
@token_required
def get_my_tasks(token_data):
    """Worker 获取分配给自己的任务"""
    if token_data.role != UserRole.Worker:
        return jsonify({"status": "error", "message": "Forbidden"}), 403

    db: Session = SessionLocal()
    try:
        # Worker 只能看到分配给自己的任务
        tasks = db.query(Task).filter(Task.assigned_to == token_data.sub).all()
        
        return jsonify({
            "status": "success",
            "tasks": [
                {
                    "task_id": task.task_id,
                    "task_name": task.task_name,
                    "manager_name": task.manager_name,
                    "status": task.status.value,
                    "deadline": task.deadline.isoformat() if task.deadline else None,
                    "created_at": task.created_at.isoformat() if task.created_at else None,
                    "workload": len(task.items)
                }
                for task in tasks
            ]
        }), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400
    finally:
        db.close()


@bp.route("/api/worker/task/<int:task_id>", methods=["GET"])
@token_required
def get_worker_task(token_data, task_id):
    """Worker 获取自己任务的详情"""
    if token_data.role != UserRole.Worker:
        return jsonify({"status": "error", "message": "Forbidden"}), 403

    db: Session = SessionLocal()
    try:
        task = db.query(Task).filter(
            Task.task_id == task_id,
            Task.assigned_to == token_data.sub  # Worker 只能查看分配给自己的任务
        ).first()
        
        if not task:
            return jsonify({"status": "error", "message": "Task not found or not assigned to you"}), 404
        
        return jsonify({
            "status": "success",
            "task": {
                "task_id": task.task_id,
                "task_name": task.task_name,
                "manager_name": task.manager_name,
                "status": task.status.value,
                "deadline": task.deadline.isoformat() if task.deadline else None,
                "created_at": task.created_at.isoformat() if task.created_at else None,
                "items": [
                    {
                        "item_id": item.item_id,
                        "item_name": item.item_name,
                        "width": float(item.width),
                        "height": float(item.height),
                        "depth": float(item.depth),
                        "x": float(item.x) if item.x is not None else None,
                        "y": float(item.y) if item.y is not None else None,
                        "z": float(item.z) if item.z is not None else None,
                        "placement_order": item.placement_order,
                        "orientation": item.orientation,
                        "remarks": item.remarks,
                        "is_fragile": item.is_fragile
                    }
                    for item in task.items
                ]
            }
        }), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400
    finally:
        db.close()
