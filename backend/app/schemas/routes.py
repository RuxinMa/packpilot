from flask import Blueprint, request, jsonify
from optimizer.box import Box
from optimizer.sa_optimizer import simulated_annealing

bp = Blueprint("ai", __name__, url_prefix="/api/ai")

@bp.route("/optimize", methods=["POST"])
def optimize_boxes():
    data = request.get_json()

    try:
        container = data["container"]
        box_data = data["boxes"]
    except KeyError:
        return jsonify({"error": "Invalid input data"}), 400
    
    box_list = [
        Box(
            box_id=box["box_id"],
            width=box["width"],
            height=box["height"],
            depth=box["depth"],
            is_fragile=box.get("is_fragile", False),
        ) for box in box_data
    ]

    best_solution, best_cost = simulated_annealing(box_list, container)

    placements = [{
        "box_id": b.box_id,
        "x": b.x,
        "y": b.y,
        "z": b.z,
        "width": b.width,
        "height": b.height,
        "depth": b.depth,
        "is_fragile": b.is_fragile,
    } for b in best_solution]

    return jsonify({
        "cost": best_cost,
        "placements": placements,
    })