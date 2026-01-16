import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Calendar, Filter } from 'lucide-react';
import { StatCard, Card, CardHeader, CardTitle, CardBody, Button, Select } from '../../components/common';
import { RevenueLineChart, RevenueAreaChart, RevenueBarChart } from '../../components/features/revenue';
import { Breadcrumb } from '../../components/common/navigation';
import { revenueService } from '../../api';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

/**
 * Revenue dashboard page
 */
const RevenuePage = () => {
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState({
    summary: null,
    monthly: [],
    byDepartment: [],
    byProject: [],
  });
  const [selectedPeriod, setSelectedPeriod] = useState('year');

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        const [summary, monthly, byDepartment, byProject] = await Promise.all([
          revenueService.getSummary(),
          revenueService.getMonthly(),
          revenueService.getByDepartment(),
          revenueService.getByProject(),
        ]);
        setRevenueData({
          summary,
          monthly,
          byDepartment,
          byProject,
        });
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, [selectedPeriod]);

  if (loading) {
    return (
      <div className="revenue-page">
        <div className="page-loading">Loading revenue data...</div>
      </div>
    );
  }

  const { summary, monthly, byDepartment, byProject } = revenueData;

  return (
    <div className="revenue-page">
      <div className="page-header">
        <div className="page-header-content">
          <Breadcrumb />
          <h1 className="page-title">Revenue</h1>
          <p className="page-subtitle">Track and analyze your company's revenue</p>
        </div>
        <div className="page-header-actions">
          <Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </Select>
        </div>
      </div>

      {/* Revenue Stats */}
      <motion.div
        className="revenue-stats"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        <StatCard
          title="Total Revenue"
          value={formatCurrency(summary?.totalRevenue || 0)}
          icon={DollarSign}
          trend="up"
          trendValue={formatPercentage(summary?.revenueGrowth || 0)}
          color="success"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(summary?.totalExpenses || 0)}
          icon={TrendingDown}
          trend="down"
          trendValue={formatPercentage(summary?.expenseGrowth || 0)}
          color="danger"
        />
        <StatCard
          title="Net Profit"
          value={formatCurrency(summary?.netProfit || 0)}
          icon={TrendingUp}
          trend="up"
          trendValue={formatPercentage(summary?.profitGrowth || 0)}
          color="primary"
        />
        <StatCard
          title="Profit Margin"
          value={formatPercentage(summary?.profitMargin || 0)}
          icon={Calendar}
          color="info"
        />
      </motion.div>

      {/* Revenue Charts */}
      <div className="revenue-charts">
        <div className="revenue-chart-full">
          <RevenueAreaChart data={monthly} title="Monthly Revenue Overview" />
        </div>

        <div>
          <RevenueBarChart data={byDepartment} title="Revenue by Department" />
        </div>

        <div>
          <RevenueLineChart data={monthly} title="Revenue Trends" />
        </div>
      </div>

      {/* Top Projects by Revenue */}
      <Card>
        <CardHeader>
          <CardTitle>Top Projects by Revenue</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Department</th>
                  <th>Revenue</th>
                  <th>Profit</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {byProject.slice(0, 10).map((project) => (
                  <tr key={project.id}>
                    <td>
                      <span className="font-medium">{project.name}</span>
                    </td>
                    <td>{project.department}</td>
                    <td>{formatCurrency(project.revenue)}</td>
                    <td className={project.profit >= 0 ? 'text-success' : 'text-danger'}>
                      {formatCurrency(project.profit)}
                    </td>
                    <td>
                      <span className={`status-badge status-${project.status}`}>
                        {project.status?.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default RevenuePage;
