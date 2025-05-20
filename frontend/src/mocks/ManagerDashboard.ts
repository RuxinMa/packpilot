interface Task {
  task_name: string;
  worker: string;
  workload: number;
  status: 'Completed' | 'Assigned';
}

// Mock data for testing
export const mockItems = [
  { 
    id: 1, 
    length: 50,  
    width: 30, 
    height: 20, 
    direction: 'Face up', 
    notes: 'Fragile item', 
    createdAt: new Date('2025-05-01T10:30:00')
  },
  { 
    id: 2, 
    length: 100, 
    width: 45, 
    height: 35, 
    direction: 'Face down', 
    notes: 'Heavy box', 
    createdAt: new Date('2025-05-03T14:15:00')
  },
  { 
    id: 3, 
    length: 75, 
    width: 60, 
    height: 40, 
    direction: 'Side A', 
    notes: '', 
    createdAt: new Date('2025-05-05T09:45:00')
  },
  { 
    id: 4, 
    length: 120, 
    width: 80, 
    height: 50, 
    direction: 'Side B', 
    notes: '', 
    createdAt: new Date('2025-05-07T16:20:00')
  },
  { 
    id: 5, 
    length: 90, 
    width: 65, 
    height: 45, 
    direction: 'Face up', 
    notes: 'Kitchen appliance', 
    createdAt: new Date('2025-05-08T11:10:00')
  }
];


// Mock data
export const mockTaskHistory: Task[] = [
  {
    task_name: 'Task-20250517-0034',
    worker: "worker1",
    workload: 30,
    status: "Completed" as const,
  },
  {
    task_name: 'Task-20250517-0035',
    worker: "worker1",
    workload: 50,
    status: "Assigned" as const,
  },
  {
    task_name: 'Task-20250517-0036',
    worker: "worker2",
    workload: 50,
    status: "Completed" as const,
  },
  {
    task_name: 'Task-20250517-0037',
    worker: "worker3",
    workload: 55,
    status: "Assigned" as const,
  },
  {
    task_name: 'Task-20250517-0038',
    worker: "worker4",
    workload: 35,
    status: "Completed" as const,
  },
  {
    task_name: 'Task-20250517-0039',
    worker: "worker4",
    workload: 40,
    status: "Assigned" as const,
  },
];