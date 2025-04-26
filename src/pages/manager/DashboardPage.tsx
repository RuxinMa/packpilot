import React, { useState, useEffect } from 'react';
import { useItems } from '../../hooks/useItems';

// Import components
import Header from '../../components/common/Header';
import AddItem from '../../components/manager/AddItem';
import EditItem from '../../components/manager/EditItem';
import AssignTask from '../../components/manager/AssignTask';
import TaskHistory from '../../components/manager/TaskHistory';
import ItemList from '../../components/manager/ItemList';
import UserLog from '../../components/common/UserLog';

const ManagerDashboardPage: React.FC = () => {
  // State for controlling modals
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  
  // Hooks for data fetching
  const { getItems, items } = useItems();
  
  useEffect(() => {
    getItems();
  }, [getItems]);
  
  // Handler functions
  const handleEditItem = (itemId: number) => {
    setSelectedItemId(itemId);
    setOpenModal('editItem');
  };
  
  const handleRefreshItems = () => {
    getItems();
  };

  const handleLogout = () => {
    // TODO: Implement actual logout logic here
    console.log('User logged out');
    // Redirect to login page or perform other logout actions
    window.location.href = '/login';
  };
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header title="Warehouse Manager Dashboard" viewType="Manager" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex h-[calc(100vh-160px)]">
          
          {/* Left Sidebar - Control Panel */}
          <div className="w-64 bg-white shadow-md rounded-lg flex-shrink-0 border border-gray-200 flex flex-col py-4">
            {/* actions */}
            <div className="p-6 flex-auto">
              <div className="space-y-6">
                <button 
                  onClick={() => setOpenModal('addItem')}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Item
                </button>
                <button 
                  onClick={() => setOpenModal('assignTask')}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Assign Task
                </button>
                <button 
                  onClick={() => setOpenModal('taskHistory')}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Task History
                </button>
              </div>
            </div>
            
            {/* user log */}
            <UserLog userType="Worker" onLogout={handleLogout}/>
          </div>
          
          {/* Right Content - Item List */}
          <div className="flex flex-col flex-1 bg-white shadow-md rounded-lg ml-6 border border-gray-200">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-800">
                Item Inventory
              </h2>
            </div>
            <div className="flex-1 p-6 overflow-auto">
              <ItemList 
                items={items} 
                onEdit={handleEditItem}
                onRefresh={handleRefreshItems}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal components */}
      <AddItem
        isOpen={openModal === 'addItem'}
        onClose={() => setOpenModal(null)}
        onItemAdded={handleRefreshItems}
      />
      
      <EditItem
        isOpen={openModal === 'editItem'}
        onClose={() => setOpenModal(null)}
        itemId={selectedItemId}
        onItemUpdated={handleRefreshItems}
      />
      
      <AssignTask
        isOpen={openModal === 'assignTask'}
        onClose={() => setOpenModal(null)}
      />
      
      <TaskHistory
        isOpen={openModal === 'taskHistory'}
        onClose={() => setOpenModal(null)}
      />
    </div>
  );
};

export default ManagerDashboardPage;