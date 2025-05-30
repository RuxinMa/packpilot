// Mock data for testing
import { Item, Task, TaskHistoryItem, User, Worker } from '../types';

export const mockItems: Item[] = [
  { 
    id: 1, 
    name: '20250517-0034',
    length: 50,  
    width: 30, 
    height: 20, 
    orientation: 'Face up', 
    remarks: '', 
    is_fragile: true,
    created_at: new Date('2025-05-01T10:30:00')
  },
  { 
    id: 2, 
    name: '20250517-0035',
    length: 100, 
    width: 45, 
    height: 35, 
    orientation: 'Face down', 
    remarks: 'Heavy box', 
    is_fragile: false,
    created_at: new Date('2025-05-03T14:15:00')
  },
  { 
    id: 3, 
    name: '20250517-0036',
    length: 75, 
    width: 60, 
    height: 40, 
    orientation: 'Side A', 
    remarks: '', 
    is_fragile: true,
    created_at: new Date('2025-05-05T09:45:00')
  },
  { 
    id: 4, 
    name: '20250517-0037',
    length: 120, 
    width: 80, 
    height: 50, 
    orientation: '', 
    remarks: '', 
    is_fragile: false,
    created_at: new Date('2025-05-07T16:20:00')
  },
  { 
    id: 5, 
    name: '20250517-0038',
    length: 90, 
    width: 65, 
    height: 45, 
    orientation: 'Face up', 
    remarks: '', 
    is_fragile: false,
    created_at: new Date('2025-05-08T11:10:00')
  },
  { 
    id: 6, 
    name: '20250517-0039',
    length: 60, 
    width: 65, 
    height: 45, 
    orientation: '', 
    remarks: '', 
    is_fragile: true,
    created_at: new Date('2025-05-08T11:10:00')
  },
  { 
    id: 7, 
    name: '20250517-0040',
    length: 60, 
    width: 60, 
    height: 45, 
    orientation: 'Face up', 
    remarks: '', 
    is_fragile: true,
    created_at: new Date('2025-05-08T11:10:00')
  }
];

// Mock task data with updated interface
export const mockTasks: Task[] = [
  {
    id: 1,
    task_name: '20250517-0034',
    manager: 'manager1',
    worker: 'worker1',
    workload: 20,
    status: 'completed',
    items: [mockItems[3], mockItems[4]], // Full Item objects
    created_at: new Date('2025-05-17T10:30:00'),
    completed_at: new Date('2025-05-17T15:45:00'),
  },
  {
    id: 2,
    task_name: '20250517-0035',
    manager: 'manager1',
    worker: 'worker1',
    workload: 50,
    status: 'in_progress',
    items: [],
    created_at: new Date('2025-05-17T11:00:00'),
  },
  {
    id: 3,
    task_name: '20250517-0036',
    manager: 'manager1',
    worker: 'worker2',
    workload: 60,
    status: 'completed',
    items: [],
    created_at: new Date('2025-05-17T09:00:00'),
    completed_at: new Date('2025-05-17T14:30:00'),
  },
  {
    id: 4,
    task_name: '20250517-0037',
    manager: 'manager1',
    worker: 'worker3',
    workload: 42,
    status: 'in_progress',
    items: [],
    created_at: new Date('2025-05-17T12:00:00'),
  },
  {
    id: 6,
    task_name: '20250517-0037',
    manager: 'manager1',
    worker: 'worker3',
    workload: 42,
    status: 'in_progress',
    items: [],
    created_at: new Date('2025-05-17T12:00:00'),
  }
];

// Task history format for dashboard display
export const mockTaskHistory: TaskHistoryItem[] = [
  {
    task_name: '20250517-0034',
    worker: 'worker1',
    workload: 20,
    status: 'completed',
  },
  {
    task_name: '20250517-0035',
    worker: 'worker1',
    workload: 50,
    status: 'in_progress',
  },
  {
    task_name: '20250517-0036',
    worker: 'worker2',
    workload: 34,
    status: 'completed',
  },
  {
    task_name: '20250517-0037',
    worker: 'worker3',
    workload: 60,
    status: 'in_progress',
  },
];

// Auth Mock Data for login
export const MOCK_USERS: Array<User & { password: string }> = [
  { id: 1, username: 'manager1', password: 'password', role: 'Manager' },
  { id: 2, username: 'worker1', password: 'password', role: 'Worker' },
  { id: 3, username: 'worker2', password: 'password', role: 'Worker' },
  { id: 4, username: 'worker3', password: 'password', role: 'Worker' }
];

// Available workers for task assignment
export const MOCK_WORKERS: Worker[] = [
  { id: 1, username: 'worker1' },
  { id: 2, username: 'worker2' }, 
  { id: 3, username: 'worker3' }
];