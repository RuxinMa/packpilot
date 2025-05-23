import { Item } from './item';

// Complete task object
export interface Task {
  id: number;
  task_name: string;
  manager: string;      // Manager username who created the task
  worker: string;       // Assigned worker username
  workload: number;     // Total number of items
  status: 'in_progress' | 'completed';
  items: Item[];        // Array of complete Item objects
  created_at: Date;
  completed_at?: Date;
}

// Task creation input
export interface TaskInput {
  task_name: string;
  worker: string;       // Username of assigned worker
  item_ids: number[];   // Array of item IDs to include
  container: {          // Container dimensions for the task
    length: number;
    width: number;
    height: number;
  };
}

// Simplified task format for history display
export interface TaskHistoryItem {
  task_name: string;
  worker: string;
  workload: number;
  status: 'in_progress' | 'completed';
}

// Worker information
export interface Worker {
  id: number;
  username: string;
}