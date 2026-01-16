import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create hashed passwords
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const managerPassword = await bcrypt.hash('Manager@123', 10);
  const employeePassword = await bcrypt.hash('Employee@123', 10);

  // ============ CREATE USERS ============
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@temanagement.com' },
    update: {},
    create: {
      email: 'admin@temanagement.com',
      passwordHash: adminPassword,
      role: 'admin',
      accountStatus: 'active',
    },
  });
  console.log('Admin user created:', adminUser.email);

  const managerUser = await prisma.user.upsert({
    where: { email: 'manager@temanagement.com' },
    update: {},
    create: {
      email: 'manager@temanagement.com',
      passwordHash: managerPassword,
      role: 'manager',
      accountStatus: 'active',
    },
  });
  console.log('Manager user created:', managerUser.email);

  const employeeUser = await prisma.user.upsert({
    where: { email: 'employee@temanagement.com' },
    update: {},
    create: {
      email: 'employee@temanagement.com',
      passwordHash: employeePassword,
      role: 'employee',
      accountStatus: 'active',
    },
  });
  console.log('Employee user created:', employeeUser.email);

  // ============ CREATE DEPARTMENTS ============
  const itDepartment = await prisma.department.upsert({
    where: { name: 'IT Department' },
    update: {},
    create: {
      name: 'IT Department',
      description: 'Information Technology Department',
      budget: 500000,
      location: 'Building A, Floor 3',
      email: 'it@temanagement.com',
      phone: '+1234567890',
    },
  });
  console.log('IT Department created');

  const hrDepartment = await prisma.department.upsert({
    where: { name: 'Human Resources' },
    update: {},
    create: {
      name: 'Human Resources',
      description: 'Human Resources Department',
      budget: 200000,
      location: 'Building A, Floor 1',
      email: 'hr@temanagement.com',
      phone: '+1234567891',
    },
  });
  console.log('HR Department created');

  const salesDepartment = await prisma.department.upsert({
    where: { name: 'Sales' },
    update: {},
    create: {
      name: 'Sales',
      description: 'Sales and Marketing Department',
      budget: 350000,
      location: 'Building B, Floor 2',
      email: 'sales@temanagement.com',
      phone: '+1234567892',
    },
  });
  console.log('Sales Department created');

  // ============ CREATE EMPLOYEES ============
  const adminEmployee = await prisma.employee.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      departmentId: itDepartment.id,
      firstName: 'System',
      lastName: 'Administrator',
      phone: '+1234567890',
      position: 'System Administrator',
      availability: 'available',
      hireDate: new Date('2020-01-15'),
      salary: 120000,
      skills: ['System Administration', 'Management', 'Security', 'DevOps'],
    },
  });
  console.log('Admin employee created');

  const managerEmployee = await prisma.employee.upsert({
    where: { userId: managerUser.id },
    update: {},
    create: {
      userId: managerUser.id,
      departmentId: itDepartment.id,
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '+1234567893',
      position: 'Engineering Manager',
      availability: 'available',
      hireDate: new Date('2021-03-20'),
      salary: 95000,
      skills: ['Project Management', 'Agile', 'Team Leadership', 'JavaScript'],
      managerId: adminEmployee.id,
    },
  });
  console.log('Manager employee created');

  const regularEmployee = await prisma.employee.upsert({
    where: { userId: employeeUser.id },
    update: {},
    create: {
      userId: employeeUser.id,
      departmentId: itDepartment.id,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567894',
      position: 'Software Developer',
      availability: 'available',
      hireDate: new Date('2022-06-10'),
      salary: 75000,
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      managerId: managerEmployee.id,
    },
  });
  console.log('Regular employee created');

  // Set department heads
  await prisma.department.update({
    where: { id: itDepartment.id },
    data: { headId: adminEmployee.id },
  });
  console.log('IT Department head assigned');

  // ============ CREATE PROJECTS ============
  const project1 = await prisma.project.upsert({
    where: { id: BigInt(1) },
    update: {},
    create: {
      name: 'Platform Development',
      description: 'Development of the main TE Management platform',
      status: 'in_progress',
      priority: 'high',
      departmentId: itDepartment.id,
      managerId: managerEmployee.id,
      client: 'Internal',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      budget: 150000,
      progress: 45,
      tags: ['development', 'platform', 'internal'],
    },
  });
  console.log('Project 1 created:', project1.name);

  const project2 = await prisma.project.upsert({
    where: { id: BigInt(2) },
    update: {},
    create: {
      name: 'Mobile App Development',
      description: 'Building mobile applications for iOS and Android',
      status: 'planning',
      priority: 'medium',
      departmentId: itDepartment.id,
      managerId: managerEmployee.id,
      client: 'External Client A',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2025-03-31'),
      budget: 200000,
      progress: 10,
      tags: ['mobile', 'ios', 'android'],
    },
  });
  console.log('Project 2 created:', project2.name);

  const project3 = await prisma.project.upsert({
    where: { id: BigInt(3) },
    update: {},
    create: {
      name: 'Website Redesign',
      description: 'Modernizing the company website',
      status: 'completed',
      priority: 'low',
      departmentId: salesDepartment.id,
      managerId: managerEmployee.id,
      client: 'Internal',
      startDate: new Date('2023-06-01'),
      endDate: new Date('2023-12-15'),
      budget: 50000,
      progress: 100,
      tags: ['web', 'design', 'marketing'],
    },
  });
  console.log('Project 3 created:', project3.name);

  // ============ CREATE PROJECT ASSIGNMENTS ============
  await prisma.projectAssignment.upsert({
    where: { id: BigInt(1) },
    update: {},
    create: {
      projectId: project1.id,
      employeeId: managerEmployee.id,
      role: 'Project Manager',
      allocationPercentage: 50,
      assignedAt: new Date('2024-01-01'),
    },
  });

  await prisma.projectAssignment.upsert({
    where: { id: BigInt(2) },
    update: {},
    create: {
      projectId: project1.id,
      employeeId: regularEmployee.id,
      role: 'Lead Developer',
      allocationPercentage: 100,
      assignedAt: new Date('2024-01-15'),
    },
  });

  await prisma.projectAssignment.upsert({
    where: { id: BigInt(3) },
    update: {},
    create: {
      projectId: project2.id,
      employeeId: regularEmployee.id,
      role: 'Developer',
      allocationPercentage: 50,
      assignedAt: new Date('2024-06-01'),
    },
  });
  console.log('Project assignments created');

  // ============ CREATE REVENUE RECORDS ============
  await prisma.revenueRecord.upsert({
    where: { id: BigInt(1) },
    update: {},
    create: {
      projectId: project1.id,
      amount: 75000,
      expense: 45000,
      profit: 30000,
      periodStart: new Date('2024-01-01'),
      periodEnd: new Date('2024-06-30'),
      description: 'Q1-Q2 2024 Revenue - Platform Development',
    },
  });

  await prisma.revenueRecord.upsert({
    where: { id: BigInt(2) },
    update: {},
    create: {
      projectId: project3.id,
      amount: 50000,
      expense: 35000,
      profit: 15000,
      periodStart: new Date('2023-06-01'),
      periodEnd: new Date('2023-12-15'),
      description: 'Website Redesign - Full Project Revenue',
    },
  });

  await prisma.revenueRecord.upsert({
    where: { id: BigInt(3) },
    update: {},
    create: {
      projectId: project2.id,
      amount: 20000,
      expense: 12000,
      profit: 8000,
      periodStart: new Date('2024-06-01'),
      periodEnd: new Date('2024-08-31'),
      description: 'Q3 2024 Revenue - Mobile App Planning Phase',
    },
  });
  console.log('Revenue records created');

  console.log('\n========================================');
  console.log('Seed completed successfully!');
  console.log('========================================');
  console.log('\nTest Accounts:');
  console.log('----------------------------------------');
  console.log('ADMIN:');
  console.log('  Email: admin@temanagement.com');
  console.log('  Password: Admin@123');
  console.log('----------------------------------------');
  console.log('MANAGER:');
  console.log('  Email: manager@temanagement.com');
  console.log('  Password: Manager@123');
  console.log('----------------------------------------');
  console.log('EMPLOYEE:');
  console.log('  Email: employee@temanagement.com');
  console.log('  Password: Employee@123');
  console.log('========================================\n');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
