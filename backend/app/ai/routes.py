from flask import Blueprint, request, jsonify
from app.ai.schemas import OptimizeRequest
from app.ai.ai import run_ai_optimizer

bp = Blueprint("ai", __name__, url_prefix="/api/ai")

@bp.route("/optimize", methods=["POST"])
def optimize():
    try:
        data = request.get_json()
        request_model = OptimizeRequest(**data)
        container = request_model.container.dict()
        boxes = [box.dict() for box in request_model.boxes]

        result = run_ai_optimizer(container, boxes)
        return jsonify(result)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400