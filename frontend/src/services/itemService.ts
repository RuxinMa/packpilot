// src/services/itemService.ts
import { Item, ItemInput, ItemApiPayload } from '../types';
import { authService } from './authService';

// Extended ItemInput interface to include frontend-generated name
interface ItemInputWithName extends ItemInput {
  name: string;
}

// API config
const API_BASE_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Helper function to get auth token
const getAuthHeaders = () => {
  return {
    'Content-Type': 'application/json',
    ...authService.getAuthHeader(),
  };
};

// Utility functions for ID generation
export const generateItemId = (): number => {
  // Generate backend-style sequential ID: 6-8 digits
  const timestamp = Date.now();
  const lastSixDigits = timestamp % 1000000; // Get last 6 digits
  const randomSuffix = Math.floor(Math.random() * 100); // Add 2 random digits
  return lastSixDigits * 100 + randomSuffix;
};

// Frontend name generation utility
export const generateItemName = (): string => {
  const count = parseInt(localStorage.getItem('item_counter') || '0') + 1;
  localStorage.setItem('item_counter', count.toString());
  
  let paddedCount: string;
  if (count < 1000) {
    paddedCount = count.toString().padStart(3, '0');
  } else {
    paddedCount = count.toString();
  }
  
  return `ITEM-${paddedCount}`;
};

// Data transformation utilities
export const itemToApiPayload = (item: Item): ItemApiPayload => ({
  item_id: item.id,
  item_name: item.name,
  length: item.length,
  width: item.width,
  height: item.height,
  orientation: item.orientation,
  remarks: item.remarks,
  is_fragile: item.is_fragile,
  created_at: item.created_at.toISOString()
});

export const apiPayloadToItem = (payload: ItemApiPayload): Item => ({
  id: payload.item_id,
  name: payload.item_name,
  length: payload.length,
  width: payload.width,
  height: payload.height,
  orientation: payload.orientation,
  remarks: payload.remarks,
  is_fragile: payload.is_fragile,
  created_at: new Date(payload.created_at)
});

// Data transformation: backend format -> frontend format
const backendToFrontend = (backendItem: any): Item => ({
  id: backendItem.item_id,           // backend item_id -> frontend id
  name: backendItem.item_name,       // backend item_name -> frontend name
  length: parseFloat(backendItem.depth || 0),  // backend depth -> frontend length
  width: parseFloat(backendItem.width || 0),
  height: parseFloat(backendItem.height || 0),
  orientation: backendItem.orientation || 'Face Up',
  remarks: backendItem.remarks || '',
  is_fragile: Boolean(backendItem.is_fragile),
  // 修复：正确处理创建时间
  created_at: backendItem.created_at 
    ? new Date(backendItem.created_at) 
    : backendItem.created_time 
    ? new Date(backendItem.created_time)
    : backendItem.create_time
    ? new Date(backendItem.create_time)
    : new Date() // 只有当后端完全没有时间字段时才使用当前时间
});

// Data transformation: frontend format -> backend format
const frontendToBackend = (frontendItem: ItemInput): any => ({
  width: frontendItem.width,
  height: frontendItem.height,
  depth: frontendItem.length,        // frontend length -> backend depth
  orientation: frontendItem.orientation || 'Face Up',
  remarks: frontendItem.remarks || '',
  is_fragile: Boolean(frontendItem.is_fragile)
});

// API Service class
export class ItemApiService {
  // Modify getAllItems to only fetch unassigned items by default
  static async getAllItems(): Promise<Item[]> {
    try {
      // Only fetch unassigned items for manager page
      const response = await fetch(`${API_BASE_URL}/api/manager/get_items?assigned=false`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Backend response:', data); // 调试日志：查看后端返回的数据结构
        return (data.items || []).map(backendToFrontend);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch items');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  }

  // Add getItems as an alias for getAllItems to support legacy code
  static async getItems(): Promise<Item[]> {
    return this.getAllItems();
  }

  // Add new item
  static async addItem(itemData: ItemInput): Promise<{ success: boolean; item: Item; message?: string }> {
    try {
      const backendPayload = frontendToBackend(itemData);
      
      const response = await fetch(`${API_BASE_URL}/api/manager/add_item`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(backendPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Add item response:', data); 
      
      if (data.status === 'success') {
        if (data.item) {
          const newItem = backendToFrontend(data.item);
          return {
            success: true,
            item: newItem,
            message: data.message || 'Item added successfully'
          };
        } else {
          const newItem: Item = {
            id: data.item_id,           // use backend returned ID
            name: data.item_name,       // use backend generated name
            length: itemData.length,
            width: itemData.width,
            height: itemData.height,
            orientation: itemData.orientation || 'Face Up',
            remarks: itemData.remarks || '',
            is_fragile: itemData.is_fragile,
            // Using the created time returned by the backend
            created_at: data.created_at 
              ? new Date(data.created_at)
              : data.created_time
              ? new Date(data.created_time)
              : data.create_time
              ? new Date(data.create_time)
              : new Date() // backup
          };
          
          return {
            success: true,
            item: newItem,
            message: data.message || 'Item added successfully'
          };
        }
      } else {
        throw new Error(data.message || 'Failed to add item');
      }
    } catch (error) {
      console.error('Error adding item:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to add item'
      };
    }
  }

  // Update existing item
  static async updateItem(id: number, itemData: Partial<ItemInput>): Promise<{ success: boolean; message?: string }> {
    try {
      const backendPayload = frontendToBackend(itemData as ItemInput);
      
      const response = await fetch(`${API_BASE_URL}/api/manager/update_item/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(backendPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        return {
          success: true,
          message: data.message || 'Item updated successfully'
        };
      } else {
        throw new Error(data.message || 'Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update item'
      };
    }
  }

  // Delete item
  static async deleteItem(id: number): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/manager/delete_item/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        return {
          success: true,
          message: data.message || 'Item deleted successfully'
        };
      } else {
        throw new Error(data.message || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete item'
      };
    }
  }

  // Batch delete items
  static async batchDeleteItems(ids: number[]): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/manager/batch_delete_items`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ item_ids: ids }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        return {
          success: true,
          message: data.message || `Successfully deleted ${ids.length} items`
        };
      } else {
        throw new Error(data.message || 'Failed to delete items');
      }
    } catch (error) {
      console.error('Error batch deleting items:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete items'
      };
    }
  }
}