import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import {
  Calendar, Plus, Video, Clock, Users, Search, Filter,
  ChevronRight, MoreHorizontal, Trash2, Edit, Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';

const typeColors = {
  team_sync: 'bg-indigo-100 text-indigo-700',
  one_on_one: 'bg-emerald-100 text-emerald-700',
  client_call: 'bg-amber-100 text-amber-700',
  workshop: 'bg-purple-100 text-purple-700',
  presentation: 'bg-rose-100 text-rose-700',
  other: 'bg-slate-100 text-slate-700'
};

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-slate-100 text-slate-500'
};

function formatDateLabel(date) {
  if (isToday(new Date(date))) return 'Today';
  if (isTomorrow(new Date(date))) return 'Tomorrow';
  return format(new Date(date), 'EEE, MMM d');
}

export default function Meetings() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: meetings = [], isLoading } = useQuery({
    queryKey: ['meetings'],
    queryFn: () => base44.entities.Meeting.list('-scheduled_date', 100)
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Meeting.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['meetings'] })
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Meeting.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['meetings'] })
  });

  const filteredMeetings = meetings.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Group by date
  const groupedMeetings = filteredMeetings.reduce((acc, meeting) => {
    const dateKey = format(new Date(meeting.scheduled_date), 'yyyy-MM-dd');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(meeting);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-50/40 via-white to-violet-50/20 relative">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-indigo-400/8 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-violet-400/8 blur-[100px]" />
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-indigo-800 bg-clip-text text-transparent">Meetings</h1>
            <p className="text-slate-500">Manage your scheduled and past meetings</p>
          </div>
          <Link to={createPageUrl('ScheduleMeeting')}>
            <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
          </Link>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search meetings..."
              className="pl-10 h-11"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 h-11">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Meetings List */}
        <div className="space-y-6">
          <AnimatePresence>
            {Object.entries(groupedMeetings)
              .sort(([a], [b]) => new Date(b) - new Date(a))
              .map(([dateKey, dayMeetings], groupIndex) => (
                <motion.div
                  key={dateKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.05 }}
                >
                  <h3 className="text-sm font-semibold text-slate-500 mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDateLabel(dateKey)}
                  </h3>
                  <div className="space-y-2">
                    {dayMeetings.map((meeting, index) => (
                      <motion.div
                        key={meeting.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-100/80 p-4 hover:shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-200/50 transition-all group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-16 text-center">
                            <p className="text-lg font-semibold text-slate-900">
                              {format(new Date(meeting.scheduled_date), 'HH:mm')}
                            </p>
                            <p className="text-xs text-slate-400">
                              {meeting.duration_minutes || 30}min
                            </p>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <Link
                              to={createPageUrl(`MeetingDetails?id=${meeting.id}`)}
                              className="font-medium text-slate-900 hover:text-indigo-600 transition-colors"
                            >
                              {meeting.title}
                            </Link>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <Badge className={statusColors[meeting.status] || statusColors.scheduled}>
                                {meeting.status || 'scheduled'}
                              </Badge>
                              <Badge className={typeColors[meeting.meeting_type] || typeColors.other}>
                                {(meeting.meeting_type || 'other').replace('_', ' ')}
                              </Badge>
                              {meeting.participants?.length > 0 && (
                                <span className="flex items-center gap-1 text-xs text-slate-500">
                                  <Users className="h-3 w-3" />
                                  {meeting.participants.length} participants
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link to={createPageUrl(`MeetingDetails?id=${meeting.id}`)}>
                              <Button variant="ghost" size="sm">
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </Link>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {meeting.status === 'scheduled' && (
                                  <DropdownMenuItem
                                    onClick={() => updateMutation.mutate({
                                      id: meeting.id,
                                      data: { status: 'in_progress' }
                                    })}
                                  >
                                    <Play className="h-4 w-4 mr-2" />
                                    Start Meeting
                                  </DropdownMenuItem>
                                )}
                                {meeting.status === 'in_progress' && (
                                  <DropdownMenuItem
                                    onClick={() => updateMutation.mutate({
                                      id: meeting.id,
                                      data: { status: 'completed' }
                                    })}
                                  >
                                    <Video className="h-4 w-4 mr-2" />
                                    End Meeting
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => deleteMutation.mutate(meeting.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>

          {filteredMeetings.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No meetings found</h3>
              <p className="text-slate-500 mb-6">Schedule your first meeting to get started</p>
              <Link to={createPageUrl('ScheduleMeeting')}>
                <Button className="bg-gradient-to-r from-indigo-600 to-violet-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}