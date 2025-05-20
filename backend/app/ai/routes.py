from flask import Blueprint, request, jsonify
from app.optimizer.box import Box
from app.optimizer.sa_optimizer import simulated_annealing

bp = Blueprint("ai", __name__, url_prefix="/api/ai")

@bp.route("/optimize", methods=["POST"])
def optimize_boxes():
    try:
        data = request.get_json()
        container = data.get("container")
        boxes_raw = data.get("boxes")

        if not container or not boxes_raw:
            return jsonify({"status": "error", "message": "Missing container or boxes data"}), 400

        boxes = [
            Box(
                box_data["box_id"],
                box_data["width"],
                box_data["height"],
                box_data["depth"],
                box_data.get("is_fragile", 0)
            )
            for box_data in boxes_raw
        ]

        best_solution, best_cost = simulated_annealing(boxes, container)

        results = []
        for idx, box in enumerate(best_solution):
            results.append({
                "placement_order": idx + 1,
                "box_id": box.box_id,
                "x": box.x,
                "y": box.y,
                "z": box.z,
                "width": box.width,
                "height": box.height,
                "depth": box.depth,
                "is_fragile": box.is_fragile
            })

        return jsonify({
            "status": "success",
            "cost": best_cost,
            "boxes": results
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
