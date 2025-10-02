import { format, formatDistanceToNow, isAfter, isBefore, parseISO } from 'date-fns';

// Date utilities
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString);
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'completed') return false;
  const dateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  return isBefore(dateObj, new Date());
};

export const isDueSoon = (dueDate, days = 3) => {
  if (!dueDate) return false;
  const dateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  const soonDate = new Date();
  soonDate.setDate(soonDate.getDate() + days);
  return isBefore(dateObj, soonDate) && isAfter(dateObj, new Date());
};

// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

// Task utilities
export const getStatusColor = (status) => {
  const colors = {
    'todo': '#6c757d',
    'in-progress': '#007bff',
    'in-review': '#ffc107',
    'completed': '#28a745'
  };
  return colors[status] || '#6c757d';
};

export const getPriorityColor = (priority) => {
  const colors = {
    'low': '#28a745',
    'medium': '#ffc107',
    'high': '#fd7e14',
    'urgent': '#dc3545'
  };
  return colors[priority] || '#6c757d';
};

export const getStatusIcon = (status) => {
  const icons = {
    'todo': '📝',
    'in-progress': '⚡',
    'in-review': '👀',
    'completed': '✅'
  };
  return icons[status] || '📝';
};

export const getPriorityIcon = (priority) => {
  const icons = {
    'low': '🟢',
    'medium': '🟡',
    'high': '🟠',
    'urgent': '🔴'
  };
  return icons[priority] || '🟡';
};

// File utilities
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (mimetype) => {
  if (mimetype.startsWith('image/')) return '🖼️';
  if (mimetype.includes('pdf')) return '📄';
  if (mimetype.includes('word')) return '📝';
  if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) return '📊';
  if (mimetype.includes('text')) return '📃';
  return '📎';
};

// Array utilities
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {});
};

// String utilities
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Local storage utilities
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting localStorage item:', error);
  }
};

export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error getting localStorage item:', error);
    return defaultValue;
  }
};

export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing localStorage item:', error);
  }
};