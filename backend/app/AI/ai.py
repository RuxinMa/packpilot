from app.AI.optimizer.sa_optimizer import simulated_annealing
from app.AI.optimizer.box import Box

def run_ai_optimizer(container, boxes_raw, runs=3):

    container = {
        "width": float(container["width"] / 100),  # Convert to meters
        "height": float(container["height"] / 100),  # Convert to meters
        "depth": float(container["depth"] / 100)  # Convert to meters
    }

    best_solution = None
    best_cost = float("inf")

    for _ in range(runs):
        # Step 1: Create Box instances and sort them by volume in descending order (to prevent small boxes from blocking larger ones)
        boxes = sorted([
            Box(
                item_id=box["item_id"],
                original_width=box["width"] / 100,  # Convert to meters
                original_height=box["height"] / 100,  # Convert to meters
                original_depth=box["depth"] / 100,  # Convert to meters
                is_fragile=box.get("is_fragile", False)
            ) for box in boxes_raw
        ], key=lambda b: b.width * b.height * b.depth, reverse=True)

        # Step 2: Call simulated annealing optimizer
        solution, cost = simulated_annealing(boxes, container)

        if cost < best_cost:
            best_cost = cost
            best_solution = solution

    if best_solution is None or best_cost > 1e12:
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
        "x": box.x * 100,  # Convert to centimeters
        "y": box.y * 100,  # Convert to centimeters
        "z": box.z * 100,  # Convert to centimeters
        "width": box.width * 100,  # Convert to centimeters
        "height": box.height * 100,  # Convert to centimeters
        "depth": box.depth * 100,  # Convert to centimeters
        "is_fragile": box.is_fragile
    } for idx, box in enumerate(sorted_solution)]

    return {
        "status": "success",
        "cost": best_cost,
        "results": results
    }