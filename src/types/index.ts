// src/types/index.ts

// Item types
export interface ItemDimensions {
  length: number;
  width: number;
  height: number;
}

// Item as used internally in the application
export interface Item {
  id: number;
  name?: string; // Optional since some APIs may not return it
  length: number;
  width: number;
  height: number;
  orientation: string;
  remarks: string;
}

// Item as expected by the Add/Edit Item API
export interface ItemInput {
  length: number;
  width: number;
  height: number;
  orientation: string;
  remarks: string;
}

// Item as returned by the Worker APIs (Next/Previous Item)
export interface ItemResponse {
  item_id: number;
  item_name: string;
  size: string;
  direction: string;
  note: string;
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
export interface Container extends ItemDimensions {
  // Reusing the ItemDimensions interface
}

// API response types
export interface ApiResponse {
  status: 'success' | 'error';
  message: string;
}

export interface TaskHistoryResponse extends ApiResponse {
  tasks?: {
    task_name: string;
    worker: string;
    workload: number;
    status: 'Completed' | 'Assigned';
  }[];
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