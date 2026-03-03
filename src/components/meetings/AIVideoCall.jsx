import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare,
  Sparkles, Volume2, VolumeX, Send, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AVATAR_EXPRESSIONS = {
  idle: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face',
  speaking: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face',
  thinking: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face',
};

// Animated AI face built with CSS/SVG — no external dependency needed
function AIAvatar({ state }) {
  const blinkRef = useRef(null);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Animated gradient background */}
      <div className={`absolute inset-0 transition-all duration-700 ${
        state === 'speaking'
          ? 'bg-gradient-to-br from-indigo-900 via-violet-900 to-purple-900'
          : state === 'thinking'
          ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900'
          : 'bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950'
      }`} />

      {/* Radiant glow rings when speaking */}
      {state === 'speaking' && (
        <>
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="absolute w-72 h-72 rounded-full bg-violet-500/20 blur-xl"
          />
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.05, 0.2] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: 0.3 }}
            className="absolute w-72 h-72 rounded-full bg-indigo-500/20 blur-2xl"
          />
        </>
      )}

      {/* AI Avatar face - SVG based */}
      <motion.div
        animate={state === 'speaking' ? { y: [0, -4, 0] } : {}}
        transition={{ duration: 0.5, repeat: state === 'speaking' ? Infinity : 0 }}
        className="relative z-10 w-48 h-48 rounded-full overflow-hidden border-4 border-indigo-500/50 shadow-2xl shadow-indigo-500/30"
      >
        {/* Gradient face */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-200 via-violet-100 to-indigo-300" />

        {/* Face SVG */}
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
          {/* Head */}
          <ellipse cx="100" cy="110" rx="70" ry="80" fill="url(#faceGrad)" />
          <defs>
            <radialGradient id="faceGrad" cx="50%" cy="40%">
              <stop offset="0%" stopColor="#c4b5fd" />
              <stop offset="100%" stopColor="#818cf8" />
            </radialGradient>
            <radialGradient id="eyeGrad">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#312e81" />
            </radialGradient>
          </defs>

          {/* Hair */}
          <ellipse cx="100" cy="45" rx="72" ry="40" fill="#1e1b4b" />
          <ellipse cx="40" cy="80" rx="18" ry="35" fill="#1e1b4b" />
          <ellipse cx="160" cy="80" rx="18" ry="35" fill="#1e1b4b" />

          {/* Eyes */}
          <AnimatedEye cx={72} cy={100} state={state} />
          <AnimatedEye cx={128} cy={100} state={state} />

          {/* Nose */}
          <ellipse cx="100" cy="125" rx="8" ry="6" fill="#7c3aed" opacity="0.4" />

          {/* Mouth - animates when speaking */}
          <AnimatedMouth state={state} />

          {/* Cheeks */}
          <ellipse cx="65" cy="130" rx="14" ry="10" fill="#f9a8d4" opacity="0.4" />
          <ellipse cx="135" cy="130" rx="14" ry="10" fill="#f9a8d4" opacity="0.4" />

          {/* Neck */}
          <rect x="85" y="180" width="30" height="25" fill="#818cf8" />
        </svg>

        {/* Shimmer overlay when speaking */}
        {state === 'speaking' && (
          <motion.div
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-t from-violet-400/30 to-transparent"
          />
        )}
      </motion.div>

      {/* Thinking dots */}
      {state === 'thinking' && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
              className="w-3 h-3 rounded-full bg-indigo-400"
            />
          ))}
        </div>
      )}

      {/* Audio waveform when speaking */}
      {state === 'speaking' && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-1">
          {[3, 6, 9, 6, 4, 8, 5, 7, 3, 6].map((h, i) => (
            <motion.div
              key={i}
              animate={{ scaleY: [1, Math.random() * 2 + 0.5, 1] }}
              transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.05 }}
              className="w-1.5 bg-indigo-400 rounded-full"
              style={{ height: `${h * 3}px` }}
            />
          ))}
        </div>
      )}

      {/* Name tag */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full border border-white/20">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-violet-400" />
          <span className="text-white text-xs font-semibold">AI Assistant</span>
          {state === 'speaking' && (
            <span className="flex items-center gap-0.5 ml-1">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs">speaking</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function AnimatedEye({ cx, cy, state }) {
  const isBlinking = state === 'thinking';
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx="14" ry={isBlinking ? 2 : 12} fill="white" />
      <ellipse cx={cx} cy={cy} rx="9" ry={isBlinking ? 1.5 : 9} fill="url(#eyeGrad)" />
      <ellipse cx={cx - 3} cy={cy - 2} rx="3" ry="3" fill="white" opacity="0.6" />
    </g>
  );
}

function AnimatedMouth({ state }) {
  if (state === 'speaking') {
    return (
      <ellipse
        cx="100" cy="150" rx="20"
        ry="8"
        fill="#4c1d95"
        opacity="0.9"
      />
    );
  }
  if (state === 'thinking') {
    return <path d="M 82 150 Q 100 145 118 150" stroke="#4c1d95" strokeWidth="3" fill="none" strokeLinecap="round" />;
  }
  return <path d="M 80 148 Q 100 162 120 148" stroke="#4c1d95" strokeWidth="3" fill="none" strokeLinecap="round" />;
}

export default function AIVideoCall({ meeting, onEnd }) {
  const [avatarState, setAvatarState] = useState('idle'); // idle | thinking | speaking
  const [micOn, setMicOn] = useState(true);
  const [vidOn, setVidOn] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState(false);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const messagesEndRef = useRef(null);
  const videoRef = useRef(null);

  // Request camera + mic access on mount
  useEffect(() => {
    navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setCameraStream(stream);
      })
      .catch(() => setCameraError(true));
    return () => {
      cameraStream?.getTracks().forEach(t => t.stop());
    };
  }, []);

  // Attach stream to video element
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream, vidOn]);

  // Toggle video tracks when vidOn changes
  useEffect(() => {
    cameraStream?.getVideoTracks().forEach(t => { t.enabled = vidOn; });
  }, [vidOn, cameraStream]);

  // Toggle audio tracks when micOn changes
  useEffect(() => {
    cameraStream?.getAudioTracks().forEach(t => { t.enabled = micOn; });
  }, [micOn, cameraStream]);

  // Greeting on mount
  useEffect(() => {
    setTimeout(() => greetUser(), 1200);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speak = (text) => {
    if (!soundOn) return;
    synthRef.current?.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    utter.pitch = 1.1;
    const voices = synthRef.current?.getVoices() || [];
    const preferred = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Karen'));
    if (preferred) utter.voice = preferred;
    utter.onstart = () => setAvatarState('speaking');
    utter.onend = () => setAvatarState('idle');
    synthRef.current?.speak(utter);
  };

  const greetUser = async () => {
    const greeting = `Hello! I'm your AI meeting assistant for "${meeting?.title || 'this meeting'}". I'm ready to help you with summaries, action items, or any questions. How can I assist you today?`;
    addMessage('assistant', greeting);
    speak(greeting);
  };

  const addMessage = (role, content) => {
    setMessages(prev => [...prev, { role, content, time: new Date() }]);
  };

  const handleSend = async (text) => {
    const msg = (text || input).trim();
    if (!msg || isLoading) return;
    setInput('');
    addMessage('user', msg);
    setIsLoading(true);
    setAvatarState('thinking');
    synthRef.current?.cancel();

    const context = meeting ? `
Meeting: ${meeting.title}
${meeting.summary ? `Summary: ${meeting.summary}` : ''}
${meeting.key_points?.length ? `Key Points: ${meeting.key_points.join(', ')}` : ''}
${meeting.action_items?.length ? `Action Items: ${meeting.action_items.map(a => a.task).join(', ')}` : ''}
${meeting.transcript ? `Transcript excerpt: ${meeting.transcript.slice(0, 500)}` : ''}
    `.trim() : '';

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a friendly, professional AI video call assistant in a meeting called "${meeting?.title}". 
${context}

Respond conversationally and concisely (2-4 sentences max) to: "${msg}"

Be warm, helpful, and professional like a real video call participant.`,
    });

    addMessage('assistant', response);
    setIsLoading(false);
    speak(response);
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setInput(text);
      handleSend(text);
    };
    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleEnd = () => {
    synthRef.current?.cancel();
    cameraStream?.getTracks().forEach(t => t.stop());
    onEnd && onEnd(messages);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
      {/* Main video area */}
      <div className="flex-1 relative overflow-hidden">
        {/* AI Avatar - full screen */}
        <div className="absolute inset-0">
          <AIAvatar state={avatarState} />
        </div>

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent z-10">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white font-semibold text-sm">{meeting?.title || 'AI Meeting'}</span>
          </div>
          <div className="text-white/60 text-sm font-mono">
            <CallTimer />
          </div>
        </div>

        {/* User self-view */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-24 right-4 w-32 h-24 sm:w-40 sm:h-28 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-slate-800 z-20"
        >
          {cameraStream && vidOn ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover scale-x-[-1]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center mx-auto mb-1">
                  <VideoOff className="h-5 w-5 text-indigo-300" />
                </div>
                <p className="text-slate-400 text-xs">{cameraError ? 'No camera' : 'Camera off'}</p>
              </div>
            </div>
          )}
          <div className="absolute bottom-1 left-2 text-white text-xs font-medium drop-shadow">You</div>
        </motion.div>

        {/* Chat panel */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute top-0 right-0 bottom-20 w-80 bg-slate-900/95 backdrop-blur-md border-l border-white/10 z-20 flex flex-col"
            >
              <div className="p-4 border-b border-white/10 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-indigo-400" />
                <span className="text-white font-medium text-sm">Meeting Chat</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/10 text-slate-100'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-2">
                    <div className="bg-white/10 rounded-2xl px-3 py-2 flex gap-1.5">
                      {[0,1,2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-3 border-t border-white/10 flex gap-2">
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 h-10"
                  onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                />
                <Button onClick={() => handleSend()} size="sm" className="h-10 w-10 p-0 bg-indigo-600 hover:bg-indigo-700">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls bar */}
      <div className="bg-slate-900/90 backdrop-blur-md border-t border-white/10 px-4 py-4">
        <div className="flex items-center justify-center gap-4 max-w-lg mx-auto">
          <ControlBtn active={micOn} onClick={() => { setMicOn(!micOn); if (!micOn) startVoiceInput(); }} icon={micOn ? Mic : MicOff} label="Mic" danger={!micOn} />
          <ControlBtn active={vidOn} onClick={() => setVidOn(!vidOn)} icon={vidOn ? Video : VideoOff} label="Camera" danger={!vidOn} />
          <ControlBtn active={soundOn} onClick={() => { setSoundOn(!soundOn); synthRef.current?.cancel(); }} icon={soundOn ? Volume2 : VolumeX} label="Sound" danger={!soundOn} />
          <ControlBtn active={chatOpen} onClick={() => setChatOpen(!chatOpen)} icon={MessageSquare} label="Chat" highlight={chatOpen} />

          {/* End call */}
          <button
            onClick={handleEnd}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/40 transition-all hover:scale-105">
              <PhoneOff className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs text-slate-400">End</span>
          </button>
        </div>

        {/* Voice hint */}
        <div className="text-center mt-3">
          <button
            onClick={startVoiceInput}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 mx-auto"
          >
            <Mic className="h-3 w-3" />
            Click mic or speak to chat with AI
          </button>
        </div>
      </div>
    </div>
  );
}

function ControlBtn({ active, onClick, icon: Icon, label, danger, highlight }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 group">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 ${
        danger ? 'bg-red-500/20 border border-red-500/50' :
        highlight ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30' :
        'bg-white/10 hover:bg-white/20'
      }`}>
        <Icon className={`h-5 w-5 ${danger ? 'text-red-400' : highlight ? 'text-white' : 'text-white'}`} />
      </div>
      <span className="text-xs text-slate-400">{label}</span>
    </button>
  );
}

function CallTimer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return <span>{m}:{s}</span>;
}