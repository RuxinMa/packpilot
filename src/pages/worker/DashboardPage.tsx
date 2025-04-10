import React from 'react';

const WorkerDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-3xl font-bold text-gray-800">LS1 Warehouse Worker</h1>
            </div>
            <div className="flex items-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-lg font-medium bg-blue-100 text-blue-800">
                Worker View
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex h-[calc(100vh-160px)]">

          {/* Left Sidebar - Control Panel */}
          <div className="w-64 bg-white shadow-md rounded-lg flex-shrink-0 border border-gray-200 flex flex-col py-6">
            {/* actions */}
            <div className="p-8 flex-auto">
              <div className="space-y-6">
                <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-md">
                  Next Item
                </button>
                <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-md">
                  Previous Task
                </button>
                
              </div>
            </div>
            
            {/* user log */}
            <div className="mt-auto border-t border-gray-200 p-5 pt-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                <div>
                  <div className="font-medium text-xl">Username</div>
                </div>
              </div>
              <div className='mx-7 '>
                <button className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md">
                  Log out
                </button>
              </div>
              
            </div>
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