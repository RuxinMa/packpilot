import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useTaskData } from '../../hooks/useTaskData';

// Import components
import Header from '../../components/common/Header';
import ProgressBar from '../../components/worker/ProgressBar';
import UserLog from '../../components/common/UserLog';
import Button from '../../components/common/Button';
import TaskCompletionModal from '../../components/worker/TaskCompletion';
import ThreeScene, { ThreeSceneHandle } from '../../components/worker/Visual';

const WorkerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout, username, isLoading: authLoading } = useAuthContext();
  const [isLastItem, setIsLastItem] = useState(false);
  const [isTaskStarted, setIsTaskStarted] = useState(false); // Track whether the task has started
  const [showCompletionModal, setShowCompletionModal] = useState(false); // Control completion modal
  const [isCompletingTask, setIsCompletingTask] = useState(false); // New: track completion process
  
  const { tasks, selectedTaskId, setSelectedTaskId, aiOutput, loading, error, fetchTaskLayout, completeTask } = useTaskData();

  // According to the state logic in the product documentation
  const hasNoTasks = tasks.length === 0;
  const hasNoLayout = !aiOutput || !aiOutput.results || aiOutput.results.length === 0;
  const hasTaskButNoLayout = !hasNoTasks && hasNoLayout; 
  
  //  Keep the data transformation logic unchanged, but add null checks
  const transformedData = aiOutput?.results?.map(box => ({
    item_id: `Box-${box.item_id}`,
    is_fragile: box.is_fragile,
    width: box.width,
    height: box.height,
    depth: box.depth,
    position: [box.x, box.y, box.z] as [number, number, number]
  })) || [];

  //Status display logic
  const getInitialDisplay = () => {
    if (loading) return "Loading...";
    if (error) return `Error: ${error}`;
    if (hasNoTasks) return "You don't have tasks";
    if (hasNoLayout) return "Click Start Task to begin";
    return "Ready to start";
  };

  const [selectedByClick, setSelectedByClick] = useState(false);
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

  //  Update total when data changes
  React.useEffect(() => {
    setPackingProgress(prev => ({ ...prev, total: transformedData.length, current: 0 }));
    setCurrentItem(null);
    setIsLastItem(false);
  }, [transformedData.length]);
  
  React.useEffect(() => {
    const container = aiOutput?.task_info?.container;
    if (container && threeSceneRef.current?.createRoom) {
      threeSceneRef.current.createRoom(
        container.width,
        container.height,
        container.depth
      );
      threeSceneRef.current.switchToDefaultView();
    }
  }, [aiOutput?.task_info?.container]);

  React.useEffect(() => {
    if (threeSceneRef.current) {
      threeSceneRef.current.resetScene();
    }
    // When the selected task changes, reset the task started state
    setIsTaskStarted(false);
  }, [selectedTaskId]);

  const handleLogout = () => {
    logout();
    console.log('User logged out');
    navigate('/login');
  };
  
  // Get display username - fallback if not available
  const displayUsername = username || 'User';

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
  // If there is a task but no layout, fetch the layout first
  if (hasTaskButNoLayout && selectedTaskId) {
    await fetchTaskLayout(selectedTaskId);
    setIsTaskStarted(true); // Mark the task as started
    return; // After fetching the layout, the user needs to click Next again
  }
  
  // Original logic
  if (threeSceneRef.current) {
    const currentIndex = packingProgress.current;
    if (currentIndex < transformedData.length) {
      const item = transformedData[currentIndex]; 
      const scale = 0.1;
      threeSceneRef.current.addItem({
        width: item.width * scale,
        height: item.height * scale,
        depth: item.depth * scale,
        position: item.position.map(p => p * scale) as [number, number, number],
      });

      if (!selectedByClick) {
        setCurrentItem({
          item_id: item.item_id,
          is_fragile: item.is_fragile,
          width: item.width,
          height: item.height,
          depth: item.depth,
        });
      };

      const newCurrent = currentIndex + 1;
      setPackingProgress((prev) => ({
        ...prev,
        current: newCurrent,
      }));
      setSelectedByClick(false);
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

// Show confirmation modal instead of directly completing task
const handleFinishClick = () => {
  setShowCompletionModal(true);
};

// Handle actual task completion after confirmation
const handleConfirmCompletion = async () => {
  if (selectedTaskId) {
    setIsCompletingTask(true);
    try {
      const result = await completeTask(selectedTaskId);
      if (result.success) {
        // Reset all states
        setPackingProgress({ current: 0, total: 0 });
        setCurrentItem(null);
        setIsLastItem(false);
        setIsTaskStarted(false);
        setShowCompletionModal(false);
        
        // Reset the 3D scene
        if (threeSceneRef.current) {
          threeSceneRef.current.resetScene();
        }
        
        alert("Congrats! You have finished the task");
      } else {
        alert(`Failed to complete task: ${result.message}`);
      }
    } catch (error) {
      alert(`Error completing task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsCompletingTask(false);
    }
  } else {
    alert("No task selected");
    setShowCompletionModal(false);
  }
};

// New: Handle modal close
const handleCloseCompletionModal = () => {
  if (!isCompletingTask) {
    setShowCompletionModal(false);
  }
};

return (
  <div className="min-h-screen bg-gray-50">
    {/* Header */}
    <Header title="Warehouse Worker Dashboard" viewType="Worker" />

    {/* Main Content */}
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex h-[calc(100vh-160px)]">

        {/* Left Sidebar - Control Panel */}
        <div className="w-64 bg-white shadow-md rounded-lg flex-shrink-0 border border-gray-200 flex flex-col py-2">
          <div className="p-6 flex-auto">

            {/* task states */}
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

            {/* Task selection - only shown when there are multiple tasks and the task has not started */}
            {tasks.length > 1 && !isTaskStarted && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Select Task:
                </label>
                <select
                  value={selectedTaskId || ''}
                  onChange={(e) => setSelectedTaskId(Number(e.target.value))}
                  className="w-full px-3 py-2 border text-sm border-gray-300 rounded-md"
                >
                  {tasks.map((task) => (
                    <option key={task.task_id} value={task.task_id}>
                      {task.task_name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Display current task information - only shown after task starts */}
            {isTaskStarted && aiOutput?.task_info && (
              <div className="mb-4 p-2 bg-blue-50 rounded-md">
                <p className="text-sm font-medium text-blue-800">
                  {aiOutput.task_info.task_name}
                </p>
                <p className="text-xs text-blue-800">
                  Container: {aiOutput.task_info.container.width}×{aiOutput.task_info.container.height}×{aiOutput.task_info.container.depth}
                </p>
              </div>
            )}

            {/* actions */}
            <div className="space-y-4">
              {/* Enable/disable buttons based on status */}
              <button 
                className={`w-full py-3 px-4 rounded-md ${
                  hasNoTasks
                    ? 'bg-gray-400 text-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                onClick={isLastItem ? handleFinishClick : handleNextItem}
                disabled={hasNoTasks}
              >
                {hasTaskButNoLayout ? "Start Task" : (isLastItem ? "Finish" : "Next Item")}
              </button>

              <button 
                className={`w-full py-3 px-4 rounded-md ${
                  hasNoTasks || hasNoLayout || !isTaskStarted
                    ? 'bg-gray-400 text-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                onClick={handlePreviousTask}
                disabled={hasNoTasks || hasNoLayout || !isTaskStarted}
              >
                Previous Item
              </button>

              {/* progress bar */}
              <ProgressBar 
                current={hasNoTasks || hasNoLayout || !isTaskStarted ? 0 : packingProgress.current} 
                total={hasNoTasks || hasNoLayout || !isTaskStarted ? 0 : packingProgress.total} 
              />
            </div>

            {/* Item Description */}
            <div className='mt-6 p-2 border-2 rounded-md bg-gray-50 min-h-20'>
              <div className="flex flex-col justify-start h-[140px] p-2 text-gray-600 space-y-1 text-sm">
                {currentItem ? (
                  <>
                    <p><strong>Name:</strong> {currentItem.item_id}</p>
                    <p><strong>Fragile:</strong> <span className={currentItem.is_fragile ? 'text-red-600 font-bold bg-red-100 px-2 py-1 rounded' : ''}>{currentItem.is_fragile ? 'Yes' : 'No'}</span></p>
                    <p><strong>Length:</strong> {parseFloat(currentItem.depth.toString()).toFixed(2)} cm</p>
                    <p><strong>Width:</strong> {parseFloat(currentItem.width.toString()).toFixed(2)} cm</p>
                    <p><strong>Height:</strong> {parseFloat(currentItem.height.toString()).toFixed(2)} cm</p>
                  </>
                ) : (
                  <p>{getInitialDisplay()}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* User log */}
            <UserLog 
              username={displayUsername}
              loading={authLoading}
              onLogout={handleLogout}
            />
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
              items={transformedData}
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
                  setSelectedByClick(true); // Set as manually clicked
                }
              }}
              onEmptyClick={() => {
                setCurrentItem(null);
                setSelectedByClick(false); // Clear click flag
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

    {/* Task Completion Modal */}
    <TaskCompletionModal
      isOpen={showCompletionModal}
      onClose={handleCloseCompletionModal}
      onConfirm={handleConfirmCompletion}
      taskName={aiOutput?.task_info?.task_name}
      itemCount={packingProgress.total}
      isSubmitting={isCompletingTask}
    />
  </div>
);
};

export default WorkerDashboardPage;