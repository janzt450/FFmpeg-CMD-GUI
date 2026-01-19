
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { CommandBuilder } from './components/CommandBuilder';
import { ToolType, CommandHistory } from './types';
import { 
  Github, 
  Share2, 
  Info, 
  Code, 
  ShieldCheck, 
  Map, 
  Globe, 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  Bot, 
  Sparkles, 
  Eye, 
  Monitor, 
  Smartphone, 
  Clock, 
  AlertTriangle, 
  Palette,
  Terminal,
  Code2,
  Gamepad2,
  Shield,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>('trim');
  const [history, setHistory] = useState<CommandHistory[]>([]);

  // Footer State
  const [isFooterOpen, setIsFooterOpen] = useState(false);

  // Modals State
  const [isTransparencyOpen, setIsTransparencyOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isOSSOpen, setIsOSSOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  
  // External Link Dialog State
  const [noticeUrl, setNoticeUrl] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  // Close modals on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setNoticeUrl(null);
        setIsTransparencyOpen(false);
        setIsAboutOpen(false);
        setIsOSSOpen(false);
        setIsShareOpen(false);
        setIsRoadmapOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleCommandGenerated = (cmd: string) => {
    // Avoid duplicates at top of list
    if (history.length > 0 && history[0].command === cmd) return;

    const newItem: CommandHistory = {
      id: Math.random().toString(36).substr(2, 9),
      tool: activeTool,
      command: cmd,
      timestamp: Date.now()
    };

    setHistory(prev => [newItem, ...prev].slice(0, 10)); // Keep last 10
  };

  const handleExternalLink = (url: string) => {
    const hasSeen = localStorage.getItem(`ffmpeghelper_notice_${url}`);
    if (hasSeen) {
      window.open(url, '_blank');
    } else {
      setNoticeUrl(url);
    }
  };

  const confirmExternalLink = () => {
    if (!noticeUrl) return;
    localStorage.setItem(`ffmpeghelper_notice_${noticeUrl}`, 'true');
    window.open(noticeUrl, '_blank');
    setNoticeUrl(null);
  };

  const copyUrl = () => {
    if (!noticeUrl) return;
    navigator.clipboard.writeText(noticeUrl);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="flex h-screen bg-background text-gray-200 overflow-hidden font-sans relative">
      
      {/* Roadmap Modal */}
      {isRoadmapOpen && (
        <div 
          className="fixed inset-0 z-[140] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setIsRoadmapOpen(false)}
        >
          <div 
            className="bg-[#0f111a] border border-[#2a314d] rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.6)] max-w-lg w-full overflow-hidden relative p-10 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsRoadmapOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#1a1f33] text-gray-400 hover:text-white transition-all hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-20 h-20 rounded-2xl bg-[#f59e0b]/10 border border-[#f59e0b]/30 flex items-center justify-center mb-6 shadow-xl shadow-amber-900/20">
                <Map className="w-10 h-10 text-[#f59e0b]" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-2">Project Roadmap</h2>
              <p className="text-sm text-gray-500 font-medium">Future Visions</p>
            </div>

            <div className="space-y-10">
              <section>
                <div className="flex items-center gap-3 mb-3 text-accent">
                  <Gamepad2 className="w-6 h-6" />
                  <h3 className="font-bold text-xl text-white">Feature Evolution</h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  FFmpeg CMD GUI aims to support complex filter chains, visual graph-based command building, and batch processing script generation.
                </p>
              </section>

              <div className="bg-[#161b33] border border-[#2a314d] rounded-2xl p-6">
                 <h4 className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-4">THE PATH FORWARD</h4>
                 <p className="text-sm text-gray-300 font-medium leading-relaxed">
                   This roadmap is not fixed. As an open-source tool, its destiny lies with the community. Fork it, mod it, and make it your own.
                 </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {isShareOpen && (
        <div 
          className="fixed inset-0 z-[140] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setIsShareOpen(false)}
        >
          <div 
            className="bg-[#0f111a] border border-[#2a314d] rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.6)] max-w-3xl w-full overflow-hidden relative p-8 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsShareOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#1a1f33] text-gray-400 hover:text-white transition-all hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-14 h-14 rounded-2xl bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center mb-4">
                <Share2 className="w-7 h-7 text-[#3b82f6]" />
              </div>
              <h2 className="text-3xl font-bold text-white">Share FFmpeg CMD GUI</h2>
              <p className="text-sm text-gray-500 font-medium mt-1">Access this tool on other platforms</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#141828] border border-[#2a314d] rounded-2xl p-6 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-[#4c1d95]/30 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-[#7c3aed]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white leading-tight">Web App</h3>
                    <p className="text-xs text-gray-500">Run in browser</p>
                  </div>
                </div>
                <div className="mt-auto">
                  <button disabled className="w-full py-2.5 bg-[#1a1f33] text-gray-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed border border-[#2a314d]">
                    <ExternalLink className="w-4 h-4" /> Coming Soon
                  </button>
                </div>
              </div>

              <div className="bg-[#141828] border border-[#2a314d] rounded-2xl p-6 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-900/20 flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white leading-tight">Desktop</h3>
                    <p className="text-xs text-gray-500">Standalone App</p>
                  </div>
                </div>
                 <div className="mt-auto">
                  <button disabled className="w-full py-2.5 bg-[#1a1f33] text-gray-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed border border-[#2a314d]">
                    <ExternalLink className="w-4 h-4" /> Coming Soon
                  </button>
                </div>
              </div>

              <div className="bg-[#141828] border border-[#2a314d] rounded-2xl p-6 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-emerald-900/20 flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white leading-tight">Mobile</h3>
                    <p className="text-xs text-gray-500">Mobile App</p>
                  </div>
                </div>
                <div className="mt-auto">
                  <button disabled className="w-full py-2.5 bg-[#1a1f33]/50 text-gray-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                    Coming Soon
                  </button>
                </div>
              </div>

              <div className="bg-[#141828] border border-[#2a314d] rounded-2xl p-6 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center">
                    <Code2 className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white leading-tight">Source Code</h3>
                    <p className="text-xs text-gray-500">GitHub Repository</p>
                  </div>
                </div>
                <div className="mt-auto">
                  <button 
                    onClick={() => handleExternalLink('https://github.com/janzt450/Color-Detect')}
                    className="w-full py-2.5 bg-[#2a314d] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#343b59] transition-all"
                  >
                    <ExternalLink className="w-4 h-4" /> View Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Why Open Source Modal */}
      {isOSSOpen && (
        <div 
          className="fixed inset-0 z-[130] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setIsOSSOpen(false)}
        >
          <div 
            className="bg-[#0f111a] border border-[#2a314d] rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.6)] max-w-lg w-full overflow-hidden relative p-10 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsOSSOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#1a1f33] text-gray-400 hover:text-white transition-all hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-16 h-16 rounded-2xl bg-[#064e3b] border border-[#10b981]/30 flex items-center justify-center mb-6 shadow-xl shadow-emerald-900/20">
                <Shield className="w-8 h-8 text-[#10b981]" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Why Open Source?</h2>
              <p className="text-sm text-gray-500 font-medium">Transparency is Trust</p>
            </div>

            <div className="space-y-10">
              <section>
                <div className="flex items-center gap-3 mb-3 text-accent">
                  <Eye className="w-5 h-5" />
                  <h3 className="font-bold text-lg text-white">Auditability</h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  "Open Source" means the code is publicly available. Anyone can inspect it to ensure there are no hidden trackers, spyware, or malicious algorithms.
                </p>
              </section>

              <div className="bg-[#161b33] border border-[#2a314d] rounded-2xl p-6">
                 <h4 className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-4">Supported By Principles From:</h4>
                 <ul className="space-y-2">
                   <li className="text-sm font-bold text-gray-200 flex items-center gap-2">Free Software Foundation</li>
                   <li className="text-sm font-bold text-gray-200 flex items-center gap-2">Open Source Initiative</li>
                   <li className="text-sm font-bold text-gray-200 flex items-center gap-2">Electronic Frontier Foundation</li>
                 </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {isAboutOpen && (
        <div 
          className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setIsAboutOpen(false)}
        >
          <div 
            className="bg-[#0f111a] border border-[#2a314d] rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.6)] max-w-lg w-full overflow-hidden relative p-10 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsAboutOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#1a1f33] text-gray-400 hover:text-white transition-all hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-[#10b981] flex items-center justify-center mb-6 shadow-xl shadow-emerald-900/20">
                <Terminal className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">FFmpeg CMD GUI</h2>
              <p className="text-sm text-gray-500 font-medium">Command Generator</p>
            </div>

            <div className="space-y-6 text-sm text-gray-400 leading-relaxed text-center px-2">
              <p>
                FFmpeg CMD GUI was built to demystify complex video processing commands. It empowers creators to manipulate media locally without needing to memorize arcane syntax.
              </p>
              <p>
                This app does not process your files directly; it generates the code you need to run on your own machine.
              </p>
            </div>

            <div className="mt-8 bg-[#2d1a1a]/40 border border-red-500/20 rounded-2xl p-4 flex items-start gap-4">
               <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
               <p className="text-xs font-bold text-red-200/80 leading-snug">
                 This app is free forever.
               </p>
            </div>
          </div>
        </div>
      )}

      {/* Transparency Modal */}
      {isTransparencyOpen && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setIsTransparencyOpen(false)}
        >
          <div 
            className="bg-[#0f111a] border border-[#2a314d] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-lg w-full overflow-hidden relative p-8 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsTransparencyOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#1a1f33] text-gray-400 hover:text-white transition-all hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4c1d95] to-[#7c3aed] flex items-center justify-center mb-6 shadow-xl shadow-purple-900/20">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">AI Transparency Statement</h2>
              <p className="text-sm text-gray-500 font-medium">Created with Human Vision & Machine Intelligence</p>
            </div>

            <div className="space-y-8 text-left">
              <section>
                <div className="flex items-center gap-3 mb-3 text-yellow-500">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-bold text-lg text-white">A Historical Artifact</h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  This app serves as a historical artifact of the 'vibecoding' era. It was generated as an intentional exercise in UX design, bridging the gap between concept and reality through Large Language Models.
                </p>
              </section>

              <div className="bg-[#061c16] border border-[#10b981]/20 rounded-xl p-4 text-center">
                <p className="text-[#10b981] font-bold text-sm tracking-tight">
                  "Originally created with Gemini 3 Pro Preview using Google AI Studio - January 2026"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {noticeUrl && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setNoticeUrl(null)}
        >
          <div 
            className="bg-card border border-border rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden p-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4 text-accent">
              <ExternalLink className="w-6 h-6" />
              <h3 className="text-xl font-bold">External Link Notice</h3>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              You are leaving this app to visit an external website.
            </p>
            <div className="bg-background/50 rounded-xl p-4 border border-border flex items-center gap-3 mb-8 group">
              <span className="text-xs font-mono text-gray-300 break-all flex-1">{noticeUrl}</span>
              <button 
                onClick={copyUrl}
                className="shrink-0 p-2 rounded-lg bg-border/50 hover:bg-border text-gray-400 hover:text-white transition-all active:scale-95"
                title="Copy URL"
              >
                {hasCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setNoticeUrl(null)}
                className="flex-1 py-3 bg-border/20 text-gray-300 rounded-xl font-bold text-sm hover:bg-border/40 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmExternalLink}
                className="flex-[2] py-3 bg-accent text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-lg shadow-accent/20"
              >
                Continue to Site
              </button>
            </div>
          </div>
        </div>
      )}

      <Sidebar 
        activeTool={activeTool} 
        onSelectTool={setActiveTool}
        history={history}
        onClearHistory={() => setHistory([])}
      />
      
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <main className="flex-1 flex flex-col min-w-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] overflow-hidden">
            <CommandBuilder 
              tool={activeTool} 
              onCommandGenerated={handleCommandGenerated}
            />
        </main>

        <footer className={`border-t border-border bg-background/90 backdrop-blur-md shrink-0 z-10 flex flex-col transition-all duration-300 ease-in-out ${isFooterOpen ? 'h-[72px]' : 'h-6'}`}>
            {/* Toggle Bar */}
            <div 
                className="h-6 w-full flex items-center justify-between px-4 cursor-pointer hover:bg-white/5 border-b border-white/5 transition-colors group"
                onClick={() => setIsFooterOpen(!isFooterOpen)}
            >
                <ChevronUp className={`w-3.5 h-3.5 text-gray-600 group-hover:text-accent transition-all duration-300 ${isFooterOpen ? 'rotate-180' : ''}`} />
                <div className="h-1 w-8 rounded-full bg-gray-700/50 group-hover:bg-accent/50 transition-colors" />
                <ChevronUp className={`w-3.5 h-3.5 text-gray-600 group-hover:text-accent transition-all duration-300 ${isFooterOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Content */}
            <div className={`flex-1 flex items-center justify-center gap-6 overflow-hidden transition-opacity duration-200 ${isFooterOpen ? 'opacity-100' : 'opacity-0'}`}>
                <button 
                onClick={() => setIsShareOpen(true)}
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-accent transition-colors"
                >
                <Share2 className="w-3.5 h-3.5" /> Share App
                </button>
                <button 
                onClick={() => handleExternalLink('https://github.com/janzt450/Color-Detect')}
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-accent transition-colors"
                >
                <Github className="w-3.5 h-3.5" /> View Source Code
                </button>
                <button 
                onClick={() => setIsAboutOpen(true)}
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-accent transition-colors"
                >
                <Info className="w-3.5 h-3.5" /> About
                </button>
                <button 
                onClick={() => setIsOSSOpen(true)}
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-accent transition-colors"
                >
                <Code className="w-3.5 h-3.5" /> Why Open Source?
                </button>
                <button 
                onClick={() => setIsTransparencyOpen(true)}
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-accent transition-colors"
                >
                <ShieldCheck className="w-3.5 h-3.5" /> AI Transparency
                </button>
                <button 
                onClick={() => setIsRoadmapOpen(true)}
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-accent transition-colors"
                >
                <Map className="w-3.5 h-3.5" /> Roadmap
                </button>
                <button 
                onClick={() => handleExternalLink('https://outlandproductions.neocities.org/')}
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-accent transition-colors"
                >
                <Globe className="w-3.5 h-3.5" /> Website
                </button>
            </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
