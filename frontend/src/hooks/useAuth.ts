import { useState, useEffect } from 'react';
import { Item, ItemFormData, UseItemsReturn } from '../types';
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
      console.log('Loaded items from localStorage:', items); // Debug log
      // Ensure is_fragile is properly converted to boolean
      return items.map((item: any) => ({
        ...item,
        is_fragile: item.is_fragile === true || item.is_fragile === 'true' || item.is_fragile === 'yes',
        createdAt: new Date(item.createdAt)
      }));
    }
    
    // Initialize with mock data
    const initialMockItems = mockItems.map(item => ({
      ...item,
      is_fragile: (item as any).is_fragile || false // Ensure is_fragile exists
    }));
    localStorage.setItem('warehouse_items', JSON.stringify(initialMockItems));
    return initialMockItems;
  },

  // Add new item
  addItem: async (itemData: ItemFormData): Promise<{ success: boolean; item: Item; message?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log('Adding item to service:', itemData); // Debug log
    console.log('itemData.is_fragile:', itemData.is_fragile, typeof itemData.is_fragile); // Debug log
    
    const storedItems = localStorage.getItem('warehouse_items');
    const items = storedItems ? JSON.parse(storedItems) : mockItems;
    
    // FIXED: Ensure is_fragile is properly handled
    const newItem: Item = {
      id: Math.max(...items.map((item: Item) => item.id), 0) + 1,
      length: itemData.length,
      width: itemData.width,
      height: itemData.height,
      direction: itemData.direction || '',
      notes: itemData.notes || '',
      is_fragile: Boolean(itemData.is_fragile), // Ensure it's always a boolean
      createdAt: new Date()
    };
    
    console.log('Created new item:', newItem); // Debug log
    console.log('Created new item with is_fragile:', newItem.is_fragile, typeof newItem.is_fragile); // Debug log
    
    const updatedItems = [...items, newItem];
    localStorage.setItem('warehouse_items', JSON.stringify(updatedItems));
    console.log('Saved to localStorage, checking...'); // Debug log
    
    // Verify what was actually saved
    const saved = JSON.parse(localStorage.getItem('warehouse_items') || '[]');
    const lastItem = saved[saved.length - 1];
    console.log('Last item saved to localStorage:', lastItem); // Debug log
    console.log('Last item is_fragile:', lastItem.is_fragile, typeof lastItem.is_fragile); // Debug log
    
    return { success: true, item: newItem, message: 'Item added successfully' };
  },

  // Update existing item
  updateItem: async (id: number, itemData: Partial<ItemFormData>): Promise<{ success: boolean; message?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const storedItems = localStorage.getItem('warehouse_items');
    const items = storedItems ? JSON.parse(storedItems) : mockItems;
    
    const itemIndex = items.findIndex((item: Item) => item.id === id);
    if (itemIndex === -1) {
      return { success: false, message: 'Item not found' };
    }
    
    // FIXED: Ensure is_fragile is properly handled in updates
    const updatedItemData = { ...itemData };
    if ('is_fragile' in updatedItemData) {
      updatedItemData.is_fragile = Boolean(updatedItemData.is_fragile);
    }
    
    items[itemIndex] = { ...items[itemIndex], ...updatedItemData };
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
      console.log('Refreshed items:', itemsData); // Debug log
      setItems(itemsData);
    } catch (err) {
      setError('Failed to load items');
      console.error('Error loading items:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add new item
  const addItem = async (itemData: ItemFormData) => {
    setLoading(true);
    setError(null);
    
    console.log('useItems addItem called with:', itemData); // Debug log
    
    try {
      const response = await itemService.addItem(itemData);
      if (response.success) {
        console.log('Item added successfully, updating state with:', response.item); // Debug log
        setItems(prevItems => {
          const newItems = [...prevItems, response.item];
          console.log('New items state:', newItems); // Debug log
          return newItems;
        });
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
  const updateItem = async (id: number, itemData: Partial<ItemFormData>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await itemService.updateItem(id, itemData);
      if (response.success) {
        setItems(prevItems => 
          prevItems.map(item => {
            if (item.id === id) {
              const updatedItem = { ...item, ...itemData };
              // FIXED: Ensure is_fragile is properly handled
              if ('is_fragile' in itemData) {
                updatedItem.is_fragile = Boolean(itemData.is_fragile);
              }
              return updatedItem;
            }
            return item;
          })
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