import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export default function StatsCard({ title, value, subtitle, icon: Icon, gradient, trend }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.01 }}
      className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-sm border border-slate-100/80 group cursor-default"
    >
      {/* Radiant background glow */}
      <div className={`absolute -bottom-6 -right-6 h-32 w-32 rounded-full ${gradient} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
      <div className={`absolute -top-10 -left-10 h-28 w-28 rounded-full ${gradient} opacity-5 blur-3xl`} />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-4xl font-bold text-slate-900">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-400 flex items-center gap-1">
              {trend && <TrendingUp className="h-3 w-3 text-emerald-500" />}
              {subtitle}
            </p>
          )}
        </div>
        <div className={`rounded-xl p-3 ${gradient} shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Bottom shine line */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${gradient} opacity-30 group-hover:opacity-60 transition-opacity`} />
    </motion.div>
  );
}