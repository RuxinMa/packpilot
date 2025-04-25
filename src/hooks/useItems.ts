// src/hooks/useItems.ts
import { useState, useCallback } from 'react';
import { Item } from '../types';

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
      // For now, return empty array
      await new Promise(resolve => setTimeout(resolve, 500));
      setItems([]);
      
    } catch (err) {
      setError('Failed to fetch items');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = useCallback(async (itemData: Omit<Item, 'id'>) => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For testing, add a new item with a random ID
      const newItem: Item = {
        ...itemData,
        id: Date.now(),
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
  }, []);

  const updateItem = useCallback(async (id: number, itemData: Partial<Omit<Item, 'id'>>) => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
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

  const deleteItem = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
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

  return {
    items,
    loading,
    error,
    getItems,
    addItem,
    updateItem,
    deleteItem
  };
};