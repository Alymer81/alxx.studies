import React, { useState } from 'react';
import { ChatMessage } from '../../types';
import {
  Send,
  Sparkles,
  Calculator,
  PenTool,
  BookOpen,
  Layers,
  Copy,
  Check,
  RotateCcw,
  Lightbulb,
  Cpu,
} from 'lucide-react';

export const AskView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your Gemini AI Academic Tutor, styled after the Gemini mobile app. 

Ask me anything from STEM derivations and essay arguments to exam flashcards. Watch the aurora glow react as I solve complex queries!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'general' | 'math' | 'essay' | 'flashcards'>('general');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const presets = [
    {
      label: 'Solve Math Step-by-Step',
      mode: 'math' as const,
      icon: Calculator,
      prompt: 'Solve this step-by-step with formulas: ',
    },
    {
      label: 'Essay Thesis & Outline',
      mode: 'essay' as const,
      icon: PenTool,
      prompt: 'Create a structured 5-paragraph outline and strong thesis for: ',
    },
    {
      label: 'Explain Complex STEM Topic',
      mode: 'general' as const,
      icon: BookOpen,
      prompt: 'Explain this concept intuitively with a real-world example: ',
    },
    {
      label: 'High-Yield Flashcards',
      mode: 'flashcards' as const,
      icon: Layers,
      prompt: 'Generate 5 high-yield study flashcards with Q&A for: ',
    },
  ];

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend.trim(),
          mode,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate answer.');

      const assistantMsg: ChatMessage = {
        id: `asst_${Date.now()}`,
        role: 'assistant',
        content: data.answer || 'No response returned.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: `⚠️ ${err.message || 'Error communicating with Gemini. Please try again.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 pb-28 text-stone-900 dark:text-stone-100 flex flex-col h-[calc(100vh-6rem)] min-h-[620px]">
      {/* Top Gemini Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          {/* Gemini Sparkle with ambient halo */}
          <div className="relative p-2.5 rounded-2xl liquid-glass">
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 blur-md opacity-40 -z-10" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Gemini Tutor</h1>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-500 text-[10px] font-bold">
                iPhone Reacting Lighting
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              STEM derivations, essay writing, and interactive concept synthesis.
            </p>
          </div>
        </div>

        {/* Clear Chat Button */}
        <button
          onClick={() => setMessages(messages.slice(0, 1))}
          className="p-2 rounded-xl liquid-glass text-stone-400 hover:text-stone-200 transition-colors text-xs flex items-center gap-1.5"
          title="Reset Conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto py-3 shrink-0 scrollbar-none">
        {(
          [
            { id: 'general', label: 'All Subjects', icon: BookOpen },
            { id: 'math', label: 'STEM & Math', icon: Calculator },
            { id: 'essay', label: 'Essays & Writing', icon: PenTool },
            { id: 'flashcards', label: 'Exam Flashcards', icon: Layers },
          ] as const
        ).map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-stone-950 shadow-md scale-102'
                  : 'liquid-glass text-stone-600 dark:text-stone-300 hover:bg-black/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Message Chat Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 py-3 pr-1">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div className="flex items-center gap-2 text-[10px] text-stone-400 px-1 font-bold">
                {isUser ? (
                  <span>You</span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-500">
                    <Sparkles className="w-3 h-3" /> Gemini
                  </span>
                )}
                <span>· {msg.timestamp}</span>
              </div>

              <div
                className={`group relative max-w-2xl px-4 py-3 rounded-3xl text-xs leading-relaxed ${
                  isUser
                    ? 'bg-amber-500 text-stone-950 font-medium rounded-tr-xs shadow-md'
                    : 'liquid-card rounded-tl-xs border border-white/10 dark:border-white/10 shadow-lg text-stone-900 dark:text-stone-100'
                }`}
              >
                <div className="whitespace-pre-wrap break-words">{msg.content}</div>

                {!isUser && (
                  <button
                    onClick={() => handleCopy(msg.content, msg.id)}
                    className="absolute -top-3 right-3 p-1.5 rounded-xl liquid-glass text-stone-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    title="Copy Answer"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Gemini Active Problem-Solving State with Reacting Aurora Lighting */}
        {loading && (
          <div className="flex flex-col items-start space-y-2">
            <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1 px-1 animate-pulse">
              <Sparkles className="w-3 h-3" /> Gemini is analyzing & solving...
            </span>

            {/* Glowing Reacting Aurora Container */}
            <div className="relative p-[2px] rounded-3xl gemini-aurora-active w-full max-w-md">
              <div className="px-5 py-3.5 rounded-3xl bg-stone-950/90 backdrop-blur-xl border border-white/20 text-white text-xs flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-400 animate-ping" />
                <span className="font-semibold text-stone-200">
                  Formulating step-by-step solution with Gemini AI & Academic Engine...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Inspiration Pills */}
      {messages.length <= 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2 shrink-0">
          {presets.map((p, i) => {
            const Icon = p.icon;
            return (
              <button
                key={i}
                onClick={() => {
                  setMode(p.mode);
                  handleSend(p.prompt + 'Derivative of f(x) = x * ln(x)');
                }}
                className="p-2.5 rounded-2xl liquid-card text-left flex items-center gap-2.5 hover:scale-101 transition-transform"
              >
                <div className="p-1.5 rounded-xl bg-amber-500/15 text-amber-500">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <span className="text-xs font-bold truncate block">{p.label}</span>
                  <span className="text-[10px] text-stone-400 truncate block">{p.prompt}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Gemini iPhone Style Input Deck with Reacting Glowing Aura */}
      <div className="mt-2 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className={`relative p-[2px] rounded-3xl transition-all duration-300 ${
            loading ? 'gemini-aurora-active' : ''
          }`}
        >
          <div className="relative flex items-center liquid-glass rounded-3xl px-4 py-2 border border-black/10 dark:border-white/15 shadow-2xl focus-within:ring-2 focus-within:ring-amber-500/50">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask Gemini ${mode === 'math' ? 'a math problem...' : mode === 'essay' ? 'about your essay topic...' : 'anything...'}`}
              className="flex-1 bg-transparent text-xs sm:text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none py-1.5"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 rounded-2xl bg-amber-500 text-stone-950 font-bold hover:bg-amber-400 disabled:opacity-40 transition-all shadow-md shrink-0 ml-2"
              title="Send to Gemini"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
