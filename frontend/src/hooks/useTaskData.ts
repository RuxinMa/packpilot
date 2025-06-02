import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuthContext();

  // 获取工人的任务列表
  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/worker/my_tasks', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks || []);
        // 自动选择第一个任务
        if (data.tasks && data.tasks.length > 0) {
          setSelectedTaskId(data.tasks[0].task_id);
        }
      }
    } catch (err) {
      setError('Failed to fetch tasks');
    }
  };

  // 获取任务的优化布局
  const fetchTaskLayout = async (taskId: number) => {
    setLoading(true);
    setError(null);
    try {
      // 先尝试获取已有布局
      let response = await fetch(`/api/ai/get_task_layout/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // 如果没有布局，则进行优化
      if (!response.ok) {
        response = await fetch(`/api/ai/optimize_task/${taskId}?save=true`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      if (response.ok) {
        const data = await response.json();
        setAiOutput(data);
      } else {
        setError('Failed to get task layout');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  useEffect(() => {
    if (selectedTaskId) {
      fetchTaskLayout(selectedTaskId);
    }
  }, [selectedTaskId]);

  return {
    tasks,
    selectedTaskId,
    setSelectedTaskId,
    aiOutput,
    loading,
    error,
    refetch: () => selectedTaskId && fetchTaskLayout(selectedTaskId),
  };
};