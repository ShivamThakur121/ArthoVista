import React from 'react';

/**
 * Modern Low-Contrast Ambient Corporate Background Animation
 * Ultra-smooth, non-intrusive CSS GPU-accelerated morphing ambient lights
 */
export default function StarfieldBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Subtle modern dot-grid mesh */}
      <div 
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: 'radial-gradient(rgba(148, 163, 184, 0.25) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Floating Ambient Orb 1 - Soft Teal */}
      <div 
        className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-teal-300/20 blur-[130px] animate-ambient-drift-1" 
      />

      {/* Floating Ambient Orb 2 - Soft Indigo/Blue */}
      <div 
        className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full bg-indigo-300/20 blur-[140px] animate-ambient-drift-2" 
      />

      {/* Floating Ambient Orb 3 - Soft Sky */}
      <div 
        className="absolute -bottom-40 left-1/4 w-[650px] h-[650px] rounded-full bg-sky-200/25 blur-[150px] animate-ambient-drift-3" 
      />
    </div>
  );
}
