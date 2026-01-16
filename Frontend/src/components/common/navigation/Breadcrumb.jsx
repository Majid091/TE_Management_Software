import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { BREADCRUMB_CONFIG } from '../../../constants/navigation';

/**
 * Breadcrumb navigation component
 */
const Breadcrumb = ({ items = [] }) => {
  const location = useLocation();

  // Generate breadcrumbs from path if not provided
  const generateBreadcrumbs = () => {
    if (items.length > 0) return items;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    pathSegments.forEach((segment, index) => {
      const config = BREADCRUMB_CONFIG[segment];
      const path = '/' + pathSegments.slice(0, index + 1).join('/');

      // Check if segment is an ID (for detail pages)
      if (!config && segment.match(/^[0-9a-fA-F-]+$/)) {
        breadcrumbs.push({
          label: 'Details',
          path,
        });
      } else if (config) {
        breadcrumbs.push({
          label: config.label,
          path: config.path || path,
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length === 0) return null;

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        <li className="breadcrumb-item">
          <Link to="/dashboard" className="breadcrumb-link">
            <Home size={16} />
          </Link>
        </li>

        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <React.Fragment key={crumb.path || index}>
              <li className="breadcrumb-separator">
                <ChevronRight size={14} />
              </li>
              <li className="breadcrumb-item">
                {isLast ? (
                  <span className="breadcrumb-current">{crumb.label}</span>
                ) : (
                  <Link to={crumb.path} className="breadcrumb-link">
                    {crumb.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
