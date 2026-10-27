import test from 'node:test';
import assert from 'node:assert/strict';
import { AlpEmulator } from './alpEmulator';

test('ALP Emulator: Basic MOV and ADD with 16-bit registers', () => {
  const emu = new AlpEmulator();
  const code = `
    MOV AX, 10
    MOV BX, 25
    ADD AX, BX
    HLT
  `;
  const result = emu.runProgram(code);
  assert.equal(result.success, true);
  assert.equal(result.finalRegisters.AX, 35);
  assert.equal(result.finalRegisters.BX, 25);
  assert.equal(result.finalFlags.ZF, false);
});

test('ALP Emulator: Zero flag calculation', () => {
  const emu = new AlpEmulator();
  const code = `
    MOV AX, 50
    SUB AX, 50
    HLT
  `;
  const result = emu.runProgram(code);
  assert.equal(result.success, true);
  assert.equal(result.finalRegisters.AX, 0);
  assert.equal(result.finalFlags.ZF, true);
});

test('ALP Emulator: Loop decrementing CX', () => {
  const emu = new AlpEmulator();
  const code = `
    MOV AX, 0
    MOV CX, 5
  AGAIN:
    ADD AX, 2
    LOOP AGAIN
    HLT
  `;
  const result = emu.runProgram(code);
  assert.equal(result.success, true);
  assert.equal(result.finalRegisters.AX, 10);
  assert.equal(result.finalRegisters.CX, 0);
});

test('ALP Emulator: Variable declaration and memory storage', () => {
  const emu = new AlpEmulator();
  const code = `
  DATA SEGMENT
    NUM1 DW 1000H
    NUM2 DW 2000H
    SUM DW ?
  DATA ENDS
  CODE SEGMENT
  START:
    MOV AX, NUM1
    MOV BX, NUM2
    ADD AX, BX
    MOV SUM, AX
    INT 21H
  CODE ENDS
  `;
  const result = emu.runProgram(code);
  assert.equal(result.success, true);
  assert.equal(result.finalRegisters.AX, 0x3000);
});
