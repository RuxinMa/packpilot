import math

# 检查两个箱子是否重叠
def overlap(box1, box2):
    return not (box1.x + box1.width <= box2.x or
                box2.x + box2.width <= box1.x or
                box1.y + box1.height <= box2.y or
                box2.y + box2.height <= box1.y or
                box1.z + box1.depth <= box2.z or
                box2.z + box2.depth <= box1.z)

def overlap_on_yz(b1, b2):
    return not (
        b1.y + b1.height <= b2.y or b2.y + b2.height <= b1.y or
        b1.z + b1.depth  <= b2.z or b2.z + b2.depth  <= b1.z
    )

def overlap_on_xz(b1, b2):
    return not (
        b1.x + b1.width <= b2.x or b2.x + b2.width <= b1.x or
        b1.z + b1.depth <= b2.z or b2.z + b2.depth <= b1.z
    )

def overlap_on_xy(b1, b2):
    return not (
        b1.x + b1.width <= b2.x or b2.x + b2.width <= b1.x or
        b1.y + b1.height <= b2.y or b2.y + b2.height <= b1.y
    )

def is_gap_too_large(box, placed_boxes, threshold=1.5):
    for other in placed_boxes:
        if box == other:
            continue
        if overlap_on_yz(box, other):
            dx = min(abs(box.x + box.width - other.x), abs(other.x + other.width - box.x))
            if dx < threshold:
                return False
        if overlap_on_xz(box, other):
            dy = min(abs(box.y + box.height - other.y), abs(other.y + other.height - box.y))
            if dy < threshold:
                return False
        if overlap_on_xy(box, other):
            dz = min(abs(box.z + box.depth - other.z), abs(other.z + other.depth - box.z))
            if dz < threshold:
                return False
    return True

def support_area_ratio(box, placed_boxes, step=0.5):
    supported = 0
    total = 0
    x_steps = int(box.width / step)
    z_steps = int(box.depth / step)
    for i in range(x_steps):
        for k in range(z_steps):
            px = box.x + i * step + step / 2
            pz = box.z + k * step + step / 2
            py = box.y
            is_supported = False
            if abs(py) < 1e-3:
                is_supported = True  # 贴地
            else:
                for other in placed_boxes:
                    if (abs(other.y + other.height - py) < 1e-3 and
                        other.x <= px <= other.x + other.width and
                        other.z <= pz <= other.z + other.depth):
                        is_supported = True
                        break
            supported += int(is_supported)
            total += 1
    return supported / total if total > 0 else 0



# 尝试将箱子放置在容器中
# def try_place(box, placed_boxes, container):
#     for z in range(int(container['depth'] - box.depth + 1)):
#         for y in range(int(container['height'] - box.height + 1)):
#             for x in range(int(container['width'] - box.width + 1)):
#                 box.x, box.y, box.z = x, y, z
#                 if all(not overlap(box, other) for other in placed_boxes):
#                     return True
#     return False

def is_touching(box, others):
    # 靠墙
    if box.x == 0 or box.y == 0 or box.z == 0:
        return True

    # 靠近已有箱子：任意一面贴合
    for other in others:
        if abs(box.x + box.width - other.x) < 1e-3 or abs(other.x + other.width - box.x) < 1e-3:
            if overlap_on_yz(box, other): return True
        if abs(box.y + box.height - other.y) < 1e-3 or abs(other.y + other.height - box.y) < 1e-3:
            if overlap_on_xz(box, other): return True
        if abs(box.z + box.depth - other.z) < 1e-3 or abs(other.z + other.depth - box.z) < 1e-3:
            if overlap_on_xy(box, other): return True
    return False


def try_place_with_contact_priority(box, placed_boxes, container, min_support_ratio=0.9):
    x_range = list(range(int(container['width'] - box.width + 1)))
    y_range = list(range(int(container['height'] - box.height + 1)))
    z_range = list(range(int(container['depth'] - box.depth + 1)))

    positions = [(x, y, z) for y in y_range for z in z_range for x in x_range]
    positions.sort(key=lambda pos: (pos[0] + pos[1] + pos[2]))

    for x, y, z in positions:
        box.x, box.y, box.z = x, y, z
        if all(not overlap(box, other) for other in placed_boxes):
            if support_area_ratio(box, placed_boxes) >= min_support_ratio:
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
    # 按照体积从大到小排序箱子
    order = sorted(order, key=lambda b: b.width * b.height * b.depth, reverse=True)

    placed_boxes = []
    total_volume = 0
    total_x = total_y = total_z = 0
    fragile_penalty = 0
    edge_penalty = 0
    base_bias_penalty = 0
    wall_bonus = 0
    ground_bonus = 0
    slope_penalty_total = 0
    max_z = 0

    for box in order:
        placed = False
        for orientation in range(6):
            box.rotate(orientation)
            if try_place_with_contact_priority(box, placed_boxes, container):
                placed_boxes.append(box)
                total_volume += box.width * box.height * box.depth
                total_x += box.x + box.width / 2
                total_y += box.y + box.height / 2
                total_z += box.z + box.depth / 2
                max_z = max(max_z, box.z + box.depth)

                # 控制斜率（不希望太陡）
                slope_penalty_total += max(0, box.y - 0.5 * (box.x + box.z))

                # 计算易碎箱子的惩罚
                if box.is_fragile:
                    if any(overlap(other, box) and other.z > box.z for other in placed_boxes if other != box):
                        fragile_penalty += 1e6

                # 计算小箱子在边缘的惩罚
                if is_small_box(box) and is_on_edge(box, container):
                    edge_penalty += 1e6

                # 计算基础偏差惩罚 （越靠近原点惩罚越小）
                if is_gap_too_large(box, placed_boxes):
                    base_bias_penalty += 10
                else:
                    base_bias_penalty -= 5

                # 如果箱子放在墙边，给予奖励
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

    # 计算接触奖励
    touching_bonus = 0
    for i, box in enumerate(placed_boxes):
        for j, other in enumerate(placed_boxes):
            if i != j and is_touching(box, [other]):
                touching_bonus += 1

    placed_boxes.sort(key=lambda b: (b.y, b.z, b.x))

    # 计算总惩罚
    return (
        base_bias_penalty * 1.0 +
        slope_penalty_total * 2.0 +
        ground_bonus +
        wall_bonus +
        -0.1 * touching_bonus +
        fragile_penalty +
        edge_penalty +
        volume_penalty +
        height_penalty +
        center_penalty
    )