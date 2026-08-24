const fs = require('fs');
const path = 'C:/Users/franklin.song/WorkBuddy/2026-08-12-16-57-22/index.html';
const html = fs.readFileSync(path, 'utf8');
// Grab the last <script> ... </script> (the main IIFE). Avoid the JSON seed script.
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m => m[1]).filter(s => s.includes('applyDataset') || s.includes('(function()'));
if (!scripts.length) { console.error('No main script found'); process.exit(2); }
const code = scripts[scripts.length - 1];
try {
  // Compile-only: does not execute, so document/window refs are fine.
  new Function(code);
  console.log('SYNTAX OK — main script length', code.length);
} catch (e) {
  console.error('SYNTAX ERROR:', e.message);
  // Try to show approx location
  const lines = code.split('\n');
  console.error('Total lines:', lines.length);
  process.exit(1);
}
