CREATE TYPE user_role AS ENUM ('admin', 'manager', 'employee');
CREATE TYPE account_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE employee_availability AS ENUM ('available', 'busy', 'on_leave', 'unavailable');
CREATE TYPE project_status AS ENUM ('planning', 'in_progress', 'on_hold', 'completed', 'cancelled');
CREATE TYPE project_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE audit_action AS ENUM ('create', 'update', 'delete', 'login', 'logout');
CREATE TYPE audit_entity_type AS ENUM ('user', 'employee', 'department', 'project', 'project_assignment', 'revenue');

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'employee',
    account_status account_status NOT NULL DEFAULT 'active',
    last_login_at TIMESTAMPTZ,
    password_changed_at TIMESTAMPTZ,
    failed_login_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMPTZ,
    refresh_token TEXT,
    refresh_token_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    budget NUMERIC(15, 2) NOT NULL DEFAULT 0,
    location VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    head_id BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE employees (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    department_id BIGINT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    position VARCHAR(255) NOT NULL,
    availability employee_availability NOT NULL DEFAULT 'available',
    hire_date DATE NOT NULL,
    salary NUMERIC(12, 2),
    skills TEXT[],
    avatar_url TEXT,
    manager_id BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT fk_employee_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_employee_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
    CONSTRAINT fk_employee_manager FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL
);

ALTER TABLE departments ADD CONSTRAINT fk_department_head FOREIGN KEY (head_id) REFERENCES employees(id) ON DELETE SET NULL;

CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status project_status NOT NULL DEFAULT 'planning',
    priority project_priority NOT NULL DEFAULT 'medium',
    department_id BIGINT NOT NULL,
    manager_id BIGINT NOT NULL,
    client VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget NUMERIC(15, 2) NOT NULL DEFAULT 0,
    progress INTEGER NOT NULL DEFAULT 0,
    tags TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT fk_project_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
    CONSTRAINT fk_project_manager FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE RESTRICT,
    CONSTRAINT check_progress CHECK (progress >= 0 AND progress <= 100),
    CONSTRAINT check_dates CHECK (end_date >= start_date)
);

CREATE TABLE project_assignments (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL,
    employee_id BIGINT NOT NULL,
    role VARCHAR(255) NOT NULL,
    allocation_percentage INTEGER NOT NULL DEFAULT 100,
    assigned_at DATE NOT NULL DEFAULT CURRENT_DATE,
    unassigned_at DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_assignment_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_assignment_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    CONSTRAINT check_allocation CHECK (allocation_percentage > 0 AND allocation_percentage <= 100),
    CONSTRAINT check_assignment_dates CHECK (unassigned_at IS NULL OR unassigned_at >= assigned_at),
    CONSTRAINT unique_active_assignment UNIQUE (project_id, employee_id, unassigned_at)
);

CREATE TABLE revenue_records (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    expense NUMERIC(15, 2) NOT NULL DEFAULT 0,
    profit NUMERIC(15, 2) GENERATED ALWAYS AS (amount - expense) STORED,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    description TEXT,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT fk_revenue_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT check_revenue_dates CHECK (period_end >= period_start),
    CONSTRAINT check_amount CHECK (amount >= 0),
    CONSTRAINT check_expense CHECK (expense >= 0)
);

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    action audit_action NOT NULL,
    entity_type audit_entity_type NOT NULL,
    entity_id BIGINT,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_account_status ON users(account_status) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NOT NULL;

