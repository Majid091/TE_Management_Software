import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, FolderKanban, Building2 } from 'lucide-react';
import {
  StatCard,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Select,
} from '../../components/common';
import {
  AnalyticsPieChart,
  AnalyticsListWidget,
  RevenueLineChart,
  RevenueBarChart,
} from '../../components/features';
import { Breadcrumb } from '../../components/common/navigation';
import { analyticsService } from '../../api';
import { formatNumber, formatPercentage } from '../../utils/formatters';

/**
 * Analytics dashboard page
 */
const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    employees: null,
    projects: null,
    departments: null,
    trends: null,
  });
  const [selectedPeriod, setSelectedPeriod] = useState('year');

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const [employees, projects, departments, trends] = await Promise.all([
          analyticsService.getEmployeeAnalytics(),
          analyticsService.getProjectAnalytics(),
          analyticsService.getDepartmentAnalytics(),
          analyticsService.getTrends(),
        ]);
        setAnalyticsData({
          employees,
          projects,
          departments,
          trends,
        });
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [selectedPeriod]);

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="page-loading">Loading analytics data...</div>
      </div>
    );
  }

  const { employees, projects, departments, trends } = analyticsData;

  // Transform data for pie charts
  const projectStatusData = projects?.byStatus?.map((item) => ({
    name: item.status.replace('_', ' '),
    value: item.count,
  })) || [];

  const employeeAvailabilityData = employees?.byAvailability?.map((item) => ({
    name: item.status.replace('_', ' '),
    value: item.count,
  })) || [];

  const departmentSizeData = departments?.bySize?.map((item) => ({
    name: item.department,
    value: item.count,
  })) || [];

  return (
    <div className="analytics-page">
      <div className="page-header">
        <div className="page-header-content">
          <Breadcrumb />
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Comprehensive insights and reports</p>
        </div>
        <div className="page-header-actions">
          <Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </Select>
        </div>
      </div>

      {/* Overview Stats */}
      <motion.div
        className="stats-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        <StatCard
          title="Total Employees"
          value={formatNumber(employees?.total || 0)}
          icon={Users}
          trend="up"
          trendValue={formatPercentage(12.5)}
          color="primary"
        />
        <StatCard
          title="Active Projects"
          value={formatNumber(projects?.total || 0)}
          icon={FolderKanban}
          color="success"
        />
        <StatCard
          title="Departments"
          value={formatNumber(departments?.total || 0)}
          icon={Building2}
          color="info"
        />
        <StatCard
          title="On-Time Completion"
          value={formatPercentage(projects?.onTimeCompletion || 0)}
          icon={BarChart3}
          color="warning"
        />
      </motion.div>

      {/* Charts Grid */}
      <div className="analytics-grid">
        {/* Employee Growth Trend */}
        <div className="analytics-col-8">
          <Card className="chart-card">
            <CardHeader>
              <CardTitle>Employee Growth Trend</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="chart-container">
                <RevenueLineChart
                  data={trends?.employeeGrowth?.map((item) => ({
                    ...item,
                    revenue: item.count,
                    profit: 0,
                    expenses: 0,
                  })) || []}
                  title=""
                />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Employee Availability */}
        <div className="analytics-col-4">
          <AnalyticsPieChart
            data={employeeAvailabilityData}
            title="Employee Availability"
            dataKey="value"
            nameKey="name"
          />
        </div>

        {/* Project Status */}
        <div className="analytics-col-4">
          <AnalyticsPieChart
            data={projectStatusData}
            title="Projects by Status"
            dataKey="value"
            nameKey="name"
          />
        </div>

        {/* Department Size */}
        <div className="analytics-col-4">
          <AnalyticsPieChart
            data={departmentSizeData}
            title="Employees by Department"
            dataKey="value"
            nameKey="name"
          />
        </div>

        {/* Key Metrics */}
        <div className="analytics-col-4">
          <AnalyticsListWidget
            title="Key Metrics"
            items={[
              { id: 1, label: 'Avg Tenure', value: `${employees?.averageTenure || 0} years` },
              { id: 2, label: 'Turnover Rate', value: formatPercentage(employees?.turnoverRate || 0) },
              { id: 3, label: 'Avg Project Duration', value: `${projects?.averageDuration || 0} months` },
              { id: 4, label: 'Budget Utilization', value: formatPercentage(projects?.averageBudgetUtilization || 0) },
            ]}
          />
        </div>

        {/* Department Budget Utilization */}
        <div className="analytics-col-12">
          <RevenueBarChart
            data={departments?.budgetUtilization?.map((item) => ({
              department: item.department,
              revenue: item.allocated,
              utilized: item.utilized,
            })) || []}
            title="Department Budget Allocation"
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
