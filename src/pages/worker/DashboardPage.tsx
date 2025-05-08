import React, { useState, useRef } from 'react';
import Header from '../../components/common/Header';
import ProgressBar from '../../components/worker/ProgressBar';
import UserLog from '../../components/common/UserLog';
import ThreeScene, { ThreeSceneHandle } from '../../components/worker/Visual';
import { itemDatabase } from '../../components/common/data';


const WorkerDashboardPage: React.FC = () => {
  const [packingProgress, setPackingProgress] = useState({ current: 0, total: itemDatabase.length });
  const [is2DView, setIs2DView] = useState(false);
  const threeSceneRef = useRef<ThreeSceneHandle>(null);
  const [currentItem, setCurrentItem] = useState<null | {
    id: string;
    Inf: string;
    width: number;
    height: number;
    depth: number;
  }>(null);

  const handleLogout = () => {
    console.log('User logged out');
    window.location.href = '/login';
  };

  const toggleView = () => {
    if (threeSceneRef.current) {
      if (is2DView) {
        threeSceneRef.current.switchToDefaultView();
      } else {
        threeSceneRef.current.switchToTopView();
      }
      setIs2DView(!is2DView);
    }
  };

  const handleNextItem = () => {
    if (threeSceneRef.current) {
      const currentIndex = packingProgress.current;
      if (currentIndex < itemDatabase.length) {
        const item = itemDatabase[currentIndex];
  
        const newItemParams = {
          width: item.width,
          height: item.height,
          depth: item.depth,
          color: 0xadd8e6,
          position: item.position,
        };
  
        threeSceneRef.current.addItem(newItemParams);
  
        setCurrentItem({
          id: item.id,
          Inf: item.Inf,
          width: item.width,
          height: item.height,
          depth: item.depth,
        });

        setPackingProgress((prev) => ({
          ...prev,
          current: Math.min(prev.current + 1, prev.total),
        }));       
      }
    }
  };
  
  

  const handlePreviousTask = () => {
    if (threeSceneRef.current) {
      threeSceneRef.current.removeLastItem();
  
      setPackingProgress((prev) => {
        const newCurrent = Math.max(prev.current - 1, 0);
  
        if (newCurrent > 0) {
          const item = itemDatabase[newCurrent - 1]; 
          setCurrentItem({
            id: item.id,
            Inf: item.Inf,
            width: item.width,
            height: item.height,
            depth: item.depth,
          });
        } else {
 
          setCurrentItem(null);
        }
  
        return {
          ...prev,
          current: newCurrent,
        };
      });
    }
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
              <div className="space-y-6">
              <button 
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-md"
                onClick={handleNextItem}  
              >
                Next Item
              </button>
              <button 
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-md"
                onClick={handlePreviousTask} 
              >
                Previous Item
              </button>
                {/* progress bar */}
                <ProgressBar 
                  current={packingProgress.current} 
                  total={packingProgress.total} 
                />
              </div>

              {/* Item Description */}
              <div className='mt-10 p-2 border-2 rounded-md bg-gray-50 min-h-20'>
              <div className="flex flex-col justify-start h-48 p-2 text-gray-600 space-y-1">
                {currentItem ? (
                  <>
                    <p><strong>Name:</strong> {currentItem.id}</p>
                    <p><strong>Info:</strong> {currentItem.Inf}</p>
                    <p><strong>Width:</strong> {currentItem.width}</p>
                    <p><strong>Height:</strong> {currentItem.height}</p>
                    <p><strong>Depth:</strong> {currentItem.depth}</p>
                  </>
                ) : (
                  <p>No item selected.</p>
                )}
              </div>

              </div>
            </div>
            
            {/* user log */}
            <UserLog userType="Worker1" onLogout={handleLogout}/>
          </div>
          
          {/* Right Content - Visualization */}
          <div className="flex flex-col flex-1 bg-white shadow-md rounded-lg ml-6 border border-gray-200 relative">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-800">
                Packing View
              </h2>
            </div>
            <div className='flex flex-1 bg-indigo-100 p-4 items-center justify-center'>
              <ThreeScene 
                ref={threeSceneRef}
                onItemClick={(itemId) => {
                  const item = itemDatabase.find(item => item.id === itemId);
                  
                  if (item) {
                    setCurrentItem({
                      id: item.id,
                      Inf: item.Inf,
                      width: item.width,
                      height: item.height,
                      depth: item.depth,
                    });
                  }
                }}
                onEmptyClick={() => {
                  console.log('点击了空白区域，准备切回最新物体');
                }}
                            
              />
              <div className="absolute bottom-8 right-8">
                <button 
                  onClick={toggleView}
                  className={`py-3 px-4 rounded-md text-white shadow-md ${
                    is2DView ? 'bg-gray-500 hover:bg-gray-600' : 'bg-indigo-500 hover:bg-indigo-600'
                  }`}
                >
                  {is2DView ? '3D View' : '2D View'}
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