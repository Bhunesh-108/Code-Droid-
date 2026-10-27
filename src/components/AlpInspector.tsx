import React, { useState } from 'react';
import { Play, RotateCcw, StepForward, Cpu, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { AlpEmulator } from '../utils/alpEmulator';
import { AlpExecutionResult, AlpStep } from '../types';

interface AlpInspectorProps {
  currentCode: string;
  onHighlightLine?: (line: number) => void;
}

export const AlpInspector: React.FC<AlpInspectorProps> = ({ currentCode, onHighlightLine }) => {
  const [result, setResult] = useState<AlpExecutionResult | null>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(-1);
  const [activeTab, setActiveTab] = useState<'registers' | 'steps' | 'memory'>('registers');

  const runAll = () => {
    const emu = new AlpEmulator();
    const res = emu.runProgram(currentCode);
    setResult(res);
    setCurrentStepIdx(res.steps.length - 1);
    if (res.steps.length > 0 && onHighlightLine) {
      onHighlightLine(res.steps[res.steps.length - 1].line);
    }
  };

  const stepNext = () => {
    if (!result) {
      const emu = new AlpEmulator();
      const res = emu.runProgram(currentCode);
      setResult(res);
      setCurrentStepIdx(0);
      if (res.steps.length > 0 && onHighlightLine) {
        onHighlightLine(res.steps[0].line);
      }
      return;
    }

    if (currentStepIdx < result.steps.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      if (onHighlightLine) {
        onHighlightLine(result.steps[nextIdx].line);
      }
    }
  };

  const stepPrev = () => {
    if (result && currentStepIdx > 0) {
      const prevIdx = currentStepIdx - 1;
      setCurrentStepIdx(prevIdx);
      if (onHighlightLine) {
        onHighlightLine(result.steps[prevIdx].line);
      }
    }
  };

  const resetAll = () => {
    setResult(null);
    setCurrentStepIdx(-1);
  };

  const currentStep: AlpStep | null =
    result && currentStepIdx >= 0 && currentStepIdx < result.steps.length
      ? result.steps[currentStepIdx]
      : null;

  const registers = currentStep ? currentStep.registers : result?.finalRegisters || {
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

  const flags = currentStep ? currentStep.flags : result?.finalFlags || {
    ZF: false,
    CF: false,
    SF: false,
    OF: false,
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e24] text-zinc-200 overflow-hidden text-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#2d2d38] bg-[#18181d]">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-4 h-4 text-purple-400" />
          <span className="font-semibold text-zinc-100 uppercase tracking-wider text-[11px]">
            8086 ALP Architecture
          </span>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 bg-[#121216] p-0.5 rounded border border-zinc-700/60">
          <button
            onClick={() => setActiveTab('registers')}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
              activeTab === 'registers' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Registers
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
              activeTab === 'steps' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Trace
          </button>
        </div>
      </div>

      {/* Control Buttons: Run, Step, Reset */}
      <div className="flex items-center justify-between p-2.5 bg-[#23232c] border-b border-zinc-700/60">
        <div className="flex items-center gap-1.5">
          <button
            onClick={stepNext}
            className="flex items-center gap-1 px-2.5 py-1 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white rounded font-medium shadow-sm"
            title="Step next instruction"
          >
            <StepForward className="w-3.5 h-3.5" />
            <span>Step</span>
          </button>
          <button
            onClick={runAll}
            className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded font-medium shadow-sm"
            title="Run complete ALP program"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run All</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {result && (
            <span className="text-[10px] text-zinc-400 font-mono">
              Step {currentStepIdx + 1}/{result.steps.length}
            </span>
          )}
          <button
            onClick={resetAll}
            className="p-1 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 rounded"
            title="Reset CPU state"
            aria-label="Reset CPU state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {activeTab === 'registers' ? (
          <>
            {/* General Purpose Registers Table */}
            <div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>General Purpose Registers (16-bit / 8-bit)</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'AX', val: registers.AX, high: (registers.AX >> 8) & 0xff, low: registers.AX & 0xff },
                  { name: 'BX', val: registers.BX, high: (registers.BX >> 8) & 0xff, low: registers.BX & 0xff },
                  { name: 'CX', val: registers.CX, high: (registers.CX >> 8) & 0xff, low: registers.CX & 0xff },
                  { name: 'DX', val: registers.DX, high: (registers.DX >> 8) & 0xff, low: registers.DX & 0xff },
                ].map(r => (
                  <div
                    key={r.name}
                    className="bg-[#24242d] border border-zinc-700/80 rounded-lg p-2 flex flex-col gap-1 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-purple-400 text-xs">{r.name}</span>
                      <span className="font-mono text-zinc-300 text-xs">
                        0x{r.val.toString(16).padStart(4, '0').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 border-t border-zinc-700/50 pt-1">
                      <span>Dec: {r.val}</span>
                      <span>
                        H: {r.high.toString(16).toUpperCase()} | L: {r.low.toString(16).toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pointer & Index Registers */}
            <div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                Pointers & Index Registers
              </div>
              <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
                <div className="bg-[#24242d] p-1.5 rounded border border-zinc-700/60 flex flex-col items-center">
                  <span className="text-zinc-400 text-[10px]">SI</span>
                  <span className="text-zinc-200">0x{registers.SI.toString(16).padStart(4, '0').toUpperCase()}</span>
                </div>
                <div className="bg-[#24242d] p-1.5 rounded border border-zinc-700/60 flex flex-col items-center">
                  <span className="text-zinc-400 text-[10px]">DI</span>
                  <span className="text-zinc-200">0x{registers.DI.toString(16).padStart(4, '0').toUpperCase()}</span>
                </div>
                <div className="bg-[#24242d] p-1.5 rounded border border-zinc-700/60 flex flex-col items-center">
                  <span className="text-zinc-400 text-[10px]">SP</span>
                  <span className="text-zinc-200">0x{registers.SP.toString(16).padStart(4, '0').toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Status Flags */}
            <div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                Status Flags Register
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: 'ZF', name: 'Zero', active: flags.ZF },
                  { label: 'CF', name: 'Carry', active: flags.CF },
                  { label: 'SF', name: 'Sign', active: flags.SF },
                  { label: 'OF', name: 'Overflow', active: flags.OF },
                ].map(f => (
                  <div
                    key={f.label}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      f.active
                        ? 'bg-purple-950/70 border-purple-500 text-purple-200 font-bold shadow-xs'
                        : 'bg-[#24242d] border-zinc-700/60 text-zinc-500'
                    }`}
                  >
                    <div className="font-mono text-xs">{f.label}</div>
                    <div className="text-[9px] uppercase tracking-wider mt-0.5">
                      {f.active ? '1 (Set)' : '0 (Clear)'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Executing Instruction readout */}
            {currentStep && (
              <div className="bg-purple-950/40 border border-purple-600/40 rounded-lg p-2.5 text-xs space-y-1">
                <div className="text-[10px] font-bold text-purple-300 uppercase">Current Step:</div>
                <div className="font-mono text-white font-semibold">Line {currentStep.line}: {currentStep.instruction}</div>
                {currentStep.outputLog && (
                  <div className="text-emerald-400 text-[11px] font-mono">{currentStep.outputLog}</div>
                )}
              </div>
            )}
          </>
        ) : (
          /* Execution Steps History */
          <div className="space-y-1.5 font-mono">
            {result?.steps.map((st, i) => (
              <div
                key={i}
                onClick={() => {
                  setCurrentStepIdx(i);
                  if (onHighlightLine) onHighlightLine(st.line);
                }}
                className={`p-2 rounded-md border cursor-pointer text-xs transition-colors ${
                  i === currentStepIdx
                    ? 'bg-purple-900/40 border-purple-500 text-white'
                    : 'bg-[#24242d] border-zinc-700/50 text-zinc-300 hover:bg-[#2e2e38]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-purple-400 font-bold">Step {st.stepNumber}</span>
                  <span className="text-[10px] text-zinc-500">Ln {st.line}</span>
                </div>
                <div className="text-white font-medium truncate mt-0.5">{st.instruction}</div>
                <div className="text-[10px] text-zinc-400 mt-1 flex gap-2">
                  <span>AX: 0x{st.registers.AX.toString(16).toUpperCase()}</span>
                  <span>BX: 0x{st.registers.BX.toString(16).toUpperCase()}</span>
                  <span>CX: {st.registers.CX}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
