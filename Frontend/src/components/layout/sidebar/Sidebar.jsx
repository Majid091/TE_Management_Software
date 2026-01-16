import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { MAIN_NAVIGATION, SECONDARY_NAVIGATION } from '../../../constants/navigation';
import { useAuth } from '../../../hooks/useAuth';
import { filterNavigationByRole } from '../../../helpers/roleHelpers';

/**
 * Sidebar navigation component
 */
const Sidebar = ({
  isCollapsed,
  onToggle,
  isMobileOpen = false,
  onMobileClose,
  isMobile = false
}) => {
  const location = useLocation();
  const { user } = useAuth();

  // Filter navigation based on user role
  const mainNavItems = filterNavigationByRole(MAIN_NAVIGATION, user);
  const secondaryNavItems = filterNavigationByRole(SECONDARY_NAVIGATION, user);

  // Determine sidebar classes
  const sidebarClasses = [
    'sidebar',
    isCollapsed && !isMobile ? 'collapsed' : '',
    isMobile && isMobileOpen ? 'mobile-open' : '',
    isMobile && !isMobileOpen ? 'mobile-closed' : '',
  ].filter(Boolean).join(' ');

  const handleNavClick = () => {
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <aside className={sidebarClasses}>
      <div className="sidebar-header">
        <NavLink to="/dashboard" className="sidebar-logo" onClick={handleNavClick}>
          <div className="logo-icon">TE</div>
          {(!isCollapsed || isMobile) && <span className="logo-text">TE Management</span>}
        </NavLink>

        {/* Mobile close button */}
        {isMobile && (
          <button
            className="sidebar-close-btn"
            onClick={onMobileClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

            return (
              <li key={item.id} className="nav-item">
                <NavLink
                  to={item.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  title={isCollapsed && !isMobile ? item.label : undefined}
                  onClick={handleNavClick}
                >
                  <Icon size={20} className="nav-icon" />
                  {(!isCollapsed || isMobile) && (
                    <span className="nav-label">{item.label}</span>
                  )}
                  {isActive && (
                    <motion.div
                      className="nav-active-indicator"
                      layoutId="activeNav"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>

        <div className="nav-divider"></div>

        <ul className="nav-list secondary">
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <li key={item.id} className="nav-item">
                <NavLink
                  to={item.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  title={isCollapsed && !isMobile ? item.label : undefined}
                  onClick={handleNavClick}
                >
                  <Icon size={20} className="nav-icon" />
                  {(!isCollapsed || isMobile) && (
                    <span className="nav-label">{item.label}</span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Desktop collapse toggle */}
      {!isMobile && (
        <button
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      )}
    </aside>
  );
};

export default Sidebar;
