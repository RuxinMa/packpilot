import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { ItemInput, TaskInput } from '../../types';

// Import components
import Header from '../../components/common/Header';
import AddItem from '../../components/manager/AddItem';
import EditItem from '../../components/manager/EditItem';
import DeleteItem from '../../components/manager/DeleteItem';
import AssignTask from '../../components/manager/AssignTask';
import TaskHistory from '../../components/manager/TaskHistory';
import ItemList from '../../components/manager/ItemList';
import UserLog from '../../components/common/UserLog';
import Button from '../../components/common/Button';

// Import hooks
import { useItems } from '../../hooks/useItems';
import { useTasks } from '../../hooks/useTasks';

const ManagerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();
  
  // State for controlling modals
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  
  // State for items selection mode
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  // Hooks for data management
  const { 
    items, 
    loading: itemsLoading, 
    error: itemsError, 
    addItem, 
    deleteItem, 
    refreshItems 
  } = useItems();
  
  const { 
    tasks, 
    loading: tasksLoading, 
    error: tasksError, 
    assignTask, 
    refreshTasks 
  } = useTasks();

  // Handler functions
  const handleEditItem = (itemId: number) => {
    setSelectedItemId(itemId);
    setOpenModal('editItem');
  };
  
  const handleDeleteItem = (itemId: number) => {
    setSelectedItemId(itemId);
    setOpenModal('deleteItem');
  };
  
  const handleRefreshItems = async () => {
    await refreshItems();
  };

  // Handle item added with API integration
  const handleItemAdded = async (newItemData: ItemInput) => {
    console.log('Adding item with data:', newItemData); // Debug log
    const result = await addItem(newItemData);
    if (result.success) {
      console.log('Item added successfully:', result.message);
    } else {
      console.error('Failed to add item:', result.message);
    }
  };

  const handleItemUpdated = async () => {
    // Refresh items to get updated data
    await refreshItems();
    console.log('Item updated successfully');
  };

  const handleItemDeleted = async () => {
    if (selectedItemId) {
      const result = await deleteItem(selectedItemId);
      if (result.success) {
        console.log('Item deleted successfully:', result.message);
      } else {
        console.error('Failed to delete item:', result.message);
      }
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

  // New function to handle select all
  const handleSelectAll = () => {
    const allItemIds = items.map(item => item.id);
    setSelectedItems(allItemIds);
  };

  // New function to handle clear all selections
  const handleClearAll = () => {
    setSelectedItems([]);
  };

  const handleContinueSelection = () => {
    setOpenModal('assignTask');
  };

  const handleClearSelection = () => {
    setSelectionMode(false);
    setSelectedItems([]);
  };

  const handleTaskAssigned = async (taskData: { 
    task_name: string; 
    worker: string; 
    container: { length: number; width: number; height: number; }
  }) => {
    const taskInput: TaskInput = {
      task_name: taskData.task_name,
      worker: taskData.worker,
      item_ids: selectedItems,
      container: taskData.container
    };

    const result = await assignTask(taskInput);

    if (result.success) {
      // Remove assigned items from the items list (they're now assigned to worker)
      for (const itemId of selectedItems) {
        await deleteItem(itemId);
      }
      
      setSelectionMode(false);
      setSelectedItems([]);
      console.log('Task assigned successfully:', result.message);
    } else {
      console.error('Failed to assign task:', result.message);
    }
  };

  const handleLogout = () => {
    logout();
    console.log('User logged out');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header title="Warehouse Manager Dashboard" viewType="Manager" />

      {/* Error display */}
      {(itemsError || tasksError) && (
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {itemsError && <p>Items Error: {itemsError}</p>}
            {tasksError && <p>Tasks Error: {tasksError}</p>}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex h-[calc(100vh-160px)]">
          
          {/* Left Sidebar - Control Panel */}
          <div className="w-64 bg-white shadow-md rounded-lg flex-shrink-0 border border-gray-200 flex flex-col py-4">

            {/* Action buttons */}
            <div className="p-6 flex-auto">
              <div className="space-y-6">
                <Button 
                  onClick={() => setOpenModal('addItem')}
                  variant="primary"
                  size="md"
                  fullWidth
                  disabled={selectionMode || itemsLoading}
                  isLoading={itemsLoading}
                >
                  Add Item
                </Button>
                {selectionMode ? (
                  <Button 
                    onClick={handleClearSelection}
                    variant="secondary"
                    size="md"
                    fullWidth
                  >
                    Cancel Selection
                  </Button>
                ) : (
                  <Button 
                    onClick={handleStartAssignTask}
                    variant="primary"
                    size="md"
                    fullWidth
                    disabled={itemsLoading || items.length === 0}
                  >
                    Assign Task
                  </Button>
                )}
                <Button 
                  onClick={() => setOpenModal('taskHistory')}
                  variant="primary"
                  size="md"
                  fullWidth
                  disabled={selectionMode || tasksLoading}
                  isLoading={tasksLoading}
                >
                  Task History
                </Button>
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
              {itemsLoading && <p className="text-sm text-gray-500 mt-1">Loading items...</p>}
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
                onSelectAll={handleSelectAll}
                onClearAll={handleClearAll}
                onContinueSelection={handleContinueSelection}
                loading={itemsLoading}
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
        items={items}
      />
      
      <TaskHistory
        isOpen={openModal === 'taskHistory'}
        onClose={() => setOpenModal(null)}
        tasks={tasks}
        loading={tasksLoading}
        onRefresh={refreshTasks}
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