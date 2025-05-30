// src/types/item.ts

// Item as used internally in the application
export interface Item {
  id: number;
  name?: string;
  length: number;
  width: number;
  height: number;
  orientation: string;
  remarks: string;
  is_fragile: boolean;
  created_at?: Date;
}

// Item form input for create/edit operations
export interface ItemInput {
  length: number;
  width: number;
  height: number;
  orientation: string;
  remarks: string;
  is_fragile: boolean;
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