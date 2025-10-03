import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { tasksAPI, commentsAPI, filesAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  MessageSquare, 
  Send,
  Paperclip,
  Download,
  Calendar,
  User,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error: showError } = useToast();

  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchTaskDetails = useCallback(async () => {
    try {
      setLoading(true);
      const [taskRes, commentsRes, filesRes] = await Promise.all([
        tasksAPI.getTaskById(id),
        commentsAPI.getTaskComments(id),
        filesAPI.getTaskFiles(id)
      ]);

      setTask(taskRes.data.task);
      setComments(commentsRes.data.comments || []);
      setFiles(filesRes.data?.files || []);
    } catch (error) {
      showError('Failed to load task details');
      console.error('Task detail error:', error);
      // Set default values in case of error
      setComments([]);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [id, showError]);

  useEffect(() => {
    fetchTaskDetails();
  }, [fetchTaskDetails]);

  const handleStatusChange = async (newStatus) => {
    try {
      await tasksAPI.updateTask(id, { status: newStatus });
      setTask(prev => ({ ...prev, status: newStatus }));
      success('Task status updated');
    } catch (error) {
      showError('Failed to update task status');
    }
  };

  const handleDeleteTask = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await tasksAPI.deleteTask(id);
      success('Task deleted successfully');
      navigate('/tasks');
    } catch (error) {
      showError('Failed to delete task');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentSubmitting(true);
    try {
      const response = await commentsAPI.addComment({
        content: newComment,
        taskId: id
      });
      setComments(prev => [response.data.comment, ...prev]);
      setNewComment('');
      success('Comment added');
    } catch (error) {
      showError('Failed to add comment');
    } finally {
      setCommentSubmitting(false);
    }
  };

  const onDrop = async (acceptedFiles) => {
    setUploading(true);
    try {
      const response = await filesAPI.uploadFiles(id, acceptedFiles);
      setFiles(prev => [...prev, ...response.data.files]);
      success(`${acceptedFiles.length} file(s) uploaded successfully`);
    } catch (error) {
      showError('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleDownloadFile = async (filename, originalName) => {
    try {
      const blob = await filesAPI.downloadFile(id, filename);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = originalName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showError('Failed to download file');
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

  if (loading) {
    return <LoadingSpinner message="Loading task details..." />;
  }

  if (!task) {
    return (
      <div className="error-state">
        <h2>Task not found</h2>
        <p>The task you're looking for doesn't exist or has been deleted.</p>
        <Link to="/tasks" className="btn btn-primary">Back to Tasks</Link>
      </div>
    );
  }

  return (
    <div className="task-detail-page">
      <div className="page-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="header-actions">
          <Link to={`/tasks/${id}/edit`} className="btn btn-secondary">
            <Edit size={18} />
            Edit
          </Link>
          <button onClick={handleDeleteTask} className="btn btn-danger">
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      <div className="task-detail-container">
        {/* Task Header */}
        <div className="task-header">
          <h1 className="task-title">{task.title}</h1>
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
              <span className="overdue-badge">
                <AlertTriangle size={16} />
                Overdue
              </span>
            )}
          </div>
        </div>

        {/* Task Meta */}
        <div className="task-meta-section">
          <div className="meta-item">
            <User size={18} />
            <div>
              <span className="meta-label">Assigned to:</span>
              <span className="meta-value">{task.assignedTo?.name}</span>
            </div>
          </div>
          <div className="meta-item">
            <Calendar size={18} />
            <div>
              <span className="meta-label">Due date:</span>
              <span className="meta-value">
                {format(new Date(task.dueDate), 'MMM dd, yyyy HH:mm')}
              </span>
            </div>
          </div>
          {task.estimatedHours && (
            <div className="meta-item">
              <Clock size={18} />
              <div>
                <span className="meta-label">Estimated:</span>
                <span className="meta-value">{task.estimatedHours}h</span>
              </div>
            </div>
          )}
        </div>

        {/* Status Actions */}
        <div className="status-actions">
          <label>Change Status:</label>
          <div className="status-buttons">
            {['todo', 'in-progress', 'in-review', 'completed'].map(status => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`status-btn ${task.status === status ? 'active' : ''}`}
                disabled={task.status === status}
              >
                {status.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Task Description */}
        <div className="task-description-section">
          <h3>Description</h3>
          <div className="task-description">
            {task.description.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="tags-section">
            <h3>Tags</h3>
            <div className="tags-list">
              {task.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* File Attachments */}
        <div className="files-section">
          <h3>Attachments</h3>
          
          {/* File Upload */}
          <div {...getRootProps()} className={`file-dropzone ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()} />
            <Paperclip size={24} />
            {uploading ? (
              <p>Uploading files...</p>
            ) : isDragActive ? (
              <p>Drop files here...</p>
            ) : (
              <p>Drag & drop files here, or click to select files</p>
            )}
          </div>

          {/* Files List */}
          {files.length > 0 && (
            <div className="files-list">
              {files.map(file => (
                <div key={file.filename} className="file-item">
                  <div className="file-info">
                    <span className="file-name">{file.originalName}</span>
                    <span className="file-size">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <button
                    onClick={() => handleDownloadFile(file.filename, file.originalName)}
                    className="download-btn"
                  >
                    <Download size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h3>
            <MessageSquare size={20} />
            Comments ({comments.length})
          </h3>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
              required
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={commentSubmitting || !newComment.trim()}
            >
              {commentSubmitting ? 'Posting...' : <><Send size={16} /> Post Comment</>}
            </button>
          </form>

          {/* Comments List */}
          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment._id} className="comment-item">
                <div className="comment-header">
                  <div className="comment-author">
                    <div className="author-avatar">
                      {comment.author?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="author-name">{comment.author?.name}</span>
                  </div>
                  <span className="comment-date">
                    {format(new Date(comment.createdAt), 'MMM dd, yyyy HH:mm')}
                  </span>
                </div>
                <div className="comment-content">
                  {comment.content.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {comments.length === 0 && (
            <div className="empty-comments">
              <MessageSquare size={48} />
              <p>No comments yet</p>
              <p>Be the first to add a comment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;