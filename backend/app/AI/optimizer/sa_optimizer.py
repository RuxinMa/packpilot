import random
import math
from .cost_functions import advanced_cost_function

def perturb(solution):
    new_solution = [b.copy() for b in solution]
    op = random.choice(["swap", "rotate", "move"])

    if op == "swap" and len(new_solution) >= 2:
        i, j = random.sample(range(len(new_solution)), 2)
        new_solution[i], new_solution[j] = new_solution[j], new_solution[i]

    elif op == "rotate":
        i = random.randint(0, len(new_solution) - 1)
        new_solution[i].rotate(random.randint(0, 5))

    elif op == "move" and len(new_solution) >= 2:
        i = random.randint(0, len(new_solution) - 1)
        box = new_solution.pop(i)
        new_solution.insert(random.randint(0, len(new_solution)), box)

    return new_solution

# 这个文件实现了模拟退火算法，用于优化箱子的放置。它使用了一个成本函数来评估当前的放置方案，并通过随机扰动来寻找更好的解决方案。
def simulated_annealing(boxes, container, initial_temp=1000, cooling_rate=0.95, stop_T=1, max_iter=2000):
    try:
        current_solution = [b.copy() for b in boxes]
        current_cost = advanced_cost_function(current_solution, container)
        best_solution = [b.copy() for b in current_solution]
        best_cost = current_cost

        T = initial_temp
        iteration = 0
        invalid_count = 0
        max_invalid = 50


        while T > stop_T and iteration < max_iter:
            neighbor = perturb(current_solution)
            neighbor_cost = advanced_cost_function(neighbor, container)

            if neighbor_cost >= 1e12:
                print("Invalid neighbor solution detected, skipping...")
                invalid_count += 1
                if invalid_count >= max_invalid:
                    print("⚠️ Too many invalid neighbors. Breaking early.")
                    break
                iteration += 1
                T *= cooling_rate
                continue
            invalid_count = 0

            delta = neighbor_cost - current_cost
            if delta < 0 or random.random() < math.exp(-delta / T):
                current_solution = [b.copy() for b in neighbor]
                current_cost = neighbor_cost
                if current_cost < best_cost:
                    best_solution = [b.copy() for b in neighbor]
                    best_cost = current_cost

            if iteration % 100 == 0:
                print(f"Iter {iteration}: Temp={T:.2f}, Cost={current_cost:.2f}, Best={best_cost:.2f}")

            # Early exit if solution is clearly invalid
            if best_cost >= 1e12:
                print("No valid solution found (best_cost too high). Aborting early.")
                return None, float("inf")

            T *= cooling_rate
            iteration += 1

        if best_cost >= 1e12:
            print("Final result invalid. No feasible solution found.")
            return None, float("inf")

        return best_solution, best_cost

    except Exception as e:
        print("Exception in simulated_annealing:", e)
        import traceback
        traceback.print_exc()
        return None, float("inf")