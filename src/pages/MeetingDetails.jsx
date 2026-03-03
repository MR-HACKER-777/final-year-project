import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  ArrowLeft, Calendar, Clock, Users, FileText, MessageSquare,
  CheckSquare, Sparkles, Loader2, Play, Video, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import MeetingChat from '@/components/meetings/MeetingChat';
import ActionItems from '@/components/meetings/ActionItems';
import AIVideoCall from '@/components/meetings/AIVideoCall';

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-slate-100 text-slate-500'
};

export default function MeetingDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const meetingId = urlParams.get('id');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);

  const { data: meeting, isLoading } = useQuery({
    queryKey: ['meeting', meetingId],
    queryFn: () => base44.entities.Meeting.filter({ id: meetingId }).then(res => res[0]),
    enabled: !!meetingId
  });

  const { data: chatMessages = [] } = useQuery({
    queryKey: ['chat-messages', meetingId],
    queryFn: () => base44.entities.ChatMessage.filter({ meeting_id: meetingId }, 'created_date', 100),
    enabled: !!meetingId
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Meeting.update(meetingId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['meeting', meetingId] })
  });

  const createMessageMutation = useMutation({
    mutationFn: (data) => base44.entities.ChatMessage.create({ ...data, meeting_id: meetingId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['chat-messages', meetingId] })
  });

  const generateSummary = async () => {
    if (!meeting?.transcript) return;
    setIsGeneratingSummary(true);
    
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyze this meeting transcript and generate a comprehensive summary.

Transcript:
${meeting.transcript}

Provide:
1. A brief summary (2-3 paragraphs)
2. Key discussion points (as a list)
3. Action items with assignees and due dates if mentioned (as a list)

Format your response as JSON:
{
  "summary": "...",
  "key_points": ["point1", "point2", ...],
  "action_items": [{"task": "...", "assignee": "...", "due_date": "...", "completed": false}, ...]
}`,
      response_json_schema: {
        type: "object",
        properties: {
          summary: { type: "string" },
          key_points: { type: "array", items: { type: "string" } },
          action_items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                task: { type: "string" },
                assignee: { type: "string" },
                due_date: { type: "string" },
                completed: { type: "boolean" }
              }
            }
          }
        }
      }
    });
    
    await updateMutation.mutateAsync({
      summary: result.summary,
      key_points: result.key_points,
      action_items: result.action_items
    });
    
    setIsGeneratingSummary(false);
  };

  const handleActionItemToggle = (index) => {
    const updatedItems = [...(meeting.action_items || [])];
    updatedItems[index] = { ...updatedItems[index], completed: !updatedItems[index].completed };
    updateMutation.mutate({ action_items: updatedItems });
  };

  if (isLoading || !meeting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <>
    {showVideoCall && (
      <AIVideoCall
        meeting={meeting}
        onEnd={(msgs) => {
          setShowVideoCall(false);
          updateMutation.mutate({ status: 'completed' });
        }}
      />
    )}
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/60 via-white to-violet-50/30 relative">
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-20 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-400/8 blur-[100px]" />
        <div className="absolute bottom-20 left-1/4 w-[300px] h-[300px] rounded-full bg-indigo-400/8 blur-[80px]" />
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to={createPageUrl('Meetings')}>
            <Button variant="ghost" className="mb-4 -ml-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Meetings
            </Button>
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-slate-900">{meeting.title}</h1>
                <Badge className={statusColors[meeting.status] || statusColors.scheduled}>
                  {meeting.status || 'scheduled'}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(meeting.scheduled_date), 'EEEE, MMMM d, yyyy')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {format(new Date(meeting.scheduled_date), 'HH:mm')} • {meeting.duration_minutes || 30} min
                </span>
                {meeting.participants?.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {meeting.participants.length} participants
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              {meeting.status === 'scheduled' && (
                <Button
                  onClick={() => { updateMutation.mutate({ status: 'in_progress' }); setShowVideoCall(true); }}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Start AI Video Call
                </Button>
              )}
              {meeting.status === 'in_progress' && (
                <>
                  <Button
                    onClick={() => setShowVideoCall(true)}
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/25"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Join AI Video Call
                  </Button>
                  <Button
                    onClick={() => updateMutation.mutate({ status: 'completed' })}
                    variant="outline"
                  >
                    End Meeting
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-md shadow-slate-200/50 p-1">
              <TabsTrigger value="overview" className="gap-2">
                <FileText className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="transcript" className="gap-2">
                <FileText className="h-4 w-4" />
                Transcript
              </TabsTrigger>
              <TabsTrigger value="actions" className="gap-2">
                <CheckSquare className="h-4 w-4" />
                Action Items
              </TabsTrigger>
              <TabsTrigger value="chat" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Ask AI
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Summary Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100/60 p-6 shadow-sm shadow-indigo-500/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-indigo-50/80 to-transparent rounded-bl-full pointer-events-none" />
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                    AI Summary
                  </h3>
                  {meeting.transcript && !meeting.summary && (
                    <Button
                      onClick={generateSummary}
                      disabled={isGeneratingSummary}
                      variant="outline"
                      size="sm"
                    >
                      {isGeneratingSummary ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Summary
                        </>
                      )}
                    </Button>
                  )}
                </div>
                
                {meeting.summary ? (
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 whitespace-pre-wrap">{meeting.summary}</p>
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">
                    {meeting.transcript 
                      ? 'Click "Generate Summary" to create an AI-powered summary of this meeting.'
                      : 'Add a transcript to generate an AI summary.'}
                  </p>
                )}
              </div>

              {/* Key Points */}
              {meeting.key_points?.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Points</h3>
                  <ul className="space-y-2">
                    {meeting.key_points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 text-sm font-medium">
                          {idx + 1}
                        </div>
                        <span className="text-slate-600">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Description */}
              {meeting.description && (
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Description</h3>
                  <p className="text-slate-600 whitespace-pre-wrap">{meeting.description}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="transcript">
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Meeting Transcript</h3>
                </div>
                
                {meeting.transcript ? (
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                      {meeting.transcript}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 mb-4">No transcript available yet</p>
                    <Textarea
                      placeholder="Paste or type the meeting transcript here..."
                      rows={10}
                      className="max-w-2xl mx-auto"
                      onBlur={(e) => {
                        if (e.target.value) {
                          updateMutation.mutate({ transcript: e.target.value });
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="actions">
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Action Items</h3>
                <ActionItems
                  items={meeting.action_items}
                  onToggle={handleActionItemToggle}
                />
              </div>
            </TabsContent>

            <TabsContent value="chat" className="h-[600px]">
              <div className="bg-white rounded-2xl border border-slate-100 h-full overflow-hidden">
                <MeetingChat
                  meeting={meeting}
                  messages={chatMessages}
                  onNewMessage={(msg) => createMessageMutation.mutateAsync(msg)}
                />
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
    </>
  );
}