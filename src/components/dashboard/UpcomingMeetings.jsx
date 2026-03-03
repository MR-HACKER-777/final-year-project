import React from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isTomorrow } from 'date-fns';
import { Clock, Users, ChevronRight, Video, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const typeColors = {
  team_sync: { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-500', border: 'border-l-indigo-400' },
  one_on_one: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-l-emerald-400' },
  client_call: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', border: 'border-l-amber-400' },
  workshop: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500', border: 'border-l-purple-400' },
  presentation: { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500', border: 'border-l-rose-400' },
  other: { bg: 'bg-slate-50', text: 'text-slate-700', dot: 'bg-slate-400', border: 'border-l-slate-300' }
};

function formatDateLabel(date) {
  if (isToday(new Date(date))) return 'Today';
  if (isTomorrow(new Date(date))) return 'Tomorrow';
  return format(new Date(date), 'MMM d');
}

export default function UpcomingMeetings({ meetings }) {
  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-sm border border-slate-100/80 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-indigo-50/60 to-transparent rounded-bl-full pointer-events-none" />

      <div className="flex items-center justify-between mb-5 relative">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500">
            <CalendarDays className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Upcoming Meetings</h3>
        </div>
        <Link
          to={createPageUrl('Meetings')}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
        >
          View all <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="space-y-2 relative">
        {meetings.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-100 to-indigo-50 flex items-center justify-center mx-auto mb-3">
              <Video className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-slate-500 text-sm font-medium">No upcoming meetings</p>
            <p className="text-slate-400 text-xs mt-1">Schedule a meeting to get started</p>
          </div>
        ) : (
          meetings.slice(0, 5).map((meeting, index) => {
            const colors = typeColors[meeting.meeting_type] || typeColors.other;
            return (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.06 }}
              >
                <Link
                  to={createPageUrl(`MeetingDetails?id=${meeting.id}`)}
                  className={`flex items-center gap-4 p-4 rounded-xl border-l-4 ${colors.border} ${colors.bg} hover:shadow-md transition-all group`}
                >
                  <div className="flex-shrink-0 text-center w-14">
                    <p className={`text-xs font-semibold ${colors.text}`}>
                      {formatDateLabel(meeting.scheduled_date)}
                    </p>
                    <p className="text-xl font-bold text-slate-900">
                      {format(new Date(meeting.scheduled_date), 'HH:mm')}
                    </p>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate group-hover:text-indigo-700 transition-colors text-sm">
                      {meeting.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} border border-current/20 font-medium`}>
                        {(meeting.meeting_type || 'other').replace('_', ' ')}
                      </span>
                      {meeting.participants?.length > 0 && (
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Users className="h-3 w-3" />
                          {meeting.participants.length}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        {meeting.duration_minutes || 30}m
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </Link>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}