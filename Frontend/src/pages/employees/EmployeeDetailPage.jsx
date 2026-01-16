import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  DollarSign,
  FolderKanban,
  User,
} from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardBody, ConfirmModal } from '../../components/common';
import { Breadcrumb } from '../../components/common/navigation';
import { employeeService } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { useModal } from '../../hooks/useModal';
import { canManageEmployees } from '../../helpers/roleHelpers';
import { formatDate, formatCurrency } from '../../utils/formatters';
import {
  EMPLOYEE_AVAILABILITY_LABELS,
  EMPLOYEE_AVAILABILITY_COLORS,
} from '../../constants/status';
import toast from 'react-hot-toast';

/**
 * Employee detail page
 */
const EmployeeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const deleteModal = useModal();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const data = await employeeService.getById(id);
        setEmployee(data);
      } catch (error) {
        console.error('Error fetching employee:', error);
        toast.error('Employee not found');
        navigate('/employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await employeeService.delete(id);
      toast.success('Employee deleted successfully');
      navigate('/employees');
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="page-loading">Loading employee...</div>;
  }

  if (!employee) {
    return null;
  }

  const availabilityColors = EMPLOYEE_AVAILABILITY_COLORS[employee.availability];

  return (
    <div className="employee-detail-page">
      <div className="page-header">
        <div className="page-header-content">
          <Breadcrumb />
          <div className="page-header-nav">
            <Button
              variant="ghost"
              icon={ArrowLeft}
              onClick={() => navigate('/employees')}
            >
              Back to Employees
            </Button>
          </div>
        </div>
        <div className="page-header-actions">
          {canManageEmployees(user) && (
            <>
              <Button
                variant="outline"
                icon={Edit}
                onClick={() => navigate(`/employees/${id}/edit`)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                icon={Trash2}
                onClick={() => deleteModal.open()}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <motion.div
        className="employee-detail-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Profile Card */}
        <Card className="employee-profile-card">
          <CardBody>
            <div className="profile-header">
              <div className="profile-avatar">
                {employee.avatar ? (
                  <img src={employee.avatar} alt={`${employee.firstName} ${employee.lastName}`} />
                ) : (
                  <span>
                    {employee.firstName?.[0]}
                    {employee.lastName?.[0]}
                  </span>
                )}
                <span
                  className={`availability-dot large ${availabilityColors?.dot || ''}`}
                />
              </div>
              <div className="profile-info">
                <h1 className="profile-name">
                  {employee.firstName} {employee.lastName}
                </h1>
                <p className="profile-position">{employee.position}</p>
                <span
                  className={`status-badge ${availabilityColors?.bg || ''} ${availabilityColors?.text || ''}`}
                >
                  {EMPLOYEE_AVAILABILITY_LABELS[employee.availability]}
                </span>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-item">
                <Mail size={18} />
                <span>{employee.email}</span>
              </div>
              {employee.phone && (
                <div className="detail-item">
                  <Phone size={18} />
                  <span>{employee.phone}</span>
                </div>
              )}
              <div className="detail-item">
                <Briefcase size={18} />
                <span>{employee.department?.name || 'No Department'}</span>
              </div>
              <div className="detail-item">
                <Calendar size={18} />
                <span>Hired {formatDate(employee.hireDate)}</span>
              </div>
              {employee.salary && canManageEmployees(user) && (
                <div className="detail-item">
                  <DollarSign size={18} />
                  <span>Salary: {formatCurrency(employee.salary)}</span>
                </div>
              )}
              {employee.manager && (
                <div className="detail-item">
                  <User size={18} />
                  <span>Manager: {employee.manager.name}</span>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Skills */}
        {employee.skills?.length > 0 && (
          <Card className="employee-skills-card">
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="skills-list">
                {employee.skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    className="skill-tag"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Projects */}
        <Card className="employee-projects-card">
          <CardHeader>
            <CardTitle>
              <FolderKanban size={18} /> Assigned Projects
            </CardTitle>
          </CardHeader>
          <CardBody>
            {employee.projects?.length > 0 ? (
              <ul className="projects-list">
                {employee.projects.map((project) => (
                  <li key={project.id} className="project-item">
                    <Link to={`/projects/${project.id}`} className="project-link">
                      {project.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-projects">No projects assigned</p>
            )}
          </CardBody>
        </Card>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        onConfirm={handleDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${employee.firstName} ${employee.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
};

export default EmployeeDetailPage;
