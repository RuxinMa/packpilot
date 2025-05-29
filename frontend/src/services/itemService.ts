// src/services/itemService.ts
import { useState, useCallback, useEffect } from 'react';
import { mockItems } from '../mocks/ManagerDashboard';


export interface Item {
  id: number;
  length: number;
  width: number;
  height: number;
  direction: string;
  notes: string;
  createdAt: Date;
}

interface UseItemsReturn {
  items: Item[];
  addItem: (item: Omit<Item, 'id' | 'createdAt'>) => Promise<Item>;
  updateItem: (id: number, updates: Partial<Omit<Item, 'id'>>) => Promise<Item | null>;
  deleteItem: (id: number) => Promise<boolean>;
  refreshItems: () => void;
}

// Simulate a stored items array
let storedItems: Item[] = [...mockItems];
// Track the last used ID to ensure sequential ID generation
let lastItemId = Math.max(...storedItems.map(i => i.id), 0);

export const useItems = (): UseItemsReturn => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    setItems([...storedItems]);
  }, []);

  // Add a new item with an auto-incremented ID
  const addItem = useCallback(async (itemData: Omit<Item, 'id' | 'createdAt'>): Promise<Item> => {
    // Increment the last ID
    lastItemId += 1;
    
    const newItem: Item = {
      ...itemData,
      id: lastItemId,
      createdAt: new Date(),
    };
    
    // Store the new item
    storedItems = [...storedItems, newItem];
    
    // Update the state
    setItems([...storedItems]);
    
    // Return the new item (simulating an API response)
    return Promise.resolve(newItem);
  }, []);

  // Update an existing item
  const updateItem = useCallback(async (id: number, updates: Partial<Omit<Item, 'id'>>): Promise<Item | null> => {
    const itemIndex = storedItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return Promise.resolve(null);
    }
    
    // Update the item
    const updatedItem: Item = {
      ...storedItems[itemIndex],
      ...updates,
    };
    
    // Replace the old item with the updated one
    storedItems = [
      ...storedItems.slice(0, itemIndex),
      updatedItem,
      ...storedItems.slice(itemIndex + 1),
    ];
    
    // Update the state
    setItems([...storedItems]);
    
    // Return the updated item (simulating an API response)
    return Promise.resolve(updatedItem);    
  }, []);

// Delete an existing item by ID
const deleteItem = useCallback(async (id: number): Promise<boolean> => {
  const itemIndex = storedItems.findIndex(item => item.id === id);

  // Return false if item not found
  if (itemIndex === -1) return Promise.resolve(false);

  // Remove the item from the stored array
  storedItems = storedItems.filter(item => item.id !== id);

  // Update the state
  setItems([...storedItems]);

  // Return true to indicate successful deletion
  return Promise.resolve(true);
}, []);

const refreshItems = () => {
  setItems([...storedItems]);
};

  return {
    items,
    addItem,
    updateItem,
    deleteItem,
    refreshItems,
  };
};