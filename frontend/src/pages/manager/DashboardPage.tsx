import React, { useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useItemContext } from '../../contexts/ItemContext';
import { useTaskContext } from '../../contexts/TaskContext';
import { TaskInput } from '../../types';

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

const ManagerDashboardPage: React.FC = () => {
  // const navigate = useNavigate(); // 如果不使用路由，注释掉这行
  const { logout, username, isLoading: authLoading } = useAuthContext();
  
  // Use Item Context
  const {
    items,
    loading: itemsLoading,
    error: itemsError,
    selectedItems,
    selectionMode,
    addItem,
    // batchDeleteItems,
    refreshItems,
    startSelection,
    toggleItemSelection,
    selectAllItems,
    clearSelection,
    clearSelectionMode,
  } = useItemContext();
  
  // Use Task Context
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    assignTask,
    refreshTasksByManager,
    getCurrentManagerId
  } = useTaskContext();
  
  // State for controlling modals
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  // UI Event handlers (pure UI logic)
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

  // Item operations (simplified - just call context methods)
  const handleItemAdded = async (newItemData: any) => {
    const result = await addItem(newItemData);
    if (result.success) {
      console.log('Item added successfully:', result.message);
    } else {
      console.error('Failed to add item:', result.message);
    }
  };

  const handleItemUpdated = async () => {
    await refreshItems();
    console.log('Item updated successfully');
  };

  const handleItemDeleted = async () => {
    if (selectedItemId) {
      // This will be handled by DeleteItem component
      console.log('Item deletion handled by DeleteItem component');
    }
  };

  // Selection operations (simplified)
  const handleStartAssignTask = () => {
    startSelection();
  };

  const handleContinueSelection = () => {
    setOpenModal('assignTask');
  };

  // Task assignment (using Task Context)
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
      // 不调用批量删除！只是刷新列表，已分配的物品会被过滤掉
      clearSelectionMode(); // 清除选择状态
      await refreshItems(); // 刷新物品列表，已分配的物品不会显示
      console.log('Task assigned successfully:', result.message);
    } else {
      console.error('Failed to assign task:', result.message);
    }
  };

  // Task refresh handler for current manager
  const handleRefreshTasks = async () => {
    const currentManagerId = getCurrentManagerId();
    await refreshTasksByManager(currentManagerId);
  };

  const handleLogout = () => {
    logout();
    console.log('User logged out');
    // navigate('/login'); // 如果不使用路由，注释掉这行
    // 或者使用 window.location.href = '/login'; 
    // 或者刷新页面 window.location.reload();
  };

  // Get display username - fallback if not available
  const displayUsername = username || 'Unknown User';

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
                    onClick={clearSelectionMode}
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
            
            {/* User log - now shows actual username only */}
            <UserLog 
              username={displayUsername}
              loading={authLoading}
              onLogout={handleLogout}
            />
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
                onToggleItemSelection={toggleItemSelection}
                onSelectAll={selectAllItems}
                onClearAll={clearSelection}
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
        onClearSelection={clearSelectionMode}
        onTaskAssigned={handleTaskAssigned}
        items={items}
      />
      
      <TaskHistory
        isOpen={openModal === 'taskHistory'}
        onClose={() => setOpenModal(null)}
        tasks={tasks}
        loading={tasksLoading}
        onRefresh={handleRefreshTasks}
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