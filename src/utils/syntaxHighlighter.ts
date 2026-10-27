import Prism from 'prismjs';

// Import essential language syntaxes
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-nasm';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-json';

// Add customized 8086 / x86 ALP Assembly grammar if not fully covered
Prism.languages.alp = {
  comment: /;.*|\/\/.*/,
  string: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
  label: {
    pattern: /^[A-Za-z_][A-Za-z0-9_]*:/m,
    alias: 'function',
  },
  keyword: /\b(?:DATA\s+SEGMENT|CODE\s+SEGMENT|DATA\s+ENDS|CODE\s+ENDS|ASSUME|START|END|ORG|SECTION|GLOBAL|DB|DW|DD|EQU|MACRO|ENDM)\b/i,
  instruction: {
    pattern: /\b(?:MOV|ADD|ADC|SUB|SBB|MUL|IMUL|DIV|IDIV|INC|DEC|CMP|AND|OR|XOR|NOT|TEST|SHL|SHR|SAL|SAR|ROL|ROR|JMP|JE|JZ|JNE|JNZ|JG|JNLE|JGE|JNL|JL|JNGE|JLE|JNG|JA|JNBE|JAE|JNB|JB|JNAE|JBE|JNA|JC|JNC|LOOP|LOOPE|LOOPNE|CALL|RET|PUSH|POP|INT|IN|OUT|HLT|NOP|LEA|LDS|LES|CLC|STC|CMC)\b/i,
    alias: 'keyword',
  },
  register: {
    pattern: /\b(?:EAX|EBX|ECX|EDX|ESI|EDI|ESP|EBP|AX|BX|CX|DX|AH|AL|BH|BL|CH|CL|DH|DL|SI|DI|SP|BP|IP|CS|DS|SS|ES|FS|GS)\b/i,
    alias: 'variable',
  },
  number: /\b(?:0[xX][0-9a-fA-F]+|[0-9a-fA-F]+[Hh]|[01]+[Bb]|[0-9]+)\b/,
  operator: /[-+/*=<>]/,
  punctuation: /[{}[\];(),.:]/,
};

export function highlightCode(code: string, language: string): string {
  const langKey = language.toLowerCase();
  let grammar = Prism.languages.javascript;

  if (langKey === 'python' || langKey === 'py') {
    grammar = Prism.languages.python || Prism.languages.javascript;
  } else if (langKey === 'c') {
    grammar = Prism.languages.c || Prism.languages.javascript;
  } else if (langKey === 'cpp' || langKey === 'c++') {
    grammar = Prism.languages.cpp || Prism.languages.c || Prism.languages.javascript;
  } else if (langKey === 'csharp' || langKey === 'cs' || langKey === 'c#') {
    grammar = Prism.languages.csharp || Prism.languages.javascript;
  } else if (langKey === 'swift') {
    grammar = Prism.languages.swift || Prism.languages.javascript;
  } else if (langKey === 'rust' || langKey === 'rs') {
    grammar = Prism.languages.rust || Prism.languages.javascript;
  } else if (langKey === 'go' || langKey === 'golang') {
    grammar = Prism.languages.go || Prism.languages.javascript;
  } else if (langKey === 'kotlin' || langKey === 'kt') {
    grammar = Prism.languages.kotlin || Prism.languages.javascript;
  } else if (langKey === 'java') {
    grammar = Prism.languages.java || Prism.languages.javascript;
  } else if (langKey === 'alp' || langKey === 'asm' || langKey === 'assembly') {
    grammar = Prism.languages.alp || Prism.languages.nasm || Prism.languages.javascript;
  } else if (langKey === 'markdown' || langKey === 'md') {
    grammar = Prism.languages.markdown || Prism.languages.javascript;
  } else if (langKey === 'json') {
    grammar = Prism.languages.json || Prism.languages.javascript;
  }

  try {
    return Prism.highlight(code, grammar, langKey);
  } catch {
    return escapeHtml(code);
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
