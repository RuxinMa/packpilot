// src/contexts/ItemContext.tsx
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Item, ItemInput } from '../types';
import { ItemApiService, generateItemName } from '../services/itemService';
import { authService } from '../services/authService';

// Context state interface
interface ItemState {
  items: Item[];
  loading: boolean;
  error: string | null;
  selectedItems: number[];
  selectionMode: boolean;
}

// Context actions
type ItemAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ITEMS'; payload: Item[] }
  | { type: 'ADD_ITEM'; payload: Item }
  | { type: 'UPDATE_ITEM'; payload: { id: number; data: Partial<Item> } }
  | { type: 'DELETE_ITEM'; payload: number }
  | { type: 'DELETE_ITEMS'; payload: number[] }
  | { type: 'SET_SELECTION_MODE'; payload: boolean }
  | { type: 'SET_SELECTED_ITEMS'; payload: number[] }
  | { type: 'TOGGLE_ITEM_SELECTION'; payload: number }
  | { type: 'SELECT_ALL_ITEMS' }
  | { type: 'CLEAR_SELECTION' };

// Context methods interface
interface ItemContextType extends ItemState {
  // Data operations
  refreshItems: () => Promise<void>;
  addItem: (itemData: ItemInput) => Promise<{ success: boolean; message?: string; item?: Item }>;
  updateItem: (id: number, itemData: Partial<ItemInput>) => Promise<{ success: boolean; message?: string }>;
  deleteItem: (id: number) => Promise<{ success: boolean; message?: string }>;
  batchDeleteItems: (ids: number[]) => Promise<{ success: boolean; message?: string }>;
  
  // Selection operations
  startSelection: () => void;
  toggleItemSelection: (itemId: number) => void;
  selectAllItems: () => void;
  clearSelection: () => void;
  clearSelectionMode: () => void;
  
  // Utility functions
  generatePreviewName: () => string;
  getSelectedItemsDetails: () => Item[];
}

// Initial state
const initialState: ItemState = {
  items: [],
  loading: false,
  error: null,
  selectedItems: [],
  selectionMode: false,
};

// Reducer function
const itemReducer = (state: ItemState, action: ItemAction): ItemState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_ITEMS':
      return { ...state, items: action.payload };
    
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        ),
      };
    
    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        selectedItems: state.selectedItems.filter(id => id !== action.payload),
      };
    
    case 'DELETE_ITEMS':
      return {
        ...state,
        items: state.items.filter(item => !action.payload.includes(item.id)),
        selectedItems: [],
        selectionMode: false,
      };
    
    case 'SET_SELECTION_MODE':
      return { 
        ...state, 
        selectionMode: action.payload,
        selectedItems: action.payload ? state.selectedItems : []
      };
    
    case 'SET_SELECTED_ITEMS':
      return { ...state, selectedItems: action.payload };
    
    case 'TOGGLE_ITEM_SELECTION':
      const itemId = action.payload;
      const isSelected = state.selectedItems.includes(itemId);
      return {
        ...state,
        selectedItems: isSelected
          ? state.selectedItems.filter(id => id !== itemId)
          : [...state.selectedItems, itemId],
      };
    
    case 'SELECT_ALL_ITEMS':
      return {
        ...state,
        selectedItems: state.items.map(item => item.id),
      };
    
    case 'CLEAR_SELECTION':
      return { ...state, selectedItems: [] };
    
    default:
      return state;
  }
};

// Create context
const ItemContext = createContext<ItemContextType | undefined>(undefined);

// Context provider component
interface ItemProviderProps {
  children: ReactNode;
}

export const ItemProvider: React.FC<ItemProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(itemReducer, initialState);

  // Data operations
  const refreshItems = async () => {
    // Check authentication status before making API calls
    if (!authService.isAuthenticated()) {
      console.log('ItemContext: Not authenticated, skipping refresh');
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const items = await ItemApiService.getItems();
      dispatch({ type: 'SET_ITEMS', payload: items });
    } catch (error) {
      const errorMessage = 'Failed to load items';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error loading items:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addItem = async (itemData: ItemInput) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const response = await ItemApiService.addItem(itemData);
      if (response.success) {
        dispatch({ type: 'ADD_ITEM', payload: response.item });
        return { success: true, message: response.message, item: response.item };
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to add item' });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = 'Failed to add item';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error adding item:', error);
      return { success: false, message: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateItem = async (id: number, itemData: Partial<ItemInput>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const response = await ItemApiService.updateItem(id, itemData);
      if (response.success) {
        dispatch({ type: 'UPDATE_ITEM', payload: { id, data: itemData } });
        return { success: true, message: response.message };
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to update item' });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = 'Failed to update item';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error updating item:', error);
      return { success: false, message: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteItem = async (id: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const response = await ItemApiService.deleteItem(id);
      if (response.success) {
        dispatch({ type: 'DELETE_ITEM', payload: id });
        return { success: true, message: response.message };
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to delete item' });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = 'Failed to delete item';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error deleting item:', error);
      return { success: false, message: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const batchDeleteItems = async (ids: number[]) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const response = await ItemApiService.batchDeleteItems(ids);
      if (response.success) {
        dispatch({ type: 'DELETE_ITEMS', payload: ids });
        return { success: true, message: response.message };
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to delete items' });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = 'Failed to delete items';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error deleting items:', error);
      return { success: false, message: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Selection operations
  const startSelection = () => {
    dispatch({ type: 'SET_SELECTION_MODE', payload: true });
    dispatch({ type: 'CLEAR_SELECTION' });
  };

  const toggleItemSelection = (itemId: number) => {
    dispatch({ type: 'TOGGLE_ITEM_SELECTION', payload: itemId });
  };

  const selectAllItems = () => {
    dispatch({ type: 'SELECT_ALL_ITEMS' });
  };

  const clearSelection = () => {
    dispatch({ type: 'CLEAR_SELECTION' });
  };

  const clearSelectionMode = () => {
    dispatch({ type: 'SET_SELECTION_MODE', payload: false });
  };

  // Utility functions
  const generatePreviewName = () => {
    return generateItemName();
  };

  const getSelectedItemsDetails = () => {
    return state.items.filter(item => state.selectedItems.includes(item.id));
  };

  // Load items on mount - wait for authentication
  useEffect(() => {
    const loadInitialData = () => {
      // Check authentication status
      if (!authService.isAuthenticated()) {
        console.log('ItemContext: Not authenticated, skipping initial load');
        return;
      }
      
      console.log('ItemContext: Loading initial items...');
      refreshItems();
    };

    // Check immediately
    loadInitialData();
    
    // Listen for storage changes to detect auth state changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        console.log('ItemContext: Auth token changed, reloading items');
        loadInitialData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const value: ItemContextType = {
    ...state,
    refreshItems,
    addItem,
    updateItem,
    deleteItem,
    batchDeleteItems,
    startSelection,
    toggleItemSelection,
    selectAllItems,
    clearSelection,
    clearSelectionMode,
    generatePreviewName,
    getSelectedItemsDetails,
  };

  return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;
};

// Custom hook to use the context
export const useItemContext = () => {
  const context = useContext(ItemContext);
  if (context === undefined) {
    throw new Error('useItemContext must be used within an ItemProvider');
  }
  return context;
};