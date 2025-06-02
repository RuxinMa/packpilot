from flask import Blueprint, request, jsonify
from app.AI.schemas import OptimizeRequest
from app.AI.ai import run_ai_optimizer
from app.db.database import SessionLocal
from app.Task.models import Task
from app.Container.models import Container
from app.Item.models import Item
from app.auth.auth import token_required

bp = Blueprint("ai", __name__, url_prefix="/api/ai")

@bp.route("/optimize", methods=["POST"])
def optimize():
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({"status": "error", "message": "No data provided"}), 400
        request_model = OptimizeRequest(**data)
        container = request_model.container.dict()
        boxes = [box.dict() for box in request_model.boxes]

        result = run_ai_optimizer(container, boxes)
        return jsonify(result), 200
    
    except ValueError as ve:
        return jsonify({"status": "error", "message": f"Validation error: {str(ve)}"}), 400
    except Exception as e:
        return jsonify({"status": "error", "message": f"Unexpected error: {str(e)}"}), 400

@bp.route("/optimize_task/<int:task_id>", methods=["POST"])
@token_required
def optimize_task(token_data, task_id):
    """基于任务ID的优化API - 供前端可视化调用"""
    db = SessionLocal()
    try:
        # 获取任务
        task = db.query(Task).filter(Task.task_id == task_id).first()
        if not task:
            return jsonify({"status": "error", "message": "Task not found"}), 404
        
        # 检查权限：Manager可以看所有任务，Worker只能看分配给自己的任务
        if token_data.role.value == "Worker" and task.assigned_to != token_data.sub:
            return jsonify({"status": "error", "message": "Access denied"}), 403
        
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
        
        # 调用AI优化算法
        result = run_ai_optimizer(container_data, boxes_data)
        
        # 可选：保存优化结果到数据库
        save_to_db = request.args.get('save', 'false').lower() == 'true'
        if save_to_db and result.get("status") == "success":
            for item_result in result["results"]:
                item = db.query(Item).filter(Item.item_id == item_result["item_id"]).first()
                if item:
                    item.x = item_result["x"]
                    item.y = item_result["y"] 
                    item.z = item_result["z"]
                    item.placement_order = item_result["placement_order"]
            db.commit()
            
        # 添加任务和容器信息到返回结果中，便于前端使用
        result["task_info"] = {
            "task_id": task.task_id,
            "task_name": task.task_name,
            "container": {
                "container_id": container.container_id,
                "width": float(container.width),
                "height": float(container.height),
                "depth": float(container.depth),
                "label": container.label
            }
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        db.rollback()
        return jsonify({"status": "error", "message": str(e)}), 400
    finally:
        db.close()

@bp.route("/get_task_layout/<int:task_id>", methods=["GET"])
@token_required  
def get_task_layout(token_data, task_id):
    """获取任务的当前摆放布局 - 如果已经优化过的话"""
    db = SessionLocal()
    try:
        # 获取任务
        task = db.query(Task).filter(Task.task_id == task_id).first()
        if not task:
            return jsonify({"status": "error", "message": "Task not found"}), 404
            
        # 检查权限
        if token_data.role.value == "Worker" and task.assigned_to != token_data.sub:
            return jsonify({"status": "error", "message": "Access denied"}), 403
        
        # 获取容器
        container = db.query(Container).filter(Container.container_id == task.container_id).first()
        if not container:
            return jsonify({"status": "error", "message": "Container not found"}), 404
            
        # 获取有布局信息的物品
        items = db.query(Item).filter(
            Item.task_id == task_id,
            Item.placement_order.isnot(None)
        ).order_by(Item.placement_order).all()
        
        if not items:
            return jsonify({
                "status": "error", 
                "message": "No layout found. Please run optimization first."
            }), 404
        
        # 构造与优化结果相同格式的返回数据
        results = [{
            "item_id": item.item_id,
            "placement_order": item.placement_order,
            "x": float(item.x) if item.x is not None else 0,
            "y": float(item.y) if item.y is not None else 0,
            "z": float(item.z) if item.z is not None else 0,
            "width": float(item.width),
            "height": float(item.height),
            "depth": float(item.depth),
            "is_fragile": item.is_fragile
        } for item in items]
        
        return jsonify({
            "status": "success",
            "cost": None,  # 历史数据没有cost信息
            "results": results,
            "task_info": {
                "task_id": task.task_id,
                "task_name": task.task_name,
                "container": {
                    "container_id": container.container_id,
                    "width": float(container.width),
                    "height": float(container.height),
                    "depth": float(container.depth),
                    "label": container.label
                }
            }
        }), 200
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400
    finally:
        db.close()