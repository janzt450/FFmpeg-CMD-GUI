
import React, { useState, useEffect } from 'react';
import { Copy, Check, Terminal, Info, AlertTriangle, Plus, X } from 'lucide-react';
import { ToolType, TrimConfig, StitchConfig, ConvertConfig, ExtractConfig, ScaleConfig } from '../types';

interface CommandBuilderProps {
  tool: ToolType;
  onCommandGenerated: (cmd: string) => void;
}

export const CommandBuilder: React.FC<CommandBuilderProps> = ({ tool, onCommandGenerated }) => {
  const [command, setCommand] = useState('');
  const [copied, setCopied] = useState(false);

  // Tool Configurations
  const [trim, setTrim] = useState<TrimConfig>({
    input: 'input.mp4', startTime: '00:00:00', endTime: '00:00:10', useDuration: false, reEncode: false, output: 'trimmed.mp4'
  });
  
  const [stitch, setStitch] = useState<StitchConfig>({
    files: ['part1.mp4', 'part2.mp4'], output: 'stitched.mp4'
  });

  const [convert, setConvert] = useState<ConvertConfig>({
    input: 'source.mkv', container: 'mp4', videoCodec: 'libx264', audioCodec: 'aac', crf: 23, output: 'output.mp4'
  });

  const [extract, setExtract] = useState<ExtractConfig>({
    input: 'video.mp4', format: 'mp3', bitrate: '192k', output: 'audio.mp3'
  });

  const [scale, setScale] = useState<ScaleConfig>({
    input: 'input.mp4', width: '1920', height: '-1', maintainAspect: true, output: 'resized.mp4'
  });

  // Generate command string based on current tool and state
  useEffect(() => {
    let cmd = '';
    
    switch (tool) {
      case 'trim':
        if (!trim.reEncode) {
            cmd = `ffmpeg -ss ${trim.startTime} -i "${trim.input}" ${trim.useDuration ? '-t' : '-to'} ${trim.endTime} -c copy "${trim.output}"`;
        } else {
            cmd = `ffmpeg -i "${trim.input}" -ss ${trim.startTime} ${trim.useDuration ? '-t' : '-to'} ${trim.endTime} -c:v libx264 -c:a aac "${trim.output}"`;
        }
        break;

      case 'stitch':
        cmd = `# Create a text file named 'files.txt' with the following content:\n`;
        stitch.files.forEach(f => cmd += `# file '${f}'\n`);
        cmd += `\nffmpeg -f concat -safe 0 -i files.txt -c copy "${stitch.output}"`;
        break;

      case 'convert':
        cmd = `ffmpeg -i "${convert.input}" -c:v ${convert.videoCodec} -crf ${convert.crf} -c:a ${convert.audioCodec} "${convert.output}"`;
        break;

      case 'extract':
        cmd = `ffmpeg -i "${extract.input}" -vn -acodec ${extract.format === 'mp3' ? 'libmp3lame' : 'aac'} -b:a ${extract.bitrate} "${extract.output}"`;
        break;

      case 'scale':
        const w = scale.width || '-1';
        const h = scale.maintainAspect && scale.width !== '-1' ? '-1' : scale.height;
        cmd = `ffmpeg -i "${scale.input}" -vf scale=${w}:${h} -c:a copy "${scale.output}"`;
        break;

      case 'gif':
        cmd = `ffmpeg -i "input.mp4" -vf "fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 "output.gif"`;
        break;
    }

    setCommand(cmd);
  }, [tool, trim, stitch, convert, extract, scale]);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    onCommandGenerated(command);
    setTimeout(() => setCopied(false), 2000);
  };

  const InputField = ({ label, value, onChange, placeholder = '' }: any) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none font-mono text-gray-300"
      />
    </div>
  );

  const Toggle = ({ label, checked, onChange }: any) => (
    <div className="flex items-center justify-between bg-background border border-border p-3 rounded-lg cursor-pointer" onClick={() => onChange(!checked)}>
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <div className={`w-10 h-5 rounded-full relative transition-colors ${checked ? 'bg-accent' : 'bg-gray-700'}`}>
            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${checked ? 'left-6' : 'left-1'}`} />
        </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    {tool === 'trim' && 'Trim / Cut Video'}
                    {tool === 'stitch' && 'Stitch / Merge Videos'}
                    {tool === 'convert' && 'Convert Format'}
                    {tool === 'extract' && 'Extract Audio'}
                    {tool === 'scale' && 'Resize / Scale'}
                    {tool === 'gif' && 'Convert to GIF'}
                </h2>
                <p className="text-gray-400 text-sm">Configure your parameters below to generate the FFmpeg code.</p>
            </div>

            {/* Config Forms */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-5 shadow-xl">
                
                {tool === 'trim' && (
                    <div className="grid grid-cols-2 gap-5">
                        <div className="col-span-2">
                             <InputField label="Input File Path" value={trim.input} onChange={(v: string) => setTrim({...trim, input: v})} />
                        </div>
                        <InputField label="Start Time (HH:MM:SS)" value={trim.startTime} onChange={(v: string) => setTrim({...trim, startTime: v})} />
                        <InputField label={trim.useDuration ? "Duration (Seconds)" : "End Time (HH:MM:SS)"} value={trim.endTime} onChange={(v: string) => setTrim({...trim, endTime: v})} />
                        
                        <div className="col-span-2 grid grid-cols-2 gap-4">
                             <Toggle label="Use Duration instead of End Time" checked={trim.useDuration} onChange={(v: boolean) => setTrim({...trim, useDuration: v})} />
                             <Toggle label="Re-encode (Slower, Frame Perfect)" checked={trim.reEncode} onChange={(v: boolean) => setTrim({...trim, reEncode: v})} />
                        </div>
                        <div className="col-span-2">
                             <InputField label="Output File Name" value={trim.output} onChange={(v: string) => setTrim({...trim, output: v})} />
                        </div>
                    </div>
                )}

                {tool === 'stitch' && (
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Input Files</label>
                        {stitch.files.map((file, idx) => (
                            <div key={idx} className="flex gap-2">
                                <input 
                                    className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm font-mono text-gray-300"
                                    value={file}
                                    onChange={(e) => {
                                        const newFiles = [...stitch.files];
                                        newFiles[idx] = e.target.value;
                                        setStitch({...stitch, files: newFiles});
                                    }}
                                />
                                <button 
                                    onClick={() => {
                                        const newFiles = stitch.files.filter((_, i) => i !== idx);
                                        setStitch({...stitch, files: newFiles});
                                    }}
                                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <button 
                            onClick={() => setStitch({...stitch, files: [...stitch.files, `video${stitch.files.length + 1}.mp4`]})}
                            className="text-xs font-bold text-accent flex items-center gap-1 hover:text-blue-400"
                        >
                            <Plus className="w-3 h-3" /> Add File
                        </button>
                         <div className="pt-4">
                             <InputField label="Output File Name" value={stitch.output} onChange={(v: string) => setStitch({...stitch, output: v})} />
                        </div>
                    </div>
                )}

                {tool === 'convert' && (
                    <div className="grid grid-cols-2 gap-5">
                        <div className="col-span-2">
                             <InputField label="Input File Path" value={convert.input} onChange={(v: string) => setConvert({...convert, input: v})} />
                        </div>
                        <InputField label="Video Codec" value={convert.videoCodec} onChange={(v: string) => setConvert({...convert, videoCodec: v})} placeholder="libx264" />
                        <InputField label="Audio Codec" value={convert.audioCodec} onChange={(v: string) => setConvert({...convert, audioCodec: v})} placeholder="aac" />
                        <InputField label="CRF (Quality 0-51, lower is better)" value={convert.crf.toString()} onChange={(v: string) => setConvert({...convert, crf: parseInt(v) || 23})} />
                        <InputField label="Output Container" value={convert.output} onChange={(v: string) => setConvert({...convert, output: v})} placeholder="output.mp4" />
                    </div>
                )}

                {tool === 'extract' && (
                     <div className="grid grid-cols-2 gap-5">
                        <div className="col-span-2">
                             <InputField label="Input Video Path" value={extract.input} onChange={(v: string) => setExtract({...extract, input: v})} />
                        </div>
                        <div className="col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Format</label>
                            <div className="flex gap-4">
                                {['mp3', 'aac', 'wav'].map(fmt => (
                                    <button 
                                        key={fmt}
                                        onClick={() => setExtract({...extract, format: fmt, output: `audio.${fmt}`})}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold border ${extract.format === fmt ? 'bg-accent text-white border-accent' : 'border-border text-gray-400'}`}
                                    >
                                        {fmt.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <InputField label="Bitrate" value={extract.bitrate} onChange={(v: string) => setExtract({...extract, bitrate: v})} />
                        <InputField label="Output File Name" value={extract.output} onChange={(v: string) => setExtract({...extract, output: v})} />
                     </div>
                )}

                {tool === 'scale' && (
                    <div className="grid grid-cols-2 gap-5">
                        <div className="col-span-2">
                             <InputField label="Input File Path" value={scale.input} onChange={(v: string) => setScale({...scale, input: v})} />
                        </div>
                        <InputField label="Width (px)" value={scale.width} onChange={(v: string) => setScale({...scale, width: v})} placeholder="1920" />
                        <InputField label="Height (px)" value={scale.height} onChange={(v: string) => setScale({...scale, height: v})} placeholder="-1" />
                        <div className="col-span-2">
                             <Toggle label="Maintain Aspect Ratio (Set one dim to -1)" checked={scale.maintainAspect} onChange={(v: boolean) => setScale({...scale, maintainAspect: v})} />
                        </div>
                        <div className="col-span-2">
                             <InputField label="Output File Name" value={scale.output} onChange={(v: string) => setScale({...scale, output: v})} />
                        </div>
                    </div>
                )}

                {tool === 'gif' && (
                    <div className="text-center py-8">
                        <Info className="w-12 h-12 text-accent mx-auto mb-4" />
                        <p className="text-gray-300 mb-2">High Quality GIF Generation</p>
                        <p className="text-xs text-gray-500 max-w-md mx-auto">This generates a complex filter chain that generates a palette from the video first, then applies it to create a high-quality GIF, avoiding the graininess of standard conversions.</p>
                    </div>
                )}
            </div>

            {/* Output Section */}
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500 pb-12">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-2">
                        <Terminal className="w-4 h-4" /> Generated Command
                    </label>
                    {copied && <span className="text-xs text-green-500 font-bold animate-pulse">Copied to clipboard!</span>}
                </div>
                
                <div className="relative group">
                    <pre className="bg-[#0f111a] border border-border rounded-xl p-6 font-mono text-sm text-green-400 whitespace-pre-wrap break-all shadow-inner">
                        {command}
                    </pre>
                    <button 
                        onClick={handleCopy}
                        className="absolute top-4 right-4 p-2 bg-card border border-border rounded-lg text-gray-300 hover:text-white hover:border-accent transition-all shadow-lg"
                        title="Copy Command"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>
                
                <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-5">
                    <h3 className="text-sm font-bold text-blue-400 mb-3 flex items-center gap-2">
                        <Info className="w-4 h-4" /> How to run this command
                    </h3>
                    <ol className="list-decimal list-inside text-xs text-gray-400 space-y-2 font-medium">
                        <li>Ensure <a href="https://ffmpeg.org/download.html" target="_blank" rel="noreferrer" className="text-accent hover:underline">FFmpeg</a> is installed and added to your system PATH.</li>
                        <li>Open your Terminal (Mac/Linux) or Command Prompt/PowerShell (Windows).</li>
                        <li>Navigate to the folder containing your files (e.g., <span className="font-mono bg-white/5 px-1.5 py-0.5 rounded text-gray-300">cd Downloads</span>).</li>
                        <li>Paste the generated code above and press Enter.</li>
                    </ol>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};
