import React, { useState } from 'react';

// Import components
import Header from '../../components/common/Header';
import ProgressBar from '../../components/worker/ProgressBar';
import UserLog from '../../components/common/UserLog';

const WorkerDashboardPage: React.FC = () => {
  const [packingProgress, setPackingProgress] = useState({ current: 10, total: 50 });
  
  const handleLogout = () => {
    // TODO: Implement actual logout logic here
    console.log('User logged out');
    // Redirect to login page or perform other logout actions
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header title="Warehouse Worker Dashboard" viewType="Worker" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex h-[calc(100vh-160px)]">

          {/* Left Sidebar - Control Panel */}
          <div className="w-64 bg-white shadow-md rounded-lg flex-shrink-0 border border-gray-200 flex flex-col py-4">
            <div className="p-8 flex-auto">
              {/* actions */}
              {/* Todo: Implement actual packing actions */}
              <div className="space-y-6">
                <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-md">
                  Next Item
                </button>
                <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-md">
                  Previous Task
                </button>
                {/* progress bar */}
                <ProgressBar 
                  current={packingProgress.current} 
                  total={packingProgress.total} 
                />
              </div>

              {/* Todo: Item Description a component (component/worker/ItemDescription) */}
              <div className='mt-10 p-2 border-2 rounded-md bg-gray-50 min-h-20'>
                <div className="flex items-center justify-center h-36 text-gray-500">
                  <p>item description</p>
                </div>
              </div>
            </div>
            
          {/* user log */}
          <UserLog userType="Worker" onLogout={handleLogout}/>
        </div>
          
          {/* Right Content - Visulalization */}
          <div className="flex flex-col flex-1 bg-white shadow-md rounded-lg ml-6 border border-gray-200 relative">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-800 ">
                Packing View
              </h2>
            </div>
            <div className='flex flex-1 bg-indigo-100 p-4 items-center justify-center'>
              <h1 className="text-xl text-gray-800">
                Visualization
              </h1>
              <div className="absolute bottom-8 right-8">
                <button className="py-3 px-4 bg-indigo-500 rounded-md text-white hover:bg-indigo-700 shadow-md">
                  3D View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboardPage;