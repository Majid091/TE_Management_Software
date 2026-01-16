import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, DollarSign, Clock } from 'lucide-react';
import { Card } from '../../common/cards';
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
} from '../../../constants/status';
import { formatDate, formatCurrency } from '../../../utils/formatters';

/**
 * Project card component for grid view
 */
const ProjectCard = ({ project, onClick }) => {
  const navigate = useNavigate();

  const statusColor = PROJECT_STATUS_COLORS[project.status];
  const statusLabel = PROJECT_STATUS_LABELS[project.status];

  const handleClick = () => {
    if (onClick) {
      onClick(project);
    } else {
      navigate(`/projects/${project.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="project-card"
        hoverable
        onClick={handleClick}
        padding="medium"
      >
        <div className="project-card-header">
          <div className="project-info">
            <h3 className="project-name">{project.name}</h3>
            <p className="project-client">{project.client}</p>
          </div>
          <span
            className={`status-badge ${statusColor?.bg || ''} ${statusColor?.text || ''}`}
          >
            {statusLabel}
          </span>
        </div>

        <p className="project-description">{project.description}</p>

        <div className="project-progress">
          <div className="progress-header">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>
        </div>

        <div className="project-card-body">
          <div className="project-detail">
            <Calendar size={14} />
            <span>
              {formatDate(project.startDate)} - {formatDate(project.endDate)}
            </span>
          </div>
          <div className="project-detail">
            <Users size={14} />
            <span>{project.team?.length || 0} team members</span>
          </div>
          <div className="project-detail">
            <DollarSign size={14} />
            <span>Budget: {formatCurrency(project.budget)}</span>
          </div>
          {project.revenue > 0 && (
            <div className="project-detail revenue">
              <DollarSign size={14} />
              <span>Revenue: {formatCurrency(project.revenue)}</span>
            </div>
          )}
        </div>

        <div className="project-card-footer">
          <div className="project-tags">
            {project.tags?.slice(0, 3).map((tag) => (
              <span key={tag} className="project-tag">
                {tag}
              </span>
            ))}
          </div>
          <span className={`project-priority project-priority-${project.priority}`}>
            {project.priority} priority
          </span>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;
