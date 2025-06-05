import math
import numpy as np

# 检查两个箱子是否重叠
def overlap(box1, box2):
    eps = 1e-6
    return not (
        box1.x + box1.width <= box2.x + eps or
        box2.x + box2.width <= box1.x + eps or
        box1.y + box1.height <= box2.y + eps or
        box2.y + box2.height <= box1.y + eps or
        box1.z + box1.depth <= box2.z + eps or
        box2.z + box2.depth <= box1.z + eps
    )


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

def support_area_ratio(box, placed_boxes, step=None):
    # 自动计算合适步长
    if step is None:
        step = max(min(box.width, box.height, box.depth) / 6.0, 0.05)

    supported = 0
    total = 0
    x_steps = max(1, int(box.width / step))
    z_steps = max(1, int(box.depth / step))

    for i in range(x_steps):
        for k in range(z_steps):
            px = box.x + i * step + step / 2
            pz = box.z + k * step + step / 2
            py = box.y

            is_supported = False
            if np.isclose(py, 0.0, atol=1e-3):  # 贴地认为支撑
                is_supported = True
            else:
                for other in placed_boxes:
                    if (np.isclose(other.y + other.height, py, atol=1e-3) and
                        other.x <= px <= other.x + other.width and
                        other.z <= pz <= other.z + other.depth):
                        is_supported = True
                        break

            supported += int(is_supported)
            total += 1

    return supported / total if total > 0 else 0

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

# 检查箱子是否在易碎箱子上方
def is_on_top_of_fragile(box, placed_boxes):
    for other in placed_boxes:
        if other.is_fragile:
            if (
                overlap_on_xy(box, other) and
                box.y >= other.y + other.height - 1e-3
            ):
                return True
    return False

