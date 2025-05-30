// src/services/itemService.ts
import { Item, ItemInput, ItemApiPayload, ApiResponse } from '../types';
import { mockItems } from '../mocks/dataManager';

// Utility functions for ID and name generation
export const generateItemId = (): number => {
  // Generate shorter sequential ID: 6-8 digits
  const timestamp = Date.now();
  const lastSixDigits = timestamp % 1000000; // Get last 6 digits
  const randomSuffix = Math.floor(Math.random() * 100); // Add 2 random digits
  return lastSixDigits * 100 + randomSuffix;
};

export const generateItemName = (): string => {
  // Generate adaptive sequential name with dynamic padding
  // ITEM-001 → ITEM-999 → ITEM-1000 → ITEM-9999 → ITEM-10000
  const count = parseInt(localStorage.getItem('item_counter') || '0') + 1;
  localStorage.setItem('item_counter', count.toString());
  
  // Dynamic padding based on number length
  let paddedCount: string;
  if (count < 1000) {
    // 1-999: 3 digits with leading zeros (ITEM-001, ITEM-002, ..., ITEM-999)
    paddedCount = count.toString().padStart(3, '0');
  } else {
    // 1000+: No padding, just the number (ITEM-1000, ITEM-1001, ...)
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

// API Service class
export class ItemApiService {
  // Get all items
  static async getItems(): Promise<Item[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const storedItems = localStorage.getItem('warehouse_items');
    if (storedItems) {
      const items = JSON.parse(storedItems);
      return items.map((item: any) => ({
        ...item,
        is_fragile: item.is_fragile === true || item.is_fragile === 'true' || item.is_fragile === 'yes',
        created_at: item.created_at ? new Date(item.created_at) : new Date(),
        name: item.name || `ITEM-${item.id}`
      }));
    }
    
    const itemsWithNames = mockItems.map(item => ({
      ...item,
      name: item.name || generateItemName(),
      created_at: item.created_at || new Date()
    }));
    localStorage.setItem('warehouse_items', JSON.stringify(itemsWithNames));
    return itemsWithNames;
  }

  // Add new item
  static async addItem(itemData: ItemInput): Promise<{ success: boolean; item: Item; message?: string }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const storedItems = localStorage.getItem('warehouse_items');
    const items = storedItems ? JSON.parse(storedItems) : [];
    
    const newId = generateItemId();
    const newName = generateItemName();
    const createdAt = new Date();
    
    const newItem: Item = {
      id: newId,
      name: newName,
      length: itemData.length,
      width: itemData.width,
      height: itemData.height,
      orientation: itemData.orientation || '',
      remarks: itemData.remarks || '',
      is_fragile: Boolean(itemData.is_fragile),
      created_at: createdAt
    };
    
    const updatedItems = [...items, newItem];
    localStorage.setItem('warehouse_items', JSON.stringify(updatedItems));
    
    // Sync to backend
    try {
      await this.syncToBackend('CREATE', newItem);
      console.log(`Item ${newName} (ID: ${newId}) synced to backend`);
    } catch (error) {
      console.warn('Failed to sync item to backend:', error);
    }
    
    return { success: true, item: newItem, message: `Item ${newName} added successfully` };
  }

  // Update existing item
  static async updateItem(id: number, itemData: Partial<ItemInput>): Promise<{ success: boolean; message?: string }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const storedItems = localStorage.getItem('warehouse_items');
    const items = storedItems ? JSON.parse(storedItems) : [];
    
    const itemIndex = items.findIndex((item: Item) => item.id === id);
    if (itemIndex === -1) {
      return { success: false, message: 'Item not found' };
    }
    
    const originalItem = items[itemIndex];
    const updatedItem = { 
      ...originalItem, 
      ...itemData,
      created_at: originalItem.created_at
    };
    
    items[itemIndex] = updatedItem;
    localStorage.setItem('warehouse_items', JSON.stringify(items));
    
    // Sync to backend
    try {
      await this.syncToBackend('UPDATE', updatedItem);
      console.log(`Item ${updatedItem.name} (ID: ${id}) updated in backend`);
    } catch (error) {
      console.warn('Failed to sync item update to backend:', error);
    }
    
    return { success: true, message: `Item ${updatedItem.name} updated successfully` };
  }

  // Delete item
  static async deleteItem(id: number): Promise<{ success: boolean; message?: string }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const storedItems = localStorage.getItem('warehouse_items');
    const items = storedItems ? JSON.parse(storedItems) : [];
    
    const itemToDelete = items.find((item: Item) => item.id === id);
    if (!itemToDelete) {
      return { success: false, message: 'Item not found' };
    }
    
    const filteredItems = items.filter((item: Item) => item.id !== id);
    localStorage.setItem('warehouse_items', JSON.stringify(filteredItems));
    
    // Sync to backend
    try {
      await this.syncToBackend('DELETE', itemToDelete);
      console.log(`Item ${itemToDelete.name} (ID: ${id}) deleted from backend`);
    } catch (error) {
      console.warn('Failed to sync item deletion to backend:', error);
    }
    
    return { success: true, message: `Item ${itemToDelete.name} deleted successfully` };
  }

  // Batch delete items (for task assignment)
  static async batchDeleteItems(ids: number[]): Promise<{ success: boolean; message?: string }> {
    const results = await Promise.allSettled(
      ids.map(id => this.deleteItem(id))
    );
    
    const failedDeletes = results.filter(result => 
      result.status === 'rejected' || 
      (result.status === 'fulfilled' && !result.value.success)
    );
    
    if (failedDeletes.length > 0) {
      return { 
        success: false, 
        message: `Failed to delete ${failedDeletes.length} out of ${ids.length} items` 
      };
    }
    
    return { 
      success: true, 
      message: `Successfully deleted ${ids.length} items` 
    };
  }

  // Sync operations to backend
  private static async syncToBackend(operation: 'CREATE' | 'UPDATE' | 'DELETE', item: Item): Promise<ApiResponse> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const payload = itemToApiPayload(item);
    
    switch (operation) {
      case 'CREATE':
        console.log('POST /api/items', payload);
        // Real API call: await fetch('/api/items', { method: 'POST', body: JSON.stringify(payload) })
        break;
      case 'UPDATE':
        console.log(`PUT /api/items/${item.id}`, payload);
        // Real API call: await fetch(`/api/items/${item.id}`, { method: 'PUT', body: JSON.stringify(payload) })
        break;
      case 'DELETE':
        console.log(`DELETE /api/items/${item.id}`);
        // Real API call: await fetch(`/api/items/${item.id}`, { method: 'DELETE' })
        break;
    }
    
    // Simulate random API failures (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Backend sync failed');
    }
    
    return { success: true, message: `${operation} operation synced successfully` };
  }
}