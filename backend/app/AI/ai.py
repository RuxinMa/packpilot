from app.AI.optimizer.sa_optimizer import simulated_annealing
from app.AI.optimizer.box import Box

def run_ai_optimizer(container, boxes_raw, runs=5):

    best_solution = None
    best_cost = float("inf")

    for _ in range(runs):
        boxes = [Box(
            item_id=box["item_id"],
            original_width=box["width"],
            original_height=box["height"],
            original_depth=box["depth"],
            is_fragile=box.get("is_fragile", False)
        ) for box in boxes_raw]

        solution, cost = simulated_annealing(boxes, container)

        if cost < best_cost:
            best_cost = cost
            best_solution = solution

    if best_solution is None or best_cost > 1e10:
        return {
            "status": "error",
            "cost": float("inf"),
            "results": [],
            "message": "Unable to pack all boxes into container"
        }

    sorted_solution = sorted(best_solution, key=lambda b: (b.z, b.y, b.x))
    
    results = [{
        "item_id": box.item_id,
        "placement_order": idx + 1,
        "x": box.x,
        "y": box.y,
        "z": box.z,
        "width": box.width,
        "height": box.height,
        "depth": box.depth,
        "is_fragile": box.is_fragile
    } for idx, box in enumerate(sorted_solution)]

    return {
        "status": "success",
        "cost": best_cost,
        "results": results
    }