from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from datetime import datetime
from app.db.database import SessionLocal
from app.auth.auth import token_required
from app.Task.models import Task, TaskStatus
from app.auth.models import UserRole
from app.AI.ai import run_ai_optimizer
from app.Container.models import Container
from app.Item.models import Item

bp = Blueprint('task', __name__)

@bp.route("/api/manager/assign_task", methods=["POST"])
@token_required
def assign_task(token_data):
    if token_data.role != UserRole.Manager:
        return jsonify({"status": "error", "message": "Forbidden"}), 403

    db: Session = SessionLocal()
    try:
        data = request.get_json()

        # Generate task_name if not provided
        task_name = data.get("task_name", f"Task-{datetime.utcnow().isoformat()}")

        # 创建任务
        task = Task(
            task_name=task_name,
            container_id=data["container_id"],
            assigned_to=data["assigned_to"],
            manager_name=token_data.sub,
            deadline=datetime.fromisoformat(data["deadline"]) if data.get("deadline") else None,
            status=TaskStatus.Assigned
        )
        db.add(task)
        db.flush()  # 获取task_id但不提交

        # 分配物品给任务（只标记，不删除记录）
        assigned_items_count = 0
        
        if "item_ids" in data and data["item_ids"]:
            items = db.query(Item).filter(Item.item_id.in_(data["item_ids"])).all()
            
            if not items:
                db.rollback()
                return jsonify({
                    "status": "error",
                    "message": "No items found with the provided IDs"
                }), 404
            
            # 检查是否有已分配的物品
            already_assigned = [item for item in items if item.is_assigned or item.task_id is not None]
            if already_assigned:
                assigned_names = [item.item_name for item in already_assigned]
                db.rollback()
                return jsonify({
                    "status": "error",
                    "message": f"Cannot assign already assigned items: {', '.join(assigned_names)}"
                }), 400
            
            # 只标记分配，不删除记录
            for item in items:
                item.task_id = task.task_id
                item.is_assigned = True
                assigned_items_count += 1

        db.commit()

        return jsonify({
            "status": "success",
            "message": "Task assigned successfully",
            "task_id": task.task_id,
            "assigned_to": task.assigned_to,
            "items_assigned": assigned_items_count
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

@bp.route("/api/manager/optimize_task/<int:task_id>", methods=["POST"])
@token_required
def optimize_task_placement(token_data, task_id):
    """Manager优化任务中货物的摆放"""
    if token_data.role != UserRole.Manager:
        return jsonify({"status": "error", "message": "Forbidden"}), 403
    
    db: Session = SessionLocal()
    try:
        # 获取任务
        task = db.query(Task).filter(Task.task_id == task_id).first()
        if not task:
            return jsonify({"status": "error", "message": "Task not found"}), 404
        
        # 获取容器
        container = db.query(Container).filter(Container.container_id == task.container_id).first()
        if not container:
            return jsonify({"status": "error", "message": "Container not found"}), 404
        
        # 获取任务中的物品
        items = db.query(Item).filter(Item.task_id == task_id).all()
        if not items:
            return jsonify({"status": "error", "message": "No items found for this task"}), 404
        
        # 转换为AI API需要的格式
        container_data = {
            "width": float(container.width),
            "height": float(container.height), 
            "depth": float(container.depth)
        }
        
        boxes_data = [{
            "item_id": item.item_id,
            "width": float(item.width),
            "height": float(item.height),
            "depth": float(item.depth),
            "is_fragile": item.is_fragile
        } for item in items]
        
        # 直接调用AI优化函数（不用requests）
        result = run_ai_optimizer(container_data, boxes_data)
        
        # 保存优化结果到数据库
        if result.get("status") == "success":
            for item_result in result["results"]:
                item = db.query(Item).filter(Item.item_id == item_result["item_id"]).first()
                if item:
                    item.x = item_result["x"]
                    item.y = item_result["y"] 
                    item.z = item_result["z"]
                    item.placement_order = item_result["placement_order"]
            db.commit()
            
        return jsonify(result), 200
        
    except Exception as e:
        db.rollback()
        return jsonify({"status": "error", "message": str(e)}), 400
    finally:
        db.close()

@bp.route("/api/worker/complete_task/<int:task_id>", methods=["PUT"])
@token_required
def complete_task(token_data, task_id):
    """Worker 完成任务"""
    if token_data.role != UserRole.Worker:
        return jsonify({"status": "error", "message": "Forbidden"}), 403
    
    db: Session = SessionLocal()
    try:
        # 检查任务是否存在且分配给当前worker
        task = db.query(Task).filter(
            Task.task_id == task_id,
            Task.assigned_to == token_data.sub
        ).first()
        
        if not task:
            return jsonify({"status": "error", "message": "Task not found or not assigned to you"}), 404
        
        # 检查任务是否已经完成
        if task.status == TaskStatus.Completed:
            return jsonify({"status": "error", "message": "Task is already completed"}), 400
        
        # 更新任务状态为完成
        task.status = TaskStatus.Completed
        db.commit()
        
        return jsonify({
            "status": "success",
            "message": "Task completed successfully",
            "task_id": task.task_id,
            "task_name": task.task_name
        }), 200
        
    except Exception as e:
        db.rollback()
        return jsonify({"status": "error", "message": str(e)}), 400
    finally:
        db.close()
