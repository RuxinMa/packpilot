# 这个文件定义了一个 Box 类，用于表示一个箱子。每个箱子有唯一的 ID、原始尺寸、当前尺寸、位置和是否易碎等属性。
# 该类还提供了旋转箱子的方法和复制箱子的方法。箱子的 ID 是自动递增的，确保每个箱子都有唯一的标识符。
# 该类的设计允许用户创建多个箱子实例，并对它们进行操作，如旋转和复制
class Box:
    counter = 1

    def __init__(self, item_id, original_width, original_height, original_depth, is_fragile=False):
        self.item_id = int(item_id)
        self.original_width = float(original_width)
        self.original_height = float(original_height)
        self.original_depth = float(original_depth)
        self.is_fragile = bool(int(is_fragile))
        self.x = self.y = self.z = 0
        self.width = self.original_width
        self.height = self.original_height
        self.depth = self.original_depth
        self.unique_id = Box.counter
        Box.counter += 1
        self.orientation = [
            (self.original_width, self.original_height, self.original_depth),
            (self.original_width, self.original_depth, self.original_height),
            (self.original_height, self.original_width, self.original_depth),
            (self.original_height, self.original_depth, self.original_width),
            (self.original_depth, self.original_width, self.original_height),
            (self.original_depth, self.original_height, self.original_width)
        ]

    def rotate(self, idx):
        self.width, self.height, self.depth = self.orientation[idx]

    def copy(self):
        new_box = Box(self.item_id, self.original_width, self.original_height, self.original_depth, self.is_fragile)
        new_box.x, new_box.y, new_box.z = self.x, self.y, self.z
        new_box.width, new_box.height, new_box.depth = self.width, self.height, self.depth
        new_box.unique_id = self.unique_id
        return new_box
