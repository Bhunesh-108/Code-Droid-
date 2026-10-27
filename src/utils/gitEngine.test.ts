import test from 'node:test';
import assert from 'node:assert/strict';
import { GitEngine } from './gitEngine';

test('GitEngine: Detect modified and untracked files', () => {
  const initialFiles = {
    'main.py': 'print("hello")',
    'index.js': 'console.log(1);',
  };

  const git = new GitEngine(initialFiles);

  const workingFiles = {
    'main.py': 'print("hello world!")', // modified
    'index.js': 'console.log(1);',       // untouched
    'new.cpp': 'int main() {}',          // untracked
  };

  const status = git.getStatus(workingFiles);
  assert.deepEqual(status.unstagedFiles, ['main.py']);
  assert.deepEqual(status.untrackedFiles, ['new.cpp']);
});

test('GitEngine: Stage and commit workflow', () => {
  const initialFiles = {
    'algo.cpp': '#include <iostream>',
  };

  const git = new GitEngine(initialFiles);
  const workingFiles = {
    'algo.cpp': '#include <iostream>\nusing namespace std;',
  };

  git.stageFile('algo.cpp');
  let status = git.getStatus(workingFiles);
  assert.deepEqual(status.stagedFiles, ['algo.cpp']);
  assert.deepEqual(status.unstagedFiles, []);

  const commit = git.commit('Update namespace', workingFiles);
  assert.ok(commit);
  assert.equal(commit.message, 'Update namespace');

  status = git.getStatus(workingFiles);
  assert.equal(status.stagedFiles.length, 0);
  assert.equal(status.unstagedFiles.length, 0);
});

test('GitEngine: Branch creation and switching', () => {
  const git = new GitEngine();
  assert.equal(git.createBranch('feature/alp'), true);
  assert.equal(git.checkoutBranch('feature/alp'), true);
  assert.equal(git.getStatus({}).branch, 'feature/alp');
});
