import React from 'react';
const palette = ['#F75A5A', '#FFA955', '#FFD63A', '#6DE1D2'];
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-32 h-32 rounded-full flex items-center justify-center text-5xl font-bold mb-6" style={{background: `linear-gradient(135deg, ${palette[0]}, ${palette[1]})`, color: palette[2]}}>
        404
      </div>
      <h1 className="text-3xl font-bold mb-2" style={{color: palette[0]}}>Page Not Found</h1>
      <p className="text-white/70 mb-6">The page you are looking for does not exist.</p>
      <a href="/dashboard" className="px-6 py-3 rounded-lg font-semibold text-white text-lg transition-all" style={{background: `linear-gradient(90deg, ${palette[0]}, ${palette[1]}, ${palette[2]}, ${palette[3]})`}}>
        Go to Dashboard
      </a>
    </div>
  );
} 