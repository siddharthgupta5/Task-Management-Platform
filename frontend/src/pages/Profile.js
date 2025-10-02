import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authAPI } from '../services/api';
import { User, Save, Mail, Lock } from 'lucide-react';

const Profile = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const { user, updateUser } = useAuth();
  const { success, error: showError } = useToast();
  
  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || ''
    }
  });

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, watch, reset: resetPassword } = useForm();

  const onProfileSubmit = async (data) => {
    setIsUpdating(true);
    try {
      const response = await authAPI.updateProfile({
        name: data.name,
        email: data.email
      });
      updateUser(response.data.user);
      success('Profile updated successfully!');
    } catch (error) {
      showError(error.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setIsChangingPassword(true);
    try {
      await authAPI.updateProfile({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      success('Password changed successfully!');
      resetPassword();
    } catch (error) {
      showError(error.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const watchNewPassword = watch('newPassword');

  return (
    <div className="profile-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Profile Settings</h1>
          <p>Manage your account information</p>
        </div>
      </div>

      <div className="profile-container">
        {/* Profile Information Card */}
        <div className="profile-card">
          <div className="card-header">
            <div className="card-icon">
              <User size={24} />
            </div>
            <div>
              <h2>Profile Information</h2>
              <p>Update your personal details</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                {...registerProfile('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' }
                })}
                className={profileErrors.name ? 'error' : ''}
                placeholder="Enter your full name"
              />
              {profileErrors.name && <span className="field-error">{profileErrors.name.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <Mail size={20} />
                <input
                  type="email"
                  id="email"
                  {...registerProfile('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  className={profileErrors.email ? 'error' : ''}
                  placeholder="Enter your email"
                />
              </div>
              {profileErrors.email && <span className="field-error">{profileErrors.email.message}</span>}
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  'Updating...'
                ) : (
                  <>
                    <Save size={18} />
                    Update Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Password Change Card */}
        <div className="profile-card">
          <div className="card-header">
            <div className="card-icon">
              <Lock size={24} />
            </div>
            <div>
              <h2>Change Password</h2>
              <p>Update your account password</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="profile-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                {...registerPassword('currentPassword', {
                  required: 'Current password is required'
                })}
                className={passwordErrors.currentPassword ? 'error' : ''}
                placeholder="Enter current password"
              />
              {passwordErrors.currentPassword && <span className="field-error">{passwordErrors.currentPassword.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                {...registerPassword('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                className={passwordErrors.newPassword ? 'error' : ''}
                placeholder="Enter new password"
              />
              {passwordErrors.newPassword && <span className="field-error">{passwordErrors.newPassword.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                {...registerPassword('confirmPassword', {
                  required: 'Please confirm your new password',
                  validate: (value) => value === watchNewPassword || 'Passwords do not match'
                })}
                className={passwordErrors.confirmPassword ? 'error' : ''}
                placeholder="Confirm new password"
              />
              {passwordErrors.confirmPassword && <span className="field-error">{passwordErrors.confirmPassword.message}</span>}
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isChangingPassword}
              >
                {isChangingPassword ? (
                  'Changing Password...'
                ) : (
                  <>
                    <Lock size={18} />
                    Change Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Account Statistics */}
        <div className="profile-card">
          <div className="card-header">
            <div className="card-icon">
              <User size={24} />
            </div>
            <div>
              <h2>Account Statistics</h2>
              <p>Your account activity overview</p>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <h3>Member Since</h3>
              <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="stat-item">
              <h3>Account Status</h3>
              <p>
                <span className="status-badge active">Active</span>
              </p>
            </div>
            <div className="stat-item">
              <h3>User Role</h3>
              <p>{user?.role || 'User'}</p>
            </div>
            <div className="stat-item">
              <h3>Last Login</h3>
              <p>{user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;