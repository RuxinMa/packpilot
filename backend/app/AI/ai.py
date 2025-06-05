from app.AI.optimizer.sa_optimizer import simulated_annealing
from app.AI.optimizer.box import Box

def run_ai_optimizer(container, boxes_raw, runs=2):

    container = {
        "width": float(container["width"] / 100),  # 转换为米
        "height": float(container["height"] / 100),  # 转换为米
        "depth": float(container["depth"] / 100)  # 转换为米
    }

    best_solution = None
    best_cost = float("inf")

    for _ in range(runs):
        # Step 1: 创建 Box 实例并按体积从大到小排序（避免小箱子阻挡大箱子）
        boxes = sorted([
            Box(
                item_id=box["item_id"],
                original_width=box["width"] / 100,  # 转换为米
                original_height=box["height"] / 100,  # 转换为米
                original_depth=box["depth"] / 100,  # 转换为米
                is_fragile=box.get("is_fragile", False)
            ) for box in boxes_raw
        ], key=lambda b: b.width * b.height * b.depth, reverse=True)

        # Step 2: 调用模拟退火优化器
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
        "x": box.x * 100,  # 转换为厘米
        "y": box.y * 100,  # 转换为厘米
        "z": box.z * 100,  # 转换为厘米
        "width": box.width * 100,  # 转换为厘米
        "height": box.height * 100,  # 转换为厘米
        "depth": box.depth * 100,  # 转换为厘米
        "is_fragile": box.is_fragile
    } for idx, box in enumerate(sorted_solution)]

    return {
        "status": "success",
        "cost": best_cost,
        "results": results
    }