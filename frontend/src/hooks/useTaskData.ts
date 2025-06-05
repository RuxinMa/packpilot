import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { authService } from '../services/authService';

// 添加API配置
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

interface AIBox {
  item_id: number;
  width: number;
  height: number;
  depth: number;
  is_fragile: boolean;
  x: number;
  y: number;
  z: number;
  placement_order: number;
}

interface AIOutput {
  cost: number;
  results: AIBox[];
  status: string;
  task_info?: {
    task_id: number;
    task_name: string;
    container: {
      container_id: number;
      width: number;
      height: number;
      depth: number;
      label?: string;
    };
  };
}

interface Task {
  task_id: number;
  task_name: string;
  status: string;
  workload: number;
}

export const useTaskData = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [aiOutput, setAiOutput] = useState<AIOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuthContext();

  // 获取工人的任务列表
  const fetchTasks = async () => {
    const token = authService.getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('Fetching worker tasks...');
      const response = await fetch(`${API_BASE_URL}/api/worker/my_tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Fetch tasks response:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Tasks data:', data);
        setTasks(data.tasks || []);
        // 自动选择第一个任务，但不获取布局
        if (data.tasks && data.tasks.length > 0) {
          setSelectedTaskId(data.tasks[0].task_id);
        } else {
          setSelectedTaskId(null);
        }
      } else {
        const errorData = await response.json();
        console.error('Error fetching tasks:', errorData);
        setError(`Failed to fetch tasks: ${errorData.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Network error fetching tasks:', err);
      setError('Network error: Unable to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  // 手动获取任务的优化布局
  const fetchTaskLayout = async (taskId: number) => {
    const token = authService.getToken();
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching layout for task ${taskId}...`);
      // 先尝试获取已有布局
      let response = await fetch(`${API_BASE_URL}/api/ai/get_task_layout/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // 如果没有布局，则进行优化
      if (!response.ok) {
        console.log('No existing layout, optimizing...');
        response = await fetch(`${API_BASE_URL}/api/ai/optimize_task/${taskId}?save=true`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      if (response.ok) {
        const data = await response.json();
        console.log('AI output data:', data);
        setAiOutput(data);
      } else {
        const errorData = await response.json();
        console.error('Error fetching layout:', errorData);
        setError('Failed to get task layout');
      }
    } catch (err) {
      console.error('Network error fetching layout:', err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  // 添加一个新的 effect 来监听 selectedTaskId 的变化
  useEffect(() => {
    // 当选择的任务改变时，清除之前的 aiOutput
    if (selectedTaskId !== null) {
      setAiOutput(null);
      // 这里不自动获取布局，让用户手动点击 "Start Task" 按钮
    }
  }, [selectedTaskId]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]);

// 完成任务
const completeTask = async (taskId: number) => {
  const token = authService.getToken();
  if (!token) {
    throw new Error('No authentication token');
  }

  console.log('completeTask called with taskId:', taskId);
  console.log('API_BASE_URL:', API_BASE_URL);

  setLoading(true);
  setError(null);
  try {
    console.log(`Completing task ${taskId}...`);
    const url = `${API_BASE_URL}/api/worker/complete_task/${taskId}`;
    console.log('API URL:', url);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (response.ok) {
      const data = await response.json();
      console.log('Task completed successfully:', data);
      
      // 更新本地状态
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.task_id === taskId 
            ? { ...task, status: 'Completed' }
            : task
        )
      );
      
      return { success: true, message: data.message };
    } else {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `HTTP ${response.status}` };
      }
      console.error('Error completing task:', errorData);
      setError(`Failed to complete task: ${errorData.message || 'Unknown error'}`);
      return { success: false, message: errorData.message || 'Failed to complete task' };
    }
  } catch (err) {
    console.error('Network error completing task:', err);
    const errorMessage = 'Network error: Unable to complete task';
    setError(errorMessage);
    return { success: false, message: errorMessage };
  } finally {
    setLoading(false);
  }
};

  return {
    tasks,
    selectedTaskId,
    setSelectedTaskId,
    aiOutput,
    loading,
    error,
    fetchTaskLayout,
    completeTask,
    refetch: () => selectedTaskId && fetchTaskLayout(selectedTaskId),
  };
};