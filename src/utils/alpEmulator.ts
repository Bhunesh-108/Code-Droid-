import { AlpExecutionResult, AlpStep, FlagState, RegisterState } from '../types';

export class AlpEmulator {
  private registers: RegisterState = {
    AX: 0,
    BX: 0,
    CX: 0,
    DX: 0,
    SI: 0,
    DI: 0,
    SP: 0xfffe,
    BP: 0,
    IP: 0,
  };

  private flags: FlagState = {
    ZF: false,
    CF: false,
    SF: false,
    OF: false,
  };

  private memory: Record<number, number> = {};
  private variables: Record<string, { address: number; size: 'byte' | 'word'; value: number }> = {};
  private labels: Record<string, number> = {};
  private steps: AlpStep[] = [];
  private outputLogs: string[] = [];

  constructor() {
    this.reset();
  }

  public reset() {
    this.registers = {
      AX: 0,
      BX: 0,
      CX: 0,
      DX: 0,
      SI: 0,
      DI: 0,
      SP: 0xfffe,
      BP: 0,
      IP: 0,
    };
    this.flags = {
      ZF: false,
      CF: false,
      SF: false,
      OF: false,
    };
    this.memory = {};
    this.variables = {};
    this.labels = {};
    this.steps = [];
    this.outputLogs = [];
  }

  public getRegister(name: string): number {
    const reg = name.toUpperCase().trim();
    if (reg === 'AX') return this.registers.AX & 0xffff;
    if (reg === 'AL') return this.registers.AX & 0xff;
    if (reg === 'AH') return (this.registers.AX >> 8) & 0xff;

    if (reg === 'BX') return this.registers.BX & 0xffff;
    if (reg === 'BL') return this.registers.BX & 0xff;
    if (reg === 'BH') return (this.registers.BX >> 8) & 0xff;

    if (reg === 'CX') return this.registers.CX & 0xffff;
    if (reg === 'CL') return this.registers.CX & 0xff;
    if (reg === 'CH') return (this.registers.CX >> 8) & 0xff;

    if (reg === 'DX') return this.registers.DX & 0xffff;
    if (reg === 'DL') return this.registers.DX & 0xff;
    if (reg === 'DH') return (this.registers.DX >> 8) & 0xff;

    if (reg === 'SI') return this.registers.SI & 0xffff;
    if (reg === 'DI') return this.registers.DI & 0xffff;
    if (reg === 'SP') return this.registers.SP & 0xffff;
    if (reg === 'BP') return this.registers.BP & 0xffff;
    if (reg === 'IP') return this.registers.IP & 0xffff;

    // x86 32-bit compatibility aliases
    if (reg === 'EAX') return this.registers.AX & 0xffff;
    if (reg === 'EBX') return this.registers.BX & 0xffff;
    if (reg === 'ECX') return this.registers.CX & 0xffff;
    if (reg === 'EDX') return this.registers.DX & 0xffff;

    return 0;
  }

  public setRegister(name: string, value: number) {
    const reg = name.toUpperCase().trim();
    const val = value & 0xffff;

    if (reg === 'AX' || reg === 'EAX') {
      this.registers.AX = val;
    } else if (reg === 'AL') {
      this.registers.AX = (this.registers.AX & 0xff00) | (val & 0xff);
    } else if (reg === 'AH') {
      this.registers.AX = (this.registers.AX & 0x00ff) | ((val & 0xff) << 8);
    } else if (reg === 'BX' || reg === 'EBX') {
      this.registers.BX = val;
    } else if (reg === 'BL') {
      this.registers.BX = (this.registers.BX & 0xff00) | (val & 0xff);
    } else if (reg === 'BH') {
      this.registers.BX = (this.registers.BX & 0x00ff) | ((val & 0xff) << 8);
    } else if (reg === 'CX' || reg === 'ECX') {
      this.registers.CX = val;
    } else if (reg === 'CL') {
      this.registers.CX = (this.registers.CX & 0xff00) | (val & 0xff);
    } else if (reg === 'CH') {
      this.registers.CX = (this.registers.CX & 0x00ff) | ((val & 0xff) << 8);
    } else if (reg === 'DX' || reg === 'EDX') {
      this.registers.DX = val;
    } else if (reg === 'DL') {
      this.registers.DX = (this.registers.DX & 0xff00) | (val & 0xff);
    } else if (reg === 'DH') {
      this.registers.DX = (this.registers.DX & 0x00ff) | ((val & 0xff) << 8);
    } else if (reg === 'SI') {
      this.registers.SI = val;
    } else if (reg === 'DI') {
      this.registers.DI = val;
    } else if (reg === 'SP') {
      this.registers.SP = val;
    } else if (reg === 'BP') {
      this.registers.BP = val;
    }
  }

