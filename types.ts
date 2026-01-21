
export type ToolType = 'trim' | 'stitch' | 'convert' | 'extract' | 'scale' | 'gif' | 'addAudio' | 'extractFrames' | 'crop';

export interface ToolColorConfig {
  trim: string;
  stitch: string;
  convert: string;
  extract: string;
  scale: string;
  gif: string;
  addAudio: string;
  extractFrames: string;
  crop: string;
}

export interface CommandHistory {
  id: string;
  tool: ToolType;
  command: string;
  timestamp: number;
}

export interface TrimConfig {
  input: string;
  startTime: string;
  endTime: string;
  useDuration: boolean;
  reEncode: boolean;
  output: string;
}

export interface StitchConfig {
  files: string[];
  output: string;
}

export interface ConvertConfig {
  input: string;
  container: string;
  videoCodec: string;
  audioCodec: string;
  crf: number;
  output: string;
}

export interface ExtractConfig {
  input: string;
  format: string;
  bitrate: string;
  output: string;
}

export interface ScaleConfig {
  input: string;
  width: string;
  height: string;
  maintainAspect: boolean;
  output: string;
}

export interface AddAudioConfig {
  videoInput: string;
  audioInput: string;
  replaceOriginal: boolean;
  output: string;
}

export interface ExtractFramesConfig {
  input: string;
  mode: 'single' | 'sequence';
  timestamp: string;
  fps: string;
  output: string;
}

export interface CropConfig {
  input: string;
  width: string;
  height: string;
  x: string;
  y: string;
  output: string;
  isBatch: boolean;
}

export interface GifConfig {
  input: string;
  output: string;
}
