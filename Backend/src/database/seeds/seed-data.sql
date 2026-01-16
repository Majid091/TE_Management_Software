-- Seed data for TE Management Software
-- Password for all users: "password123" (hashed with bcrypt)

-- Insert Users
INSERT INTO users (email, password_hash, role, account_status) VALUES
('admin@company.com', '$2b$10$YourHashedPasswordHere', 'admin', 'active'),
('manager@company.com', '$2b$10$YourHashedPasswordHere', 'manager', 'active'),
('employee@company.com', '$2b$10$YourHashedPasswordHere', 'employee', 'active');

-- Insert Departments
INSERT INTO departments (name, description, budget, location, email, phone) VALUES
('Engineering', 'Software development and technical operations', 2500000, 'Building A, Floor 3', 'engineering@company.com', '+1 234 567 8900'),
('Product', 'Product management and strategy', 1200000, 'Building A, Floor 2', 'product@company.com', '+1 234 567 8910'),
('Design', 'User experience and visual design', 800000, 'Building B, Floor 1', 'design@company.com', '+1 234 567 8920'),
('Marketing', 'Brand management and marketing campaigns', 1500000, 'Building B, Floor 2', 'marketing@company.com', '+1 234 567 8930'),
('Human Resources', 'Employee relations and talent acquisition', 400000, 'Building A, Floor 1', 'hr@company.com', '+1 234 567 8940'),
('Finance', 'Financial planning and accounting', 600000, 'Building A, Floor 1', 'finance@company.com', '+1 234 567 8950');

-- Insert Employees (link to users)
INSERT INTO employees (user_id, department_id, first_name, last_name, phone, position, availability, hire_date, salary, skills) VALUES
(1, 1, 'Admin', 'User', '+1 234 567 8901', 'System Administrator', 'available', '2020-01-01', 120000, ARRAY['System Admin', 'Management']),
(2, 2, 'Manager', 'User', '+1 234 567 8902', 'Product Manager', 'available', '2019-07-20', 110000, ARRAY['Product Strategy', 'Agile', 'Data Analysis']),
(3, 1, 'Employee', 'User', '+1 234 567 8903', 'Software Engineer', 'available', '2021-03-15', 95000, ARRAY['JavaScript', 'React', 'Node.js']);

-- Insert Sample Projects
INSERT INTO projects (name, description, status, priority, department_id, manager_id, client, start_date, end_date, budget, progress, tags) VALUES
('Project Alpha', 'Enterprise resource planning system modernization', 'in_progress', 'high', 1, 2, 'Acme Corporation', '2024-01-15', '2024-06-30', 500000, 65, ARRAY['ERP', 'Modernization', 'Cloud']),
('Project Beta', 'Mobile application development for retail client', 'in_progress', 'medium', 1, 2, 'RetailMax Inc.', '2024-02-01', '2024-08-15', 300000, 40, ARRAY['Mobile', 'iOS', 'Android']),
('Project Gamma', 'Data analytics platform implementation', 'planning', 'high', 2, 2, 'DataCorp Analytics', '2024-04-01', '2024-12-31', 800000, 10, ARRAY['Analytics', 'Big Data', 'AI']);

-- Note: After inserting the above data, you'll need to:
-- 1. Hash passwords properly using bcrypt (replace $2b$10$YourHashedPasswordHere)
-- 2. Update department head_id references if needed
-- 3. Add project assignments
-- 4. Add revenue records