  private parseValue(token: string): number {
    const clean = token.trim();
    if (!clean) return 0;

    // Check register
    if (this.isRegister(clean)) {
      return this.getRegister(clean);
    }

    // Check variable
    const varName = clean.toUpperCase();
    if (this.variables[varName]) {
      return this.variables[varName].value;
    }

    // Check memory pointer like [SI] or [BX] or [address]
    if (clean.startsWith('[') && clean.endsWith(']')) {
      const inner = clean.slice(1, -1).trim();
      const addr = this.parseValue(inner);
      return (this.memory[addr] || 0) | ((this.memory[addr + 1] || 0) << 8);
    }

    // Hex notation: 1234H, 0x1234
    if (/^[0-9A-Fa-f]+[Hh]$/.test(clean)) {
      return parseInt(clean.slice(0, -1), 16) || 0;
    }
    if (/^0[Xx][0-9A-Fa-f]+$/.test(clean)) {
      return parseInt(clean.slice(2), 16) || 0;
    }

    // Binary notation: 1010B
    if (/^[01]+[Bb]$/.test(clean)) {
      return parseInt(clean.slice(0, -1), 2) || 0;
    }

    // Character literal: 'A'
    if ((clean.startsWith("'") && clean.endsWith("'")) || (clean.startsWith('"') && clean.endsWith('"'))) {
      return clean.charCodeAt(1) || 0;
    }

    // Decimal
    const parsed = parseInt(clean, 10);
    return isNaN(parsed) ? 0 : parsed;
  }

  private isRegister(token: string): boolean {
    const t = token.toUpperCase().trim();
    return [
      'AX', 'AH', 'AL', 'BX', 'BH', 'BL',
      'CX', 'CH', 'CL', 'DX', 'DH', 'DL',
      'SI', 'DI', 'SP', 'BP', 'IP',
      'EAX', 'EBX', 'ECX', 'EDX', 'ESI', 'EDI'
    ].includes(t);
  }

