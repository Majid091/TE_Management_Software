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
  CardHeader,
  CardTitle,
  CardBody,
} from '../../components/common';
import { FormField, FormRow, FormSection, FormActions } from '../../components/common/forms';
import { Breadcrumb } from '../../components/common/navigation';
import { employeeService, departmentService } from '../../api';
import { EMPLOYEE_AVAILABILITY, EMPLOYEE_AVAILABILITY_LABELS } from '../../constants/status';
import toast from 'react-hot-toast';

/**
 * Employee create/edit form page
 */
const EmployeeFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      position: '',
      departmentId: '',
      availability: EMPLOYEE_AVAILABILITY.AVAILABLE,
      salary: '',
      skills: '',
    },
  });

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await departmentService.getAll();
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    fetchDepartments();
  }, []);

  // Fetch employee data in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchEmployee = async () => {
        try {
          setLoading(true);
          const data = await employeeService.getById(id);
          reset({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone || '',
            position: data.position,
            departmentId: data.department?.id || '',
            availability: data.availability,
            salary: data.salary || '',
            skills: data.skills?.join(', ') || '',
          });
        } catch (error) {
          console.error('Error fetching employee:', error);
          toast.error('Employee not found');
          navigate('/employees');
        } finally {
          setLoading(false);
        }
      };
      fetchEmployee();
    }
  }, [id, isEditMode, reset, navigate]);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const employeeData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || undefined,
        position: data.position,
        departmentId: data.departmentId ? Number(data.departmentId) : undefined,
        availability: data.availability,
        skills: data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        salary: data.salary ? Number(data.salary) : undefined,
      };

      // Only include password for new employees
      if (!isEditMode && data.password) {
        employeeData.password = data.password;
      }

      if (isEditMode) {
        await employeeService.update(id, employeeData);
        toast.success('Employee updated successfully');
      } else {
        await employeeService.create(employeeData);
        toast.success('Employee created successfully');
      }

      navigate('/employees');
    } catch (error) {
      console.error('Error saving employee:', error);
      console.error('Error response:', error.response?.data);

      // Show specific validation errors from backend
      const errorMessage = error.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        toast.error(errorMessage.join(', '));
      } else if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error(isEditMode ? 'Failed to update employee' : 'Failed to create employee');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const departmentOptions = departments.map((dept) => ({
    value: dept.id,
    label: dept.name,
  }));

  const availabilityOptions = Object.values(EMPLOYEE_AVAILABILITY).map((status) => ({
    value: status,
    label: EMPLOYEE_AVAILABILITY_LABELS[status],
  }));

  if (loading) {
    return <div className="page-loading">Loading...</div>;
  }

  return (
    <div className="employee-form-page">
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
          <h1 className="page-title">
            {isEditMode ? 'Edit Employee' : 'Add New Employee'}
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
              <FormSection title="Personal Information">
                <FormRow>
                  <FormField>
                    <Input
                      label="First Name"
                      required
                      error={errors.firstName?.message}
                      {...register('firstName', {
                        required: 'First name is required',
                      })}
                    />
                  </FormField>
                  <FormField>
                    <Input
                      label="Last Name"
                      required
                      error={errors.lastName?.message}
                      {...register('lastName', {
                        required: 'Last name is required',
                      })}
                    />
                  </FormField>
                </FormRow>

                <FormRow>
                  <FormField>
                    <Input
                      type="email"
                      label="Email"
                      required
                      error={errors.email?.message}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Invalid email address',
                        },
                      })}
                    />
                  </FormField>
                  <FormField>
                    <Input
                      type="tel"
                      label="Phone"
                      error={errors.phone?.message}
                      {...register('phone')}
                    />
                  </FormField>
                </FormRow>

                {!isEditMode && (
                  <FormRow>
                    <FormField>
                      <Input
                        type="password"
                        label="Password"
                        required
                        error={errors.password?.message}
                        {...register('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters',
                          },
                        })}
                      />
                    </FormField>
                  </FormRow>
                )}
              </FormSection>

              <FormSection title="Employment Details">
                <FormRow>
                  <FormField>
                    <Input
                      label="Position"
                      required
                      error={errors.position?.message}
                      {...register('position', {
                        required: 'Position is required',
                      })}
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
                      label="Availability"
                      options={availabilityOptions}
                      error={errors.availability?.message}
                      {...register('availability')}
                    />
                  </FormField>
                  <FormField>
                    <Input
                      type="number"
                      label="Salary"
                      error={errors.salary?.message}
                      {...register('salary', {
                        min: { value: 0, message: 'Salary cannot be negative' },
                      })}
                    />
                  </FormField>
                </FormRow>

                <FormField>
                  <Input
                    label="Skills"
                    helperText="Separate skills with commas"
                    {...register('skills')}
                  />
                </FormField>
              </FormSection>

              <FormActions>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => navigate('/employees')}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  icon={Save}
                  loading={submitting}
                >
                  {isEditMode ? 'Update Employee' : 'Create Employee'}
                </Button>
              </FormActions>
            </form>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default EmployeeFormPage;
