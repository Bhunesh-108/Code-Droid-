import { GitEngine } from './gitEngine';
import { CodeRunner } from './codeRunners';
import { getLanguageFromFilename } from './fileSystem';

export interface TerminalExecutionOutput {
  lines: { type: 'input' | 'output' | 'error' | 'success' | 'system'; text: string }[];
  clear?: boolean;
}

export class TerminalEngine {
  public static async executeCommand(
    rawCommand: string,
    files: Record<string, string>,
    git: GitEngine,
    currentFile?: string,
    onFileChange?: (path: string, content: string | null) => void
  ): Promise<TerminalExecutionOutput> {
    const cmd = rawCommand.trim();
    if (!cmd) return { lines: [] };

    const output: { type: 'input' | 'output' | 'error' | 'success' | 'system'; text: string }[] = [
      { type: 'input', text: `$ ${cmd}` },
    ];

    if (cmd === 'clear' || cmd === 'cls') {
      return { lines: [], clear: true };
    }

    const parts = cmd.split(/\s+/);
    const mainCommand = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (mainCommand) {
      case 'help': {
        output.push({
          type: 'system',
          text: `CodeDroid POSIX Terminal Shell (Multi-Language Android Edition):
  python3 <file.py>          Run Python 3 script
  node <file.js>             Run Node.js / JavaScript
  gcc <file.c>               Compile & execute C program
  g++ <file.cpp>             Compile & execute C++ program
  dotnet run / csc <file.cs> Run C# (.NET) program
  swift <file.swift>         Execute Swift script
  rustc <file.rs> / cargo    Compile & run Rust binary
  go run <file.go>           Execute Go (Golang) program
  kotlinc <file.kt>          Compile & run Kotlin code
  nasm <file.asm>            Assemble & execute 8086 ALP
  git status / add / commit  Source control management
  git diff / log / branch    Diff viewer and history
  ls / cat / touch / rm      Virtual filesystem tools
  clear / run                Terminal screen and runner`,
        });
        break;
      }

      case 'pwd': {
        output.push({ type: 'output', text: '/storage/emulated/0/CodeDroid/workspace' });
        break;
      }

      case 'ls':
      case 'dir': {
        const fileList = Object.keys(files);
        if (fileList.length === 0) {
          output.push({ type: 'output', text: '(empty directory)' });
        } else {
          const formatted = fileList
            .map(f => {
              const lang = getLanguageFromFilename(f);
              const icon =
                lang === 'python'
                  ? '🐍'
                  : lang === 'javascript'
                  ? '🟨'
                  : lang === 'c'
                  ? '🅲'
                  : lang === 'cpp'
                  ? '🔷'
                  : lang === 'csharp'
                  ? '🟣'
                  : lang === 'swift'
                  ? '🧡'
                  : lang === 'rust'
                  ? '🦀'
                  : lang === 'go'
                  ? '🐹'
                  : lang === 'kotlin'
                  ? '🎯'
                  : lang === 'alp'
                  ? '⚡'
                  : '📄';
              return `${icon} ${f.padEnd(20)} [${lang}]`;
            })
            .join('\n');
          output.push({ type: 'output', text: formatted });
        }
        break;
      }

      case 'cat': {
        const target = args[0];
        if (!target) {
          output.push({ type: 'error', text: 'cat: missing file operand' });
        } else if (files[target] === undefined) {
          output.push({ type: 'error', text: `cat: ${target}: No such file or directory` });
        } else {
          output.push({ type: 'output', text: files[target] });
        }
        break;
      }

      case 'touch': {
        const target = args[0];
        if (!target) {
          output.push({ type: 'error', text: 'touch: missing file operand' });
        } else {
          if (onFileChange) onFileChange(target, files[target] ?? '');
          output.push({ type: 'success', text: `Created file ${target}` });
        }
        break;
      }

      case 'rm': {
        const target = args[0];
        if (!target) {
          output.push({ type: 'error', text: 'rm: missing operand' });
        } else if (files[target] === undefined) {
          output.push({ type: 'error', text: `rm: cannot remove '${target}': No such file` });
        } else {
          if (onFileChange) onFileChange(target, null);
          output.push({ type: 'success', text: `Removed ${target}` });
        }
        break;
      }

      case 'run': {
        if (!currentFile || !files[currentFile]) {
          output.push({ type: 'error', text: 'run: no active file open to run' });
        } else {
          const lang = getLanguageFromFilename(currentFile);
          output.push({ type: 'system', text: `[Running ${currentFile} (${lang})...]` });
          const res = await CodeRunner.runCode(files[currentFile], lang);
          if (res.stderr) output.push({ type: 'error', text: res.stderr });
          if (res.stdout) output.push({ type: 'output', text: res.stdout });
          output.push({
            type: res.exitCode === 0 ? 'success' : 'error',
            text: `[Process completed in ${res.executionTimeMs}ms with exit code ${res.exitCode}]`,
          });
        }
        break;
      }

      case 'python':
      case 'python3':
      case 'py': {
        const target = args[0] || (currentFile?.endsWith('.py') ? currentFile : 'main.py');
        if (!files[target]) {
          output.push({ type: 'error', text: `python: can't open file '${target}': [Errno 2] No such file` });
        } else {
          output.push({ type: 'system', text: `Python 3.12.2 (Android aarch64)` });
          const res = await CodeRunner.runCode(files[target], 'python');
          if (res.stderr) output.push({ type: 'error', text: res.stderr });
          if (res.stdout) output.push({ type: 'output', text: res.stdout });
          output.push({
            type: res.exitCode === 0 ? 'success' : 'error',
            text: `[Finished in ${res.executionTimeMs}ms]`,
          });
        }
        break;
      }

      case 'node':
      case 'js': {
        const target = args[0] || (currentFile?.endsWith('.js') ? currentFile : 'index.js');
        if (!files[target]) {
          output.push({ type: 'error', text: `node: Cannot find module '/workspace/${target}'` });
        } else {
          output.push({ type: 'system', text: `Node.js v20.11.1 (V8 Engine)` });
          const res = await CodeRunner.runCode(files[target], 'javascript');
          if (res.stderr) output.push({ type: 'error', text: res.stderr });
          if (res.stdout) output.push({ type: 'output', text: res.stdout });
          output.push({
            type: res.exitCode === 0 ? 'success' : 'error',
            text: `[Finished in ${res.executionTimeMs}ms]`,
          });
        }
        break;
      }

      case 'gcc':
      case 'clang': {
        const target = args[0] || (currentFile?.endsWith('.c') ? currentFile : 'kernel.c');
        if (!files[target]) {
          output.push({ type: 'error', text: `gcc: fatal error: no input files (${target})` });
        } else {
          output.push({ type: 'system', text: `gcc 13.2.0 (Ubuntu/Android) compiling ${target}...` });
          const res = await CodeRunner.runCode(files[target], 'c');
          if (res.stderr) output.push({ type: 'error', text: res.stderr });
          if (res.stdout) output.push({ type: 'output', text: res.stdout });
          output.push({
            type: res.exitCode === 0 ? 'success' : 'error',
            text: `[Build & Run finished in ${res.executionTimeMs}ms]`,
          });
        }
        break;
      }

      case 'g++':
      case 'clang++': {
        const target = args[0] || (currentFile?.endsWith('.cpp') ? currentFile : 'algo.cpp');
        if (!files[target]) {
          output.push({ type: 'error', text: `g++: fatal error: ${target}: No such file or directory` });
        } else {
          output.push({ type: 'system', text: `g++ 13.2.0 compiling ${target}...` });
          const res = await CodeRunner.runCode(files[target], 'cpp');
          if (res.stderr) output.push({ type: 'error', text: res.stderr });
          if (res.stdout) output.push({ type: 'output', text: res.stdout });
          output.push({
            type: res.exitCode === 0 ? 'success' : 'error',
            text: `[Finished in ${res.executionTimeMs}ms]`,
          });
        }
        break;
      }

      case 'dotnet':
      case 'csc':
      case 'csharp': {
        const target = args[0] === 'run' ? (args[1] || 'Program.cs') : (args[0] || 'Program.cs');
        if (!files[target]) {
          output.push({ type: 'error', text: `dotnet: The project file '${target}' was not found.` });
        } else {
          output.push({ type: 'system', text: `.NET SDK 8.0.204 (arm64)` });
          const res = await CodeRunner.runCode(files[target], 'csharp');
          if (res.stderr) output.push({ type: 'error', text: res.stderr });
          if (res.stdout) output.push({ type: 'output', text: res.stdout });
          output.push({
            type: res.exitCode === 0 ? 'success' : 'error',
            text: `[.NET finished in ${res.executionTimeMs}ms]`,
          });
        }
        break;
      }

      case 'swift': {
        const target = args[0] || (currentFile?.endsWith('.swift') ? currentFile : 'main.swift');
        if (!files[target]) {
          output.push({ type: 'error', text: `swift: error: no such file or directory: '${target}'` });
        } else {
          output.push({ type: 'system', text: `Swift version 5.10 (swift-5.10-RELEASE)` });
          const res = await CodeRunner.runCode(files[target], 'swift');
          if (res.stderr) output.push({ type: 'error', text: res.stderr });
          if (res.stdout) output.push({ type: 'output', text: res.stdout });
          output.push({
            type: res.exitCode === 0 ? 'success' : 'error',
            text: `[Swift finished in ${res.executionTimeMs}ms]`,
          });
        }
        break;
      }

      case 'rustc':
      case 'cargo':
      case 'rust': {
        const target = (args[0] === 'run' ? args[1] : args[0]) || (currentFile?.endsWith('.rs') ? currentFile : 'main.rs');
        if (!files[target]) {
          output.push({ type: 'error', text: `error: couldn't read ${target}: No such file or directory` });
        } else {
          output.push({ type: 'system', text: `rustc 1.78.0 (9b00956e5 2024-04-29)` });
          const res = await CodeRunner.runCode(files[target], 'rust');
          if (res.stderr) output.push({ type: 'error', text: res.stderr });
          if (res.stdout) output.push({ type: 'output', text: res.stdout });
          output.push({
            type: res.exitCode === 0 ? 'success' : 'error',
            text: `[Rust binary exited in ${res.executionTimeMs}ms]`,
          });
        }
        break;
      }

      case 'go': {
        const target = (args[0] === 'run' ? args[1] : args[0]) || (currentFile?.endsWith('.go') ? currentFile : 'server.go');
        if (!files[target]) {
          output.push({ type: 'error', text: `go: cannot find main module or file '${target}'` });
        } else {
          output.push({ type: 'system', text: `go version go1.22.2 linux/arm64` });
          const res = await CodeRunner.runCode(files[target], 'go');
          if (res.stderr) output.push({ type: 'error', text: res.stderr });
          if (res.stdout) output.push({ type: 'output', text: res.stdout });
          output.push({
            type: res.exitCode === 0 ? 'success' : 'error',
            text: `[Go completed in ${res.executionTimeMs}ms]`,
          });
        }
        break;
      }

      case 'kotlinc':
      case 'kotlin': {
        const target = args[0] || (currentFile?.endsWith('.kt') ? currentFile : 'App.kt');
        if (!files[target]) {
          output.push({ type: 'error', text: `kotlinc: error: file not found: ${target}` });
        } else {
          output.push({ type: 'system', text: `kotlinc-jvm 1.9.23 (JRE 21)` });
          const res = await CodeRunner.runCode(files[target], 'kotlin');
          if (res.stderr) output.push({ type: 'error', text: res.stderr });
          if (res.stdout) output.push({ type: 'output', text: res.stdout });
          output.push({
            type: res.exitCode === 0 ? 'success' : 'error',
            text: `[Kotlin finished in ${res.executionTimeMs}ms]`,
          });
        }
        break;
      }

      case 'nasm':
      case 'alp':
      case 'emu8086':
      case 'masm': {
        const target = args.find(a => !a.startsWith('-')) || (currentFile?.endsWith('.asm') ? currentFile : 'addition_alp.asm');
        if (!files[target]) {
          output.push({ type: 'error', text: `nasm: fatal: unable to open input file '${target}'` });
        } else {
          output.push({ type: 'system', text: `NASM / 8086 ALP Assembler version 2.16.01` });
          const res = await CodeRunner.runCode(files[target], 'alp');
          if (res.stderr) output.push({ type: 'error', text: res.stderr });
          if (res.stdout) output.push({ type: 'output', text: res.stdout });
          output.push({
            type: res.exitCode === 0 ? 'success' : 'error',
            text: `[Assembled & Executed in ${res.executionTimeMs}ms]`,
          });
        }
        break;
      }

      case 'git': {
        const sub = args[0]?.toLowerCase();
        if (!sub || sub === 'status') {
          const status = git.getStatus(files);
          let text = `On branch ${status.branch}\n`;
          if (status.stagedFiles.length === 0 && status.unstagedFiles.length === 0 && status.untrackedFiles.length === 0) {
            text += 'nothing to commit, working tree clean';
          } else {
            if (status.stagedFiles.length > 0) {
              text += 'Changes to be committed:\n  (use "git restore --staged <file>..." to unstage)\n';
              status.stagedFiles.forEach(f => {
                text += `\t\x1b[32mmodified:   ${f}\x1b[0m\n`;
              });
            }
            if (status.unstagedFiles.length > 0) {
              text += '\nChanges not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n';
              status.unstagedFiles.forEach(f => {
                text += `\t\x1b[31mmodified:   ${f}\x1b[0m\n`;
              });
            }
            if (status.untrackedFiles.length > 0) {
              text += '\nUntracked files:\n  (use "git add <file>..." to include in what will be committed)\n';
              status.untrackedFiles.forEach(f => {
                text += `\t\x1b[31m${f}\x1b[0m\n`;
              });
            }
          }
          output.push({ type: 'output', text });
        } else if (sub === 'add') {
          const target = args[1];
          if (!target || target === '.' || target === '-A') {
            git.stageAll(files);
            output.push({ type: 'success', text: 'Staged all modified and untracked files.' });
          } else {
            git.stageFile(target);
            output.push({ type: 'success', text: `Staged ${target}` });
          }
        } else if (sub === 'commit') {
          const mIdx = args.indexOf('-m');
          let message = 'Update code';
          if (mIdx !== -1 && args[mIdx + 1]) {
            message = args.slice(mIdx + 1).join(' ').replace(/^["']|["']$/g, '');
          }
          const commit = git.commit(message, files);
          if (commit) {
            output.push({
              type: 'success',
              text: `[${git.getStatus(files).branch} ${commit.hash}] ${commit.message}\n ${commit.filesChanged.length} file(s) changed`,
            });
          } else {
            output.push({ type: 'error', text: 'no changes added to commit (use "git add")' });
          }
        } else if (sub === 'log') {
          const status = git.getStatus(files);
          const logText = status.commits
            .map(c => `commit ${c.hash} (HEAD -> ${status.branch})\nAuthor: ${c.author}\nDate:   ${new Date(c.timestamp).toUTCString()}\n\n    ${c.message}\n`)
            .join('\n');
          output.push({ type: 'output', text: logText || 'No commits yet.' });
        } else if (sub === 'branch') {
          const status = git.getStatus(files);
          const bName = args[1];
          if (bName) {
            if (git.createBranch(bName)) {
              output.push({ type: 'success', text: `Created branch ${bName}` });
            } else {
              output.push({ type: 'error', text: `fatal: a branch named '${bName}' already exists` });
            }
          } else {
            const bList = status.branches.map(b => (b === status.branch ? `* ${b}` : `  ${b}`)).join('\n');
            output.push({ type: 'output', text: bList });
          }
        } else if (sub === 'checkout') {
          let bName = args[1];
          if (bName === '-b' && args[2]) {
            git.createBranch(args[2]);
            bName = args[2];
          }
          if (bName && git.checkoutBranch(bName)) {
            output.push({ type: 'success', text: `Switched to branch '${bName}'` });
          } else {
            output.push({ type: 'error', text: `error: pathspec '${bName}' did not match any file(s) known to git` });
          }
        } else if (sub === 'diff') {
          const target = args[1] || currentFile;
          if (!target || !files[target]) {
            output.push({ type: 'output', text: '(No diff or file specified)' });
          } else {
            const diffLines = git.computeDiff(target, files[target]);
            const formatted = diffLines
              .map(d => (d.type === 'add' ? `+ ${d.content}` : d.type === 'del' ? `- ${d.content}` : `  ${d.content}`))
              .join('\n');
            output.push({ type: 'output', text: `diff --git a/${target} b/${target}\n${formatted}` });
          }
        } else {
          output.push({ type: 'error', text: `git: '${sub}' is not a git command. See 'help'` });
        }
        break;
      }

      default:
        output.push({
          type: 'error',
          text: `bash: ${mainCommand}: command not found. Type 'help' for available commands.`,
        });
        break;
    }

    return { lines: output };
  }
}
