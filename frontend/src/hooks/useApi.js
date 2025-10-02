import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import taskService from '../services/taskService';
import fileService from '../services/fileService';
import analyticsService from '../services/analyticsService';
import toast from 'react-hot-toast';

// Hook for fetching tasks with filters
export const useTasks = (filters = {}) => {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => taskService.getTasks(filters),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching a single task
export const useTask = (taskId) => {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: () => taskService.getTaskById(taskId),
    enabled: !!taskId,
  });
};

// Hook for creating a task
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      toast.success('Task created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create task');
    },
  });
};

// Hook for updating a task
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => taskService.updateTask(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['tasks']);
      queryClient.invalidateQueries(['task', variables.id]);
      toast.success('Task updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update task');
    },
  });
};

// Hook for deleting a task
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      toast.success('Task deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    },
  });
};

// Hook for task comments
export const useTaskComments = (taskId) => {
  return useQuery({
    queryKey: ['comments', taskId],
    queryFn: () => taskService.getTaskComments(taskId),
    enabled: !!taskId,
  });
};

// Hook for adding a comment
export const useAddComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: taskService.addComment,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['comments', variables.taskId]);
      toast.success('Comment added successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add comment');
    },
  });
};

// Hook for file upload
export const useFileUpload = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskId, files }) => fileService.uploadFiles(taskId, files),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['task', variables.taskId]);
      toast.success(`${data.data.files.length} file(s) uploaded successfully!`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload files');
    },
  });
};

// Hook for analytics data
export const useAnalytics = (type, params = {}) => {
  const queryFn = () => {
    switch (type) {
      case 'overview':
        return analyticsService.getTaskOverview(params);
      case 'performance':
        return analyticsService.getUserPerformance(params);
      case 'trends':
        return analyticsService.getTaskTrends(params);
      default:
        throw new Error('Invalid analytics type');
    }
  };

  return useQuery({
    queryKey: ['analytics', type, params],
    queryFn,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for local storage
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// Hook for debounced value
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook for pagination
export const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const goToPage = (newPage) => setPage(newPage);
  const goToNextPage = () => setPage(prev => prev + 1);
  const goToPrevPage = () => setPage(prev => Math.max(1, prev - 1));
  const changeLimit = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
  };

  return {
    page,
    limit,
    goToPage,
    goToNextPage,
    goToPrevPage,
    changeLimit,
  };
};