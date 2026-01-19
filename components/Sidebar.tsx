
import React from 'react';
import { 
  Scissors, 
  Files, 
  RefreshCw, 
  Music, 
  Scaling, 
  Film,
  Terminal,
  Clock,
  Trash2,
  Check,
  Copy
} from 'lucide-react';
import { ToolType, CommandHistory } from '../types';

interface SidebarProps {
  activeTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  history: CommandHistory[];
  onClearHistory: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTool,
  onSelectTool,
  history,
  onClearHistory
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const tools: { id: ToolType; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'trim', label: 'Trim / Cut', icon: <Scissors className="w-4 h-4" />, desc: 'Cut video segments' },
    { id: 'stitch', label: 'Stitch / Merge', icon: <Files className="w-4 h-4" />, desc: 'Join multiple files' },
    { id: 'convert', label: 'Convert Format', icon: <RefreshCw className="w-4 h-4" />, desc: 'Change container/codec' },
    { id: 'extract', label: 'Extract Audio', icon: <Music className="w-4 h-4" />, desc: 'Save audio track' },
    { id: 'scale', label: 'Resize / Scale', icon: <Scaling className="w-4 h-4" />, desc: 'Change resolution' },
    { id: 'gif', label: 'Video to GIF', icon: <Film className="w-4 h-4" />, desc: 'Create optimized GIFs' },
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="w-72 bg-sidebar border-r border-border flex flex-col shrink-0 z-20 h-full">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center border border-accent/30">
            <Terminal className="w-5 h-5 text-accent" />
          </div>
          <h1 className="font-bold text-lg tracking-tight">FFmpeg CMD GUI</h1>
        </div>
        <p className="text-xs text-gray-500 pl-11">Command Generator</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        <p className="px-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">Tools</p>
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            className={`w-full text-left p-3 rounded-xl transition-all border flex flex-col gap-1 ${
              activeTool === tool.id
                ? 'bg-accent/10 border-accent/50 text-white shadow-lg shadow-accent/5'
                : 'bg-transparent border-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200'
            }`}
          >
            <div className="flex items-center gap-3 font-semibold text-sm">
              {tool.icon}
              {tool.label}
            </div>
          </button>
        ))}

        {history.length > 0 && (
          <div className="pt-6 mt-4 border-t border-border">
            <div className="flex items-center justify-between px-2 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <Clock className="w-3 h-3" /> Recent
              </span>
              <button onClick={onClearHistory} className="text-red-400 hover:text-red-300 p-1">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2">
              {history.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-card border border-border rounded-lg p-2.5 group relative"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-accent uppercase">{item.tool}</span>
                    <button 
                      onClick={() => handleCopy(item.command, item.id)}
                      className="text-gray-500 hover:text-white transition-colors"
                    >
                      {copiedId === item.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 font-mono truncate bg-black/30 p-1 rounded">
                    {item.command}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border text-[10px] text-gray-600 text-center leading-relaxed">
        Processing is done locally. No AI used. No data or telemetry is sent or collected in this app.
      </div>
    </div>
  );
};
