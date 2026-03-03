import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import {
  Video, Sparkles, FileText, MessageSquare, CheckSquare,
  Zap, Brain, Clock, Users, ArrowRight, Check, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Video,
    title: 'Real-Time Video Meetings',
    description: 'Conduct seamless video calls with AI-powered assistance'
  },
  {
    icon: FileText,
    title: 'Smart Transcription',
    description: 'Automatic, accurate transcripts of every meeting'
  },
  {
    icon: Brain,
    title: 'AI-Powered Summaries',
    description: 'Get instant summaries with key points and insights'
  },
  {
    icon: MessageSquare,
    title: 'ChatGPT-Like Interface',
    description: 'Ask questions about your meetings anytime'
  },
  {
    icon: CheckSquare,
    title: 'Action Item Tracking',
    description: 'Never miss a follow-up with smart action tracking'
  },
  {
    icon: Zap,
    title: 'Real-Time Collaboration',
    description: 'Engage better with reduced cognitive load'
  }
];

const benefits = [
  'Automated meeting documentation',
  'Searchable meeting archives',
  'Smart action item extraction',
  'Multi-participant support',
  'Secure and private',
  'Cross-device access'
];

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await base44.auth.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        navigate(createPageUrl('Dashboard'));
      }
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogin = () => {
    base44.auth.redirectToLogin(createPageUrl('Dashboard'));
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-violet-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-violet-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          {/* Nav */}
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">MeetingAI</span>
            </div>
            <Button
              onClick={handleLogin}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Sign In
            </Button>
          </motion.nav>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm mb-6">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>AI-Powered Meeting Intelligence</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Smarter Meetings.<br/>
                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  Better Results.
                </span>
              </h1>
              
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Transform your meetings with AI-powered transcription, intelligent summaries, 
                and a ChatGPT-like interface for instant insights.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleLogin}
                  size="lg"
                  className="h-14 px-8 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-lg shadow-lg shadow-indigo-500/25"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 border-white/20 text-white hover:bg-white/10 text-lg"
                  onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn More
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 rounded-3xl blur-3xl" />
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                <div className="space-y-4">
                  {[
                    { icon: Video, text: 'Meeting in progress...', color: 'from-emerald-500 to-teal-500' },
                    { icon: FileText, text: 'Transcribing live audio...', color: 'from-blue-500 to-cyan-500' },
                    { icon: Brain, text: 'Analyzing key points...', color: 'from-violet-500 to-purple-500' }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="flex items-center gap-4 bg-slate-700/50 rounded-xl p-4"
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                        <item.icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-white font-medium">{item.text}</span>
                      <div className="ml-auto">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything You Need for Smarter Meetings
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powered by advanced AI to enhance collaboration and productivity
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition-all border border-slate-100"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-gradient-to-br from-indigo-50 to-violet-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Why Teams Choose MeetingAI
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                Built on cutting-edge research in AI communication, our platform delivers 
                measurable improvements in meeting effectiveness and team productivity.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-4xl font-bold text-indigo-600 mb-2">98%</div>
                  <div className="text-slate-600">Transcription Accuracy</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-violet-600 mb-2">60%</div>
                  <div className="text-slate-600">Time Saved</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-emerald-600 mb-2">10k+</div>
                  <div className="text-slate-600">Meetings Processed</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-amber-600 mb-2">4.9★</div>
                  <div className="text-slate-600">User Rating</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-xl"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Key Benefits</h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-slate-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-br from-slate-900 via-indigo-900 to-violet-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Meetings?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Join thousands of teams using AI to make meetings more productive
            </p>
            <Button
              onClick={handleLogin}
              size="lg"
              className="h-14 px-8 bg-white text-indigo-900 hover:bg-slate-100 text-lg font-semibold shadow-lg"
            >
              Start Free Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-white font-semibold">MeetingAI</span>
            </div>
            <p className="text-slate-400 text-sm">
              © 2026 MeetingAI. Powered by AI research and innovation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}