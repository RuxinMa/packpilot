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

# This file implements the simulated annealing algorithm for optimizing box placement. It uses a cost function to evaluate the current placement and searches for better solutions via random perturbations.
def simulated_annealing(boxes, container, initial_temp=1000, cooling_rate=0.99, stop_T=1, max_iter=10000):
    current_solution = [b.copy() for b in boxes]
    current_cost = advanced_cost_function(current_solution, container)
    best_solution = [b.copy() for b in current_solution]
    best_cost = current_cost

    T = initial_temp
    iteration = 0

    while T > stop_T and iteration < max_iter:
        neighbor = perturb(current_solution)
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

    if best_cost >= 1e12:
            print("❌ Final result invalid. No feasible solution found.")
            return None, float("inf")
    
    print(f"✅ Optimization finished. Best cost: {best_cost:.2f}")
    return best_solution, best_cost