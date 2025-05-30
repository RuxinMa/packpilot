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

    results = [{
        "item_id": box.item_id,
        "placement_order": idx + 1,
        "x": box.x, # + box.width / 2,
        "y": box.y, # + box.height / 2,
        "z": box.z, # + box.depth / 2,
        "width": box.width,
        "height": box.height,
        "depth": box.depth,
        "is_fragile": box.is_fragile
    } for idx, box in enumerate(best_solution)]

    return {
        "status": "success",
        "cost": best_cost,
        "results": results
    }