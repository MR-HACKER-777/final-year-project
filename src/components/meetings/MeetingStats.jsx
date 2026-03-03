import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MeetingStats({ meetings }) {
  const now = new Date();
  const thisWeek = meetings.filter(m => {
    const diff = now - new Date(m.scheduled_date);
    return diff < 7 * 24 * 60 * 60 * 1000 && diff > 0;
  });
  
  const lastWeek = meetings.filter(m => {
    const diff = now - new Date(m.scheduled_date);
    return diff < 14 * 24 * 60 * 60 * 1000 && diff > 7 * 24 * 60 * 60 * 1000;
  });
  
  const avgDuration = meetings.length > 0
    ? Math.round(meetings.reduce((acc, m) => acc + (m.duration_minutes || 30), 0) / meetings.length)
    : 30;
  
  const completionRate = meetings.filter(m => m.action_items?.length > 0).length > 0
    ? Math.round((meetings.filter(m => m.action_items?.every(a => a.completed)).length / 
        meetings.filter(m => m.action_items?.length > 0).length) * 100)
    : 0;
  
  const weekGrowth = lastWeek.length > 0 
    ? Math.round(((thisWeek.length - lastWeek.length) / lastWeek.length) * 100)
    : 0;

  const stats = [
    {
      label: 'This Week',
      value: thisWeek.length,
      subtext: weekGrowth !== 0 ? `${weekGrowth > 0 ? '+' : ''}${weekGrowth}% vs last week` : 'Same as last week',
      trend: weekGrowth > 0 ? 'up' : weekGrowth < 0 ? 'down' : 'neutral',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Avg Duration',
      value: `${avgDuration}m`,
      subtext: 'per meeting',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      label: 'Completion',
      value: `${completionRate}%`,
      subtext: 'action items done',
      color: 'from-violet-500 to-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">{stat.label}</span>
            {stat.trend && stat.trend !== 'neutral' && (
              stat.trend === 'up' ? 
                <TrendingUp className="h-4 w-4 text-emerald-500" /> : 
                <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </div>
          <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
            {stat.value}
          </div>
          <div className="text-xs text-slate-500">{stat.subtext}</div>
        </motion.div>
      ))}
    </div>
  );
}