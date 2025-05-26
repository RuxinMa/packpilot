from flask import Blueprint, request, jsonify
from AI.schemas import OptimizeRequest
from AI.ai import run_ai_optimizer

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