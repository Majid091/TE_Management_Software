import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { getRoleLabel, getRoleColors } from '../../../helpers/roleHelpers';

/**
 * Main header component
 */
const Header = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement global search
      console.log('Searching for:', searchQuery);
    }
  };

  const roleColors = user ? getRoleColors(user.role) : {};

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="btn-icon header-menu-btn"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        <form className="header-search" onSubmit={handleSearch}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </form>
      </div>

      <div className="header-right">
        <button className="btn-icon header-notification-btn" aria-label="Notifications">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>

        <div className="header-user" ref={userMenuRef}>
          <button
            className="user-menu-trigger"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.firstName} />
              ) : (
                <span>{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
              )}
            </div>
            <div className="user-info">
              <span className="user-name">
                {user?.firstName} {user?.lastName}
              </span>
              <span className={`user-role ${roleColors.text}`}>
                {getRoleLabel(user?.role)}
              </span>
            </div>
            <ChevronDown
              size={16}
              className={`chevron ${showUserMenu ? 'rotate' : ''}`}
            />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                className="user-menu"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="user-menu-header">
                  <div className="user-avatar large">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.firstName} />
                    ) : (
                      <span>{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
                    )}
                  </div>
                  <div>
                    <p className="user-name">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="user-email">{user?.email}</p>
                  </div>
                </div>

                <div className="user-menu-divider"></div>

                <Link
                  to="/settings"
                  className="user-menu-item"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings size={18} />
                  <span>Settings</span>
                </Link>

                <button
                  className="user-menu-item logout"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
