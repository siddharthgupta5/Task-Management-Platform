import React, { useState, useEffect, useCallback } from 'react';
import { analyticsAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Download, 
  TrendingUp, 
  Users, 
  Calendar,
  Filter
} from 'lucide-react';

const Analytics = () => {
  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('month');
  
  const { error: showError, success } = useToast();

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      const [overviewRes, trendsRes, performanceRes] = await Promise.all([
        analyticsAPI.getOverview({ dateRange: timeFilter }),
        analyticsAPI.getTaskTrends({ period: timeFilter }),
        analyticsAPI.getUserPerformance({ period: timeFilter })
      ]);

      setOverview(overviewRes.data);
      setTrends(trendsRes.data);
      setPerformance(performanceRes.data);
    } catch (error) {
      showError('Failed to load analytics data');
      console.error('Analytics error:', error);
    } finally {
      setLoading(false);
    }
  }, [timeFilter, showError]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const handleExport = async (format = 'json') => {
    try {
      const response = await analyticsAPI.exportTasks({ 
        format,
        startDate: getStartDate(),
        endDate: new Date().toISOString()
      });
      
      if (format === 'csv') {
        const blob = new Blob([response], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tasks-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        const blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tasks-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
      
      success(`Tasks exported as ${format.toUpperCase()}`);
    } catch (error) {
      showError('Failed to export data');
    }
  };

  const getStartDate = () => {
    const now = new Date();
    switch (timeFilter) {
      case 'week':
        return new Date(now.setDate(now.getDate() - 7)).toISOString();
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1)).toISOString();
      case 'quarter':
        return new Date(now.setMonth(now.getMonth() - 3)).toISOString();
      case 'year':
        return new Date(now.setFullYear(now.getFullYear() - 1)).toISOString();
      default:
        return new Date(now.setMonth(now.getMonth() - 1)).toISOString();
    }
  };

  // Chart colors
  const STATUS_COLORS = {
    'todo': '#6c757d',
    'in-progress': '#007bff',
    'in-review': '#ffc107',
    'completed': '#28a745'
  };

  const PRIORITY_COLORS = {
    'low': '#28a745',
    'medium': '#ffc107',
    'high': '#fd7e14',
    'urgent': '#dc3545'
  };

  if (loading) {
    return <LoadingSpinner message="Loading analytics..." />;
  }

  return (
    <div className="analytics-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Analytics & Reports</h1>
          <p>Track your task management performance</p>
        </div>
        <div className="header-actions">
          <div className="filter-group">
            <Filter size={18} />
            <select 
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value)}
              className="time-filter"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          <div className="export-buttons">
            <button 
              onClick={() => handleExport('json')} 
              className="btn btn-secondary"
            >
              <Download size={18} />
              Export JSON
            </button>
            <button 
              onClick={() => handleExport('csv')} 
              className="btn btn-secondary"
            >
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      {overview && (
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={32} />
            </div>
            <div className="stat-content">
              <h2>{overview.totalTasks}</h2>
              <p>Total Tasks</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Calendar size={32} />
            </div>
            <div className="stat-content">
              <h2>{overview.completedTasks}</h2>
              <p>Completed</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Users size={32} />
            </div>
            <div className="stat-content">
              <h2>{overview.completionRate.toFixed(1)}%</h2>
              <p>Completion Rate</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon alert">
              <TrendingUp size={32} />
            </div>
            <div className="stat-content">
              <h2>{overview.overdueCount}</h2>
              <p>Overdue Tasks</p>
            </div>
          </div>
        </div>
      )}

      <div className="charts-container">
        {/* Status Distribution */}
        {overview && overview.statusStats && Object.keys(overview.statusStats).length > 0 && (
          <div className="chart-card">
            <h3>Task Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(overview.statusStats).map(([status, count]) => ({
                    name: status.replace('-', ' '),
                    value: count,
                    fill: STATUS_COLORS[status]
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {Object.entries(overview.statusStats).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry[0]]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Priority Distribution */}
        {overview && overview.priorityStats && Object.keys(overview.priorityStats).length > 0 && (
          <div className="chart-card">
            <h3>Task Priority Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={Object.entries(overview.priorityStats).map(([priority, count]) => ({
                  priority: priority.charAt(0).toUpperCase() + priority.slice(1),
                  count,
                  fill: PRIORITY_COLORS[priority]
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="priority" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Task Creation Trends */}
        {trends && trends.creationTrends && Array.isArray(trends.creationTrends) && trends.creationTrends.length > 0 && (
          <div className="chart-card full-width">
            <h3>Task Creation Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={trends.creationTrends.map((item, index) => ({
                  date: `Period ${index + 1}`,
                  created: item.tasksCreated || 0,
                  completed: item.tasksCompleted || 0
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="created" 
                  stroke="#007bff" 
                  strokeWidth={2}
                  name="Created"
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#28a745" 
                  strokeWidth={2}
                  name="Completed"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* User Performance */}
        {performance && performance.userPerformance && Array.isArray(performance.userPerformance) && performance.userPerformance.length > 0 && (
          <div className="chart-card full-width">
            <h3>User Performance</h3>
            <div className="performance-table">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Total Tasks</th>
                    <th>Completed</th>
                    <th>Completion Rate</th>
                    <th>Overdue</th>
                    <th>Avg. Est. Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {performance.userPerformance.map(user => (
                    <tr key={user._id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">
                            {user.userName?.charAt(0).toUpperCase()}
                          </div>
                          {user.userName}
                        </div>
                      </td>
                      <td>{user.totalTasks || 0}</td>
                      <td>{user.completedTasks || 0}</td>
                      <td>
                        <div className="completion-rate">
                          <span>{(user.completionRate || 0).toFixed(1)}%</span>
                          <div className="completion-bar">
                            <div 
                              className="completion-progress"
                              style={{ width: `${user.completionRate || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td>{user.overdueTasks || 0}</td>
                      <td>{user.avgEstimatedHours || 0}h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State for Charts */}
        {(!overview || !overview.statusStats || Object.keys(overview.statusStats).length === 0) && 
         (!trends || !trends.creationTrends || trends.creationTrends.length === 0) && 
         (!performance || !performance.userPerformance || performance.userPerformance.length === 0) && (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No Analytics Data Available</h3>
            <p>Create some tasks to see analytics and reports</p>
          </div>
        )}
      </div>

      {/* Summary Section */}
      <div className="analytics-summary">
        <h3>Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <h4>Most Productive Period</h4>
            <p>
              {timeFilter === 'week' ? 'This week' : 
               timeFilter === 'month' ? 'This month' : 
               timeFilter === 'quarter' ? 'This quarter' : 'This year'}
            </p>
          </div>
          <div className="summary-item">
            <h4>Average Completion Time</h4>
            <p>Based on task creation and completion dates</p>
          </div>
          <div className="summary-item">
            <h4>Top Priority Focus</h4>
            <p>
              {overview && overview.priorityStats && Object.keys(overview.priorityStats).length > 0 ? (
                (() => {
                  const topPriority = Object.entries(overview.priorityStats).reduce((a, b) => 
                    overview.priorityStats[a[0]] > overview.priorityStats[b[0]] ? a : b
                  )[0];
                  return topPriority.charAt(0).toUpperCase() + topPriority.slice(1) + ' priority tasks';
                })()
              ) : (
                'No priority data available'
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;