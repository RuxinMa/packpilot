from app.optimizer.sa_optimizer import simulated_annealing
from app.optimizer.box import Box

def run_ai_optimizer(container, boxes_raw):
    boxes = [Box(
        box_id=box["box_id"],
        original_width=box["width"],
        original_height=box["height"],
        original_depth=box["depth"],
        is_fragile=box.get("is_fragile", False)
    ) for box in boxes_raw]

    solution, cost = simulated_annealing(boxes, container)

    results = [{
        "box_id": box.box_id,
        "x": box.x,
        "y": box.y,
        "z": box.z,
        "width": box.width,
        "height": box.height,
        "depth": box.depth
    } for box in solution]

    return {
        "status": "success",
        "cost": cost,
        "results": results
    }