import React, { useState } from 'react';
// import { useItems } from '../../services/itemService';

// Import components
import Header from '../../components/common/Header';
import AddItem from '../../components/manager/AddItem';
import EditItem from '../../components/manager/EditItem';
import DeleteItem from '../../components/manager/DeleteItem';
import AssignTask from '../../components/manager/AssignTask';
import TaskHistory from '../../components/manager/TaskHistory';
import ItemList from '../../components/manager/ItemList';
import UserLog from '../../components/common/UserLog';

// Mock data for testing
const mockItems = [
  { 
    id: 1, 
    length: 50, 
    width: 30, 
    height: 20, 
    direction: 'Face up', 
    notes: 'Fragile item', 
    createdAt: new Date('2025-05-01T10:30:00')
  },
  { 
    id: 2, 
    length: 100, 
    width: 45, 
    height: 35, 
    direction: 'Face down', 
    notes: 'Heavy box', 
    createdAt: new Date('2025-05-03T14:15:00')
  },
  { 
    id: 3, 
    length: 75, 
    width: 60, 
    height: 40, 
    direction: 'Side A', 
    notes: '', 
    createdAt: new Date('2025-05-05T09:45:00')
  },
  { 
    id: 4, 
    length: 120, 
    width: 80, 
    height: 50, 
    direction: 'Side B', 
    notes: '', 
    createdAt: new Date('2025-05-07T16:20:00')
  },
  { 
    id: 5, 
    length: 90, 
    width: 65, 
    height: 45, 
    direction: 'Face up', 
    notes: 'Kitchen appliance', 
    createdAt: new Date('2025-05-08T11:10:00')
  }
];

const ManagerDashboardPage: React.FC = () => {
  // State for controlling modals
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  
  // State for items selection mode
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  // Hooks for data fetching (using mock data for now)
  // const { getItems, items } = useItems();
  const [items, setItems] = useState(mockItems);
  
  // Load items on component mount
  // useEffect(() => {
  //   getItems();
  // }, [getItems]);
  
  // Handler functions
  const handleEditItem = (itemId: number) => {
    setSelectedItemId(itemId);
    setOpenModal('editItem');
  };
  
  const handleDeleteItem = (itemId: number) => {
    setSelectedItemId(itemId);
    setOpenModal('deleteItem');
  };
  
  const handleRefreshItems = () => {
    // In a real app, we would refresh from API
    console.log('Refreshing items');
  };

  // MODIFIED: Handle item added with proper item data
  const handleItemAdded = (newItemData: any) => {
    // In a real app, we would refresh the items from API
    // For mock testing, create a new item with the submitted data
    const newItem = { 
      id: Math.max(...items.map(item => item.id), 0) + 1, // Generate a unique ID
      length: newItemData.length,
      width: newItemData.width,
      height: newItemData.height, 
      direction: newItemData.direction,
      notes: newItemData.notes || '',
      createdAt: new Date()
    };
    
    setItems([...items, newItem]);
  };

  const handleItemUpdated = () => {
    // In a real app, we would refresh the items
    console.log('Item updated');
  };

  const handleItemDeleted = () => {
    // In a real app, we would refresh the items
    // For mock testing, let's remove the item
    if (selectedItemId) {
      setItems(items.filter(item => item.id !== selectedItemId));
    }
  };

  const handleStartAssignTask = () => {
    setSelectionMode(true);
    setSelectedItems([]);
  };

  const handleToggleItemSelection = (itemId: number) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleContinueSelection = () => {
    setOpenModal('assignTask');
  };

  const handleClearSelection = () => {
    setSelectionMode(false);
    setSelectedItems([]);
  };

  const handleTaskAssigned = () => {
    // Remove assigned items from the list
    setItems(items.filter(item => !selectedItems.includes(item.id)));
    setSelectionMode(false);
    setSelectedItems([]);
  };

  const handleLogout = () => {
    // Implement actual logout logic here
    console.log('User logged out');
    // Redirect to login page
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header title="Warehouse Manager Dashboard" viewType="Manager" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex h-[calc(100vh-160px)]">
          
          {/* Left Sidebar - Control Panel */}
          <div className="w-64 bg-white shadow-md rounded-lg flex-shrink-0 border border-gray-200 flex flex-col py-4">

            {/* Action buttons */}
            <div className="p-6 flex-auto">
              <div className="space-y-6">
                <button 
                  onClick={() => setOpenModal('addItem')}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
                  disabled={selectionMode}
                >
                  Add Item
                </button>
                {selectionMode ? (
                  <button 
                    onClick={handleClearSelection}
                    className="w-full py-3 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center justify-center"
                  >
                    Cancel Selection
                  </button>
                ) : (
                  <button 
                    onClick={handleStartAssignTask}
                    className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
                  >
                    Assign Task
                  </button>
                )}
                <button 
                  onClick={() => setOpenModal('taskHistory')}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
                  disabled={selectionMode}
                >
                  Task History
                </button>
              </div>
            </div>
            
            {/* User log */}
            <UserLog userType="Manager" onLogout={handleLogout}/>
          </div>
          
          {/* Right Content - Item List */}
          <div className="flex flex-col flex-1 bg-white shadow-md rounded-lg ml-6 border border-gray-200">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-800">
                {selectionMode ? 'Select Items for Task' : 'Item Inventory'}
              </h2>
            </div>
            <div className="flex-1 p-6 overflow-auto">
              <ItemList 
                items={items} 
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                onRefresh={handleRefreshItems}
                selectionMode={selectionMode}
                selectedItems={selectedItems}
                onToggleItemSelection={handleToggleItemSelection}
                onContinueSelection={handleContinueSelection}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal components */}
      <AddItem
        isOpen={openModal === 'addItem'}
        onClose={() => setOpenModal(null)}
        onItemAdded={handleItemAdded}
      />
      
      <EditItem
        isOpen={openModal === 'editItem'}
        onClose={() => setOpenModal(null)}
        itemId={selectedItemId}
        onItemUpdated={handleItemUpdated}
      />
      
      <AssignTask
        isOpen={openModal === 'assignTask'}
        onClose={() => setOpenModal(null)}
        selectedItems={selectedItems}
        onClearSelection={handleClearSelection}
        onTaskAssigned={handleTaskAssigned}
      />
      
      <TaskHistory
        isOpen={openModal === 'taskHistory'}
        onClose={() => setOpenModal(null)}
      />
      
      <DeleteItem
        isOpen={openModal === 'deleteItem'}
        onClose={() => setOpenModal(null)}
        itemId={selectedItemId}
        onItemDeleted={handleItemDeleted}
      />
    </div>
  );
};

export default ManagerDashboardPage;