import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  FolderKanban,
  Building2,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { StatCard, Card, CardHeader, CardTitle, CardBody } from '../../components/common';
import { RevenueAreaChart, ActivityFeedWidget, AnalyticsPieChart } from '../../components/features';
import { analyticsService, revenueService } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency, formatNumber, formatPercentage } from '../../utils/formatters';
import { canViewRevenue } from '../../helpers/roleHelpers';
import { Breadcrumb } from '../../components/common/navigation';

/**
 * Dashboard page component
 */
const DashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [analytics, revenue] = await Promise.all([
          analyticsService.getDashboard(),
          canViewRevenue(user) ? revenueService.getMonthly() : Promise.resolve([]),
        ]);
        setDashboardData(analytics);
        setRevenueData(revenue);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-skeleton">Loading dashboard...</div>
      </div>
    );
  }

  const overview = dashboardData?.overview || {};
  const projectsByStatus = dashboardData?.projectsByStatus || [];
  const employeesByDepartment = dashboardData?.employeesByDepartment || [];
  const recentActivity = dashboardData?.recentActivity || [];
  const upcomingDeadlines = dashboardData?.upcomingDeadlines || [];

  // Transform data for pie charts
  const projectStatusData = projectsByStatus.map((item) => ({
    name: item.status.replace('_', ' '),
    value: item.count,
  }));

  const departmentData = employeesByDepartment.map((item) => ({
    name: item.department,
    value: item.count,
  }));

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="page-header-content">
          <Breadcrumb />
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.firstName}!</p>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div
        className="stats-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        <StatCard
          title="Total Employees"
          value={formatNumber(overview.totalEmployees ?? 0)}
          icon={Users}
          trend="up"
          trendValue={`${overview.employeeGrowth ?? 0}%`}
          color="primary"
        />
        <StatCard
          title="Active Projects"
          value={formatNumber(overview.totalProjects ?? 0)}
          icon={FolderKanban}
          trend="up"
          trendValue={`${overview.projectGrowth ?? 0}%`}
          color="success"
        />
        <StatCard
          title="Departments"
          value={formatNumber(overview.totalDepartments ?? 0)}
          icon={Building2}
          color="info"
        />
        {canViewRevenue(user) && (
          <StatCard
            title="Total Revenue"
            value={formatCurrency(overview.totalRevenue ?? 0)}
            icon={DollarSign}
            trend="up"
            trendValue={`${overview.revenueGrowth ?? 0}%`}
            color="warning"
          />
        )}
      </motion.div>

      {/* Charts Row */}
      <div className="dashboard-charts">
        {canViewRevenue(user) && revenueData.length > 0 && (
          <div className="chart-large">
            <RevenueAreaChart data={revenueData} title="Revenue Overview" />
          </div>
        )}

        <div className="chart-small">
          <AnalyticsPieChart
            data={projectStatusData}
            title="Projects by Status"
            dataKey="value"
            nameKey="name"
          />
        </div>

        <div className="chart-small">
          <AnalyticsPieChart
            data={departmentData}
            title="Employees by Department"
            dataKey="value"
            nameKey="name"
          />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="dashboard-bottom">
        {/* Recent Activity */}
        <div className="dashboard-activity">
          <ActivityFeedWidget activities={recentActivity} />
        </div>

        {/* Upcoming Deadlines */}
        <div className="dashboard-deadlines">
          <Card className="deadlines-card">
            <CardHeader
              actions={
                <Link to="/projects" className="view-all-link">
                  View All <ArrowRight size={14} />
                </Link>
              }
            >
              <CardTitle>
                <Clock size={18} /> Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardBody>
              <ul className="deadlines-list">
                {upcomingDeadlines.map((deadline, index) => (
                  <motion.li
                    key={deadline.id}
                    className="deadline-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="deadline-info">
                      <span className="deadline-project">{deadline.project}</span>
                      <span className="deadline-date">{deadline.deadline}</span>
                    </div>
                    <span
                      className={`deadline-days ${
                        deadline.daysLeft <= 7 ? 'urgent' : ''
                      }`}
                    >
                      {deadline.daysLeft} days left
                    </span>
                  </motion.li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
