import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

// Import components
import Header from '../../components/common/Header';
import ProgressBar from '../../components/worker/ProgressBar';
import UserLog from '../../components/common/UserLog';
import ThreeScene, { ThreeSceneHandle } from '../../components/worker/Visual';
import Button from '../../components/common/Button';
import aiOutput from '../../mocks/sample_ai_output.json';

<<<<<<< HEAD
interface AIBox {
  item_id: number;
  width: number;
  height: number;
  depth: number;
  is_fragile: boolean;
  x: number;
  y: number;
  z: number;
}

interface AIOutput {
  cost: number;
  results: AIBox[];
  status: string;
}
=======
import { itemDatabase } from '../../mocks/data';
>>>>>>> cd2638759f55483b6919ebfc1e30f07b2600c2ed

const WorkerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();
  const [isLastItem, setIsLastItem] = useState(false);

  const transformedData = (aiOutput as AIOutput).results.map(box => ({
    item_id: `Box-${box.item_id}`,
    is_fragile: box.is_fragile,
    width: box.width,
    height: box.height,
    depth: box.depth,
    position: [box.x, box.y, box.z] as [number, number, number]
  }));

  const [packingProgress, setPackingProgress] = useState({ current: 0, total: transformedData.length });
  const [is2DView, setIs2DView] = useState(false);
  const threeSceneRef = useRef<ThreeSceneHandle>(null);
  const [currentItem, setCurrentItem] = useState<null | {
    item_id: string;
    is_fragile: boolean;
    width: number;
    height: number;
    depth: number;
  }>(null);
  

  const handleLogout = () => {
    logout();
    console.log('User logged out');
    navigate('/login');
  };

const switchTo2D = () => {
  if (threeSceneRef.current) {
    threeSceneRef.current.switchToTopView();
    setIs2DView(true);
  }
};

const switchTo3D = () => {
  if (threeSceneRef.current) {
    threeSceneRef.current.switchToDefaultView();
    setIs2DView(false);
  }
};


const handleNextItem = () => {
  if (threeSceneRef.current) {
    const currentIndex = packingProgress.current;
    if (currentIndex < transformedData.length) {
      const item = transformedData[currentIndex]; 

      threeSceneRef.current.addItem({
        width: item.width,
        height: item.height,
        depth: item.depth,
        position: item.position,
      });

      setCurrentItem({
        item_id: item.item_id,
        is_fragile: item.is_fragile,
        width: item.width,
        height: item.height,
        depth: item.depth,
      });

      const newCurrent = currentIndex + 1;
      setPackingProgress((prev) => ({
        ...prev,
        current: newCurrent,
      }));
      setIsLastItem(newCurrent === transformedData.length);
    }
  }
};

const handlePreviousTask = () => {
  if (threeSceneRef.current) {
    threeSceneRef.current.removeLastItem();

    setPackingProgress((prev) => {
      const newCurrent = Math.max(prev.current - 1, 0);

      if (newCurrent > 0) {
        const item = transformedData[newCurrent - 1]; 
        setCurrentItem({
          item_id: item.item_id,
          is_fragile: item.is_fragile,
          width: item.width,
          height: item.height,
          depth: item.depth,
        });
      } else {
        setCurrentItem(null);
      }
      
      setIsLastItem(newCurrent === transformedData.length);

      return {
        ...prev,
        current: newCurrent,
      };
    });
  }
};

const handleFinish = () => {
  alert("Congrats！You have finished the task");
};
  
  

<<<<<<< HEAD
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
              {/* change buttion from next item to finish*/}
              <button 
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-md"
                onClick={isLastItem ? handleFinish : handleNextItem}  
              >
                {isLastItem ? "Finish" : "Next Item"}
              </button>

              <button 
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-md"
                onClick={handlePreviousTask} 
              >
                Previous Item
              </button>
=======
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
              <Button 
                variant="primary"
                size="md"
                fullWidth
                onClick={handleNextItem}  
              >
                Next Item
              </Button>
              <Button 
                variant="primary"
                size="md"
                fullWidth
                onClick={handlePreviousTask} 
              >
                Previous Item
              </Button>
                {/* progress bar */}
                <ProgressBar 
                  current={packingProgress.current} 
                  total={packingProgress.total} 
                />
              </div>
>>>>>>> cd2638759f55483b6919ebfc1e30f07b2600c2ed

              {/* progress bar */}
              <ProgressBar 
                current={packingProgress.current} 
                total={packingProgress.total} 
              />
            </div>

            {/* Item Description */}
            <div className='mt-10 p-2 border-2 rounded-md bg-gray-50 min-h-20'>
              <div className="flex flex-col justify-start h-40 p-2 text-gray-600 space-y-1">
                {currentItem ? (
                  <>
                    <p><strong>Name:</strong> {currentItem.item_id}</p>
                    <p><strong>Fragile:</strong> {currentItem.is_fragile ? 'Yes' : 'No'}</p>
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
          <div className='flex flex-1 p-4 items-center justify-center'>
            <ThreeScene 
              ref={threeSceneRef}
              onItemClick={(itemId) => {
                const item = transformedData.find(item => item.item_id === itemId);
                if (item) {
                  setCurrentItem({
                    item_id: item.item_id,
                    is_fragile: item.is_fragile,
                    width: item.width,
                    height: item.height,
                    depth: item.depth,
                  });
                }
              }}
              onEmptyClick={() => {
                console.log('点击了空白区域');
              }}
            />
            <div className="absolute bottom-8 right-8 flex space-x-4">
              <Button
                onClick={switchTo2D}
                variant={is2DView ? 'primary' : 'secondary'}
                className="px-4 py-3 text-lg w-24"
              >
                2D View
              </Button>
              <Button
                onClick={switchTo3D}
                variant={!is2DView ? 'primary' : 'secondary'}
                className="px-4 py-3 text-lg w-24"
              >
                3D View
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default WorkerDashboardPage;