import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { tasksAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, Save, X } from 'lucide-react';

const EditTask = () => {
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();

  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getTaskById(id);
      const task = response.data.task;
      
      // Populate form with existing task data
      reset({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: new Date(task.dueDate).toISOString().slice(0, 16),
        assignedTo: task.assignedTo?._id || '',
        estimatedHours: task.estimatedHours || ''
      });
      
      setTags(task.tags || []);
    } catch (error) {
      showError('Failed to load task details');
      console.error('Edit task error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const taskData = {
        ...data,
        tags,
        estimatedHours: data.estimatedHours ? parseFloat(data.estimatedHours) : undefined
      };

      await tasksAPI.updateTask(id, taskData);
      success('Task updated successfully!');
      navigate(`/tasks/${id}`);
    } catch (error) {
      showError(error.message || 'Failed to update task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading task details..." />;
  }

  return (
    <div className="create-task-page">
      <div className="page-header">
        <button 
          onClick={() => navigate(-1)} 
          className="back-btn"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="header-content">
          <h1>Edit Task</h1>
          <p>Update task details</p>
        </div>
      </div>

      <div className="task-form-container">
        <form onSubmit={handleSubmit(onSubmit)} className="task-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Task Title *</label>
            <input
              type="text"
              id="title"
              {...register('title', { 
                required: 'Title is required',
                minLength: { value: 3, message: 'Title must be at least 3 characters' },
                maxLength: { value: 200, message: 'Title cannot exceed 200 characters' }
              })}
              className={errors.title ? 'error' : ''}
              placeholder="Enter task title"
            />
            {errors.title && <span className="field-error">{errors.title.message}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              rows={4}
              {...register('description', { 
                required: 'Description is required',
                minLength: { value: 10, message: 'Description must be at least 10 characters' },
                maxLength: { value: 2000, message: 'Description cannot exceed 2000 characters' }
              })}
              className={errors.description ? 'error' : ''}
              placeholder="Describe the task in detail"
            />
            {errors.description && <span className="field-error">{errors.description.message}</span>}
          </div>

          {/* Status and Priority Row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" {...register('status')}>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="in-review">In Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select id="priority" {...register('priority')}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Due Date and Estimated Hours Row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dueDate">Due Date *</label>
              <input
                type="datetime-local"
                id="dueDate"
                {...register('dueDate', { 
                  required: 'Due date is required'
                })}
                className={errors.dueDate ? 'error' : ''}
              />
              {errors.dueDate && <span className="field-error">{errors.dueDate.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="estimatedHours">Estimated Hours</label>
              <input
                type="number"
                id="estimatedHours"
                min="0"
                step="0.5"
                {...register('estimatedHours', {
                  min: { value: 0, message: 'Hours cannot be negative' },
                  max: { value: 999, message: 'Hours cannot exceed 999' }
                })}
                className={errors.estimatedHours ? 'error' : ''}
                placeholder="0"
              />
              {errors.estimatedHours && <span className="field-error">{errors.estimatedHours.message}</span>}
            </div>
          </div>

          {/* Assigned To */}
          <div className="form-group">
            <label htmlFor="assignedTo">Assign To</label>
            <input
              type="text"
              id="assignedTo"
              {...register('assignedTo')}
              placeholder={`Leave empty to assign to yourself (${user?.name})`}
            />
            <small className="field-help">
              Enter user ID or email. Leave empty to assign to yourself.
            </small>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <div className="tags-input-container">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagKeyPress}
                placeholder="Add tags..."
                className="tags-input"
              />
              <button 
                type="button" 
                onClick={addTag} 
                className="add-tag-btn"
                disabled={!tagInput.trim()}
              >
                Add
              </button>
            </div>
            
            {tags.length > 0 && (
              <div className="tags-list">
                {tags.map(tag => (
                  <span key={tag} className="tag">
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => removeTag(tag)}
                      className="remove-tag-btn"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Updating...'
              ) : (
                <>
                  <Save size={20} />
                  Update Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;