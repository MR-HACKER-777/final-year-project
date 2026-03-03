import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Zap, Database, MessageSquare, Copy, Check, ChevronDown, ChevronRight, Sparkles, Lock, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const endpoints = [
  {
    category: 'Entities – Meeting',
    color: 'from-indigo-500 to-violet-500',
    bgColor: 'from-indigo-50 to-violet-50',
    borderColor: 'border-indigo-200/60',
    icon: Database,
    apis: [
      {
        method: 'GET',
        name: 'List Meetings',
        code: `import { base44 } from '@/api/base44Client';

// List latest 50 meetings
const meetings = await base44.entities.Meeting.list('-scheduled_date', 50);`,
        description: 'Retrieves all meetings sorted by scheduled date descending.',
        returns: 'Array of Meeting objects'
      },
      {
        method: 'POST',
        name: 'Create Meeting',
        code: `import { base44 } from '@/api/base44Client';

const meeting = await base44.entities.Meeting.create({
  title: "Weekly Team Sync",
  scheduled_date: "2026-03-01T10:00:00Z",
  duration_minutes: 60,
  meeting_type: "team_sync",
  participants: ["alice@example.com", "bob@example.com"],
  description: "Weekly alignment meeting"
});`,
        description: 'Creates a new meeting record.',
        returns: 'Created Meeting object with id'
      },
      {
        method: 'PATCH',
        name: 'Update Meeting',
        code: `import { base44 } from '@/api/base44Client';

// Update meeting status and add transcript
const updated = await base44.entities.Meeting.update(meetingId, {
  status: "completed",
  transcript: "Alice: Let's review the Q1 roadmap...",
  summary: "Discussed roadmap priorities...",
  key_points: ["Q1 targets confirmed", "New hires planned"],
  action_items: [{ task: "Share roadmap doc", assignee: "alice@example.com", completed: false }]
});`,
        description: 'Updates fields on an existing meeting.',
        returns: 'Updated Meeting object'
      },
      {
        method: 'DELETE',
        name: 'Delete Meeting',
        code: `import { base44 } from '@/api/base44Client';

await base44.entities.Meeting.delete(meetingId);`,
        description: 'Permanently deletes a meeting record.',
        returns: 'void'
      },
      {
        method: 'GET',
        name: 'Filter Meetings',
        code: `import { base44 } from '@/api/base44Client';

// Get only completed meetings
const completed = await base44.entities.Meeting.filter(
  { status: 'completed' },
  '-scheduled_date',
  100
);`,
        description: 'Filter meetings by any field value.',
        returns: 'Filtered array of Meeting objects'
      }
    ]
  },
  {
    category: 'Entities – ChatMessage',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'from-emerald-50 to-teal-50',
    borderColor: 'border-emerald-200/60',
    icon: MessageSquare,
    apis: [
      {
        method: 'POST',
        name: 'Create Chat Message',
        code: `import { base44 } from '@/api/base44Client';

const message = await base44.entities.ChatMessage.create({
  meeting_id: "meeting_abc123",
  role: "user",           // "user" | "assistant"
  content: "What were the key decisions from this meeting?"
});`,
        description: 'Saves a new chat message tied to a meeting.',
        returns: 'Created ChatMessage object'
      },
      {
        method: 'GET',
        name: 'Get Chat History',
        code: `import { base44 } from '@/api/base44Client';

// Get all messages for a meeting
const messages = await base44.entities.ChatMessage.filter(
  { meeting_id: "meeting_abc123" },
  'created_date',
  100
);`,
        description: 'Retrieves all chat messages for a specific meeting.',
        returns: 'Array of ChatMessage objects'
      }
    ]
  },
  {
    category: 'AI Integration – InvokeLLM',
    color: 'from-violet-500 to-purple-500',
    bgColor: 'from-violet-50 to-purple-50',
    borderColor: 'border-violet-200/60',
    icon: Sparkles,
    apis: [
      {
        method: 'POST',
        name: 'Generate Meeting Summary',
        code: `import { base44 } from '@/api/base44Client';

const result = await base44.integrations.Core.InvokeLLM({
  prompt: \`Analyze this meeting transcript and generate a summary.
  
Transcript: \${transcript}

Return JSON with: summary, key_points[], action_items[]\`,
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
});`,
        description: 'Uses the AI to analyze a meeting transcript and extract a structured summary with action items.',
        returns: '{ summary: string, key_points: string[], action_items: ActionItem[] }'
      },
      {
        method: 'POST',
        name: 'AI Meeting Q&A',
        code: `import { base44 } from '@/api/base44Client';

// Ask the AI a question about a meeting
const answer = await base44.integrations.Core.InvokeLLM({
  prompt: \`You are an AI assistant for meeting \${meeting.title}.
  
Meeting context:
- Summary: \${meeting.summary}
- Transcript: \${meeting.transcript}
- Key Points: \${meeting.key_points?.join(', ')}

User question: \${userQuestion}

Provide a concise, helpful answer based on the meeting data.\`
});

// answer is a string response`,
        description: 'Powers the ChatGPT-like post-meeting Q&A interface.',
        returns: 'string (AI response)'
      }
    ]
  },
  {
    category: 'Authentication',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'from-amber-50 to-orange-50',
    borderColor: 'border-amber-200/60',
    icon: Lock,
    apis: [
      {
        method: 'GET',
        name: 'Get Current User',
        code: `import { base44 } from '@/api/base44Client';

const user = await base44.auth.me();
// user.id, user.email, user.full_name, user.role`,
        description: 'Returns the currently authenticated user.',
        returns: 'User object or throws if unauthenticated'
      },
      {
        method: 'GET',
        name: 'Check Auth Status',
        code: `import { base44 } from '@/api/base44Client';

const isAuth = await base44.auth.isAuthenticated();
// Returns true/false`,
        description: 'Checks whether the user is currently authenticated.',
        returns: 'boolean'
      },
      {
        method: 'GET',
        name: 'Redirect to Login',
        code: `import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';

// Redirect after login to Dashboard
base44.auth.redirectToLogin(createPageUrl('Dashboard'));`,
        description: 'Redirects the user to the platform login page.',
        returns: 'void (navigation)'
      },
      {
        method: 'POST',
        name: 'Logout',
        code: `import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';

base44.auth.logout(createPageUrl('Home'));`,
        description: 'Logs out the current user and redirects.',
        returns: 'void (navigation)'
      }
    ]
  }
];

