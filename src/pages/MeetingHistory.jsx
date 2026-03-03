import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  Search, FileText, MessageSquare, CheckSquare, Calendar,
  Clock, Users, ChevronRight, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function MeetingHistory() {
  const [search, setSearch] = useState('');

  const { data: meetings = [], isLoading } = useQuery({
    queryKey: ['meetings'],
    queryFn: () => base44.entities.Meeting.filter({ status: 'completed' }, '-scheduled_date', 100)
  });

  const filteredMeetings = meetings.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  const getCompletionPercent = (meeting) => {
    if (!meeting.action_items?.length) return null;
    const completed = meeting.action_items.filter(a => a.completed).length;
    return Math.round((completed / meeting.action_items.length) * 100);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-violet-50/30 relative">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-400/8 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-indigo-400/8 blur-[100px]" />
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to={createPageUrl('Dashboard')}>
            <Button variant="ghost" className="mb-4 -ml-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-violet-800 bg-clip-text text-transparent">Meeting History</h1>
          <p className="text-slate-500">Browse and review your past meetings</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search meetings..."
              className="pl-10 h-11"
            />
          </div>
        </motion.div>

        {/* Meetings List */}
        <div className="space-y-4">
          {filteredMeetings.map((meeting, index) => {
            const completionPercent = getCompletionPercent(meeting);
            
            return (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={createPageUrl(`MeetingDetails?id=${meeting.id}`)}
                  className="block bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100/80 p-6 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-200/50 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-50/50 to-transparent rounded-bl-full pointer-events-none" />
                  <div className="flex items-start gap-4 relative">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {meeting.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {format(new Date(meeting.scheduled_date), 'MMM d, yyyy')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {format(new Date(meeting.scheduled_date), 'HH:mm')}
                            </span>
                            {meeting.participants?.length > 0 && (
                              <span className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                {meeting.participants.length}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 mt-4">
                        {meeting.transcript && (
                          <Badge variant="outline" className="text-xs gap-1">
                            <FileText className="h-3 w-3" />
                            Transcript
                          </Badge>
                        )}
                        {meeting.summary && (
                          <Badge variant="outline" className="text-xs gap-1">
                            <MessageSquare className="h-3 w-3" />
                            Summary
                          </Badge>
                        )}
                        {meeting.action_items?.length > 0 && (
                          <Badge variant="outline" className="text-xs gap-1">
                            <CheckSquare className="h-3 w-3" />
                            {meeting.action_items.length} Actions
                          </Badge>
                        )}
                      </div>
                      
                      {completionPercent !== null && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-slate-500">Action items progress</span>
                            <span className="font-medium text-slate-700">{completionPercent}%</span>
                          </div>
                          <Progress value={completionPercent} className="h-1.5" />
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}

          {filteredMeetings.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No completed meetings</h3>
              <p className="text-slate-500">Completed meetings will appear here</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}