def try_place_with_contact_priority(box, placed_boxes, container, greedy=False, bias_to_corner=False):
    eps = 1e-6
    best_score = float('inf')
    best_position = None

    def get_candidates(placed_boxes, axis_len, dim, bias_corner=False):
        candidates = set()
        if bias_corner:
            candidates.add(0.0)
        for b in placed_boxes:
            end = getattr(b, dim) + getattr(b, 'width' if dim == 'x' else 'height' if dim == 'y' else 'depth')
            if end < axis_len:
                candidates.add(round(end, 6))
                candidates.add(round(end + 0.01, 6))
                candidates.add(round(end - 0.01, 6))
        return sorted(candidates)

    # Step 0: 初始角落
    corner_positions = [(0.0, 0.0, 0.0)]
    for (x, y, z) in corner_positions:
        box.x, box.y, box.z = x, y, z
        if is_on_top_of_fragile(box, placed_boxes):
            continue
        if (box.x + box.width > container['width'] + eps or
            box.y + box.height > container['height'] + eps or
            box.z + box.depth > container['depth'] + eps):
            continue  # ❌ 越界，跳过这个位置
        if any(overlap(box, other) for other in placed_boxes):
            continue
        if greedy:
            return True
        else:
            score = x + y + z
            if score < best_score:
                best_score = score
                best_position = (x, y, z)

    # Step 1: 基于已有箱子向外扩展
    for anchor in placed_boxes:
        offsets = [
            (anchor.x + anchor.width, anchor.y, anchor.z),
            (anchor.x, anchor.y + anchor.height, anchor.z),
            (anchor.x, anchor.y, anchor.z + anchor.depth),
        ]
        for (x, y, z) in offsets:
            box.x, box.y, box.z = x, y, z
            if is_on_top_of_fragile(box, placed_boxes):
                continue
            if (box.x + box.width > container['width'] + eps or
                box.y + box.height > container['height'] + eps or
                box.z + box.depth > container['depth'] + eps):
                continue  # ❌ 越界，跳过这个位置
            if any(overlap(box, other) for other in placed_boxes):
                continue
            if y > 0 and support_area_ratio(box, placed_boxes) < 1.0:
                continue
            if greedy:
                return True
            else:
                score = x + y + z
                if score < best_score:
                    best_score = score
                    best_position = (x, y, z)

    # Step 2: 全面尝试 y-x-z 排列
    y_range = sorted(set([0.0] + [b.y + b.height for b in placed_boxes]))
    x_range = get_candidates(placed_boxes, container['width'], 'x', bias_to_corner)
    z_range = get_candidates(placed_boxes, container['depth'], 'z', bias_to_corner)

    for y in y_range:
        for z in z_range:
            for x in x_range:
                box.x, box.y, box.z = x, y, z
                if is_on_top_of_fragile(box, placed_boxes):
                    continue
                if any(overlap(box, other) for other in placed_boxes):
                    continue
                if y > 0 and support_area_ratio(box, placed_boxes) < 1.0:
                    continue
                if greedy:
                    return True
                else:
                    score = x + y + z
                    if score < best_score:
                        best_score = score
                        best_position = (x, y, z)

    # Step 3: fallback，贴地角落
    for x in [0.0]:
        for y in [0.0]:
            for z in [0.0]:
                box.x, box.y, box.z = x, y, z
                if any(overlap(box, other) for other in placed_boxes):
                    continue
                if greedy:
                    return True
                else:
                    score = x + y + z
                    if score < best_score:
                        best_score = score
                        best_position = (x, y, z)

    if best_position:
        box.x, box.y, box.z = best_position
        return True

    print(f"❌ Failed to place box {box}")
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
    order = sorted(order, key=lambda b: b.width * b.height * b.depth, reverse=True)

    placed_boxes = []
    total_volume = 0
    total_x = total_y = total_z = 0
    fragile_penalty = 0
    edge_penalty = 0
    base_bias_penalty = 0
    slope_penalty_total = 0
    max_z = 0
    position_bonus = 0

    for box in order:
        placed = False
        for orientation in range(6):
            box.rotate(orientation)
            if try_place_with_contact_priority(box, placed_boxes, container, greedy=True):  # ✅ 开启 greedy
                placed_boxes.append(box)
                total_volume += box.width * box.height * box.depth
                total_x += box.x + box.width / 2
                total_y += box.y + box.height / 2
                total_z += box.z + box.depth / 2
                max_z = max(max_z, box.z + box.depth)

                # 斜率惩罚（越斜越差）
                slope_penalty_total += max(0, box.y - 0.5 * (box.x + box.z))

                # 易碎箱子惩罚（上方不能有重物）
                if box.is_fragile:
                    top = box.y + box.height
                    for other in placed_boxes:
                        if other == box:
                            continue
                        if overlap_on_xy(box, other) and other.y >= top - 1e-3:
                            fragile_penalty += 1e6
                            break

                # 小箱子放边缘惩罚
                if is_small_box(box) and is_on_edge(box, container):
                    edge_penalty += 1e6

                # 缝隙偏差惩罚
                if is_gap_too_large(box, placed_boxes):
                    base_bias_penalty += 10
                else:
                    base_bias_penalty -= 5

                # 靠近原点 + 靠墙奖励
                center_dist = math.sqrt(box.x**2 + box.y**2 + box.z**2)
                position_bonus -= center_dist * 0.5
                if np.isclose(box.x, 0.0, atol=1e-3): position_bonus += 1.0
                if np.isclose(box.y, 0.0, atol=1e-3): position_bonus += 1.0
                if np.isclose(box.z, 0.0, atol=1e-3): position_bonus += 1.0

                placed = True
                break

        if not placed:
            return 1e12  # 无法放置，重罚

    if not placed_boxes:
        return 1e12

    # 中心偏移惩罚
    center_x = container['width'] / 2
    center_y = container['height'] / 2
    center_z = container['depth'] / 2
    avg_x = total_x / len(placed_boxes)
    avg_y = total_y / len(placed_boxes)
    avg_z = total_z / len(placed_boxes)
    center_penalty = math.sqrt((avg_x - center_x)**2 + (avg_y - center_y)**2 + (avg_z - center_z)**2)

    # 体积使用惩罚
    container_volume = container['width'] * container['height'] * container['depth']
    unused_volume = container_volume - total_volume
    volume_penalty = unused_volume / container_volume

    # 高度惩罚
    height_penalty = max_z / container['depth']

    # 接触奖励
    touching_bonus = 0
    for i, box in enumerate(placed_boxes):
        for j, other in enumerate(placed_boxes):
            if i != j and is_touching(box, [other]):
                touching_bonus += 1

    placed_boxes.sort(key=lambda b: (b.y, b.z, b.x))

    final_cost = (
        base_bias_penalty * 1.0 +
        slope_penalty_total * 2.0 +
        touching_bonus +
        5.0 * fragile_penalty +
        1.0 * edge_penalty +
        2.0 * volume_penalty +
        3.0 * height_penalty +
        center_penalty +
        position_bonus
    )

    # 若因逻辑失误导致返回 nan 或负数，强制补救
    if not np.isfinite(final_cost) or final_cost < 0:
        return 1e12

    return final_cost