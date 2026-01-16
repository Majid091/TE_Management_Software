import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  FolderKanban,
  DollarSign,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  ConfirmModal,
} from '../../components/common';
import { Breadcrumb } from '../../components/common/navigation';
import { departmentService } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { useModal } from '../../hooks/useModal';
import { canManageDepartments } from '../../helpers/roleHelpers';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

/**
 * Department detail page
 */
const DepartmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const deleteModal = useModal();

  const [department, setDepartment] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [deptData, empData, projData] = await Promise.all([
          departmentService.getById(id),
          departmentService.getEmployees(id),
          departmentService.getProjects(id),
        ]);
        setDepartment(deptData);
        setEmployees(empData);
        setProjects(projData);
      } catch (error) {
        console.error('Error fetching department:', error);
        toast.error('Department not found');
        navigate('/departments');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await departmentService.delete(id);
      toast.success('Department deleted successfully');
      navigate('/departments');
    } catch (error) {
      console.error('Error deleting department:', error);
      toast.error('Failed to delete department');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="page-loading">Loading department...</div>;
  }

  if (!department) {
    return null;
  }

  return (
    <div className="department-detail-page">
      <div className="page-header">
        <div className="page-header-content">
          <Breadcrumb />
          <div className="page-header-nav">
            <Button
              variant="ghost"
              icon={ArrowLeft}
              onClick={() => navigate('/departments')}
            >
              Back to Departments
            </Button>
          </div>
        </div>
        <div className="page-header-actions">
          {canManageDepartments(user) && (
            <>
              <Button
                variant="outline"
                icon={Edit}
                onClick={() => navigate(`/departments/${id}/edit`)}
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
        className="department-detail-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header Card */}
        <Card className="department-header-card">
          <CardBody>
            <div className="department-header">
              <div className="department-icon large">
                {department.name?.[0]}
              </div>
              <div className="department-info">
                <h1 className="department-name">{department.name}</h1>
                <p className="department-description">{department.description}</p>
                {department.head && (
                  <p className="department-head">
                    Head: <Link to={`/employees/${department.head.id}`}>{department.head.name}</Link>
                  </p>
                )}
              </div>
            </div>

            <div className="department-stats">
              <div className="stat-item">
                <Users size={24} />
                <div>
                  <span className="stat-value">{department.employeeCount}</span>
                  <span className="stat-label">Employees</span>
                </div>
              </div>
              <div className="stat-item">
                <FolderKanban size={24} />
                <div>
                  <span className="stat-value">{department.projectCount}</span>
                  <span className="stat-label">Projects</span>
                </div>
              </div>
              <div className="stat-item">
                <DollarSign size={24} />
                <div>
                  <span className="stat-value">{formatCurrency(department.budget)}</span>
                  <span className="stat-label">Budget</span>
                </div>
              </div>
            </div>

            <div className="department-contact">
              {department.location && (
                <div className="contact-item">
                  <MapPin size={16} />
                  <span>{department.location}</span>
                </div>
              )}
              {department.email && (
                <div className="contact-item">
                  <Mail size={16} />
                  <span>{department.email}</span>
                </div>
              )}
              {department.phone && (
                <div className="contact-item">
                  <Phone size={16} />
                  <span>{department.phone}</span>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Employees */}
        <Card className="department-employees-card">
          <CardHeader>
            <CardTitle>
              <Users size={18} /> Team Members
            </CardTitle>
          </CardHeader>
          <CardBody>
            {employees.length > 0 ? (
              <ul className="employees-list">
                {employees.map((emp) => (
                  <li key={emp.id} className="employee-item">
                    <Link to={`/employees/${emp.id}`} className="employee-link">
                      <span className="employee-name">{emp.name}</span>
                      <span className="employee-position">{emp.position}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-data">No employees in this department</p>
            )}
          </CardBody>
        </Card>

        {/* Projects */}
        <Card className="department-projects-card">
          <CardHeader>
            <CardTitle>
              <FolderKanban size={18} /> Projects
            </CardTitle>
          </CardHeader>
          <CardBody>
            {projects.length > 0 ? (
              <ul className="projects-list">
                {projects.map((proj) => (
                  <li key={proj.id} className="project-item">
                    <Link to={`/projects/${proj.id}`} className="project-link">
                      <span className="project-name">{proj.name}</span>
                      <span className={`project-status status-${proj.status}`}>
                        {proj.status.replace('_', ' ')}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-data">No projects in this department</p>
            )}
          </CardBody>
        </Card>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        onConfirm={handleDelete}
        title="Delete Department"
        message={`Are you sure you want to delete "${department.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
};

export default DepartmentDetailPage;
