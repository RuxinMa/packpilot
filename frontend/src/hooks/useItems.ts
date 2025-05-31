import { useState, useEffect } from 'react';
import { Item, ItemInput } from '../types';
import { ItemApiService } from '../services/itemService';

// Extended ItemInput interface to include frontend-generated name
interface ItemInputWithName extends ItemInput {
  name: string;
}

// Hook return interface
interface UseItemsReturn {
  items: Item[];
  loading: boolean;
  error: string | null;
  addItem: (itemData: ItemInputWithName) => Promise<{ success: boolean; item?: Item; message?: string }>;
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
      const itemsData = await ItemApiService.getItems();
      setItems(itemsData);
    } catch (err) {
      setError('Failed to load items');
      console.error('Error loading items:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add new item - accepts frontend-generated name
  const addItem = async (itemData: ItemInputWithName) => {
    setLoading(true);
    setError(null);
    
    try {
      // Pass the frontend-generated name to the service
      const response = await ItemApiService.addItemWithName(itemData);
      if (response.success) {
        // Update local state with the backend-returned item (includes backend-generated ID)
        setItems(prevItems => [...prevItems, response.item]);
        return { 
          success: true, 
          item: response.item, 
          message: response.message 
        };
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
      const response = await ItemApiService.updateItem(id, itemData);
      if (response.success) {
        // Update local state optimistically
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
      const response = await ItemApiService.deleteItem(id);
      if (response.success) {
        // Update local state by removing the deleted item
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