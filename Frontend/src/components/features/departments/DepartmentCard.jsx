import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, FolderKanban, DollarSign, MapPin } from 'lucide-react';
import { Card } from '../../common/cards';
import { formatCurrency } from '../../../utils/formatters';

/**
 * Department card component for grid view
 */
const DepartmentCard = ({ department, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(department);
    } else {
      navigate(`/departments/${department.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="department-card"
        hoverable
        onClick={handleClick}
        padding="medium"
      >
        <div className="department-card-header">
          <div className="department-icon">
            {department.name?.[0]}
          </div>
          <div className="department-info">
            <h3 className="department-name">{department.name}</h3>
            {department.head && (
              <p className="department-head">
                Head: {department.head.name}
              </p>
            )}
          </div>
        </div>

        <p className="department-description">{department.description}</p>

        <div className="department-card-body">
          <div className="department-stat">
            <Users size={16} />
            <div>
              <span className="stat-value">{department.employeeCount}</span>
              <span className="stat-label">Employees</span>
            </div>
          </div>
          <div className="department-stat">
            <FolderKanban size={16} />
            <div>
              <span className="stat-value">{department.projectCount}</span>
              <span className="stat-label">Projects</span>
            </div>
          </div>
        </div>

        <div className="department-card-footer">
          {department.location && (
            <div className="department-detail">
              <MapPin size={14} />
              <span>{department.location}</span>
            </div>
          )}
          {department.budget && (
            <div className="department-detail">
              <DollarSign size={14} />
              <span>Budget: {formatCurrency(department.budget)}</span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default DepartmentCard;
