import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import Header from '../../components/common/Header';
import ProgressBar from '../../components/worker/ProgressBar';
import UserLog from '../../components/common/UserLog';
import ThreeScene, { ThreeSceneHandle } from '../../components/worker/Visual';
import Button from '../../components/common/Button';
import { useTaskData } from '../../hooks/useTaskData';

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

const WorkerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();
  const [isLastItem, setIsLastItem] = useState(false);
  
  // 使用API数据替换静态数据
  const { tasks, selectedTaskId, setSelectedTaskId, aiOutput, loading, error, fetchTaskLayout } = useTaskData();

  // 根据产品文档的状态逻辑
  const hasNoTasks = tasks.length === 0;
  const hasNoLayout = !aiOutput || !aiOutput.results || aiOutput.results.length === 0;
  const hasTaskButNoLayout = !hasNoTasks && hasNoLayout; // 新增：有任务但没有布局
  
  // 数据转换逻辑保持不变，但添加空值检查
  const transformedData = aiOutput?.results?.map(box => ({
    item_id: `Box-${box.item_id}`,
    is_fragile: box.is_fragile,
    width: box.width,
    height: box.height,
    depth: box.depth,
    position: [box.x, box.y, box.z] as [number, number, number]
  })) || [];

  // 状态显示逻辑
  const getInitialDisplay = () => {
    if (loading) return "Loading...";
    if (error) return `Error: ${error}`;
    if (hasNoTasks) return "You don't have tasks";
    if (hasNoLayout) return "Click Next to start task";
    return "Ready to start";
  };

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

  // 更新total当数据变化时
  React.useEffect(() => {
    setPackingProgress(prev => ({ ...prev, total: transformedData.length, current: 0 }));
    setCurrentItem(null);
    setIsLastItem(false);
  }, [transformedData.length]);

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


const handleNextItem = async () => {
  // 如果有任务但没有布局，先获取布局
  if (hasTaskButNoLayout && selectedTaskId) {
    await fetchTaskLayout(selectedTaskId);
    return; // 布局获取后，用户需要再次点击Next
  }
  
  // 原来的逻辑
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
            {/* 根据产品文档显示状态 */}
            {loading && (
              <div className="mb-4 p-3 bg-yellow-50 rounded-md">
                <p className="text-sm text-yellow-800">Loading tasks...</p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 rounded-md">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {hasNoTasks && !loading && (
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-800">You don't have tasks</p>
              </div>
            )}

            {/* 任务选择 - 只在有多个任务时显示 */}
            {tasks.length > 1 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Task:
                </label>
                <select
                  value={selectedTaskId || ''}
                  onChange={(e) => setSelectedTaskId(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {tasks.map((task) => (
                    <option key={task.task_id} value={task.task_id}>
                      {task.task_name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 显示当前任务信息 */}
            {aiOutput?.task_info && (
              <div className="mb-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm font-medium text-blue-800">
                  Task: {aiOutput.task_info.task_name}
                </p>
                <p className="text-xs text-blue-600">
                  Container: {aiOutput.task_info.container.width}×{aiOutput.task_info.container.height}×{aiOutput.task_info.container.depth}
                </p>
              </div>
            )}

            {/* actions */}
            <div className="space-y-6">
              {/* 根据状态禁用/启用按钮 */}
              <button 
                className={`w-full py-3 px-4 rounded-md ${
                  hasNoTasks
                    ? 'bg-gray-400 text-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                onClick={isLastItem ? handleFinish : handleNextItem}  
                disabled={hasNoTasks}
              >
                {hasTaskButNoLayout ? "Start Task" : (isLastItem ? "Finish" : "Next Item")}
              </button>

              <button 
                className={`w-full py-3 px-4 rounded-md ${
                  hasNoTasks || hasNoLayout
                    ? 'bg-gray-400 text-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                onClick={handlePreviousTask}
                disabled={hasNoTasks || hasNoLayout}
              >
                Previous Item
              </button>

              {/* progress bar - 根据状态显示 */}
              <ProgressBar 
                current={hasNoTasks || hasNoLayout ? 0 : packingProgress.current} 
                total={hasNoTasks || hasNoLayout ? 0 : packingProgress.total} 
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
                  <p>{getInitialDisplay()}</p>
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