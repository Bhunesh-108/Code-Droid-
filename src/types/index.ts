export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  content?: string;
  language?: 'python' | 'javascript' | 'cpp' | 'c' | 'csharp' | 'swift' | 'rust' | 'go' | 'kotlin' | 'java' | 'alp' | 'markdown' | 'json' | 'html' | 'css';
  isOpen?: boolean;
  isModified?: boolean;
  children?: FileNode[];
}

export interface OpenTab {
  fileId: string;
  path: string;
  name: string;
  language: string;
  isDirty?: boolean;
}

export type SupportedLanguage = 'python' | 'javascript' | 'cpp' | 'c' | 'csharp' | 'swift' | 'rust' | 'go' | 'kotlin' | 'java' | 'alp' | 'markdown' | 'json' | 'html' | 'css';

export interface GitCommit {
  hash: string;
  message: string;
  author: string;
  timestamp: number;
  filesChanged: string[];
}

export interface GitStatus {
  branch: string;
  branches: string[];
  stagedFiles: string[];
  unstagedFiles: string[];
  untrackedFiles: string[];
  commits: GitCommit[];
}

export interface FileDiffLine {
  type: 'add' | 'del' | 'same';
  oldLineNumber?: number;
  newLineNumber?: number;
  content: string;
}

export interface RegisterState {
  AX: number;
  BX: number;
  CX: number;
  DX: number;
  SI: number;
  DI: number;
  SP: number;
  BP: number;
  IP: number;
}

export interface FlagState {
  ZF: boolean; // Zero flag
  CF: boolean; // Carry flag
  SF: boolean; // Sign flag
  OF: boolean; // Overflow flag
}

export interface AlpStep {
  stepNumber: number;
  instruction: string;
  line: number;
  registers: RegisterState;
  flags: FlagState;
  outputLog?: string;
}

export interface AlpExecutionResult {
  success: boolean;
  error?: string;
  steps: AlpStep[];
  finalRegisters: RegisterState;
  finalFlags: FlagState;
  output: string;
  memoryDump: Record<number, number>;
}

export interface TerminalEntry {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  text: string;
  timestamp: number;
}

export type ThemeType = 'vscode-dark' | 'one-dark' | 'dracula' | 'monokai' | 'github-dark' | 'solarized-dark';

export interface EditorSettings {
  theme: ThemeType;
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  lineNumbers: boolean;
  showMinimap: boolean;
  touchHaptics: boolean;
  autoCloseBrackets: boolean;
}