  public runProgram(sourceCode: string, maxSteps = 5000): AlpExecutionResult {
    this.reset();
    const rawLines = sourceCode.split('\n');

    // First pass: extract labels and data declarations
    interface CleanInstruction {
      originalLineNumber: number;
      text: string;
      opcode: string;
      args: string[];
    }

    const instructions: CleanInstruction[] = [];
    let dataAddressCounter = 0x2000;

    for (let i = 0; i < rawLines.length; i++) {
      let line = rawLines[i].trim();
      // Strip comments (; or //)
      const commentIdx = line.indexOf(';');
      if (commentIdx !== -1) line = line.substring(0, commentIdx).trim();
      const slashComment = line.indexOf('//');
      if (slashComment !== -1) line = line.substring(0, slashComment).trim();

      if (!line) continue;

      // Check labels (e.g. "START:", "LOOP1:")
      const labelMatch = line.match(/^([A-Za-z_][A-Za-z0-9_]*):(.*)$/);
      if (labelMatch) {
        const labelName = labelMatch[1].toUpperCase();
        this.labels[labelName] = instructions.length;
        line = labelMatch[2].trim();
        if (!line) continue;
      }

      // Check variable declarations: VAR1 DW 1234H, NUM DB 25
      const varMatch = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s+(DB|DW)\s+(.+)$/i);
      if (varMatch) {
        const varName = varMatch[1].toUpperCase();
        const type = varMatch[2].toUpperCase() === 'DW' ? 'word' : 'byte';
        const rawVal = varMatch[3].trim();
        let val = 0;
        if (rawVal !== '?') {
          val = this.parseValue(rawVal);
        }
        this.variables[varName] = { address: dataAddressCounter, size: type, value: val };
        this.memory[dataAddressCounter] = val & 0xff;
        if (type === 'word') {
          this.memory[dataAddressCounter + 1] = (val >> 8) & 0xff;
          dataAddressCounter += 2;
        } else {
          dataAddressCounter += 1;
        }
        continue;
      }

      // Skip segment/assume boilerplates
      if (/^(DATA\s+SEGMENT|CODE\s+SEGMENT|DATA\s+ENDS|CODE\s+ENDS|ASSUME|END\b|SECTION\b|GLOBAL\b|ORG\b)/i.test(line)) {
        continue;
      }

      // Instruction parsing
      const spaceIdx = line.search(/\s/);
      let opcode = '';
      let argString = '';
      if (spaceIdx === -1) {
        opcode = line.toUpperCase();
      } else {
        opcode = line.substring(0, spaceIdx).toUpperCase();
        argString = line.substring(spaceIdx + 1).trim();
      }

      // Parse comma-separated arguments
      const args: string[] = [];
      if (argString) {
        let current = '';
        let inQuotes = false;
        for (let c = 0; c < argString.length; c++) {
          const char = argString[c];
          if (char === "'" || char === '"') inQuotes = !inQuotes;
          if (char === ',' && !inQuotes) {
            args.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        if (current.trim()) args.push(current.trim());
      }

      instructions.push({
        originalLineNumber: i + 1,
        text: rawLines[i].trim(),
        opcode,
        args,
      });
    }

    // Second pass: Execution loop
    let pc = 0;
    let stepCount = 0;

    // If 'START' label exists, start execution there
    if (this.labels['START'] !== undefined) {
      pc = this.labels['START'];
    }

    try {
      while (pc >= 0 && pc < instructions.length && stepCount < maxSteps) {
        const inst = instructions[pc];
        this.registers.IP = pc;
        stepCount++;

        let logMessage: string | undefined;
        let nextPc = pc + 1;

        switch (inst.opcode) {
          case 'MOV': {
            const dest = inst.args[0];
            const src = inst.args[1];
            const val = this.parseValue(src);
            this.writeDestination(dest, val);
            break;
          }

          case 'ADD': {
            const dest = inst.args[0];
            const src = inst.args[1];
            const v1 = this.readDestination(dest);
            const v2 = this.parseValue(src);
            const res = v1 + v2;
            this.flags.CF = res > 0xffff;
            this.flags.ZF = (res & 0xffff) === 0;
            this.flags.SF = (res & 0x8000) !== 0;
            this.flags.OF = ((v1 ^ res) & (v2 ^ res) & 0x8000) !== 0;
            this.writeDestination(dest, res & 0xffff);
            break;
          }

          case 'ADC': {
            const dest = inst.args[0];
            const src = inst.args[1];
            const v1 = this.readDestination(dest);
            const v2 = this.parseValue(src);
            const carry = this.flags.CF ? 1 : 0;
            const res = v1 + v2 + carry;
            this.flags.CF = res > 0xffff;
            this.flags.ZF = (res & 0xffff) === 0;
            this.flags.SF = (res & 0x8000) !== 0;
            this.writeDestination(dest, res & 0xffff);
            break;
          }

          case 'SUB': {
            const dest = inst.args[0];
            const src = inst.args[1];
            const v1 = this.readDestination(dest);
            const v2 = this.parseValue(src);
            const res = v1 - v2;
            this.flags.CF = v1 < v2;
            this.flags.ZF = (res & 0xffff) === 0;
            this.flags.SF = (res & 0x8000) !== 0;
            this.writeDestination(dest, res & 0xffff);
            break;
          }

          case 'SBB': {
            const dest = inst.args[0];
            const src = inst.args[1];
            const v1 = this.readDestination(dest);
            const v2 = this.parseValue(src);
            const borrow = this.flags.CF ? 1 : 0;
            const res = v1 - (v2 + borrow);
            this.flags.CF = v1 < v2 + borrow;
            this.flags.ZF = (res & 0xffff) === 0;
            this.flags.SF = (res & 0x8000) !== 0;
            this.writeDestination(dest, res & 0xffff);
            break;
          }

          case 'INC': {
            const dest = inst.args[0];
            const v = this.readDestination(dest);
            const res = (v + 1) & 0xffff;
            this.flags.ZF = res === 0;
            this.flags.SF = (res & 0x8000) !== 0;
            this.writeDestination(dest, res);
            break;
          }

          case 'DEC': {
            const dest = inst.args[0];
            const v = this.readDestination(dest);
            const res = (v - 1) & 0xffff;
            this.flags.ZF = res === 0;
            this.flags.SF = (res & 0x8000) !== 0;
            this.writeDestination(dest, res);
            break;
          }

          case 'MUL': {
            const src = inst.args[0];
            const v = this.parseValue(src);
            const res = (this.registers.AX & 0xffff) * v;
            this.registers.AX = res & 0xffff;
            this.registers.DX = (res >> 16) & 0xffff;
            this.flags.CF = this.registers.DX > 0;
            this.flags.OF = this.flags.CF;
            break;
          }

          case 'DIV': {
            const src = inst.args[0];
            const v = this.parseValue(src);
            if (v === 0) throw new Error('Divide by zero in ALP execution');
            const dividend = ((this.registers.DX & 0xffff) << 16) | (this.registers.AX & 0xffff);
            this.registers.AX = Math.floor(dividend / v) & 0xffff;
            this.registers.DX = (dividend % v) & 0xffff;
            break;
          }

          case 'CMP': {
            const dest = inst.args[0];
            const src = inst.args[1];
            const v1 = this.readDestination(dest);
            const v2 = this.parseValue(src);
            const res = v1 - v2;
            this.flags.CF = v1 < v2;
            this.flags.ZF = v1 === v2;
            this.flags.SF = (res & 0x8000) !== 0;
            this.flags.OF = ((v1 ^ res) & (~v2 ^ res) & 0x8000) !== 0;
            break;
          }

          case 'AND': {
            const dest = inst.args[0];
            const src = inst.args[1];
            const res = this.readDestination(dest) & this.parseValue(src);
            this.flags.CF = false;
            this.flags.OF = false;
            this.flags.ZF = (res & 0xffff) === 0;
            this.flags.SF = (res & 0x8000) !== 0;
            this.writeDestination(dest, res);
            break;
          }

          case 'OR': {
            const dest = inst.args[0];
            const src = inst.args[1];
            const res = this.readDestination(dest) | this.parseValue(src);
            this.flags.CF = false;
            this.flags.OF = false;
            this.flags.ZF = (res & 0xffff) === 0;
            this.flags.SF = (res & 0x8000) !== 0;
            this.writeDestination(dest, res);
            break;
          }

          case 'XOR': {
            const dest = inst.args[0];
            const src = inst.args[1];
            const res = (this.readDestination(dest) ^ this.parseValue(src)) & 0xffff;
            this.flags.CF = false;
            this.flags.OF = false;
            this.flags.ZF = res === 0;
            this.flags.SF = (res & 0x8000) !== 0;
            this.writeDestination(dest, res);
            break;
          }

          case 'NOT': {
            const dest = inst.args[0];
            const res = (~this.readDestination(dest)) & 0xffff;
            this.writeDestination(dest, res);
            break;
          }

          case 'SHL':
          case 'SAL': {
            const dest = inst.args[0];
            const count = inst.args[1] ? this.parseValue(inst.args[1]) : 1;
            const res = (this.readDestination(dest) << count) & 0xffff;
            this.flags.ZF = res === 0;
            this.writeDestination(dest, res);
            break;
          }

          case 'SHR': {
            const dest = inst.args[0];
            const count = inst.args[1] ? this.parseValue(inst.args[1]) : 1;
            const res = (this.readDestination(dest) >> count) & 0xffff;
            this.flags.ZF = res === 0;
            this.writeDestination(dest, res);
            break;
          }

          case 'JMP': {
            const target = inst.args[0]?.toUpperCase();
            if (this.labels[target] !== undefined) {
              nextPc = this.labels[target];
            }
            break;
          }

          case 'JZ':
          case 'JE': {
            if (this.flags.ZF) {
              const target = inst.args[0]?.toUpperCase();
              if (this.labels[target] !== undefined) nextPc = this.labels[target];
            }
            break;
          }

          case 'JNZ':
          case 'JNE': {
            if (!this.flags.ZF) {
              const target = inst.args[0]?.toUpperCase();
              if (this.labels[target] !== undefined) nextPc = this.labels[target];
            }
            break;
          }

          case 'JC':
          case 'JB': {
            if (this.flags.CF) {
              const target = inst.args[0]?.toUpperCase();
              if (this.labels[target] !== undefined) nextPc = this.labels[target];
            }
            break;
          }

          case 'JNC':
          case 'JNB':
          case 'JAE': {
            if (!this.flags.CF) {
              const target = inst.args[0]?.toUpperCase();
              if (this.labels[target] !== undefined) nextPc = this.labels[target];
            }
            break;
          }

          case 'JG':
          case 'JNLE': {
            if (!this.flags.ZF && this.flags.SF === this.flags.OF) {
              const target = inst.args[0]?.toUpperCase();
              if (this.labels[target] !== undefined) nextPc = this.labels[target];
            }
            break;
          }

          case 'JL':
          case 'JNGE': {
            if (this.flags.SF !== this.flags.OF) {
              const target = inst.args[0]?.toUpperCase();
              if (this.labels[target] !== undefined) nextPc = this.labels[target];
            }
            break;
          }

          case 'LOOP': {
            this.registers.CX = (this.registers.CX - 1) & 0xffff;
            if (this.registers.CX > 0) {
              const target = inst.args[0]?.toUpperCase();
              if (this.labels[target] !== undefined) nextPc = this.labels[target];
            }
            break;
          }

          case 'PUSH': {
            const val = this.parseValue(inst.args[0]);
            this.registers.SP = (this.registers.SP - 2) & 0xffff;
            this.memory[this.registers.SP] = val & 0xff;
            this.memory[this.registers.SP + 1] = (val >> 8) & 0xff;
            break;
          }

          case 'POP': {
            const dest = inst.args[0];
            const val = (this.memory[this.registers.SP] || 0) | ((this.memory[this.registers.SP + 1] || 0) << 8);
            this.registers.SP = (this.registers.SP + 2) & 0xffff;
            this.writeDestination(dest, val);
            break;
          }

          case 'INT': {
            const intNum = inst.args[0]?.toUpperCase();
            if (intNum === '21H' || intNum === '33' || intNum === '0X21') {
              const ah = (this.registers.AX >> 8) & 0xff;
              if (ah === 0x4c || ah === 0x00) {
                // Program terminate
                logMessage = '[INT 21H: AH=4CH Program Terminated Successfully]';
                nextPc = instructions.length; // halt
              } else if (ah === 0x02) {
                // Display character in DL
                const charCode = this.registers.DX & 0xff;
                const char = String.fromCharCode(charCode);
                this.outputLogs.push(char);
                logMessage = `[INT 21H: Print Char '${char}']`;
              } else if (ah === 0x09) {
                // Print string at DX ending with '$'
                let addr = this.registers.DX & 0xffff;
                let str = '';
                while (this.memory[addr] !== undefined && this.memory[addr] !== 0x24 && str.length < 256) {
                  str += String.fromCharCode(this.memory[addr]);
                  addr++;
                }
                this.outputLogs.push(str);
                logMessage = `[INT 21H: Print String: "${str}"]`;
              }
            } else if (intNum === '80H' || intNum === '0X80') {
              // Linux syscall
              logMessage = '[SYSCALL executed]';
            }
            break;
          }

          case 'HLT': {
            logMessage = '[HLT: Processor Halted]';
            nextPc = instructions.length;
            break;
          }

          case 'NOP':
            break;

          default:
            // unrecognized instruction or directive
            break;
        }

        // Snapshot step
        this.steps.push({
          stepNumber: stepCount,
          instruction: inst.text,
          line: inst.originalLineNumber,
          registers: { ...this.registers },
          flags: { ...this.flags },
          outputLog: logMessage,
        });

        pc = nextPc;
      }

      return {
        success: true,
        steps: this.steps,
        finalRegisters: { ...this.registers },
        finalFlags: { ...this.flags },
        output: this.outputLogs.join(''),
        memoryDump: { ...this.memory },
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        error: message,
        steps: this.steps,
        finalRegisters: { ...this.registers },
        finalFlags: { ...this.flags },
        output: this.outputLogs.join(''),
        memoryDump: { ...this.memory },
      };
    }
  }

  private readDestination(dest: string): number {
    const clean = dest.trim();
    if (this.isRegister(clean)) {
      return this.getRegister(clean);
    }
    const varName = clean.toUpperCase();
    if (this.variables[varName]) {
      return this.variables[varName].value;
    }
    if (clean.startsWith('[') && clean.endsWith(']')) {
      const inner = clean.slice(1, -1).trim();
      const addr = this.parseValue(inner);
      return (this.memory[addr] || 0) | ((this.memory[addr + 1] || 0) << 8);
    }
    return 0;
  }

  private writeDestination(dest: string, val: number) {
    const clean = dest.trim();
    if (this.isRegister(clean)) {
      this.setRegister(clean, val);
      return;
    }
    const varName = clean.toUpperCase();
    if (this.variables[varName]) {
      this.variables[varName].value = val;
      const addr = this.variables[varName].address;
      this.memory[addr] = val & 0xff;
      if (this.variables[varName].size === 'word') {
        this.memory[addr + 1] = (val >> 8) & 0xff;
      }
      return;
    }
    if (clean.startsWith('[') && clean.endsWith(']')) {
      const inner = clean.slice(1, -1).trim();
      const addr = this.parseValue(inner);
      this.memory[addr] = val & 0xff;
      this.memory[addr + 1] = (val >> 8) & 0xff;
    }
  }
}
