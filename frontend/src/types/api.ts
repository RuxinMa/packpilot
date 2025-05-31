// src/types/api.ts

import { TaskHistoryItem } from './task';
import { ItemResponse } from './item';

// Base API response
export interface ApiResponse {
  status: 'success' | 'error';
  message: string;
}

// Task history API response
export interface TaskHistoryResponse extends ApiResponse {
  tasks?: TaskHistoryItem[];
}

// Worker tasks API response
export interface WorkerTasksResponse extends ApiResponse {
  tasks?: ItemResponse[];
}

// Item detail API response
export interface ItemDetailResponse extends ApiResponse {
  item?: ItemResponse;
}