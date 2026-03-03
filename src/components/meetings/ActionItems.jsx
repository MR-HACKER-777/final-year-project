import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { User, Calendar, CheckCircle2, Circle, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ActionItems({ items, onToggle }) {
  if (!items?.length) {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-100 to-indigo-50 flex items-center justify-center mx-auto mb-3">
          <ClipboardList className="h-6 w-6 text-slate-400" />
        </div>
        <p className="text-slate-500 font-medium">No action items</p>
        <p className="text-slate-400 text-sm mt-1">Generate a summary to extract action items automatically</p>
      </div>
    );
  }

  const completed = items.filter(i => i.completed).length;
  const percent = Math.round((completed / items.length) * 100);

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100/60">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15" fill="none"
                stroke="url(#grad)" strokeWidth="3"
                strokeDasharray={`${(percent / 100) * 94} 94`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-indigo-700">
              {percent}%
            </span>
          </div>
          <div>
            <p className="font-semibold text-slate-900">{completed}/{items.length} completed</p>
            <p className="text-sm text-slate-500">Action items progress</p>
          </div>
        </div>
      </div>

      {/* Items */}
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
            item.completed
              ? 'bg-slate-50 border-slate-200 opacity-70'
              : 'bg-white border-indigo-100/60 shadow-sm hover:shadow-md hover:border-indigo-200/80'
          }`}
        >
          <div className="mt-0.5">
            {item.completed ? (
              <CheckCircle2
                className="h-5 w-5 text-emerald-500 cursor-pointer"
                onClick={() => onToggle(index)}
              />
            ) : (
              <Circle
                className="h-5 w-5 text-slate-300 cursor-pointer hover:text-indigo-500 transition-colors"
                onClick={() => onToggle(index)}
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-medium text-sm ${item.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
              {item.task}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {item.assignee && (
                <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  <User className="h-3 w-3" />
                  {item.assignee}
                </span>
              )}
              {item.due_date && (
                <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  <Calendar className="h-3 w-3" />
                  Due {format(new Date(item.due_date), 'MMM d')}
                </span>
              )}
            </div>
          </div>
          {!item.completed && (
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse mt-2 flex-shrink-0" />
          )}
        </motion.div>
      ))}
    </div>
  );
}