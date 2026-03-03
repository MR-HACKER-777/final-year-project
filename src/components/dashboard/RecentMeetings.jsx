import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FileText, MessageSquare, ChevronRight, CheckCircle2, History, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Badge } from '@/components/ui/badge';

export default function RecentMeetings({ meetings }) {
  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-sm border border-slate-100/80 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-violet-50/60 to-transparent rounded-tr-full pointer-events-none" />

      <div className="flex items-center justify-between mb-5 relative">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500">
            <History className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Recent Meetings</h3>
        </div>
        <Link
          to={createPageUrl('MeetingHistory')}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
        >
          View history <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="space-y-2 relative">
        {meetings.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-100 to-violet-50 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-slate-500 text-sm font-medium">No completed meetings yet</p>
            <p className="text-slate-400 text-xs mt-1">Your meeting history will appear here</p>
          </div>
        ) : (
          meetings.slice(0, 4).map((meeting, index) => (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
            >
              <Link
                to={createPageUrl(`MeetingDetails?id=${meeting.id}`)}
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50/80 to-violet-50/30 hover:from-indigo-50/60 hover:to-violet-50/60 border border-slate-100/60 hover:border-indigo-200/50 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-violet-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate group-hover:text-indigo-700 transition-colors text-sm">
                      {meeting.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {format(new Date(meeting.scheduled_date), 'MMM d, yyyy · HH:mm')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                  {meeting.summary && (
                    <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center" title="Has AI Summary">
                      <Sparkles className="h-3 w-3 text-violet-600" />
                    </div>
                  )}
                  {meeting.transcript && (
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center" title="Has Transcript">
                      <FileText className="h-3 w-3 text-blue-600" />
                    </div>
                  )}
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}