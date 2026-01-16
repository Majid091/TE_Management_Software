import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import {
  Button,
  Input,
  Select,
  TextArea,
  Card,
  CardBody,
} from '../../components/common';
import { FormField, FormRow, FormSection, FormActions } from '../../components/common/forms';
import { Breadcrumb } from '../../components/common/navigation';
import { projectService, departmentService, employeeService } from '../../api';
import { PROJECT_STATUS, PROJECT_STATUS_LABELS } from '../../constants/status';
import toast from 'react-hot-toast';

/**
 * Project create/edit form page
 */
const ProjectFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      client: '',
      status: PROJECT_STATUS.PLANNING,
      departmentId: '',
      managerId: '',
      startDate: '',
      endDate: '',
      budget: '',
      priority: 'medium',
      tags: '',
    },
  });

  // Fetch departments and managers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptResponse, empResponse] = await Promise.all([
          departmentService.getAll(),
          employeeService.getAll({ limit: 100 }),
        ]);
        setDepartments(deptResponse.data);
        setManagers(empResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Fetch project data in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchProject = async () => {
        try {
          setLoading(true);
          const data = await projectService.getById(id);
          reset({
            name: data.name,
            description: data.description || '',
            client: data.client || '',
            status: data.status,
            departmentId: data.department?.id || '',
            managerId: data.manager?.id || '',
            startDate: data.startDate?.split('T')[0] || '',
            endDate: data.endDate?.split('T')[0] || '',
            budget: data.budget || '',
            priority: data.priority || 'medium',
            tags: data.tags?.join(', ') || '',
          });
        } catch (error) {
          console.error('Error fetching project:', error);
          toast.error('Project not found');
          navigate('/projects');
        } finally {
          setLoading(false);
        }
      };
      fetchProject();
    }
  }, [id, isEditMode, reset, navigate]);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const projectData = {
        name: data.name,
        description: data.description || undefined,
        client: data.client || undefined,
        status: data.status,
        priority: data.priority,
        departmentId: data.departmentId ? Number(data.departmentId) : undefined,
        managerId: data.managerId ? Number(data.managerId) : undefined,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        budget: data.budget ? Number(data.budget) : undefined,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      };

      if (isEditMode) {
        await projectService.update(id, projectData);
        toast.success('Project updated successfully');
      } else {
        await projectService.create(projectData);
        toast.success('Project created successfully');
      }

      navigate('/projects');
    } catch (error) {
      console.error('Error saving project:', error);
      console.error('Error response:', error.response?.data);

      const errorMessage = error.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        toast.error(errorMessage.join(', '));
      } else if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error(isEditMode ? 'Failed to update project' : 'Failed to create project');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const departmentOptions = departments.map((dept) => ({
    value: dept.id,
    label: dept.name,
  }));

  const managerOptions = managers.map((emp) => ({
    value: emp.id,
    label: `${emp.firstName} ${emp.lastName}`,
  }));

  const statusOptions = Object.values(PROJECT_STATUS).map((status) => ({
    value: status,
    label: PROJECT_STATUS_LABELS[status],
  }));

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  if (loading) {
    return <div className="page-loading">Loading...</div>;
  }

  return (
    <div className="project-form-page">
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
          <h1 className="page-title">
            {isEditMode ? 'Edit Project' : 'Create New Project'}
          </h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="form-card">
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormSection title="Project Information">
                <FormField>
                  <Input
                    label="Project Name"
                    required
                    error={errors.name?.message}
                    {...register('name', {
                      required: 'Project name is required',
                    })}
                  />
                </FormField>

                <FormField>
                  <TextArea
                    label="Description"
                    rows={4}
                    error={errors.description?.message}
                    {...register('description')}
                  />
                </FormField>

                <FormRow>
                  <FormField>
                    <Input
                      label="Client"
                      error={errors.client?.message}
                      {...register('client')}
                    />
                  </FormField>
                  <FormField>
                    <Select
                      label="Department"
                      required
                      options={departmentOptions}
                      error={errors.departmentId?.message}
                      {...register('departmentId', {
                        required: 'Department is required',
                      })}
                    />
                  </FormField>
                </FormRow>

                <FormRow>
                  <FormField>
                    <Select
                      label="Project Manager"
                      required
                      options={managerOptions}
                      error={errors.managerId?.message}
                      {...register('managerId', {
                        required: 'Project manager is required',
                      })}
                    />
                  </FormField>
                </FormRow>
              </FormSection>

              <FormSection title="Project Details">
                <FormRow>
                  <FormField>
                    <Select
                      label="Status"
                      options={statusOptions}
                      error={errors.status?.message}
                      {...register('status')}
                    />
                  </FormField>
                  <FormField>
                    <Select
                      label="Priority"
                      options={priorityOptions}
                      error={errors.priority?.message}
                      {...register('priority')}
                    />
                  </FormField>
                </FormRow>

                <FormRow>
                  <FormField>
                    <Input
                      type="date"
                      label="Start Date"
                      required
                      error={errors.startDate?.message}
                      {...register('startDate', {
                        required: 'Start date is required',
                      })}
                    />
                  </FormField>
                  <FormField>
                    <Input
                      type="date"
                      label="End Date"
                      required
                      error={errors.endDate?.message}
                      {...register('endDate', {
                        required: 'End date is required',
                      })}
                    />
                  </FormField>
                </FormRow>

                <FormRow>
                  <FormField>
                    <Input
                      type="number"
                      label="Budget"
                      error={errors.budget?.message}
                      {...register('budget', {
                        min: { value: 0, message: 'Budget cannot be negative' },
                      })}
                    />
                  </FormField>
                  <FormField>
                    <Input
                      label="Tags"
                      helperText="Separate tags with commas"
                      {...register('tags')}
                    />
                  </FormField>
                </FormRow>
              </FormSection>

              <FormActions>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => navigate('/projects')}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  icon={Save}
                  loading={submitting}
                >
                  {isEditMode ? 'Update Project' : 'Create Project'}
                </Button>
              </FormActions>
            </form>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProjectFormPage;