CREATE INDEX idx_departments_name ON departments(name) WHERE deleted_at IS NULL;
CREATE INDEX idx_departments_head_id ON departments(head_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_departments_deleted_at ON departments(deleted_at) WHERE deleted_at IS NOT NULL;

CREATE INDEX idx_employees_user_id ON employees(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_department_id ON employees(department_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_manager_id ON employees(manager_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_availability ON employees(availability) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_full_name ON employees(first_name, last_name) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_hire_date ON employees(hire_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_deleted_at ON employees(deleted_at) WHERE deleted_at IS NOT NULL;

CREATE INDEX idx_projects_department_id ON projects(department_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_manager_id ON projects(manager_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_status ON projects(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_priority ON projects(priority) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_dates ON projects(start_date, end_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_client ON projects(client) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_deleted_at ON projects(deleted_at) WHERE deleted_at IS NOT NULL;

CREATE INDEX idx_project_assignments_project_id ON project_assignments(project_id);
CREATE INDEX idx_project_assignments_employee_id ON project_assignments(employee_id);
CREATE INDEX idx_project_assignments_active ON project_assignments(project_id, employee_id) WHERE unassigned_at IS NULL;
CREATE INDEX idx_project_assignments_dates ON project_assignments(assigned_at, unassigned_at);

CREATE INDEX idx_revenue_project_id ON revenue_records(project_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_revenue_period ON revenue_records(period_start, period_end) WHERE deleted_at IS NULL;
CREATE INDEX idx_revenue_recorded_at ON revenue_records(recorded_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_revenue_deleted_at ON revenue_records(deleted_at) WHERE deleted_at IS NOT NULL;

CREATE INDEX idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_assignments_updated_at BEFORE UPDATE ON project_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_revenue_records_updated_at BEFORE UPDATE ON revenue_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION log_user_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values)
        VALUES (OLD.id, 'delete', 'user', OLD.id, to_jsonb(OLD));
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values)
        VALUES (NEW.id, 'update', 'user', NEW.id, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_values)
        VALUES (NEW.id, 'create', 'user', NEW.id, to_jsonb(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION log_employee_changes()
RETURNS TRIGGER AS $$
DECLARE
    current_user_id BIGINT;
BEGIN
    current_user_id := NULLIF(current_setting('app.current_user_id', TRUE), '')::BIGINT;

    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values)
        VALUES (current_user_id, 'delete', 'employee', OLD.id, to_jsonb(OLD));
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values)
        VALUES (current_user_id, 'update', 'employee', NEW.id, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_values)
        VALUES (current_user_id, 'create', 'employee', NEW.id, to_jsonb(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION log_department_changes()
RETURNS TRIGGER AS $$
DECLARE
    current_user_id BIGINT;
BEGIN
    current_user_id := NULLIF(current_setting('app.current_user_id', TRUE), '')::BIGINT;

    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values)
        VALUES (current_user_id, 'delete', 'department', OLD.id, to_jsonb(OLD));
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values)
        VALUES (current_user_id, 'update', 'department', NEW.id, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_values)
        VALUES (current_user_id, 'create', 'department', NEW.id, to_jsonb(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION log_project_changes()
RETURNS TRIGGER AS $$
DECLARE
    current_user_id BIGINT;
BEGIN
    current_user_id := NULLIF(current_setting('app.current_user_id', TRUE), '')::BIGINT;

    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values)
        VALUES (current_user_id, 'delete', 'project', OLD.id, to_jsonb(OLD));
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values)
        VALUES (current_user_id, 'update', 'project', NEW.id, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_values)
        VALUES (current_user_id, 'create', 'project', NEW.id, to_jsonb(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION log_project_assignment_changes()
RETURNS TRIGGER AS $$
DECLARE
    current_user_id BIGINT;
BEGIN
    current_user_id := NULLIF(current_setting('app.current_user_id', TRUE), '')::BIGINT;

    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values)
        VALUES (current_user_id, 'delete', 'project_assignment', OLD.id, to_jsonb(OLD));
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values)
        VALUES (current_user_id, 'update', 'project_assignment', NEW.id, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_values)
        VALUES (current_user_id, 'create', 'project_assignment', NEW.id, to_jsonb(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION log_revenue_changes()
RETURNS TRIGGER AS $$
DECLARE
    current_user_id BIGINT;
BEGIN
    current_user_id := NULLIF(current_setting('app.current_user_id', TRUE), '')::BIGINT;

    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values)
        VALUES (current_user_id, 'delete', 'revenue', OLD.id, to_jsonb(OLD));
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values)
        VALUES (current_user_id, 'update', 'revenue', NEW.id, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_values)
        VALUES (current_user_id, 'create', 'revenue', NEW.id, to_jsonb(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_users AFTER INSERT OR UPDATE OR DELETE ON users FOR EACH ROW EXECUTE FUNCTION log_user_changes();
CREATE TRIGGER audit_employees AFTER INSERT OR UPDATE OR DELETE ON employees FOR EACH ROW EXECUTE FUNCTION log_employee_changes();
CREATE TRIGGER audit_departments AFTER INSERT OR UPDATE OR DELETE ON departments FOR EACH ROW EXECUTE FUNCTION log_department_changes();
CREATE TRIGGER audit_projects AFTER INSERT OR UPDATE OR DELETE ON projects FOR EACH ROW EXECUTE FUNCTION log_project_changes();
CREATE TRIGGER audit_project_assignments AFTER INSERT OR UPDATE OR DELETE ON project_assignments FOR EACH ROW EXECUTE FUNCTION log_project_assignment_changes();
CREATE TRIGGER audit_revenue_records AFTER INSERT OR UPDATE OR DELETE ON revenue_records FOR EACH ROW EXECUTE FUNCTION log_revenue_changes();
