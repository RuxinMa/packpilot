// src/types/index.ts

// Item related types
export interface Item {
  id: number;
  length: number;
  width: number;
  height: number;
  orientation: string;
  remarks: string;
}

// Task related types
export interface Task {
  task_id: number;
  task_name: string;
  worker: string;
  worker_id: number;
  workload: number;
  status: 'Completed' | 'Assigned';
  items: Item[];
}

// Worker related types
export interface Worker {
  id: number;
  username: string;
}

// Container related types
export interface Container {
  length: number;
  width: number;
  height: number;
}

// API response types
export interface ApiResponse {
  status: 'success' | 'error';
  message: string;
}

export interface ItemResponse extends ApiResponse {
  item_id?: number;
}

export interface TaskResponse extends ApiResponse {
  task_id?: number;
}

export interface TaskHistoryResponse extends ApiResponse {
  tasks?: Task[];
}

export interface WorkerTasksResponse extends ApiResponse {
  tasks?: {
    task_id: number;
    item_id: number;
    item_name: string;
    size: string;
    direction: string;
    note: string;
  }[];
}

export interface ItemDetailResponse extends ApiResponse {
  item?: {
    item_id: number;
    item_name: string;
    size: string;
    direction: string;
    note: string;
  };
}