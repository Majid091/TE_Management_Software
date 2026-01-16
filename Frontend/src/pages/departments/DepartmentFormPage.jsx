import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Input, TextArea, Select, Card } from '../../components/common';
import { Breadcrumb } from '../../components/common/navigation';
import { departmentService, employeeService } from '../../api';
import { useApp } from '../../hooks/useApp';

/**
 * Department create/edit form page
 */
const DepartmentFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addDepartment, updateDepartment } = useApp();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(isEditMode);
  const [employees, setEmployees] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      headId: '',
      budget: '',
    },
  });

  // Fetch employees for head selection
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await employeeService.getAll({ limit: 100 });
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  // Fetch department data if editing
  useEffect(() => {
    if (isEditMode) {
      const fetchDepartment = async () => {
        try {
          setFetchingData(true);
          const department = await departmentService.getById(id);
          reset({
            name: department.name,
            description: department.description || '',
            headId: department.head?.id || '',
            budget: department.budget || '',
          });
        } catch (error) {
          console.error('Error fetching department:', error);
          toast.error('Failed to load department data');
          navigate('/departments');
        } finally {
          setFetchingData(false);
        }
      };
      fetchDepartment();
    }
  }, [id, isEditMode, reset, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const departmentData = {
        name: data.name,
        description: data.description || undefined,
        budget: data.budget ? parseFloat(data.budget) : undefined,
        headId: data.headId ? Number(data.headId) : undefined,
      };

      if (isEditMode) {
        const updated = await departmentService.update(id, departmentData);
        updateDepartment(updated);
        toast.success('Department updated successfully');
      } else {
        const created = await departmentService.create(departmentData);
        addDepartment(created);
        toast.success('Department created successfully');
      }
      navigate('/departments');
    } catch (error) {
      console.error('Error saving department:', error);
      console.error('Error response:', error.response?.data);

      const errorMessage = error.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        toast.error(errorMessage.join(', '));
      } else if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error('Failed to save department');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="form-page">
        <div className="page-loading">Loading department data...</div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="page-header">
        <div className="page-header-content">
          <Breadcrumb />
          <h1 className="page-title">
            {isEditMode ? 'Edit Department' : 'Create Department'}
          </h1>
          <p className="page-subtitle">
            {isEditMode
              ? 'Update department information'
              : 'Add a new department to your organization'}
          </p>
        </div>
        <div className="page-header-actions">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => navigate('/departments')}
          >
            Back
          </Button>
        </div>
      </div>

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="form-card">
          <div className="form-section">
            <h3 className="form-section-title">Department Information</h3>
            <div className="form-row">
              <Input
                label="Department Name"
                placeholder="Enter department name"
                error={errors.name?.message}
                required
                {...register('name', {
                  required: 'Department name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                })}
              />
              <Select
                label="Department Head"
                error={errors.headId?.message}
                {...register('headId')}
              >
                <option value="">Select department head</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} - {emp.position}
                  </option>
                ))}
              </Select>
            </div>
            <div className="form-row">
              <TextArea
                label="Description"
                placeholder="Enter department description"
                error={errors.description?.message}
                {...register('description')}
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Budget</h3>
            <div className="form-row">
              <Input
                type="number"
                label="Annual Budget"
                placeholder="Enter annual budget"
                error={errors.budget?.message}
                {...register('budget', {
                  min: {
                    value: 0,
                    message: 'Budget cannot be negative',
                  },
                })}
              />
            </div>
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/departments')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={Save}
              loading={isSubmitting || loading}
            >
              {isEditMode ? 'Update Department' : 'Create Department'}
            </Button>
          </div>
        </Card>
      </motion.form>
    </div>
  );
};

export default DepartmentFormPage;
