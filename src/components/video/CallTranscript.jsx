import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Bot, User, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function CallTranscript({ messages, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="h-full flex flex-col bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden" style={{ minHeight: '300px', maxHeight: '500px' }}>
      <div className="px-4 py-3 border-b border-white/10">
        <h3 className="text-white font-semibold text-sm">Live Transcript</h3>
        <p className="text-slate-500 text-xs">{messages.length} messages</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-sm">Conversation will appear here...</div>
        )}
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
              )}
              <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/10 text-slate-200'
              }`}>
                {msg.role === 'assistant' ? (
                  <ReactMarkdown className="prose prose-xs prose-invert max-w-none prose-p:my-0.5">
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  <p>{msg.content}</p>
                )}
                <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}>
                  {format(new Date(msg.time), 'HH:mm:ss')}
                </p>
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                  <User className="h-3.5 w-3.5 text-slate-300" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0">
              <Bot className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="bg-white/10 rounded-2xl px-3 py-2 flex items-center gap-1.5">
              {[0,1,2].map(i => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                  animate={{ y: [0,-4,0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}