const methodColors = {
  GET: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  POST: 'bg-blue-100 text-blue-700 border-blue-200',
  PATCH: 'bg-amber-100 text-amber-700 border-amber-200',
  DELETE: 'bg-red-100 text-red-700 border-red-200',
};

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group mt-3">
      <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 text-xs overflow-x-auto leading-relaxed font-mono">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors opacity-0 group-hover:opacity-100"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-300" />}
      </button>
    </div>
  );
}

function ApiCard({ api }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-slate-200/70 rounded-xl overflow-hidden bg-white/60 backdrop-blur-sm hover:border-indigo-200/60 transition-colors">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50/50 transition-colors"
      >
        <Badge className={`text-xs font-bold px-2 py-0.5 border ${methodColors[api.method]}`}>
          {api.method}
        </Badge>
        <span className="font-medium text-slate-900 flex-1">{api.name}</span>
        <span className="text-xs text-slate-400 hidden sm:block">{api.returns}</span>
        {open ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-slate-100">
          <p className="text-sm text-slate-600 mt-3 mb-1">{api.description}</p>
          <CodeBlock code={api.code} />
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-slate-400">Returns:</span>
            <code className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">{api.returns}</code>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApiReference() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-900 via-slate-900 to-indigo-950 relative overflow-x-hidden">
      {/* Radiant glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -left-20 w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute top-1/2 -right-20 w-[400px] h-[400px] rounded-full bg-violet-600/15 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] rounded-full bg-purple-600/10 blur-[80px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/30">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">API Reference</h1>
              <p className="text-slate-400">All APIs used in MeetingAI</p>
            </div>
          </div>

          {/* Info banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 rounded-2xl p-5 backdrop-blur-sm">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.15),transparent_60%)]" />
            <div className="relative flex flex-col sm:flex-row gap-4 items-start">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-indigo-400" />
                <span className="text-sm font-semibold text-white">Base SDK</span>
              </div>
              <p className="text-sm text-slate-300 flex-1">
                All APIs are accessed via <code className="bg-slate-800/60 text-indigo-300 px-1.5 py-0.5 rounded text-xs">@/api/base44Client</code>. 
                The client is pre-initialized — just import and use. No API keys needed in frontend code.
              </p>
            </div>
          </div>

          {/* Quick overview cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { label: 'Entity APIs', count: '5', icon: Database, color: 'from-indigo-500 to-violet-500' },
              { label: 'Chat APIs', count: '2', icon: MessageSquare, color: 'from-emerald-500 to-teal-500' },
              { label: 'AI Integrations', count: '2', icon: Sparkles, color: 'from-violet-500 to-purple-500' },
              { label: 'Auth APIs', count: '4', icon: Lock, color: 'from-amber-500 to-orange-500' },
            ].map((item) => (
              <div key={item.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-2`}>
                  <item.icon className="h-4 w-4 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">{item.count}</div>
                <div className="text-xs text-slate-400">{item.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Endpoint Sections */}
        <div className="space-y-8">
          {endpoints.map((section, sectionIdx) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIdx * 0.1 }}
              className={`relative overflow-hidden rounded-2xl border ${section.borderColor} bg-gradient-to-br ${section.bgColor} p-6`}
            >
              {/* Section glow */}
              <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br ${section.color} opacity-10 blur-3xl`} />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${section.color} shadow-sm`}>
                    <section.icon className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">{section.category}</h2>
                  <Badge variant="outline" className="text-xs ml-auto">
                    {section.apis.length} endpoint{section.apis.length > 1 ? 's' : ''}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {section.apis.map((api, apiIdx) => (
                    <ApiCard key={apiIdx} api={api} />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 text-sm">
            <Zap className="h-4 w-4 text-indigo-400" />
            Powered by Base44 Platform · All APIs are secure and authenticated
          </div>
        </motion.div>
      </div>
    </div>
  );
}