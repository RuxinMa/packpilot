import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import Header from '../../components/common/Header';
import ProgressBar from '../../components/worker/ProgressBar';
import UserLog from '../../components/common/UserLog';
import ThreeScene, { ThreeSceneHandle } from '../../components/worker/Visual';
import { itemDatabase } from '../../mocks/data';
import Button from '../../components/common/Button';
import aiOutput from '../../mocks/sample_ai_output.json';

// 定义AI输出数据的类型
interface AIBox {
  box_id: number;
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

const WorkerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  // 转换AI输出数据为与原来兼容的格式
  const transformedData = (aiOutput as AIOutput).results.map(box => ({
    id: `Box-${box.box_id}`,
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
    id: string;
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
        is_fragile: item.is_fragile,
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
        const item = transformedData[newCurrent - 1]; 
        setCurrentItem({
          id: item.id,
          is_fragile: item.is_fragile,
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
              <div className="flex flex-col justify-start h-40 p-2 text-gray-600 space-y-1">
                {currentItem ? (
                  <>
                    <p><strong>Name:</strong> {currentItem.id}</p>
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
                  // 直接使用itemId查找，而不是依赖索引
                  const item = transformedData.find(item => item.id === itemId);
                  if (item) {
                    setCurrentItem({
                      id: item.id,
                      is_fragile: item.is_fragile,
                      width: item.width,
                      height: item.height,
                      depth: item.depth,
                    });
                    
                    // 更新进度到当前物品
                    const itemIndex = transformedData.findIndex(i => i.id === itemId);
                    if (itemIndex !== -1) {
                      setPackingProgress({
                        current: itemIndex + 1, // +1因为current表示已完成的数量
                        total: transformedData.length
                      });
                    }
                  }
                }}
                onEmptyClick={() => {
                  console.log('点击了空白区域，准备切回最新物体');
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