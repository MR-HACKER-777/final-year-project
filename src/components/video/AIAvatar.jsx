import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Animated SVG AI face that reacts to mood/speaking state
export default function AIAvatar({ mood = 'neutral', isSpeaking = false, isThinking = false }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    const draw = (time) => {
      timeRef.current = time;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Background gradient
      const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.7);
      bg.addColorStop(0, '#1e1b4b');
      bg.addColorStop(1, '#0f0e1a');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Grid lines subtle
      ctx.strokeStyle = 'rgba(99,102,241,0.07)';
      ctx.lineWidth = 1;
      for (let i = 0; i < w; i += 40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
      }
      for (let j = 0; j < h; j += 40) {
        ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(w, j); ctx.stroke();
      }

      const t = time / 1000;
      const cx = w / 2;
      const cy = h / 2 - 10;

      // Outer glow ring
      const glowColor = isThinking ? '#f59e0b' : isSpeaking ? '#22c55e' : '#6366f1';
      const glowR = 140 + Math.sin(t * 2) * (isSpeaking ? 8 : 3);
      const glow = ctx.createRadialGradient(cx, cy, glowR - 20, cx, cy, glowR + 30);
      glow.addColorStop(0, glowColor + '40');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, glowR + 30, 0, Math.PI * 2);
      ctx.fill();

      // Rotating ring if thinking
      if (isThinking) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * 2);
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const rx = Math.cos(angle) * 155;
          const ry = Math.sin(angle) * 155;
          ctx.beginPath();
          ctx.arc(rx, ry, 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(245,158,11,${0.3 + (i / 8) * 0.5})`;
          ctx.fill();
        }
        ctx.restore();
      }

      // Face circle
      const faceGrad = ctx.createRadialGradient(cx - 20, cy - 20, 10, cx, cy, 130);
      faceGrad.addColorStop(0, '#4f46e5');
      faceGrad.addColorStop(0.5, '#3730a3');
      faceGrad.addColorStop(1, '#1e1b4b');
      ctx.beginPath();
      ctx.arc(cx, cy, 130, 0, Math.PI * 2);
      ctx.fillStyle = faceGrad;
      ctx.fill();
      // Face border
      ctx.strokeStyle = glowColor + '80';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Eyes
      const blinkCycle = Math.sin(t * 0.4);
      const eyeH = blinkCycle > 0.97 ? 1 : 12;
      const eyeY = cy - 25;
      const eyeOffX = 42;

      [cx - eyeOffX, cx + eyeOffX].forEach(ex => {
        // Eye glow
        const eg = ctx.createRadialGradient(ex, eyeY, 0, ex, eyeY, 20);
        eg.addColorStop(0, glowColor + 'cc');
        eg.addColorStop(1, 'transparent');
        ctx.fillStyle = eg;
        ctx.beginPath(); ctx.ellipse(ex, eyeY, 20, 20, 0, 0, Math.PI * 2); ctx.fill();
        // Eye white
        ctx.beginPath();
        ctx.ellipse(ex, eyeY, 15, eyeH, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        // Pupil
        if (eyeH > 2) {
          ctx.beginPath();
          ctx.arc(ex + Math.sin(t * 0.3) * 3, eyeY + Math.cos(t * 0.2) * 2, 6, 0, Math.PI * 2);
          ctx.fillStyle = glowColor;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(ex + Math.sin(t * 0.3) * 3 + 2, eyeY + Math.cos(t * 0.2) * 2 - 2, 2, 0, Math.PI * 2);
          ctx.fillStyle = 'white';
          ctx.fill();
        }
      });

      // Nose (subtle)
      ctx.beginPath();
      ctx.moveTo(cx, cy - 5);
      ctx.quadraticCurveTo(cx + 10, cy + 10, cx + 5, cy + 15);
      ctx.quadraticCurveTo(cx, cy + 17, cx - 5, cy + 15);
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Mouth
      const mouthY = cy + 48;
      const mouthW = 40;
      if (isSpeaking) {
        // Animated talking mouth
        const mh = Math.abs(Math.sin(t * 10)) * 18 + 4;
        ctx.beginPath();
        ctx.ellipse(cx, mouthY, mouthW, mh, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#0f0e1a';
        ctx.fill();
        ctx.strokeStyle = glowColor + 'cc';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Teeth
        if (mh > 8) {
          ctx.fillStyle = 'rgba(255,255,255,0.8)';
          ctx.beginPath();
          ctx.ellipse(cx, mouthY - mh * 0.3, mouthW * 0.8, mh * 0.4, 0, 0, Math.PI);
          ctx.fill();
        }
      } else if (mood === 'happy') {
        ctx.beginPath();
        ctx.moveTo(cx - mouthW, mouthY);
        ctx.quadraticCurveTo(cx, mouthY + 20, cx + mouthW, mouthY);
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.stroke();
      } else if (mood === 'thinking') {
        ctx.beginPath();
        ctx.moveTo(cx - mouthW * 0.6, mouthY + 5);
        ctx.quadraticCurveTo(cx, mouthY - 5, cx + mouthW * 0.6, mouthY + 5);
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.stroke();
      } else {
        // neutral slight smile
        ctx.beginPath();
        ctx.moveTo(cx - mouthW * 0.7, mouthY);
        ctx.quadraticCurveTo(cx, mouthY + 10, cx + mouthW * 0.7, mouthY);
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Speaking sound waves
      if (isSpeaking) {
        for (let i = 1; i <= 3; i++) {
          const r = 145 + i * 25 + Math.sin(t * 5 + i) * 5;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(34,197,94,${0.15 - i * 0.04})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // Particle floaters
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + t * 0.3;
        const r = 155 + Math.sin(t + i) * 10;
        const px = cx + Math.cos(angle) * r;
        const py = cy + Math.sin(angle) * r;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = glowColor + 'aa';
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [mood, isSpeaking, isThinking]);

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <canvas
        ref={canvasRef}
        width={640}
        height={360}
        className="w-full h-full object-cover"
      />
      {isThinking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm border border-amber-500/30 rounded-full px-4 py-2 flex items-center gap-2"
        >
          <div className="flex gap-1">
            {[0,1,2].map(i => (
              <motion.div key={i} className="w-2 h-2 rounded-full bg-amber-400"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
              />
            ))}
          </div>
          <span className="text-amber-300 text-xs">Thinking...</span>
        </motion.div>
      )}
    </div>
  );
}
