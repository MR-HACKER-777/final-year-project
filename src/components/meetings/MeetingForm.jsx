import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Clock, Users, X, Plus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const meetingTypes = [
  { value: 'team_sync', label: '🔄 Team Sync', color: 'text-indigo-600' },
  { value: 'one_on_one', label: '👤 One-on-One', color: 'text-emerald-600' },
  { value: 'client_call', label: '📞 Client Call', color: 'text-amber-600' },
  { value: 'workshop', label: '🛠 Workshop', color: 'text-purple-600' },
  { value: 'presentation', label: '📊 Presentation', color: 'text-rose-600' },
  { value: 'other', label: '📌 Other', color: 'text-slate-600' }
];

const durations = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' }
];

export default function MeetingForm({ initialData, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    scheduled_date: initialData?.scheduled_date ? new Date(initialData.scheduled_date) : new Date(),
    time: initialData?.scheduled_date ? format(new Date(initialData.scheduled_date), 'HH:mm') : '09:00',
    duration_minutes: initialData?.duration_minutes || 30,
    meeting_type: initialData?.meeting_type || 'team_sync',
    participants: initialData?.participants || []
  });

  const [participantInput, setParticipantInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const [hours, minutes] = formData.time.split(':');
    const scheduledDate = new Date(formData.scheduled_date);
    scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    onSubmit({ ...formData, scheduled_date: scheduledDate.toISOString() });
  };

  const addParticipant = () => {
    if (participantInput && !formData.participants.includes(participantInput)) {
      setFormData(prev => ({ ...prev, participants: [...prev.participants, participantInput] }));
      setParticipantInput('');
    }
  };

  const removeParticipant = (email) => {
    setFormData(prev => ({ ...prev, participants: prev.participants.filter(p => p !== email) }));
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-semibold text-slate-700">Meeting Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="e.g. Weekly Team Standup"
          required
          className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-300"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-semibold text-slate-700">Description <span className="text-slate-400 font-normal">(optional)</span></Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Add meeting agenda or notes..."
          rows={3}
          className="bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-300 resize-none"
        />
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start h-12 bg-slate-50 border-slate-200 hover:bg-white hover:border-indigo-300 font-normal">
                <CalendarIcon className="mr-2 h-4 w-4 text-indigo-500" />
                {format(formData.scheduled_date, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.scheduled_date}
                onSelect={(date) => date && setFormData(prev => ({ ...prev, scheduled_date: date }))}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time" className="text-sm font-semibold text-slate-700">Time</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500" />
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              className="pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-300"
            />
          </div>
        </div>
      </div>

      {/* Type & Duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">Meeting Type</Label>
          <Select
            value={formData.meeting_type}
            onValueChange={(value) => setFormData(prev => ({ ...prev, meeting_type: value }))}
          >
            <SelectTrigger className="h-12 bg-slate-50 border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {meetingTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  <span className={type.color}>{type.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">Duration</Label>
          <Select
            value={formData.duration_minutes.toString()}
            onValueChange={(value) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(value) }))}
          >
            <SelectTrigger className="h-12 bg-slate-50 border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {durations.map(d => (
                <SelectItem key={d.value} value={d.value.toString()}>{d.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Participants */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-slate-700">Participants</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={participantInput}
              onChange={(e) => setParticipantInput(e.target.value)}
              placeholder="participant@email.com"
              className="pl-10 h-11 bg-slate-50 border-slate-200"
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addParticipant(); } }}
            />
          </div>
          <Button type="button" onClick={addParticipant} variant="outline" className="h-11 px-4 border-dashed hover:border-indigo-400 hover:text-indigo-600">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {formData.participants.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.participants.map(email => (
              <span
                key={email}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded-full text-sm font-medium"
              >
                {email}
                <button type="button" onClick={() => removeParticipant(email)} className="hover:text-red-500 transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-12">
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 h-12 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/25"
        >
          {isLoading ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
          ) : (
            initialData ? 'Update Meeting' : 'Schedule Meeting'
          )}
        </Button>
      </div>
    </motion.form>
  );
}