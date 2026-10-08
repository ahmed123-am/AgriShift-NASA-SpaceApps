import React, { useRef, useEffect } from 'react';
import { Bot, Send, X, Maximize2, Minimize2, Sparkles } from 'lucide-react';

export default function Chatbot({
  t, chatOpen, setChatOpen, chatExpanded, setChatExpanded,
  messages, isTyping, chatInput, setChatInput, onSendChat
}) {
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatOpen, isTyping]);

  return (
    <div className="fixed bottom-6 left-6 z-[1000]">
      {!chatOpen ? (
        <button
          onClick={() => setChatOpen(true)}
          className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 transition transform hover:scale-105 border border-emerald-400/30"
        >
          <Bot className="w-5 h-5 text-slate-950 animate-bounce" />
          <span className="text-xs">{t.chatOpenBtn}</span>
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
        </button>
      ) : (
        <div className={`bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          chatExpanded ? 'w-[90vw] md:w-[620px] h-[580px]' : 'w-80 md:w-96 h-[460px]'
        }`}>
          <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-500/20 p-1.5 rounded-lg border border-emerald-500/30">
                <Bot className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">{t.chatBotTitle}</span>
                <span className="text-3xs text-emerald-400 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  NASA Power AI Connected
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setChatExpanded(!chatExpanded)} 
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                {chatExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button 
                onClick={() => setChatOpen(false)} 
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-slate-950/60 border-b border-slate-800/80 p-2 flex gap-1.5 overflow-x-auto text-3xs no-scrollbar">
            <button 
              onClick={() => onSendChat("حلل خطتي الحالية")}
              className="bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-800/40 px-2.5 py-1 rounded-full whitespace-nowrap flex items-center gap-1 transition"
            >
              <Sparkles className="w-3 h-3" /> حلل خطتي الحالية
            </button>
            <button 
              onClick={() => onSendChat("عزل الكربون والبيئة")}
              className="bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-800/40 px-2.5 py-1 rounded-full whitespace-nowrap flex items-center gap-1 transition"
            >
              🌱 أثر الكربون
            </button>
            <button 
              onClick={() => onSendChat("كيف أواجه الجفاف هنا؟")}
              className="bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-800/40 px-2.5 py-1 rounded-full whitespace-nowrap flex items-center gap-1 transition"
            >
              💧 حلول الجفاف
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs bg-slate-950/40">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] p-3 rounded-2xl leading-relaxed whitespace-pre-line shadow ${
                  m.sender === 'user' ? 'bg-emerald-600 text-slate-950 font-medium' : 'bg-slate-800 text-slate-100 border border-slate-700/80'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-2.5 rounded-2xl border border-slate-700 flex items-center gap-1.5 text-3xs text-emerald-400">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  <span className="mr-1 text-slate-400">AgriShift يحلل بيانات ناسا...</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onSendChat(); }} className="p-2.5 border-t border-slate-800 bg-slate-950 flex gap-2">
            <input 
              type="text" 
              value={chatInput} 
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={t.chatPlaceholder}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
            />
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 p-2.5 rounded-xl transition font-bold">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}