import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { Button } from '../../common/buttons';
import { Input } from '../../common/inputs';

/**
 * Login form component
 */
const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (error) {
      setError('root', {
        message: error.message || 'Login failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      className="login-form"
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="login-form-header">
        <h2>Welcome Back</h2>
        <p>Sign in to your account to continue</p>
      </div>

      {errors.root && (
        <motion.div
          className="login-error"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          {errors.root.message}
        </motion.div>
      )}

      <div className="login-form-fields">
        <Input
          type="email"
          label="Email"
          placeholder="Enter your email"
          icon={Mail}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email address',
            },
          })}
        />

        <div className="password-field">
          <Input
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="Enter your password"
            icon={Lock}
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={isSubmitting}
        className="login-submit-btn"
      >
        Sign In
      </Button>

      <div className="login-form-footer">
        <p className="demo-credentials">
          <strong>Demo Credentials:</strong>
          <br />
          Admin: admin@temanagement.com / Admin@123
          <br />
          Manager: manager@temanagement.com / Manager@123
          <br />
          Employee: employee@temanagement.com / Employee@123
        </p>
      </div>
    </motion.form>
  );
};

export default LoginForm;
