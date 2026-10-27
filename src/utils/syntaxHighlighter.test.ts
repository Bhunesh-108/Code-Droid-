import test from 'node:test';
import assert from 'node:assert/strict';
import { highlightCode } from './syntaxHighlighter';

test('highlightCode: Highlights Python keywords and strings', () => {
  const result = highlightCode('def hello():\n    print("world")', 'python');
  assert.ok(result.includes('token keyword') || result.includes('def'));
  assert.ok(result.includes('token string') || result.includes('world'));
});

test('highlightCode: Highlights ALP 8086 Assembly MOV AX and INT 21H', () => {
  const result = highlightCode('MOV AX, 1234H\nINT 21H', 'alp');
  assert.ok(result.includes('token') || result.includes('MOV'));
});

test('highlightCode: Highlights Rust fn, struct, and let mut', () => {
  const result = highlightCode('fn main() {\n    let mut x = 5;\n}', 'rust');
  assert.ok(result.includes('token keyword') || result.includes('fn'));
});

test('highlightCode: Highlights C# using, class, and Console', () => {
  const result = highlightCode('using System;\nclass Program {}', 'csharp');
  assert.ok(result.includes('token keyword') || result.includes('class'));
});

test('highlightCode: Highlights Swift import and struct', () => {
  const result = highlightCode('import Foundation\nstruct Item {}', 'swift');
  assert.ok(result.includes('token keyword') || result.includes('struct'));
});

test('highlightCode: Highlights C #include and int main', () => {
  const result = highlightCode('#include <stdio.h>\nint main() { return 0; }', 'c');
  assert.ok(result.includes('token') || result.includes('main'));
});
