from optimizer.box import Box
from optimizer.sa_optimizer import simulated_annealing
import time

# 构造一个测试容器（单位：米）
container = {
    "width": 10.0,
    "height": 10.0,
    "depth": 10.0
}

# 构造一组测试箱子（单位：米）
boxes_raw = [
    # {"item_id": 1, "original_width": 4.0, "original_height": 4.0, "original_depth": 4.0, "is_fragile": False},
    # {"item_id": 2, "original_width": 2.0, "original_height": 2.0, "original_depth": 2.0, "is_fragile": True},
    # {"item_id": 3, "original_width": 1.0, "original_height": 1.0, "original_depth": 1.0, "is_fragile": False},
    # {"item_id": 4, "original_width": 3, "original_height": 2, "original_depth": 2, "is_fragile": True},
    {"item_id": 5, "original_width": 0.50, "original_height": 0.45, "original_depth": 0.30, "is_fragile": False},
    {"item_id": 6, "original_width": 0.18, "original_height": 0.20, "original_depth": 0.22, "is_fragile": False},
    {"item_id": 7, "original_width": 0.33, "original_height": 0.36, "original_depth": 0.28, "is_fragile": True},
    {"item_id": 8, "original_width": 0.38, "original_height": 0.32, "original_depth": 0.26, "is_fragile": False},
    {"item_id": 9, "original_width": 0.21, "original_height": 0.25, "original_depth": 0.19, "is_fragile": True},
    {"item_id": 10, "original_width": 0.29, "original_height": 0.27, "original_depth": 0.33, "is_fragile": False}
]


best_cost = float("inf")
best_solution = None

start = time.time()

for run in range(2):
    print(f"\n🔁 Run {run + 1}")
    boxes = [
        Box(
            item_id=b["item_id"],
            original_width=b["original_width"],
            original_height=b["original_height"],
            original_depth=b["original_depth"],
            is_fragile=b["is_fragile"]
        )
        for b in boxes_raw
    ]

    solution, cost = simulated_annealing(boxes, container)

    print(f"➡️ Cost: {cost}")
    if solution:
        for b in solution:
            print(f"  Box {b.item_id} at x={b.x:.2f}, y={b.y:.2f}, z={b.z:.2f} size=({b.width:.2f}x{b.height:.2f}x{b.depth:.2f})")

    if cost < best_cost:
        best_cost = cost
        best_solution = solution

end = time.time()
print(f"\n✅ Best cost across 5 runs: {best_cost}")
print(f"🕒 Total time: {end - start:.2f} seconds")

print("\n📦 Best Placement Solution:")
if best_solution:
    for b in best_solution:
        print(f"  Box {b.item_id} at x={b.x:.2f}, y={b.y:.2f}, z={b.z:.2f} "
              f"size=({b.width:.2f}x{b.height:.2f}x{b.depth:.2f}) fragile={b.is_fragile}")
else:
    print("❌ No valid placement found.")