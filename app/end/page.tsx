"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RotateCcw, Home, Star } from 'lucide-react';

export default function EndCallPage() {
  const router = useRouter();
  const [rating, setRating] = useState(0);

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex flex-col items-center justify-center relative text-white overflow-hidden font-sans selection:bg-blue-500/30">
       {/* Background Effects */}
       <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_70%)] opacity-70" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[400px] bg-blue-600/10 blur-[120px] rounded-t-full" />
      </div>

      <div className="max-w-md w-full p-8 text-center space-y-8 z-10">
        <div className="space-y-2">
            <h1 className="text-4xl font-medium tracking-tight">You left the meeting</h1>
            <p className="text-gray-400">Have a nice day!</p>
        </div>

        <div className="flex items-center justify-center gap-4">
            <button 
                onClick={() => router.push('/interview')}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:scale-105"
            >
                <RotateCcw className="w-4 h-4" />
                <span>Rejoin</span>
            </button>
            <button 
                onClick={() => router.push('/')}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 transition-all hover:shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] hover:scale-105"
            >
                <Home className="w-4 h-4" />
                <span>Return to home screen</span>
            </button>
        </div>

        <div className="pt-8 space-y-4">
            <p className="text-sm font-medium text-gray-300">How was the quality of the call?</p>
            <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`p-2 rounded-full transition-all hover:bg-white/5 ${rating >= star ? 'text-yellow-400' : 'text-gray-600'}`}
                    >
                        <Star className={`w-8 h-8 ${rating >= star ? 'fill-current' : ''}`} />
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
