// src/types/item.ts

// Item as used internally in the application
export interface Item {
  id: number;
  name: string;        // Required field for item name
  length: number;
  width: number;
  height: number;
  orientation: string;
  remarks: string;
  is_fragile: boolean;
  created_at: Date;    // Required field for creation timestamp
}

// Item form input for create/edit operations (name and id are auto-generated)
export interface ItemInput {
  length: number;
  width: number;
  height: number;
  orientation: string;
  remarks: string;
  is_fragile: boolean;
}

// Item creation input with auto-generated fields
export interface ItemCreateInput extends ItemInput {
  id: number;
  name: string;
  created_at: Date;
}

// Item format returned by Worker APIs
export interface ItemResponse {
  item_id: number;
  item_name: string;
  size: string;         // Formatted size string
  direction: string;    // API field name
  note: string;         // API field name
  is_fragile: boolean;
}

// Container dimensions
export interface Container {
  length: number;
  width: number;
  height: number;
}

// Container input for API
export interface ContainerInput {
  length: number;
  width: number;
  height: number;
  label?: string;       // Optional container label
}

// API Response types for backend communication
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Item API payload for backend
export interface ItemApiPayload {
  item_id: number;
  item_name: string;
  length: number;
  width: number;
  height: number;
  orientation: string;
  remarks: string;
  is_fragile: boolean;
  created_at: string;  // ISO string for API
}