import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Users,
  DollarSign,
  Clock,
  Building2,
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
import { projectService } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { useModal } from '../../hooks/useModal';
import { canManageProjects } from '../../helpers/roleHelpers';
import { formatDate, formatCurrency } from '../../utils/formatters';
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
} from '../../constants/status';
import toast from 'react-hot-toast';

/**
 * Project detail page
 */
const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const deleteModal = useModal();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const data = await projectService.getById(id);
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
        toast.error('Project not found');
        navigate('/projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await projectService.delete(id);
      toast.success('Project deleted successfully');
      navigate('/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="page-loading">Loading project...</div>;
  }

  if (!project) {
    return null;
  }

  const statusColors = PROJECT_STATUS_COLORS[project.status];

  return (
    <div className="project-detail-page">
      <div className="page-header">
        <div className="page-header-content">
          <Breadcrumb />
          <div className="page-header-nav">
            <Button
              variant="ghost"
              icon={ArrowLeft}
              onClick={() => navigate('/projects')}
            >
              Back to Projects
            </Button>
          </div>
        </div>
        <div className="page-header-actions">
          {canManageProjects(user) && (
            <>
              <Button
                variant="outline"
                icon={Edit}
                onClick={() => navigate(`/projects/${id}/edit`)}
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
        className="project-detail-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Project Header Card */}
        <Card className="project-header-card">
          <CardBody>
            <div className="project-header">
              <div className="project-info">
                <h1 className="project-name">{project.name}</h1>
                <p className="project-client">{project.client}</p>
                <span
                  className={`status-badge large ${statusColors?.bg || ''} ${statusColors?.text || ''}`}
                >
                  {PROJECT_STATUS_LABELS[project.status]}
                </span>
              </div>
              <div className="project-progress-ring">
                <svg viewBox="0 0 36 36" className="progress-circle">
                  <path
                    className="progress-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="progress-value"
                    strokeDasharray={`${project.progress}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="20.35" className="progress-text">
                    {project.progress}%
                  </text>
                </svg>
                <p>Progress</p>
              </div>
            </div>

            <p className="project-description">{project.description}</p>

            <div className="project-meta">
              <div className="meta-item">
                <Calendar size={18} />
                <div>
                  <span className="meta-label">Timeline</span>
                  <span className="meta-value">
                    {formatDate(project.startDate)} - {formatDate(project.endDate)}
                  </span>
                </div>
              </div>
              <div className="meta-item">
                <DollarSign size={18} />
                <div>
                  <span className="meta-label">Budget</span>
                  <span className="meta-value">{formatCurrency(project.budget)}</span>
                </div>
              </div>
              <div className="meta-item">
                <DollarSign size={18} />
                <div>
                  <span className="meta-label">Revenue</span>
                  <span className="meta-value revenue">{formatCurrency(project.revenue)}</span>
                </div>
              </div>
              <div className="meta-item">
                <Building2 size={18} />
                <div>
                  <span className="meta-label">Department</span>
                  <span className="meta-value">{project.department?.name || '-'}</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Team Members */}
        <Card className="project-team-card">
          <CardHeader>
            <CardTitle>
              <Users size={18} /> Team Members ({project.team?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardBody>
            {project.team?.length > 0 ? (
              <ul className="team-list">
                {project.team.map((member) => (
                  <li key={member.id} className="team-member">
                    <Link to={`/employees/${member.id}`} className="member-link">
                      <div className="member-avatar">
                        {member.name?.[0]}
                      </div>
                      <div className="member-info">
                        <span className="member-name">{member.name}</span>
                        <span className="member-role">{member.role}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-team">No team members assigned</p>
            )}
          </CardBody>
        </Card>

        {/* Tags */}
        {project.tags?.length > 0 && (
          <Card className="project-tags-card">
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="tags-list">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </CardBody>
          </Card>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        onConfirm={handleDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
};

export default ProjectDetailPage;
