import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { tasksAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const { error: showError, success } = useToast();

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getTasks(filters);
      setTasks(response.data.tasks);
      setPagination(response.data.pagination);
    } catch (error) {
      showError('Failed to load tasks');
      console.error('Tasks error:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, showError]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handleSearch = (e) => {
    handleFilterChange('search', e.target.value);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await tasksAPI.deleteTask(taskId);
      success('Task deleted successfully');
      fetchTasks(); // Refresh the list
    } catch (error) {
      showError('Failed to delete task');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'todo': '#6c757d',
      'in-progress': '#007bff',
      'in-review': '#ffc107',
      'completed': '#28a745'
    };
    return colors[status] || '#6c757d';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': '#28a745',
      'medium': '#ffc107',
      'high': '#fd7e14',
      'urgent': '#dc3545'
    };
    return colors[priority] || '#6c757d';
  };

  const isOverdue = (dueDate, status) => {
    if (status === 'completed') return false;
    return new Date(dueDate) < new Date();
  };

  if (loading && filters.page === 1) {
    return <LoadingSpinner message="Loading tasks..." />;
  }

  return (
    <div className="task-list-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Tasks</h1>
          <p>Manage and track your tasks</p>
        </div>
        <Link to="/tasks/new" className="btn btn-primary">
          <Plus size={20} />
          Create Task
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        <button 
          className="filter-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Status</label>
            <select 
              value={filters.status} 
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="in-review">In Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Priority</label>
            <select 
              value={filters.priority} 
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select 
              value={filters.sortBy} 
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="createdAt">Created Date</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="title">Title</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Order</label>
            <select 
              value={filters.sortOrder} 
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      )}

      {/* Tasks List */}
      {loading ? (
        <div className="loading-overlay">
          <LoadingSpinner size="small" />
        </div>
      ) : tasks.length > 0 ? (
        <>
          <div className="tasks-grid">
            {tasks.map(task => (
              <div key={task._id} className={`task-card ${isOverdue(task.dueDate, task.status) ? 'overdue' : ''}`}>
                <div className="task-header">
                  <h3 className="task-title">{task.title}</h3>
                  <div className="task-actions">
                    <Link to={`/tasks/${task._id}`} className="action-btn view">
                      <Eye size={16} />
                    </Link>
                    <Link to={`/tasks/${task._id}/edit`} className="action-btn edit">
                      <Edit size={16} />
                    </Link>
                    <button 
                      onClick={() => handleDeleteTask(task._id)}
                      className="action-btn delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="task-description">
                  {task.description.length > 120 
                    ? `${task.description.substring(0, 120)}...`
                    : task.description
                  }
                </p>

                <div className="task-badges">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(task.status) }}
                  >
                    {task.status.replace('-', ' ')}
                  </span>
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                  >
                    {task.priority}
                  </span>
                  {isOverdue(task.dueDate, task.status) && (
                    <span className="overdue-badge">Overdue</span>
                  )}
                </div>

                <div className="task-meta">
                  <div className="meta-item">
                    <User size={14} />
                    <span>{task.assignedTo?.name}</span>
                  </div>
                  <div className="meta-item">
                    <Calendar size={14} />
                    <span>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                  </div>
                </div>

                {task.tags && task.tags.length > 0 && (
                  <div className="task-tags">
                    {task.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                    {task.tags.length > 3 && (
                      <span className="tag">+{task.tags.length - 3} more</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => handleFilterChange('page', filters.page - 1)}
                disabled={!pagination.hasPrev}
                className="pagination-btn"
              >
                <ChevronLeft size={20} />
                Previous
              </button>

              <span className="pagination-info">
                Page {pagination.current} of {pagination.pages}
              </span>

              <button 
                onClick={() => handleFilterChange('page', filters.page + 1)}
                disabled={!pagination.hasNext}
                className="pagination-btn"
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No tasks found</h3>
          <p>
            {filters.search || filters.status || filters.priority 
              ? 'Try adjusting your search or filters'
              : 'Create your first task to get started'
            }
          </p>
          <Link to="/tasks/new" className="btn btn-primary">
            <Plus size={20} />
            Create Task
          </Link>
        </div>
      )}
    </div>
  );
};

export default TaskList;