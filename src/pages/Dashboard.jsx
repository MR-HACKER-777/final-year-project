import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Calendar, Video, FileText, TrendingUp, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatsCard from '@/components/dashboard/StatsCard';
import UpcomingMeetings from '@/components/dashboard/UpcomingMeetings';
import RecentMeetings from '@/components/dashboard/RecentMeetings';
import MeetingStats from '@/components/meetings/MeetingStats';

export default function Dashboard() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: meetings = [], isLoading } = useQuery({
    queryKey: ['meetings'],
    queryFn: () => base44.entities.Meeting.list('-scheduled_date', 50)
  });

  const now = new Date();
  const upcomingMeetings = meetings
    .filter(m => new Date(m.scheduled_date) > now && m.status !== 'cancelled')
    .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date));
  
  const completedMeetings = meetings.filter(m => m.status === 'completed');
  const thisMonth = meetings.filter(m => {
    const date = new Date(m.scheduled_date);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });

  const stats = [
    {
      title: 'Upcoming Meetings',
      value: upcomingMeetings.length,
      subtitle: 'scheduled',
      icon: Calendar,
      gradient: 'bg-gradient-to-br from-indigo-500 to-violet-500'
    },
    {
      title: 'Completed',
      value: completedMeetings.length,
      subtitle: 'total meetings',
      icon: Video,
      gradient: 'bg-gradient-to-br from-emerald-500 to-teal-500'
    },
    {
      title: 'This Month',
      value: thisMonth.length,
      subtitle: 'meetings',
      icon: TrendingUp,
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-500'
    },
    {
      title: 'With Transcripts',
      value: meetings.filter(m => m.transcript).length,
      subtitle: 'documented',
      icon: FileText,
      gradient: 'bg-gradient-to-br from-rose-500 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-50 via-white to-violet-50/40 relative overflow-x-hidden">
      {/* Ambient radiant blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-400/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-violet-400/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-purple-400/8 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-indigo-800 to-violet-800 bg-clip-text text-transparent">
              {user?.full_name ? `Welcome back, ${user.full_name.split(' ')[0]}! 👋` : 'Meeting Hub'}
            </h1>
            <p className="text-slate-500 mt-1">
              AI-powered meeting management and insights
            </p>
          </div>
          <Link to={createPageUrl('ScheduleMeeting')}>
            <Button className="h-12 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/30 ring-1 ring-indigo-500/20">
              <Plus className="h-5 w-5 mr-2" />
              Schedule Meeting
            </Button>
          </Link>
        </motion.div>

        {/* Quick Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-6 sm:p-8 mb-8 shadow-2xl shadow-indigo-500/30 ring-1 ring-white/10"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-violet-300/20 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-white">
                AI-Powered Meeting Intelligence
              </h2>
            </div>
            <p className="text-indigo-100 text-sm mb-4">
              Get automated transcripts, smart summaries, and instant insights from every meeting.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="text-2xl font-bold text-white">{completedMeetings.length}</div>
                <div className="text-xs text-indigo-200">Total Meetings</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="text-2xl font-bold text-white">{meetings.filter(m => m.summary).length}</div>
                <div className="text-xs text-indigo-200">AI Summaries</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="text-2xl font-bold text-white">
                  {meetings.reduce((acc, m) => acc + (m.action_items?.length || 0), 0)}
                </div>
                <div className="text-xs text-indigo-200">Action Items</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="text-2xl font-bold text-white">{upcomingMeetings.length}</div>
                <div className="text-xs text-indigo-200">Upcoming</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <MeetingStats meetings={meetings} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 relative">
          {/* Subtle radiant glow between cards */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-violet-500/5 to-purple-500/5 rounded-3xl blur-2xl -z-10 scale-110" />
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <UpcomingMeetings meetings={upcomingMeetings} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <RecentMeetings meetings={completedMeetings} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}