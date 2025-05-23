import { useState, useEffect } from 'react';
import { Item, ItemInput } from '../types';
import { mockItems } from '../mocks/dataManager';

// Mock API service - replace with real API calls later
const itemService = {
  // Get all items
  getItems: async (): Promise<Item[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get items from localStorage or use mock data
    const storedItems = localStorage.getItem('warehouse_items');
    if (storedItems) {
      const items = JSON.parse(storedItems);
      // Ensure data consistency and convert dates
      return items.map((item: any) => ({
        ...item,
        is_fragile: item.is_fragile === true || item.is_fragile === 'true' || item.is_fragile === 'yes',
        created_at: item.created_at ? new Date(item.created_at) : undefined
      }));
    }
    
    // Initialize with mock data
    localStorage.setItem('warehouse_items', JSON.stringify(mockItems));
    return mockItems;
  },

  // Add new item
  addItem: async (itemData: ItemInput): Promise<{ success: boolean; item: Item; message?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const storedItems = localStorage.getItem('warehouse_items');
    const items = storedItems ? JSON.parse(storedItems) : mockItems;
    
    const newItem: Item = {
      id: Math.max(...items.map((item: Item) => item.id), 0) + 1,
      length: itemData.length,
      width: itemData.width,
      height: itemData.height,
      orientation: itemData.orientation || '',
      remarks: itemData.remarks || '',
      is_fragile: Boolean(itemData.is_fragile),
      created_at: new Date()
    };
    
    const updatedItems = [...items, newItem];
    localStorage.setItem('warehouse_items', JSON.stringify(updatedItems));
    
    return { success: true, item: newItem, message: 'Item added successfully' };
  },

  // Update existing item
  updateItem: async (id: number, itemData: Partial<ItemInput>): Promise<{ success: boolean; message?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const storedItems = localStorage.getItem('warehouse_items');
    const items = storedItems ? JSON.parse(storedItems) : mockItems;
    
    const itemIndex = items.findIndex((item: Item) => item.id === id);
    if (itemIndex === -1) {
      return { success: false, message: 'Item not found' };
    }
    
    items[itemIndex] = { ...items[itemIndex], ...itemData };
    localStorage.setItem('warehouse_items', JSON.stringify(items));
    
    return { success: true, message: 'Item updated successfully' };
  },

  // Delete item
  deleteItem: async (id: number): Promise<{ success: boolean; message?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const storedItems = localStorage.getItem('warehouse_items');
    const items = storedItems ? JSON.parse(storedItems) : mockItems;
    
    const filteredItems = items.filter((item: Item) => item.id !== id);
    localStorage.setItem('warehouse_items', JSON.stringify(filteredItems));
    
    return { success: true, message: 'Item deleted successfully' };
  }
};

// Hook return interface
interface UseItemsReturn {
  items: Item[];
  loading: boolean;
  error: string | null;
  addItem: (itemData: ItemInput) => Promise<{ success: boolean; message?: string }>;
  updateItem: (id: number, itemData: Partial<ItemInput>) => Promise<{ success: boolean; message?: string }>;
  deleteItem: (id: number) => Promise<{ success: boolean; message?: string }>;
  refreshItems: () => Promise<void>;
}

export const useItems = (): UseItemsReturn => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load items on component mount
  const refreshItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const itemsData = await itemService.getItems();
      setItems(itemsData);
    } catch (err) {
      setError('Failed to load items');
      console.error('Error loading items:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add new item
  const addItem = async (itemData: ItemInput) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await itemService.addItem(itemData);
      if (response.success) {
        setItems(prevItems => [...prevItems, response.item]);
        return { success: true, message: response.message };
      } else {
        setError(response.message || 'Failed to add item');
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = 'Failed to add item';
      setError(errorMessage);
      console.error('Error adding item:', err);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update existing item
  const updateItem = async (id: number, itemData: Partial<ItemInput>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await itemService.updateItem(id, itemData);
      if (response.success) {
        setItems(prevItems => 
          prevItems.map(item => 
            item.id === id ? { ...item, ...itemData } : item
          )
        );
        return { success: true, message: response.message };
      } else {
        setError(response.message || 'Failed to update item');
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = 'Failed to update item';
      setError(errorMessage);
      console.error('Error updating item:', err);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Delete item
  const deleteItem = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await itemService.deleteItem(id);
      if (response.success) {
        setItems(prevItems => prevItems.filter(item => item.id !== id));
        return { success: true, message: response.message };
      } else {
        setError(response.message || 'Failed to delete item');
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = 'Failed to delete item';
      setError(errorMessage);
      console.error('Error deleting item:', err);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshItems();
  }, []);

  return {
    items,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    refreshItems
  };
};