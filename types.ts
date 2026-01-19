
export type ToolType = 'trim' | 'stitch' | 'convert' | 'extract' | 'scale' | 'gif';

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
