import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI, tasksAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Plus,
  Calendar,
  User
} from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { error: showError } = useToast();

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch analytics overview
      const statsResponse = await analyticsAPI.getOverview();
      setStats(statsResponse.data);

      // Fetch recent tasks
      const tasksResponse = await tasksAPI.getTasks({ 
        limit: 5, 
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      setRecentTasks(tasksResponse.data.tasks);
      
    } catch (error) {
      showError('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

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

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {user?.name}!</h1>
          <p>Here's what's happening with your tasks today.</p>
        </div>
        <Link to="/tasks/new" className="btn btn-primary">
          <Plus size={20} />
          Create Task
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <CheckSquare size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats?.totalTasks || 0}</h3>
            <p>Total Tasks</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats?.completedTasks || 0}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats?.statusStats?.['in-progress'] || 0}</h3>
            <p>In Progress</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats?.overdueCount || 0}</h3>
            <p>Overdue</p>
          </div>
        </div>
      </div>

      {/* Completion Rate */}
      {stats && (
        <div className="completion-section">
          <h2>Completion Rate</h2>
          <div className="completion-bar">
            <div 
              className="completion-progress"
              style={{ width: `${stats.completionRate}%` }}
            ></div>
          </div>
          <p>{stats.completionRate.toFixed(1)}% of tasks completed</p>
        </div>
      )}

      {/* Recent Tasks */}
      <div className="recent-tasks-section">
        <div className="section-header">
          <h2>Recent Tasks</h2>
          <Link to="/tasks" className="view-all-link">
            View All Tasks
          </Link>
        </div>

        {recentTasks.length > 0 ? (
          <div className="tasks-list">
            {recentTasks.map(task => (
              <div key={task._id} className="task-item">
                <div className="task-content">
                  <div className="task-header">
                    <Link to={`/tasks/${task._id}`} className="task-title">
                      {task.title}
                    </Link>
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
                    </div>
                  </div>
                  
                  <p className="task-description">
                    {task.description.length > 100 
                      ? `${task.description.substring(0, 100)}...`
                      : task.description
                    }
                  </p>
                  
                  <div className="task-meta">
                    <div className="task-assignee">
                      <User size={16} />
                      <span>{task.assignedTo?.name}</span>
                    </div>
                    <div className="task-date">
                      <Calendar size={16} />
                      <span>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <CheckSquare size={48} />
            <h3>No tasks yet</h3>
            <p>Create your first task to get started</p>
            <Link to="/tasks/new" className="btn btn-primary">
              Create Task
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <Link to="/tasks/new" className="quick-action-card">
            <Plus size={24} />
            <span>Create Task</span>
          </Link>
          <Link to="/tasks" className="quick-action-card">
            <CheckSquare size={24} />
            <span>View All Tasks</span>
          </Link>
          <Link to="/analytics" className="quick-action-card">
            <TrendingUp size={24} />
            <span>View Analytics</span>
          </Link>
          <Link to="/profile" className="quick-action-card">
            <User size={24} />
            <span>Edit Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;