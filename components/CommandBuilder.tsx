import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, Terminal, Info, AlertTriangle, Plus, X, Volume2, Camera, Film, FolderOpen, Crop, Folder, Save } from 'lucide-react';
import { ToolType, TrimConfig, StitchConfig, ConvertConfig, ExtractConfig, ScaleConfig, AddAudioConfig, ExtractFramesConfig, CropConfig, ToolColorConfig, GifConfig } from '../types';

interface CommandBuilderProps {
  tool: ToolType;
  onCommandGenerated: (cmd: string) => void;
  toolColors?: ToolColorConfig;
}

// Helper to join paths using Windows style backslashes for local commands
const joinPath = (base: string, part: string) => {
    if (!part) return base;
    const cleanBase = base.replace(/[\\/]+$/, '');
    const cleanPart = part.replace(/^[\\/]+/, '');
    if (!cleanBase) return cleanPart;
    return `${cleanBase}\\${cleanPart}`;
};

// Extracted Components to prevent re-render/hook issues
const Toggle = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between bg-background border border-border p-3 rounded-lg cursor-pointer hover:border-accent/30 transition-colors" onClick={() => onChange(!checked)}>
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <div className={`w-10 h-5 rounded-full relative transition-colors ${checked ? 'bg-accent' : 'bg-gray-700'}`}>
            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${checked ? 'left-6' : 'left-1'}`} />
        </div>
    </div>
);

const InputField = ({ label, value, onChange, placeholder = '', directoryMode = false, basePath }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string, directoryMode?: boolean, basePath: string }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isPath = label.toLowerCase().includes('input') || label.toLowerCase().includes('path') || label.toLowerCase().includes('output') || label.toLowerCase().includes('file');
    const [copiedInputLabel, setCopiedInputLabel] = useState<string | null>(null);

    // Enable directory selection attribute if in directory mode (Output fields)
    useEffect(() => {
        if (directoryMode && fileInputRef.current) {
            fileInputRef.current.setAttribute('webkitdirectory', '');
            fileInputRef.current.setAttribute('directory', '');
        } else if (fileInputRef.current) {
            fileInputRef.current.removeAttribute('webkitdirectory');
            fileInputRef.current.removeAttribute('directory');
        }
    }, [directoryMode]);

    const handleCopyInput = (val: string, lbl: string) => {
        navigator.clipboard.writeText(val);
        setCopiedInputLabel(lbl);
        setTimeout(() => setCopiedInputLabel(null), 1500);
    };

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        if (directoryMode) {
            const firstFile = files[0];
            const relPath = firstFile.webkitRelativePath; 
            let folderName = '';
            
            if (relPath) {
                folderName = relPath.split('/')[0];
            } else {
                folderName = 'SelectedFolder';
            }
            
            const placeHolderName = placeholder.includes('\\') || placeholder.includes('/') ? placeholder.split(/[\\/]/).pop() : placeholder;
            const currentFileName = value ? value.split(/[\\/]/).pop() : (placeHolderName || 'output.mp4');
            const fullPath = joinPath(basePath, joinPath(folderName, currentFileName || 'output.mp4'));
            onChange(fullPath);
        } else {
            const fileName = files[0].name;
            const fullPath = joinPath(basePath, fileName);
            onChange(fullPath);
        }
        
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
        <div className="flex items-center gap-2 group/input">
          {isPath && (
            <div className="flex items-center gap-1.5 shrink-0">
               <button 
                 onClick={() => handleCopyInput(value, label)}
                 className="p-2 bg-background border border-border rounded-lg text-gray-500 hover:text-white hover:border-accent transition-all relative"
                 title={`Copy ${label}`}
               >
                 {copiedInputLabel === label ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
               </button>
               <button 
                 onClick={() => fileInputRef.current?.click()}
                 className={`p-2 bg-background border border-border rounded-lg text-gray-500 hover:text-white transition-all relative ${directoryMode ? 'hover:border-green-500 text-green-500/70' : 'hover:border-accent'}`}
                 title={directoryMode ? "Select Output Folder" : "Select File"}
               >
                 {directoryMode ? <Folder className="w-3.5 h-3.5" /> : <FolderOpen className="w-3.5 h-3.5" />}
               </button>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 onChange={onFileSelect} 
                 className="hidden" 
               />
            </div>
          )}
          <input 
            type="text" 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none font-mono text-gray-300 transition-all"
          />
        </div>
      </div>
    );
};

// NEW: Extracted Stitch Row to allow valid hook usage (useRef) outside of loops
interface StitchFileRowProps {
    file: string;
    index: number;
    onUpdate: (val: string) => void;
    onRemove: () => void;
    basePath: string;
}

const StitchFileRow: React.FC<StitchFileRowProps> = ({ file, index, onUpdate, onRemove, basePath }) => {
    const fileRef = useRef<HTMLInputElement>(null);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(file);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) {
            onUpdate(joinPath(basePath, f.name));
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    return (
        <div className="flex gap-2 group/input">
            <div className="flex items-center gap-1.5 shrink-0">
                <button 
                    onClick={handleCopy}
                    className="p-2 bg-background border border-border rounded-lg text-gray-500 hover:text-white hover:border-accent transition-all shrink-0"
                    title="Copy path"
                >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <button 
                    onClick={() => fileRef.current?.click()}
                    className="p-2 bg-background border border-border rounded-lg text-gray-500 hover:text-white hover:border-accent transition-all shrink-0"
                    title="Select File"
                >
                    <FolderOpen className="w-4 h-4" />
                </button>
                <input type="file" ref={fileRef} className="hidden" onChange={handleFileSelect} />
            </div>
            <input 
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm font-mono text-gray-300 focus:border-accent outline-none"
                value={file}
                placeholder={`part${index+1}.mp4`}
                onChange={(e) => onUpdate(e.target.value)}
            />
            <button 
                onClick={onRemove}
                className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export const CommandBuilder: React.FC<CommandBuilderProps> = ({ tool, onCommandGenerated, toolColors }) => {
  const [command, setCommand] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Persistent Base Path
  const [basePath, setBasePath] = useState(() => localStorage.getItem('ffmpeg_base_path') || '');
  
  // Active Color
  const activeColor = toolColors ? toolColors[tool] : '#3b82f6';

  useEffect(() => {
    localStorage.setItem('ffmpeg_base_path', basePath);
  }, [basePath]);

  // Tool Configurations
  const [trim, setTrim] = useState<TrimConfig>({
    input: '', startTime: '00:00:00', endTime: '00:00:10', useDuration: false, reEncode: true, output: ''
  });
  
  const [stitch, setStitch] = useState<StitchConfig>({
    files: ['', ''], output: ''
  });

  const [convert, setConvert] = useState<ConvertConfig>({
    input: '', container: 'mp4', videoCodec: 'libx264', audioCodec: 'aac', crf: 23, output: ''
  });

  const [extract, setExtract] = useState<ExtractConfig>({
    input: '', format: 'mp3', bitrate: '192k', output: ''
  });

  const [scale, setScale] = useState<ScaleConfig>({
    input: '', width: '1920', height: '-1', maintainAspect: true, output: ''
  });

  const [addAudio, setAddAudio] = useState<AddAudioConfig>({
    videoInput: '', audioInput: '', replaceOriginal: true, output: ''
  });

  const [extractFrames, setExtractFrames] = useState<ExtractFramesConfig>({
    input: '', mode: 'single', timestamp: '00:00:05', fps: '1', output: ''
  });

  const [crop, setCrop] = useState<CropConfig>({
    input: '', width: '1280', height: '720', x: '0', y: '0', output: '', isBatch: false
  });

  const [gif, setGif] = useState<GifConfig>({
    input: '', output: ''
  });

  // Resolve path logic
  const resolvePath = (val: string, fallback: string) => {
    const target = val.trim() === '' ? fallback : val;
    if (!basePath) return target;
    
    // If target is absolute or already contains basePath, return as is
    if (target.match(/^[a-zA-Z]:[\\/]/) || target.startsWith('/') || target.startsWith('\\')) {
        return target;
    }
    
    return joinPath(basePath, target);
  };

  // Generate command string based on current tool and state
  useEffect(() => {
    let cmd = '';
    
    switch (tool) {
      case 'crop':
        const cropIn = resolvePath(crop.input, 'input.mp4');
        const cropOut = resolvePath(crop.output, 'cropped_output.mp4');
        const cropFilt = `crop=${crop.width}:${crop.height}:${crop.x}:${crop.y}`;
        if (crop.isBatch) {
          cmd = `# Run this in terminal at: ${basePath || 'current directory'}\n# For Windows (.bat):\nfor %i in (*.mp4) do ffmpeg -i "%i" -vf "${cropFilt}" -c:a copy "cropped_%i"\n\n# For Linux/Mac (.sh):\nfor i in *.mp4; do ffmpeg -i "$i" -vf "${cropFilt}" -c:a copy "cropped_$i"; done`;
        } else {
          cmd = `ffmpeg -i "${cropIn}" -vf "${cropFilt}" -c:a copy "${cropOut}"`;
        }
        break;

      case 'trim':
        const trimIn = resolvePath(trim.input, 'input.mp4');
        const trimOut = resolvePath(trim.output, 'trimmed.mp4');
        if (!trim.reEncode) {
            cmd = `ffmpeg -ss ${trim.startTime} -i "${trimIn}" ${trim.useDuration ? '-t' : '-to'} ${trim.endTime} -c copy "${trimOut}"`;
        } else {
            cmd = `ffmpeg -i "${trimIn}" -ss ${trim.startTime} ${trim.useDuration ? '-t' : '-to'} ${trim.endTime} -c:v libx264 -c:a aac "${trimOut}"`;
        }
        break;

      case 'stitch':
        cmd = `# Create a text file named 'files.txt' with the following content:\n`;
        stitch.files.forEach(f => cmd += `# file '${resolvePath(f, 'input.mp4')}'\n`);
        cmd += `\nffmpeg -f concat -safe 0 -i files.txt -c copy "${resolvePath(stitch.output, 'stitched.mp4')}"`;
        break;

      case 'convert':
        cmd = `ffmpeg -i "${resolvePath(convert.input, 'video.mkv')}" -c:v ${convert.videoCodec} -crf ${convert.crf} -c:a ${convert.audioCodec} "${resolvePath(convert.output, 'output.mp4')}"`;
        break;

      case 'extract':
        cmd = `ffmpeg -i "${resolvePath(extract.input, 'video.mp4')}" -vn -acodec ${extract.format === 'mp3' ? 'libmp3lame' : 'aac'} -b:a ${extract.bitrate} "${resolvePath(extract.output, 'audio.mp3')}"`;
        break;

      case 'scale':
        const w = scale.width || '-1';
        const h = scale.maintainAspect && scale.width !== '-1' ? '-1' : scale.height;
        cmd = `ffmpeg -i "${resolvePath(scale.input, 'input.mp4')}" -vf scale=${w}:${h} -c:a copy "${resolvePath(scale.output, 'resized.mp4')}"`;
        break;

      case 'addAudio':
        const vAddIn = resolvePath(addAudio.videoInput, 'video.mp4');
        const aAddIn = resolvePath(addAudio.audioInput, 'audio.mp3');
        cmd = `ffmpeg -i "${vAddIn}" -i "${aAddIn}" -c:v copy -c:a aac `;
        if (addAudio.replaceOriginal) {
          cmd += `-map 0:v:0 -map 1:a:0 "${resolvePath(addAudio.output, 'video_with_audio.mp4')}"`;
        } else {
          cmd += `-filter_complex "[0:a][1:a]amix=inputs=2:duration=first[a]" -map 0:v:0 -map "[a]" "${resolvePath(addAudio.output, 'video_with_audio.mp4')}"`;
        }
        break;

      case 'extractFrames':
        const framesIn = resolvePath(extractFrames.input, 'video.mp4');
        if (extractFrames.mode === 'single') {
          cmd = `ffmpeg -ss ${extractFrames.timestamp} -i "${framesIn}" -vframes 1 "${resolvePath(extractFrames.output, 'frame.jpg')}"`;
        } else {
          const out = resolvePath(extractFrames.output, 'frame.jpg');
          const outName = out.includes('.') ? out.split('.')[0] + '_%04d.' + out.split('.')[1] : 'frame_%04d.jpg';
          cmd = `ffmpeg -i "${framesIn}" -vf fps=${extractFrames.fps} "${outName}"`;
        }
        break;

      case 'gif':
        const gifIn = resolvePath(gif.input, 'input.mp4');
        const gifOut = resolvePath(gif.output, 'output.gif');
        cmd = `ffmpeg -i "${gifIn}" -vf "fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 "${gifOut}"`;
        break;
    }

    setCommand(cmd);
  }, [tool, trim, stitch, convert, extract, scale, addAudio, extractFrames, crop, gif, basePath]);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    onCommandGenerated(command);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Base Path Configuration */}
            <div className="bg-[#121624] border border-blue-500/30 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 animate-in slide-in-from-top-4 duration-500 shadow-[0_0_20px_rgba(59,130,246,0.08)] relative group transition-all hover:border-blue-500/50 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)]">
                <div className="p-3 bg-blue-500/10 rounded-lg shrink-0">
                    <FolderOpen className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 w-full">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Base Directory / Working Path</label>
                    <input 
                        type="text"
                        value={basePath}
                        onChange={(e) => setBasePath(e.target.value)}
                        placeholder="e.g. C:\Users\Name\Videos"
                        className="w-full bg-black/20 border border-border rounded-lg px-3 py-1.5 text-sm font-mono text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
                <div className="md:w-64">
                     <p className="text-[10px] text-gray-500 leading-tight group-hover:text-gray-400 transition-colors">
                        <span className="text-blue-400 font-bold italic">Required Setup:</span> You must set your local working folder path here. This is necessary for generated commands to resolve and locate your files correctly.
                     </p>
                </div>
            </div>

            {/* Header */}
            <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-75">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    {tool === 'crop' && 'Mass Crop'}
                    {tool === 'trim' && 'Trim / Cut Video'}
                    {tool === 'stitch' && 'Stitch / Merge Videos'}
                    {tool === 'convert' && 'Convert Format'}
                    {tool === 'extract' && 'Extract Audio'}
                    {tool === 'addAudio' && 'Add Audio to Video'}
                    {tool === 'scale' && 'Resize / Scale'}
                    {tool === 'extractFrames' && 'Extract Frames'}
                    {tool === 'gif' && 'Convert to GIF'}
                </h2>
                <p className="text-gray-400 text-sm">Configure your parameters below to generate the FFmpeg code.</p>
            </div>

            {/* Config Forms */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-500 delay-100">
                
                {tool === 'crop' && (
                    <div className="grid grid-cols-2 gap-5">
                        <div className="col-span-2">
                             <Toggle label="Batch Mode (Crop all .mp4 in current folder)" checked={crop.isBatch} onChange={(v: boolean) => setCrop({...crop, isBatch: v})} />
                        </div>
                        {!crop.isBatch && (
                          <div className="col-span-2">
                               <InputField basePath={basePath} label="Input File Path" value={crop.input} onChange={(v: string) => setCrop({...crop, input: v})} placeholder="raw_video.mp4" />
                          </div>
                        )}
                        <InputField basePath={basePath} label="Width" value={crop.width} onChange={(v: string) => setCrop({...crop, width: v})} placeholder="1280" />
                        <InputField basePath={basePath} label="Height" value={crop.height} onChange={(v: string) => setCrop({...crop, height: v})} placeholder="720" />
                        <InputField basePath={basePath} label="X Coordinate" value={crop.x} onChange={(v: string) => setCrop({...crop, x: v})} placeholder="0" />
                        <InputField basePath={basePath} label="Y Coordinate" value={crop.y} onChange={(v: string) => setCrop({...crop, y: v})} placeholder="0" />
                        
                        {!crop.isBatch && (
                          <div className="col-span-2">
                               <InputField basePath={basePath} label="Output File Path" value={crop.output} onChange={(v: string) => setCrop({...crop, output: v})} placeholder="cropped_video.mp4" directoryMode={true} />
                          </div>
                        )}
                        <div className="col-span-2 flex items-start gap-3 bg-blue-500/5 p-4 rounded-xl border border-blue-500/10">
                            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-400">Crop syntax: <span className="font-mono text-gray-300">crop=width:height:x:y</span>. Values are in pixels.</p>
                        </div>
                    </div>
                )}

                {tool === 'trim' && (
                    <div className="grid grid-cols-2 gap-5">
                        <div className="col-span-2">
                             <InputField basePath={basePath} label="Input File Path" value={trim.input} onChange={(v: string) => setTrim({...trim, input: v})} placeholder="source_video.mp4" />
                        </div>
                        <InputField basePath={basePath} label="Start Time (HH:MM:SS)" value={trim.startTime} onChange={(v: string) => setTrim({...trim, startTime: v})} placeholder="00:00:00" />
                        <InputField basePath={basePath} label={trim.useDuration ? "Duration (Seconds)" : "End Time (HH:MM:SS)"} value={trim.endTime} onChange={(v: string) => setTrim({...trim, endTime: v})} placeholder="00:00:10" />
                        
                        <div className="col-span-2 grid grid-cols-2 gap-4">
                             <Toggle label="Use Duration instead of End Time" checked={trim.useDuration} onChange={(v: boolean) => setTrim({...trim, useDuration: v})} />
                             <Toggle label="Re-encode (Slower, Frame Perfect)" checked={trim.reEncode} onChange={(v: boolean) => setTrim({...trim, reEncode: v})} />
                        </div>
                        <div className="col-span-2">
                             <InputField basePath={basePath} label="Output File Path" value={trim.output} onChange={(v: string) => setTrim({...trim, output: v})} placeholder="trimmed_output.mp4" directoryMode={true} />
                        </div>
                    </div>
                )}

                {tool === 'stitch' && (
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Input Files</label>
                        {stitch.files.map((file, idx) => (
                           <StitchFileRow 
                             key={idx}
                             file={file}
                             index={idx}
                             basePath={basePath}
                             onUpdate={(val) => {
                                const newFiles = [...stitch.files];
                                newFiles[idx] = val;
                                setStitch({...stitch, files: newFiles});
                             }}
                             onRemove={() => {
                                const newFiles = stitch.files.filter((_, i) => i !== idx);
                                setStitch({...stitch, files: newFiles});
                             }}
                           />
                        ))}
                        <button 
                            onClick={() => setStitch({...stitch, files: [...stitch.files, '']})}
                            className="text-xs font-bold text-accent flex items-center gap-1 hover:text-blue-400 transition-colors"
                        >
                            <Plus className="w-3 h-3" /> Add Another File
                        </button>
                         <div className="pt-4 border-t border-border/40 mt-4">
                             <InputField basePath={basePath} label="Output File Path" value={stitch.output} onChange={(v: string) => setStitch({...stitch, output: v})} placeholder="merged_result.mp4" directoryMode={true} />
                        </div>
                    </div>
                )}

                {tool === 'convert' && (
                    <div className="grid grid-cols-2 gap-5">
                        <div className="col-span-2">
                             <InputField basePath={basePath} label="Input File Path" value={convert.input} onChange={(v: string) => setConvert({...convert, input: v})} placeholder="source_footage.mkv" />
                        </div>
                        <InputField basePath={basePath} label="Video Codec" value={convert.videoCodec} onChange={(v: string) => setConvert({...convert, videoCodec: v})} placeholder="libx264" />
                        <InputField basePath={basePath} label="Audio Codec" value={convert.audioCodec} onChange={(v: string) => setConvert({...convert, audioCodec: v})} placeholder="aac" />
                        <InputField basePath={basePath} label="CRF (Quality 0-51, lower is better)" value={convert.crf.toString()} onChange={(v: string) => setConvert({...convert, crf: parseInt(v) || 23})} />
                        <InputField basePath={basePath} label="Output File Path" value={convert.output} onChange={(v: string) => setConvert({...convert, output: v})} placeholder="converted_output.mp4" directoryMode={true} />
                    </div>
                )}

                {tool === 'extract' && (
                     <div className="grid grid-cols-2 gap-5">
                        <div className="col-span-2">
                             <InputField basePath={basePath} label="Input Video Path" value={extract.input} onChange={(v: string) => setExtract({...extract, input: v})} placeholder="movie.mp4" />
                        </div>
                        <div className="col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Target Format</label>
                            <div className="flex gap-4">
                                {['mp3', 'aac', 'wav'].map(fmt => (
                                    <button 
                                        key={fmt}
                                        onClick={() => setExtract({...extract, format: fmt})}
                                        className={`px-6 py-2 rounded-xl text-sm font-bold border transition-all duration-300 ${extract.format === fmt ? 'bg-accent text-white border-accent shadow-lg' : 'border-border text-gray-400 hover:border-accent/50 hover:bg-white/[0.02]'}`}
                                        style={extract.format === fmt ? { backgroundColor: activeColor, borderColor: activeColor } : {}}
                                    >
                                        {fmt.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <InputField basePath={basePath} label="Bitrate" value={extract.bitrate} onChange={(v: string) => setExtract({...extract, bitrate: v})} placeholder="320k" />
                        <InputField basePath={basePath} label="Output Audio Path" value={extract.output} onChange={(v: string) => setExtract({...extract, output: v})} placeholder="extracted_soundtrack.mp3" directoryMode={true} />
                     </div>
                )}

                {tool === 'addAudio' && (
                    <div className="grid grid-cols-2 gap-5">
                        <div className="col-span-2">
                             <InputField basePath={basePath} label="Input Video File" value={addAudio.videoInput} onChange={(v: string) => setAddAudio({...addAudio, videoInput: v})} placeholder="raw_video.mp4" />
                        </div>
                        <div className="col-span-2">
                             <InputField basePath={basePath} label="Input Audio File" value={addAudio.audioInput} onChange={(v: string) => setAddAudio({...addAudio, audioInput: v})} placeholder="background_music.mp3" />
                        </div>
                        <div className="col-span-2">
                            <Toggle label="Replace original video audio (Map stream 1 only)" checked={addAudio.replaceOriginal} onChange={(v: boolean) => setAddAudio({...addAudio, replaceOriginal: v})} />
                        </div>
                        <div className="col-span-2">
                             <InputField basePath={basePath} label="Output File Path" value={addAudio.output} onChange={(v: string) => setAddAudio({...addAudio, output: v})} placeholder="dubbed_video.mp4" directoryMode={true} />
                        </div>
                        {!addAudio.replaceOriginal && (
                          <div className="col-span-2 flex items-start gap-3 bg-blue-500/5 p-4 rounded-xl border border-blue-500/10">
                            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-400">Mixing audio will result in a combined stream of both original video audio and your new file using the <span className="font-mono text-gray-300">amix</span> filter.</p>
                          </div>
                        )}
                    </div>
                )}

                {tool === 'scale' && (
                    <div className="grid grid-cols-2 gap-5">
                        <div className="col-span-2">
                             <InputField basePath={basePath} label="Input File Path" value={scale.input} onChange={(v: string) => setScale({...scale, input: v})} placeholder="hd_video.mp4" />
                        </div>
                        <InputField basePath={basePath} label="Width (px)" value={scale.width} onChange={(v: string) => setScale({...scale, width: v})} placeholder="1280" />
                        <InputField basePath={basePath} label="Height (px)" value={scale.height} onChange={(v: string) => setScale({...scale, height: v})} placeholder="720" />
                        <div className="col-span-2">
                             <Toggle label="Maintain Aspect Ratio (Set one dim to -1)" checked={scale.maintainAspect} onChange={(v: boolean) => setScale({...scale, maintainAspect: v})} />
                        </div>
                        <div className="col-span-2">
                             <InputField basePath={basePath} label="Output File Path" value={scale.output} onChange={(v: string) => setScale({...scale, output: v})} placeholder="scaled_video.mp4" directoryMode={true} />
                        </div>
                    </div>
                )}

                {tool === 'extractFrames' && (
                  <div className="grid grid-cols-2 gap-5">
                      <div className="col-span-2">
                           <InputField basePath={basePath} label="Input Video File" value={extractFrames.input} onChange={(v: string) => setExtractFrames({...extractFrames, input: v})} placeholder="clip.mp4" />
                      </div>
                      <div className="col-span-2 flex gap-4">
                          <button 
                              onClick={() => setExtractFrames({...extractFrames, mode: 'single'})}
                              className={`flex-1 py-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${extractFrames.mode === 'single' ? 'bg-accent/10 border-accent shadow-lg shadow-accent/5' : 'border-border text-gray-500 hover:border-gray-600'}`}
                              style={extractFrames.mode === 'single' ? { borderColor: activeColor, color: activeColor } : {}}
                          >
                            <Camera className="w-6 h-6" />
                            <span className="text-xs font-bold uppercase tracking-widest">Single Frame</span>
                          </button>
                          <button 
                              onClick={() => setExtractFrames({...extractFrames, mode: 'sequence'})}
                              className={`flex-1 py-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${extractFrames.mode === 'sequence' ? 'bg-accent/10 border-accent shadow-lg shadow-accent/5' : 'border-border text-gray-500 hover:border-gray-600'}`}
                              style={extractFrames.mode === 'sequence' ? { borderColor: activeColor, color: activeColor } : {}}
                          >
                            <Film className="w-6 h-6" />
                            <span className="text-xs font-bold uppercase tracking-widest">Image Sequence</span>
                          </button>
                      </div>
                      
                      {extractFrames.mode === 'single' ? (
                        <InputField basePath={basePath} label="Timestamp (HH:MM:SS)" value={extractFrames.timestamp} onChange={(v: string) => setExtractFrames({...extractFrames, timestamp: v})} placeholder="00:05:30" />
                      ) : (
                        <InputField basePath={basePath} label="FPS (Frames Per Second)" value={extractFrames.fps} onChange={(v: string) => setExtractFrames({...extractFrames, fps: v})} placeholder="1" />
                      )}

                      <InputField basePath={basePath} label="Output File / Pattern" value={extractFrames.output} onChange={(v: string) => setExtractFrames({...extractFrames, output: v})} placeholder="extracted_frame.jpg" directoryMode={true} />
                  </div>
                )}

                {tool === 'gif' && (
                    <div className="grid grid-cols-2 gap-5">
                        <div className="col-span-2">
                             <InputField basePath={basePath} label="Input Video File" value={gif.input} onChange={(v: string) => setGif({...gif, input: v})} placeholder="video_to_convert.mp4" />
                        </div>
                        <div className="col-span-2">
                             <InputField basePath={basePath} label="Output GIF Path" value={gif.output} onChange={(v: string) => setGif({...gif, output: v})} placeholder="output_animation.gif" directoryMode={true} />
                        </div>
                        <div className="col-span-2 text-center py-6 border-t border-border/40 mt-2">
                            <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                               <Film className="w-8 h-8 text-accent" />
                            </div>
                            <p className="text-gray-300 font-bold mb-2">Optimal Palette Generation</p>
                            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">FFmpeg creates high-quality GIFs by first analyzing your video to build a 256-color palette. This ensures no graininess or dithering artifacts commonly found in generic conversions.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Output Section */}
            <div className="space-y-4 animate-in slide-in-from-bottom-6 duration-700 pb-16">
                <div className="flex items-center justify-between px-1">
                    <label className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-gray-400">
                        <Terminal className="w-4 h-4 text-gray-500" /> GENERATED COMMAND
                    </label>
                    {copied && <span className="text-[10px] text-green-500 font-bold uppercase tracking-tighter animate-pulse">Copied to clipboard</span>}
                </div>
                
                <div className="relative group flex items-start">
                    <button 
                        onClick={handleCopy}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2.5 bg-sidebar border border-border rounded-xl text-gray-400 hover:text-white hover:border-accent transition-all shadow-xl active:scale-95"
                        title="Copy Command"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <pre className="flex-1 bg-sidebar/50 backdrop-blur-sm border border-border rounded-2xl p-6 pl-16 font-mono text-sm text-gray-300 whitespace-pre-wrap break-all shadow-inner select-text cursor-text leading-relaxed">
                        {command}
                    </pre>
                </div>
                
                <div className="bg-accent/5 border border-accent/10 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-accent mb-4 flex items-center gap-2">
                        <Info className="w-4 h-4" /> Usage Instructions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Environment Setup</p>
                            <div className="space-y-2">
                                <p className="text-xs text-gray-400 leading-relaxed">Make sure <a href="https://ffmpeg.org/download.html" target="_blank" rel="noreferrer" className="text-accent hover:underline decoration-accent/30 underline-offset-4">FFmpeg</a> is installed. Type <code className="bg-black/40 px-1.5 py-0.5 rounded text-gray-300">ffmpeg -version</code> to verify.</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Execution</p>
                            <p className="text-xs text-gray-400 leading-relaxed">Paste the command into your terminal and press <kbd className="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-gray-200">Enter</kbd>. If paths contain spaces, ensure they are wrapped in quotes as generated.</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};