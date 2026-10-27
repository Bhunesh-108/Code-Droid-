import { FileNode } from '../types';

export const INITIAL_FILES: FileNode[] = [
  {
    id: '1',
    name: 'main.py',
    path: 'main.py',
    type: 'file',
    language: 'python',
    content: `# CodeDroid - Python on Android
# Fast Fibonacci & Prime Sieve Algorithm

def fibonacci(n):
    sequence = [0, 1]
    for i in range(2, n):
        sequence.append(sequence[i-1] + sequence[i-2])
    return sequence

def sieve_of_eratosthenes(limit):
    primes = []
    is_prime = [True] * (limit + 1)
    for p in range(2, limit + 1):
        if is_prime[p]:
            primes.append(p)
            for i in range(p * p, limit + 1, p):
                is_prime[i] = False
    return primes

print("=== CodeDroid Python Engine ===")
print("Calculating first 10 Fibonacci numbers:")
fib_nums = fibonacci(10)
print(f"Fibonacci sequence: {fib_nums}")

print("\\nFinding prime numbers up to 30:")
primes = sieve_of_eratosthenes(30)
print(f"Primes: {primes}")

print("\\nExecution finished successfully!")
`,
  },
  {
    id: '2',
    name: 'index.js',
    path: 'index.js',
    type: 'file',
    language: 'javascript',
    content: `// CodeDroid - JavaScript & Node.js on Android
// Data pipeline and async simulation

const developers = [
  { name: 'Ada Lovelace', language: 'Assembly / Analytical', year: 1843 },
  { name: 'Guido van Rossum', language: 'Python', year: 1991 },
  { name: 'Brendan Eich', language: 'JavaScript', year: 1995 },
  { name: 'Bjarne Stroustrup', language: 'C++', year: 1985 },
  { name: 'Graydon Hoare', language: 'Rust', year: 2010 }
];

console.log("=== CodeDroid JS Runtime ===");
console.log("Loaded " + developers.length + " developer milestones.");

// Data transformation
const modernLangs = developers
  .filter(d => d.year > 1980)
  .map(d => d.language + " (" + d.name + ")");

console.log("Languages after 1980:");
modernLangs.forEach((lang, idx) => {
  console.log("  " + (idx + 1) + ". " + lang);
});

console.log("Total experience timeline computed successfully!");
`,
  },
  {
    id: '3',
    name: 'kernel.c',
    path: 'kernel.c',
    type: 'file',
    language: 'c',
    content: `/* CodeDroid - C Language on Android */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char name[32];
    int memory_mb;
    int priority;
} Process;

void print_process(const Process* proc) {
    printf("Process: %s | Memory: %d MB | Priority: %d\\n",
           proc->name, proc->memory_mb, proc->priority);
}

int main() {
    printf("=== CodeDroid C Native Runtime ===\\n");
    printf("Initializing microkernel process table...\\n");

    Process init_proc;
    strncpy(init_proc.name, "system_init", 32);
    init_proc.memory_mb = 64;
    init_proc.priority = 1;

    print_process(&init_proc);

    int sum = 0;
    for (int i = 1; i <= 5; i++) {
        sum += i * i;
    }
    printf("Sum of squares (1..5): %d\\n", sum);
    printf("C program executed cleanly (exit code 0).\\n");

    return 0;
}
`,
  },
  {
    id: '4',
    name: 'Program.cs',
    path: 'Program.cs',
    type: 'file',
    language: 'csharp',
    content: `// CodeDroid - C# on Android (.NET Runtime)
using System;
using System.Collections.Generic;
using System.Linq;

namespace CodeDroidApp
{
    public record Device(string Name, string OS, int StorageGB);

    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== CodeDroid C# (.NET) Engine ===");

            var devices = new List<Device>
            {
                new("Pixel 9 Pro", "Android 15", 256),
                new("Galaxy S24", "Android 14", 512),
                new("CodeDroid Terminal", "Android/Linux", 128)
            };

            Console.WriteLine($"Discovered {devices.Count} high-performance mobile devices:");

            var highCapacity = devices.Where(d => d.StorageGB >= 256);
            foreach (var dev in highCapacity)
            {
                Console.WriteLine($" -> {dev.Name} [{dev.OS}] ({dev.StorageGB} GB)");
            }

            Console.WriteLine("C# Program finished with 0 errors.");
        }
    }
}
`,
  },
  {
    id: '5',
    name: 'main.swift',
    path: 'main.swift',
    type: 'file',
    language: 'swift',
    content: `// CodeDroid - Swift Language on Android
import Foundation

struct Repository {
    let name: String
    let language: String
    let stars: Int
}

print("=== CodeDroid Swift Runtime ===")

let repos = [
    Repository(name: "swift-mobile-ide", language: "Swift", stars: 4200),
    Repository(name: "codedroid-core", language: "Rust", stars: 8900),
    Repository(name: "asm-emulator", language: "C++", stars: 3100)
]

print("Top Swift & Systems Repositories:")
for repo in repos {
    print("⭐️ \(repo.stars) - \(repo.name) [\(repo.language)]")
}

let totalStars = repos.reduce(0) { $0 + $1.stars }
print("Combined Star Count: \(totalStars)")
print("Swift execution completed successfully.")
`,
  },
  {
    id: '6',
    name: 'main.rs',
    path: 'main.rs',
    type: 'file',
    language: 'rust',
    content: `// CodeDroid - Rust Language on Android (Cargo / rustc)
#[derive(Debug)]
struct Task {
    id: u32,
    title: &'static str,
    completed: bool,
}

fn main() {
    println!("=== CodeDroid Rust 1.78 Runtime ===");

    let mut tasks = vec![
        Task { id: 1, title: "Initialize Touch Keyboard", completed: true },
        Task { id: 2, title: "Load Syntax Highlighting for Rust/C#/Swift", completed: true },
        Task { id: 3, title: "Compile ARM / POSIX Terminal", completed: true },
    ];

    println!("Registered {} memory-safe tasks:", tasks.len());
    for task in &tasks {
        let status = if task.completed { "✓" } else { "⏳" };
        println!(" [{}] #{}: {}", status, task.id, task.title);
    }

    let all_done = tasks.iter().all(|t| t.completed);
    println!("Zero memory safety violations detected. All done: {}", all_done);
}
`,
  },
  {
    id: '7',
    name: 'server.go',
    path: 'server.go',
    type: 'file',
    language: 'go',
    content: `// CodeDroid - Go (Golang) on Android
package main

import (
	"fmt"
	"time"
)

type Worker struct {
	ID    int
	Title string
}

func main() {
	fmt.Println("=== CodeDroid Go 1.22 Runtime ===")
	fmt.Println("Launching goroutine pipeline...")

	workers := []Worker{
		{ID: 1, Title: "Code Parser"},
		{ID: 2, Title: "Git Engine"},
		{ID: 3, Title: "POSIX Terminal"},
	}

	for _, w := range workers {
		fmt.Printf("Worker #%d: [%s] spawned at %v\\n", w.ID, w.Title, time.Now().Format("15:04:05"))
	}

	fmt.Println("Go channel synchronization complete.")
}
`,
  },
  {
    id: '8',
    name: 'App.kt',
    path: 'App.kt',
    type: 'file',
    language: 'kotlin',
    content: `// CodeDroid - Kotlin for Android
package dev.codedroid

data class AndroidSnippet(val language: String, val lines: Int, val isMobileOptimized: Boolean)

fun main() {
    println("=== CodeDroid Kotlin Engine ===")
    println("Booting Android Native Kotlin environment...")

    val snippets = listOf(
        AndroidSnippet("Kotlin", 45, true),
        AndroidSnippet("Rust", 60, true),
        AndroidSnippet("Swift", 35, true),
        AndroidSnippet("C#", 50, true)
    )

    val optimizedCount = snippets.filter { it.isMobileOptimized }.count()
    println("Found $optimizedCount mobile-optimized language snippets.")

    snippets.forEach {
        println("  -> \${it.language}: \${it.lines} lines of code")
    }

    println("Kotlin compilation finished with code 0.")
}
`,
  },
  {
    id: '9',
    name: 'algo.cpp',
    path: 'algo.cpp',
    type: 'file',
    language: 'cpp',
    content: `// CodeDroid - C++ on Android
// Binary Search & Vector Operations

#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int binarySearch(const vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

int main() {
    cout << "=== CodeDroid C++ Engine ===" << endl;
    cout << "Running Binary Search on sorted array..." << endl;
    
    vector<int> numbers = {3, 9, 14, 21, 28, 35, 42, 59, 78, 99};
    int target = 42;
    
    int index = binarySearch(numbers, target);
    if (index != -1) {
        cout << "Found target element " << target << " at index " << index << endl;
    } else {
        cout << "Element not found" << endl;
    }
    
    cout << "Binary search completed successfully with return code 0." << endl;
    return 0;
}
`,
  },
  {
    id: '10',
    name: 'addition_alp.asm',
    path: 'addition_alp.asm',
    type: 'file',
    language: 'alp',
    content: `; CodeDroid - 8086 Assembly Language Program (ALP)
; Program: Addition of two 16-bit numbers with Carry flag handling

DATA SEGMENT
    NUM1  DW 1234H     ; First 16-bit number
    NUM2  DW 5678H     ; Second 16-bit number
    SUM   DW ?         ; Memory location for SUM
    CARRY DB 00H       ; Memory location for CARRY (0 or 1)
DATA ENDS

CODE SEGMENT
    ASSUME CS:CODE, DS:DATA
START:
    MOV AX, 1234H      ; Load NUM1 into Accumulator AX
    MOV BX, 5678H      ; Load NUM2 into Register BX
    ADD AX, BX         ; Add BX to AX: AX = 1234H + 5678H = 68ACH
    JNC SKIP_CARRY     ; If No Carry (CF=0), jump to SKIP_CARRY
    
    INC CARRY          ; Increment carry if overflow occurred
    
SKIP_CARRY:
    MOV CX, AX         ; Store result in CX for register view
    HLT                ; Halt processor execution
CODE ENDS
END START
`,
  },
  {
    id: '11',
    name: 'README.md',
    path: 'README.md',
    type: 'file',
    language: 'markdown',
    content: `# CodeDroid IDE - Multi-Language Coding on Android 🚀

An all-in-one mobile-first alternative to VS Code designed to make coding on an Android phone smooth, fast, and ergonomic.

## 🌐 Supported Languages:
- **C** (\`.c\`, \`.h\`)
- **C#** (\`.cs\`)
- **Swift** (\`.swift\`)
- **Rust** (\`.rs\`)
- **Go** (\`.go\`)
- **Kotlin** (\`.kt\`)
- **Python** (\`.py\`)
- **JavaScript & TypeScript** (\`.js\`, \`.ts\`)
- **C++** (\`.cpp\`)
- **ALP** (8086 / x86 Assembly \`.asm\`, \`.alp\`)
- **Markdown & JSON** (\`.md\`, \`.json\`)
`,
  },
];

export function getLanguageFromFilename(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'py':
      return 'python';
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return 'javascript';
    case 'c':
      return 'c';
    case 'cpp':
    case 'cc':
    case 'cxx':
    case 'hpp':
      return 'cpp';
    case 'h':
      return 'c';
    case 'cs':
      return 'csharp';
    case 'swift':
      return 'swift';
    case 'rs':
      return 'rust';
    case 'go':
      return 'go';
    case 'kt':
    case 'kts':
      return 'kotlin';
    case 'java':
      return 'java';
    case 'asm':
    case 'alp':
    case 's':
      return 'alp';
    case 'md':
      return 'markdown';
    case 'json':
      return 'json';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    default:
      return 'text';
  }
}
