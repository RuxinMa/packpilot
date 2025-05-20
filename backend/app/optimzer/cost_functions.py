import math

# 检查两个箱子是否重叠
def overlap(box1, box2):
    return not (box1.x + box1.width <= box2.x or
                box2.x + box2.width <= box1.x or
                box1.y + box1.height <= box2.y or
                box2.y + box2.height <= box1.y or
                box1.z + box1.depth <= box2.z or
                box2.z + box2.depth <= box1.z)

# 尝试将箱子放置在容器中
def try_place(box, placed_boxes, container):
    for z in range(container['depth'] - int(box.depth) + 1):
        for y in range(container['height'] - int(box.height) + 1):
            for x in range(container['width'] - int(box.width) + 1):
                box.x, box.y, box.z = x, y, z
                if all(not overlap(box, other) for other in placed_boxes):
                    return True
    return False

# 检查箱子是否小于给定体积
def is_small_box(box, threshold_volume=10):
    return box.width * box.height * box.depth < threshold_volume

# 检查小箱子是否在容器的边缘
def is_on_edge(box, container, margin=1.0):
    return (box.x <= margin or
            box.y <= margin or
            box.z <= margin or
            box.x + box.width >= container['width'] - margin or
            box.y + box.height >= container['height'] - margin or
            box.z + box.depth >= container['depth'] - margin)

# 计算成本函数
def advanced_cost_function(order, container):
    placed_boxes = []
    total_volume = 0
    total_x = total_y = total_z = 0
    fragile_penalty = 0
    edge_penalty = 0
    base_bias_penalty = 0
    wall_bonus = 0
    max_z = 0

    for box in order:
        placed = False
        for orientation in range(6):
            box.rotate(orientation)
            if try_place(box, placed_boxes, container):
                placed_boxes.append(box)
                total_volume += box.width * box.height * box.depth
                total_x += box.x + box.width / 2
                total_y += box.y + box.height / 2
                total_z += box.z + box.depth / 2
                max_z = max(max_z, box.z + box.depth)

                # 计算易碎箱子的惩罚
                if box.is_fragile:
                    if any(overlap(other, box) and other.z > box.z for other in placed_boxes if other != box):
                        fragile_penalty += 1e6

                # 计算小箱子在边缘的惩罚
                if is_small_box(box) and is_on_edge(box, container):
                    edge_penalty += 1e6

                # 计算基础偏差惩罚 （越靠近原点惩罚越小）
                base_bias_penalty += box.x + box.y + box.z

                # 如果箱子放在边缘，惩罚增加
                # 如果箱子放在边缘，惩罚增加
                if box.x == 0 or box.y == 0 or box.z == 0:
                    wall_bonus -= 1.0
                else:
                    wall_bonus += 2.0

                placed = True
                break

        # 如果没有找到合适的放置位置，则返回一个很大的惩罚值
        if not placed:
            return 1e12  # hard penalty

    if not placed_boxes:
        return 1e12

    # 计算中心惩罚
    center_x = container['width'] / 2
    center_y = container['height'] / 2
    center_z = container['depth'] / 2
    avg_x = total_x / len(placed_boxes)
    avg_y = total_y / len(placed_boxes)
    avg_z = total_z / len(placed_boxes)
    center_penalty = math.sqrt((avg_x - center_x)**2 + (avg_y - center_y)**2 + (avg_z - center_z)**2)

    container_volume = container['width'] * container['height'] * container['depth']
    # 计算未使用的体积
    unused_volume = container_volume - total_volume
    # 计算体积惩罚
    volume_penalty = unused_volume / container_volume
    # 计算高度惩罚
    height_penalty = max_z / container['depth']

    # 计算总惩罚
    return (center_penalty +
            fragile_penalty +
            edge_penalty +
            base_bias_penalty * 0.5 +
            volume_penalty +
            height_penalty +
            wall_bonus
    )