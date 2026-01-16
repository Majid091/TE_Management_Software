import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, Briefcase, Calendar } from 'lucide-react';
import { Card } from '../../common/cards';
import {
  EMPLOYEE_AVAILABILITY_LABELS,
  EMPLOYEE_AVAILABILITY_COLORS,
} from '../../../constants/status';
import { formatDate } from '../../../utils/formatters';

/**
 * Employee card component for grid view
 */
const EmployeeCard = ({ employee, onClick }) => {
  const navigate = useNavigate();

  const availabilityColor = EMPLOYEE_AVAILABILITY_COLORS[employee.availability];
  const availabilityLabel = EMPLOYEE_AVAILABILITY_LABELS[employee.availability];

  const handleClick = () => {
    if (onClick) {
      onClick(employee);
    } else {
      navigate(`/employees/${employee.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="employee-card"
        hoverable
        onClick={handleClick}
        padding="medium"
      >
        <div className="employee-card-header">
          <div className="employee-avatar">
            {employee.avatar ? (
              <img src={employee.avatar} alt={`${employee.firstName} ${employee.lastName}`} />
            ) : (
              <span>
                {employee.firstName?.[0]}
                {employee.lastName?.[0]}
              </span>
            )}
            <span
              className={`availability-dot ${availabilityColor?.dot || ''}`}
              title={availabilityLabel}
            />
          </div>
          <div className="employee-info">
            <h3 className="employee-name">
              {employee.firstName} {employee.lastName}
            </h3>
            <p className="employee-position">{employee.position}</p>
          </div>
        </div>

        <div className="employee-card-body">
          <div className="employee-detail">
            <Briefcase size={14} />
            <span>{employee.department?.name || 'No Department'}</span>
          </div>
          <div className="employee-detail">
            <Mail size={14} />
            <span>{employee.email}</span>
          </div>
          {employee.phone && (
            <div className="employee-detail">
              <Phone size={14} />
              <span>{employee.phone}</span>
            </div>
          )}
          {employee.hireDate && (
            <div className="employee-detail">
              <Calendar size={14} />
              <span>Hired {formatDate(employee.hireDate)}</span>
            </div>
          )}
        </div>

        <div className="employee-card-footer">
          <span className={`availability-badge ${availabilityColor?.bg || ''} ${availabilityColor?.text || ''}`}>
            {availabilityLabel}
          </span>
          {employee.projects?.length > 0 && (
            <span className="projects-count">
              {employee.projects.length} project{employee.projects.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default EmployeeCard;
