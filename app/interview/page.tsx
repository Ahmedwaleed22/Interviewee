"use client";

import React, { useState } from 'react';
import { Mic, Video, PhoneOff, MoreVertical, Info, Users, MessageSquare, Hand, MonitorUp, Terminal } from 'lucide-react';
import ChatSidebar from '../../components/ChatSidebar';

export default function InterviewPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="h-screen w-full bg-[#0a0a0a] flex flex-col relative text-white overflow-hidden font-sans selection:bg-blue-500/30">
       {/* Background Effects (Matching Home Page) */}
       <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_70%)] opacity-70" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[400px] bg-blue-600/10 blur-[120px] rounded-t-full" />
      </div>

      {/* Main Content Area - Video Grid */}
      <div className="flex-1 p-4 flex relative z-30 overflow-hidden">
         {/* Video Container */}
         <div className="flex-1 flex relative transition-all duration-300">
             {/* AI Interviewer Video (Main) */}
             <div className="flex-1 bg-[#0f0f0f] border border-white/10 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-2xl">
                <div className="text-center z-10">
                    <div className="relative">
                        <div className="w-32 h-32 bg-blue-600/20 rounded-full mx-auto mb-4 flex items-center justify-center border border-blue-500/30 shadow-[0_0_30px_-5px_rgba(37,99,235,0.3)]">
                             <Terminal className="w-16 h-16 text-blue-400" />
                        </div>
                         <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-[#0f0f0f]"></div>
                    </div>
                    <p className="text-xl font-medium tracking-tight">AI Interviewer</p>
                    <p className="text-sm text-gray-400 mt-1">Interviewee Beta</p>
                </div>

                {/* Speaking Indicator */}
                 <div className="absolute top-6 right-6 bg-black/40 border border-white/10 px-4 py-2 rounded-full text-sm flex items-center gap-2 backdrop-blur-md text-blue-100/90">
                     <div className="flex gap-1 items-center h-3">
                         <div className="w-1 h-2 bg-blue-500 rounded-full animate-[pulse_1s_ease-in-out_infinite]"></div>
                         <div className="w-1 h-3 bg-blue-500 rounded-full animate-[pulse_1.2s_ease-in-out_infinite]"></div>
                         <div className="w-1 h-2 bg-blue-500 rounded-full animate-[pulse_0.8s_ease-in-out_infinite]"></div>
                     </div>
                     Speaking...
                 </div>
             </div>

             {/* User Video (Self View - Floating PiP) */}
             <div className="absolute bottom-8 right-8 w-72 h-48 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center hover:scale-105 transition-all duration-300 group z-50"
                  style={{ transformOrigin: 'bottom right' }}
             >
                 <div className="text-center opacity-50 pointer-events-none">
                     <div className="w-12 h-12 bg-white/10 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-lg font-bold">You</span>
                     </div>
                 </div>
                  <div className="absolute top-3 right-3 bg-black/50 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                     You
                 </div>
                 <div className="absolute bottom-3 left-3 pointer-events-none">
                      <div className="bg-blue-600/90 p-1.5 rounded-full shadow-lg"><Mic className="w-3 h-3 text-white" /></div>
                 </div>
             </div>
         </div>

         {/* Chat Sidebar */}
         <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>

      {/* Bottom Control Bar */}
      <div className="h-24 px-8 flex items-center justify-between shrink-0 relative z-20">
        {/* Left Info */}
        <div className="flex items-center gap-4 min-w-[240px] text-gray-300">
           <span className="font-medium text-lg tracking-tight">10:00 AM</span>
           <span className="h-4 w-px bg-white/10"></span>
           <div className="flex flex-col">
               <span className="font-medium text-sm text-white tracking-tight">Technical Interview</span>
               <span className="text-xs text-gray-500">session-id-2938</span>
           </div>
        </div>

        {/* Center Controls */}
        <div className="flex items-center gap-3">
            <button className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all hover:scale-110">
                <Mic className="w-5 h-5" />
            </button>
            <button className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all hover:scale-110">
                <Video className="w-5 h-5" />
            </button>
             <button className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all hover:scale-110 hidden md:block">
                <Hand className="w-5 h-5" />
            </button>
             <button className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all hover:scale-110 hidden md:block">
                <MonitorUp className="w-5 h-5" />
            </button>
             <button className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all hover:scale-110">
                <MoreVertical className="w-5 h-5" />
            </button>
            <button className="px-8 rounded-full bg-red-600 hover:bg-red-500 text-white transition-all hover:shadow-[0_0_20px_-5px_rgba(220,38,38,0.5)] hover:scale-105 h-14 flex items-center justify-center ml-2">
                <PhoneOff className="w-6 h-6 fill-current" />
            </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 min-w-[240px] justify-end">
            <button className="p-3 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white">
                <Info className="w-5 h-5" />
            </button>
            <button className="p-3 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white">
                <Users className="w-5 h-5" />
            </button>
            <button 
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`p-3 rounded-full transition-colors relative ${isChatOpen ? 'bg-blue-600 text-white hover:bg-blue-500' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
            >
                <MessageSquare className="w-5 h-5" />
                {!isChatOpen && <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-[#0a0a0a]"></span>}
            </button>
        </div>
      </div>
    </div>
  );
}
