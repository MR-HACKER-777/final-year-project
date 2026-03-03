import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, Send,
  Sparkles, Volume2, VolumeX, Maximize2, MessageSquare
} from 'lucide-react';
import AIAvatar from '@/components/video/AIAvatar';
import CallControls from '@/components/video/CallControls';
import CallTranscript from '@/components/video/CallTranscript';

export default function AIVideoCall() {
  const [callActive, setCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [avatarMood, setAvatarMood] = useState('neutral'); // neutral, speaking, thinking, happy
  const timerRef = useRef(null);
  const userVideoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (callActive) {
      timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
    } else {
      clearInterval(timerRef.current);
      setCallDuration(0);
    }
    return () => clearInterval(timerRef.current);
  }, [callActive]);

  const startCall = async () => {
    setCallActive(true);
    setMessages([]);
    // Try to get user camera
    if (!isCameraOff) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = stream;
        if (userVideoRef.current) userVideoRef.current.srcObject = stream;
      } catch {
        setIsCameraOff(true);
      }
    }
    // AI greeting
    setTimeout(() => {
      const greeting = "Hello! I'm your AI meeting assistant. How can I help you today? We can discuss your meeting agenda, brainstorm ideas, or I can take notes for you.";
      setMessages([{ role: 'assistant', content: greeting, time: new Date() }]);
      speakText(greeting);
    }, 800);
  };

  const endCall = () => {
    setCallActive(false);
    setIsAISpeaking(false);
    setAvatarMood('neutral');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (userVideoRef.current) userVideoRef.current.srcObject = null;
  };

  const speakText = (text) => {
    if (isSpeakerOff || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    utter.pitch = 1.05;
    // Pick a natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.name.includes('Google') && v.lang === 'en-US')
      || voices.find(v => v.lang === 'en-US')
      || voices[0];
    if (preferred) utter.voice = preferred;
    utter.onstart = () => { setIsAISpeaking(true); setAvatarMood('speaking'); };
    utter.onend = () => { setIsAISpeaking(false); setAvatarMood('neutral'); };
    window.speechSynthesis.speak(utter);
  };

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;
    setInput('');
    setIsLoading(true);
    setAvatarMood('thinking');
    setIsUserSpeaking(true);
    setTimeout(() => setIsUserSpeaking(false), 1000);

    const userMsg = { role: 'user', content: msg, time: new Date() };
    setMessages(prev => [...prev, userMsg]);

    const history = [...messages, userMsg].map(m => `${m.role === 'user' ? 'Human' : 'AI'}: ${m.content}`).join('\n');

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a friendly, professional AI video call assistant participating in a meeting. 
You help with meeting agendas, note-taking, brainstorming, and answering questions.
Keep responses conversational and concise (2-4 sentences max) since this is a live video call.
Be warm, engaging, and human-like in your tone.

Conversation so far:
${history}

Respond naturally to the latest message from Human.`,
    });

    setIsLoading(false);
    setAvatarMood('happy');
    const aiMsg = { role: 'assistant', content: response, time: new Date() };
    setMessages(prev => [...prev, aiMsg]);
    speakText(response);
    setTimeout(() => setAvatarMood('neutral'), 100);
  };

  const formatDuration = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  // Pre-call screen
  if (!callActive) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-600/15 blur-[100px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative text-center max-w-lg w-full px-6"
        >
          <div className="mb-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-indigo-500/40 ring-4 ring-indigo-500/20">
              <Sparkles className="h-14 w-14 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">AI Video Call</h1>
            <p className="text-slate-400">Have a face-to-face conversation with your AI meeting assistant</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {['🎥 Live Avatar', '🗣️ Voice AI', '📝 Auto Notes'].map(f => (
              <div key={f} className="bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm font-medium">
                {f}
              </div>
            ))}
          </div>

          <Button
            onClick={startCall}
            className="w-full h-14 text-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-2xl shadow-indigo-500/30 rounded-2xl"
          >
            <Video className="h-5 w-5 mr-2" />
            Start AI Video Call
          </Button>
          <p className="text-slate-500 text-sm mt-4">Your camera will be requested for picture-in-picture view</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 blur-[100px]" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-3 py-1">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 text-sm font-medium">LIVE</span>
          </div>
          <span className="text-slate-400 text-sm font-mono">{formatDuration(callDuration)}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-white text-sm font-medium">AI Assistant</span>
          </div>
        </div>
        <button
          onClick={() => setShowChat(!showChat)}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-1.5 text-white text-sm transition-colors"
        >
          <MessageSquare className="h-4 w-4" />
          Chat {messages.length > 0 && `(${messages.length})`}
        </button>
      </div>

      {/* Main video area */}
      <div className="flex-1 relative flex items-center justify-center px-4">
        <div className="flex flex-col lg:flex-row gap-4 w-full max-w-6xl items-center justify-center">

          {/* AI Avatar - Main */}
          <motion.div
            layout
            className={`relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 shadow-2xl ${showChat ? 'lg:w-1/2' : 'w-full max-w-2xl'}`}
            style={{ aspectRatio: '16/9' }}
          >
            <AIAvatar mood={avatarMood} isSpeaking={isAISpeaking} isThinking={isLoading} />

            {/* AI name tag */}
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isAISpeaking ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`} />
              <span className="text-white text-sm font-medium">AI Assistant</span>
              {isAISpeaking && (
                <motion.div className="flex gap-0.5">
                  {[0,1,2].map(i => (
                    <motion.div key={i} className="w-1 h-3 bg-green-400 rounded-full"
                      animate={{ scaleY: [1, 1.8, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Chat panel */}
          <AnimatePresence>
            {showChat && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="lg:w-1/2 w-full h-full"
              >
                <CallTranscript messages={messages} isLoading={isLoading} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User PiP */}
        <div className="absolute bottom-4 right-4 w-32 h-24 sm:w-44 sm:h-32 rounded-2xl overflow-hidden border-2 border-white/20 bg-slate-800 shadow-2xl">
          {!isCameraOff ? (
            <video ref={userVideoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">You</span>
              </div>
            </div>
          )}
          <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
            <span className="text-white text-xs bg-black/40 rounded px-1">You</span>
            {isMuted && <MicOff className="h-3 w-3 text-red-400" />}
          </div>
        </div>
      </div>

      {/* Bottom: Input + Controls */}
      <div className="relative z-10 px-4 pb-6 pt-2">
        {/* Quick prompts */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {["Take meeting notes", "Summarize key points", "What should we discuss next?", "Set action items"].map(p => (
            <button
              key={p}
              onClick={() => sendMessage(p)}
              disabled={isLoading}
              className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/40 text-slate-300 rounded-full transition-colors disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Text input */}
        <div className="flex gap-3 max-w-2xl mx-auto mb-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message or question..."
            className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50 rounded-xl"
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="h-12 px-5 bg-indigo-600 hover:bg-indigo-500 rounded-xl"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Call controls */}
        <CallControls
          isMuted={isMuted}
          isCameraOff={isCameraOff}
          isSpeakerOff={isSpeakerOff}
          onToggleMute={() => setIsMuted(m => !m)}
          onToggleCamera={() => {
            setIsCameraOff(c => !c);
            if (!isCameraOff && streamRef.current) {
              streamRef.current.getTracks().forEach(t => t.stop());
              streamRef.current = null;
            }
          }}
          onToggleSpeaker={() => {
            setIsSpeakerOff(s => !s);
            if (!isSpeakerOff) window.speechSynthesis?.cancel();
          }}
          onEndCall={endCall}
        />
      </div>
    </div>
  );
}