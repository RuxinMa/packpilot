// src/hooks/useItems.ts
import { useState, useCallback } from 'react';
import { Item, ItemInput } from '../types';

// Mock data for development
const mockItems: Item[] = [
  {
    id: 1,
    name: 'Item0023',
    length: 40.4,
    width: 52.3,
    height: 40.0,
    orientation: 'face_up',
    remarks: 'Fragile'
  },
  {
    id: 2,
    name: 'Item0024',
    length: 30.0,
    width: 20.0,
    height: 15.5,
    orientation: 'side_a',
    remarks: 'Heavy'
  }
];

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all items
  const getItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch('/api/items');
      // const data = await response.json();
      // setItems(data.items);
      
      // For now, use mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      setItems(mockItems);
      
    } catch (err) {
      setError('Failed to fetch items');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new item
  const addItem = useCallback(async (itemData: ItemInput): Promise<number | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch('/api/manager/add_item', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(itemData),
      // });
      // const data = await response.json();
      // return data.item_id || null;
      
      // For development, simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newItem: Item = {
        ...itemData,
        id: Math.max(0, ...items.map(item => item.id)) + 1,
        name: `Item${Math.floor(1000 + Math.random() * 9000)}`
      };
      
      setItems(prevItems => [...prevItems, newItem]);
      return newItem.id;
      
    } catch (err) {
      setError('Failed to add item');
      console.error('Error adding item:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [items]);

  // Update an existing item
  const updateItem = useCallback(async (id: number, itemData: Partial<ItemInput>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch(`/api/manager/edit_item/${id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(itemData),
      // });
      // const data = await response.json();
      // return data.status === 'success';
      
      // For development, simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, ...itemData } : item
        )
      );
      
      return true;
      
    } catch (err) {
      setError('Failed to update item');
      console.error('Error updating item:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete an item
  const deleteItem = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch(`/api/manager/delete_item/${id}`, {
      //   method: 'DELETE',
      // });
      // const data = await response.json();
      // return data.status === 'success';
      
      // For development, simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setItems(prevItems => prevItems.filter(item => item.id !== id));
      
      return true;
      
    } catch (err) {
      setError('Failed to delete item');
      console.error('Error deleting item:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a single item by ID
  const getItemById = useCallback((id: number): Item | undefined => {
    return items.find(item => item.id === id);
  }, [items]);

  // Format item dimensions as a string (e.g., "40.4 × 52.3 × 40.0")
  const formatItemSize = useCallback((item: Item): string => {
    return `${item.length.toFixed(1)} × ${item.width.toFixed(1)} × ${item.height.toFixed(1)}`;
  }, []);

  // Convert API ItemResponse to internal Item type
  const convertApiItemToItem = useCallback((apiItem: { item_id: number, item_name: string, size: string, direction: string, note: string }): Item => {
    // Parse the size string (e.g., "40.4 × 52.3 × 40.0") into dimensions
    const dimensions = apiItem.size.split('×').map(dim => parseFloat(dim.trim()));
    
    return {
      id: apiItem.item_id,
      name: apiItem.item_name,
      length: dimensions[0] || 0,
      width: dimensions[1] || 0, 
      height: dimensions[2] || 0,
      orientation: apiItem.direction,
      remarks: apiItem.note
    };
  }, []);

  return {
    items,
    loading,
    error,
    getItems,
    addItem,
    updateItem,
    deleteItem,
    getItemById,
    formatItemSize,
    convertApiItemToItem
  };
};