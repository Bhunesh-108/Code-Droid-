import { FileDiffLine, GitCommit, GitStatus } from '../types';

export class GitEngine {
  private branch: string = 'main';
  private branches: string[] = ['main', 'dev'];
  private commits: GitCommit[] = [
    {
      hash: 'a1b2c3d',
      message: 'Initial project setup with Python, JS, C++, and ALP examples',
      author: 'CodeDroid User <user@codedroid.dev>',
      timestamp: Date.now() - 3600000 * 24,
      filesChanged: ['main.py', 'index.js', 'algo.cpp', 'addition_alp.asm', 'README.md'],
    },
  ];

  private headFiles: Record<string, string> = {};
  private stagedFiles: Set<string> = new Set();

  constructor(initialFiles: Record<string, string> = {}) {
    this.headFiles = { ...initialFiles };
  }

  public setHeadFiles(files: Record<string, string>) {
    this.headFiles = { ...files };
  }

  public getStatus(workingFiles: Record<string, string>): GitStatus {
    const unstaged: string[] = [];
    const untracked: string[] = [];
    const staged: string[] = Array.from(this.stagedFiles);

    // Check all working files
    for (const [path, content] of Object.entries(workingFiles)) {
      if (this.headFiles[path] === undefined) {
        if (!this.stagedFiles.has(path)) {
          untracked.push(path);
        }
      } else if (this.headFiles[path] !== content) {
        if (!this.stagedFiles.has(path)) {
          unstaged.push(path);
        }
      }
    }

    // Check deleted files
    for (const path of Object.keys(this.headFiles)) {
      if (workingFiles[path] === undefined) {
        if (!this.stagedFiles.has(path)) {
          unstaged.push(path);
        }
      }
    }

    return {
      branch: this.branch,
      branches: [...this.branches],
      stagedFiles: staged,
      unstagedFiles: unstaged,
      untrackedFiles: untracked,
      commits: [...this.commits],
    };
  }

  public stageFile(path: string) {
    this.stagedFiles.add(path);
  }

  public stageAll(workingFiles: Record<string, string>) {
    for (const [path, content] of Object.entries(workingFiles)) {
      if (this.headFiles[path] !== content) {
        this.stagedFiles.add(path);
      }
    }
  }

  public unstageFile(path: string) {
    this.stagedFiles.delete(path);
  }

  public unstageAll() {
    this.stagedFiles.clear();
  }

  public commit(message: string, workingFiles: Record<string, string>, author = 'CodeDroid User <user@codedroid.dev>'): GitCommit | null {
    if (!message.trim() || this.stagedFiles.size === 0) {
      return null;
    }

    const filesChanged = Array.from(this.stagedFiles);
    // Update head files for staged files
    for (const file of filesChanged) {
      if (workingFiles[file] !== undefined) {
        this.headFiles[file] = workingFiles[file];
      } else {
        delete this.headFiles[file];
      }
    }

    const newCommit: GitCommit = {
      hash: Math.random().toString(16).substring(2, 9),
      message: message.trim(),
      author,
      timestamp: Date.now(),
      filesChanged,
    };

    this.commits.unshift(newCommit);
    this.stagedFiles.clear();
    return newCommit;
  }

  public createBranch(name: string): boolean {
    const clean = name.trim();
    if (!clean || this.branches.includes(clean)) return false;
    this.branches.push(clean);
    this.branch = clean;
    return true;
  }

  public checkoutBranch(name: string): boolean {
    if (this.branches.includes(name)) {
      this.branch = name;
      return true;
    }
    return false;
  }

  public computeDiff(filePath: string, workingContent: string): FileDiffLine[] {
    const oldContent = this.headFiles[filePath] ?? '';
    const oldLines = oldContent ? oldContent.split('\n') : [];
    const newLines = workingContent ? workingContent.split('\n') : [];

    const diffLines: FileDiffLine[] = [];
    const maxLen = Math.max(oldLines.length, newLines.length);

    // Simple line-by-line diff for clean visual diff display
    let i = 0;
    let j = 0;

    while (i < oldLines.length || j < newLines.length) {
      if (i < oldLines.length && j < newLines.length && oldLines[i] === newLines[j]) {
        diffLines.push({
          type: 'same',
          oldLineNumber: i + 1,
          newLineNumber: j + 1,
          content: oldLines[i],
        });
        i++;
        j++;
      } else if (i < oldLines.length && (j >= newLines.length || !newLines.slice(j).includes(oldLines[i]))) {
        diffLines.push({
          type: 'del',
          oldLineNumber: i + 1,
          content: oldLines[i],
        });
        i++;
      } else if (j < newLines.length) {
        diffLines.push({
          type: 'add',
          newLineNumber: j + 1,
          content: newLines[j],
        });
        j++;
      } else {
        break;
      }
    }

    return diffLines;
  }

  public getHeadFile(path: string): string | undefined {
    return this.headFiles[path];
  }
}
