import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, Loader2, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { base44 } from '@/api/base44Client';

const suggestions = [
  "What were the key decisions?",
  "Who has action items?",
  "Summarize the main topics",
  "What's the next steps?"
];

export default function MeetingChat({ meeting, messages, onNewMessage }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSend = async (text) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;
    setInput('');
    setIsLoading(true);

    await onNewMessage({ role: 'user', content: msg });

    const context = `
Meeting Title: ${meeting.title}
Date: ${meeting.scheduled_date}
Type: ${meeting.meeting_type || 'general'}
${meeting.description ? `Description: ${meeting.description}` : ''}
${meeting.summary ? `Summary: ${meeting.summary}` : ''}
${meeting.transcript ? `Transcript: ${meeting.transcript}` : ''}
${meeting.key_points?.length ? `Key Points:\n${meeting.key_points.map(p => `- ${p}`).join('\n')}` : ''}
${meeting.action_items?.length ? `Action Items:\n${meeting.action_items.map(a => `- ${a.task} (${a.assignee || 'unassigned'})`).join('\n')}` : ''}
    `.trim();

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an intelligent AI assistant for the meeting: "${meeting.title}". 
      
Meeting context:
${context}

User question: ${msg}

Provide a helpful, accurate, and concise response. Use markdown for formatting when needed. If the information isn't in the meeting data, say so politely and suggest what might help.`,
    });

    await onNewMessage({ role: 'assistant', content: response });
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50/50 to-white rounded-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="px-5 py-4 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-sm">Meeting AI Assistant</p>
            <p className="text-xs text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Ready to help
            </p>
          </div>
          <div className="ml-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 rounded-full">
              <Sparkles className="h-3 w-3 text-indigo-600" />
              <span className="text-xs font-medium text-indigo-700">AI Powered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Zap className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">Ask anything about this meeting</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
              I can help with summaries, action items, decisions, or anything else from the meeting.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="px-3 py-1.5 text-xs bg-white border border-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-50 hover:border-indigo-300 transition-colors shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-500/20">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-white border border-slate-100 text-slate-900 shadow-sm'
              }`}>
                {msg.role === 'assistant' ? (
                  <ReactMarkdown className="prose prose-sm max-w-none prose-p:my-1 prose-headings:text-slate-900 prose-strong:text-slate-900">
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-slate-600" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-2">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              <span className="text-xs text-slate-400 ml-1">Thinking...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this meeting..."
            className="h-12 bg-slate-50 border-slate-200 focus:bg-white"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
            }}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="h-12 w-12 p-0 bg-gradient-to-br from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/25 flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
