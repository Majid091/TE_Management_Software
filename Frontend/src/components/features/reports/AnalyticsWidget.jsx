import React from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardBody } from '../../common/cards';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

/**
 * Analytics pie chart widget
 */
export const AnalyticsPieChart = ({ data, title, dataKey = 'value', nameKey = 'name' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="analytics-widget">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="pie-chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey={dataKey}
                  nameKey={nameKey}
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

/**
 * Analytics list widget
 */
export const AnalyticsListWidget = ({ title, items, renderItem }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="analytics-widget">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardBody>
          <ul className="analytics-list">
            {items.map((item, index) => (
              <motion.li
                key={item.id || index}
                className="analytics-list-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {renderItem ? renderItem(item) : (
                  <>
                    <span className="item-label">{item.label || item.name}</span>
                    <span className="item-value">{item.value}</span>
                  </>
                )}
              </motion.li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </motion.div>
  );
};

/**
 * Activity feed widget
 */
export const ActivityFeedWidget = ({ activities, title = 'Recent Activity' }) => {
  const getActivityIcon = (type) => {
    const icons = {
      project: 'P',
      employee: 'E',
      department: 'D',
      revenue: 'R',
    };
    return icons[type] || '?';
  };

  const getActivityColor = (type) => {
    const colors = {
      project: 'activity-project',
      employee: 'activity-employee',
      department: 'activity-department',
      revenue: 'activity-revenue',
    };
    return colors[type] || '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="analytics-widget activity-widget">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardBody>
          <ul className="activity-feed">
            {activities.map((activity, index) => (
              <motion.li
                key={activity.id || index}
                className="activity-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`activity-icon ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="activity-content">
                  <p className="activity-text">
                    <strong>{activity.name}</strong> {activity.action}
                  </p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </motion.li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default AnalyticsPieChart;
