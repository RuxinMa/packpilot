import random
import math
from optimizer.cost_functions import advanced_cost_function

# 这个文件实现了模拟退火算法，用于优化箱子的放置。它使用了一个成本函数来评估当前的放置方案，并通过随机扰动来寻找更好的解决方案。
def simulated_annealing(boxes, container, initial_temp=1000, cooling_rate=0.99, stop_T=1, max_iter=10000):
    current_solution = [b.copy() for b in boxes]
    current_cost = advanced_cost_function(current_solution, container)
    best_solution = [b.copy() for b in current_solution]
    best_cost = current_cost

    T = initial_temp
    iteration = 0

    while T > stop_T and iteration < max_iter:
        neighbor = [b.copy() for b in current_solution]
        random.shuffle(neighbor)
        neighbor_cost = advanced_cost_function(neighbor, container)

        delta = neighbor_cost - current_cost
        if delta < 0 or random.random() < math.exp(-delta / T):
            current_solution = [b.copy() for b in neighbor]
            current_cost = neighbor_cost
            if current_cost < best_cost:
                best_solution = [b.copy() for b in neighbor]
                best_cost = current_cost

        if iteration % 100 == 0:
            print(f"Iter {iteration}: Temp={T:.2f}, Cost={current_cost:.2f}, Best={best_cost:.2f}")
        T *= cooling_rate
        iteration += 1

    return best_solution, best_cost