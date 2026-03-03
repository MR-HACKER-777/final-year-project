import React from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

function ControlBtn({ onClick, active, danger, icon: Icon, offIcon: OffIcon, isOn, label }) {
  const Icon2 = isOn ? Icon : (OffIcon || Icon);
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      title={label}
      className={`flex flex-col items-center gap-1 group`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all
        ${danger
          ? 'bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/40'
          : isOn
            ? 'bg-white/10 hover:bg-white/20 border border-white/20'
            : 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/30'
        }`}
      >
        <Icon2 className={`h-5 w-5 ${danger ? 'text-white' : isOn ? 'text-white' : 'text-red-400'}`} />
      </div>
      <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors">{label}</span>
    </motion.button>
  );
}

export default function CallControls({ isMuted, isCameraOff, isSpeakerOff, onToggleMute, onToggleCamera, onToggleSpeaker, onEndCall }) {
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6">
      <ControlBtn
        onClick={onToggleMute}
        isOn={!isMuted}
        icon={Mic}
        offIcon={MicOff}
        label={isMuted ? 'Unmute' : 'Mute'}
      />
      <ControlBtn
        onClick={onToggleCamera}
        isOn={!isCameraOff}
        icon={Video}
        offIcon={VideoOff}
        label={isCameraOff ? 'Camera On' : 'Camera Off'}
      />
      <ControlBtn
        onClick={onToggleSpeaker}
        isOn={!isSpeakerOff}
        icon={Volume2}
        offIcon={VolumeX}
        label={isSpeakerOff ? 'Speaker On' : 'Speaker Off'}
      />
      <ControlBtn
        onClick={onEndCall}
        danger
        isOn
        icon={PhoneOff}
        label="End Call"
      />
    </div>
  );
}