import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Bell, Palette, Globe, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Input, Card, Select } from '../../components/common';
import { Breadcrumb } from '../../components/common/navigation';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../hooks/useApp';
import { authService } from '../../api';

/**
 * Settings page component
 */
const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { state, setTheme, setLanguage } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    projectUpdates: true,
    teamChanges: true,
    weeklyReports: false,
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      updateUser(profileData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="settings-page">
      <div className="page-header">
        <div className="page-header-content">
          <Breadcrumb />
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account preferences</p>
        </div>
      </div>

      {/* Settings Tabs */}
      <Card className="settings-tabs-card" padding="none">
        <div className="settings-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Profile Settings */}
      {activeTab === 'profile' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="settings-section">
            <h3 className="settings-section-title">Profile Information</h3>
            <Card className="settings-card">
              <form onSubmit={handleProfileUpdate}>
                <div className="form-section">
                  <div className="form-row">
                    <Input
                      label="First Name"
                      value={profileData.firstName}
                      onChange={(e) =>
                        setProfileData({ ...profileData, firstName: e.target.value })
                      }
                    />
                    <Input
                      label="Last Name"
                      value={profileData.lastName}
                      onChange={(e) =>
                        setProfileData({ ...profileData, lastName: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-row">
                    <Input
                      type="email"
                      label="Email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({ ...profileData, email: e.target.value })
                      }
                    />
                    <Input
                      label="Phone"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({ ...profileData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <Button type="submit" variant="primary" loading={loading}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="settings-section">
            <h3 className="settings-section-title">Change Password</h3>
            <Card className="settings-card">
              <form onSubmit={handlePasswordChange}>
                <div className="form-section">
                  <div className="form-row">
                    <Input
                      type="password"
                      label="Current Password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-row">
                    <Input
                      type="password"
                      label="New Password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                      }
                    />
                    <Input
                      type="password"
                      label="Confirm New Password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <Button type="submit" variant="primary" loading={loading}>
                    Change Password
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          <div className="settings-section">
            <h3 className="settings-section-title">Two-Factor Authentication</h3>
            <Card className="settings-card">
              <div className="settings-item">
                <div className="settings-item-info">
                  <p className="settings-item-label">Enable 2FA</p>
                  <p className="settings-item-description">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button variant="outline" size="small">
                  Enable
                </Button>
              </div>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="settings-section">
            <h3 className="settings-section-title">Notification Preferences</h3>
            <Card className="settings-card">
              <div className="settings-item">
                <div className="settings-item-info">
                  <p className="settings-item-label">Email Notifications</p>
                  <p className="settings-item-description">
                    Receive notifications via email
                  </p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) =>
                      setNotifications({ ...notifications, email: e.target.checked })
                    }
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="settings-item">
                <div className="settings-item-info">
                  <p className="settings-item-label">Push Notifications</p>
                  <p className="settings-item-description">
                    Receive push notifications in browser
                  </p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={(e) =>
                      setNotifications({ ...notifications, push: e.target.checked })
                    }
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="settings-item">
                <div className="settings-item-info">
                  <p className="settings-item-label">Project Updates</p>
                  <p className="settings-item-description">
                    Get notified about project changes
                  </p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.projectUpdates}
                    onChange={(e) =>
                      setNotifications({ ...notifications, projectUpdates: e.target.checked })
                    }
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="settings-item">
                <div className="settings-item-info">
                  <p className="settings-item-label">Team Changes</p>
                  <p className="settings-item-description">
                    Get notified when team members join or leave
                  </p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.teamChanges}
                    onChange={(e) =>
                      setNotifications({ ...notifications, teamChanges: e.target.checked })
                    }
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="settings-item">
                <div className="settings-item-info">
                  <p className="settings-item-label">Weekly Reports</p>
                  <p className="settings-item-description">
                    Receive weekly summary reports
                  </p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.weeklyReports}
                    onChange={(e) =>
                      setNotifications({ ...notifications, weeklyReports: e.target.checked })
                    }
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Appearance Settings */}
      {activeTab === 'appearance' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="settings-section">
            <h3 className="settings-section-title">Theme</h3>
            <Card className="settings-card">
              <div className="settings-item">
                <div className="settings-item-info">
                  <p className="settings-item-label">Color Theme</p>
                  <p className="settings-item-description">
                    Choose your preferred color theme
                  </p>
                </div>
                <Select
                  value={state.ui.theme || 'light'}
                  onChange={(e) => setTheme(e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </Select>
              </div>
            </Card>
          </div>

          <div className="settings-section">
            <h3 className="settings-section-title">Language</h3>
            <Card className="settings-card">
              <div className="settings-item">
                <div className="settings-item-info">
                  <p className="settings-item-label">Display Language</p>
                  <p className="settings-item-description">
                    Select your preferred language
                  </p>
                </div>
                <Select
                  value={state.ui.language || 'en'}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </Select>
              </div>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SettingsPage;
