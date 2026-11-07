// Temporary probe: recover evidence for I073-I092 from git history and the workplan.
// Read-only: nothing is written outside stdout.
import { execSync } from 'node:child_process';
import fs from 'node:fs';

const ROOT = 'c:/Users/qinghua.song/DSAI/workbuddy';
const LOG = 'sub/log/issue_log.md';
const WP = 'sub/workplan/Sub-Dashboard-Workplan.md';
const run = cmd => execSync(cmd, { cwd: ROOT, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });

const ids = [];
for (let n = 73; n <= 92; n++) ids.push(`I${String(n).padStart(3, '0')}`);

const logCommits = run(`git log --format=%H|%ad|%s --date=short -- ${LOG}`).trim().split('\n').filter(Boolean).map(line => {
  const [sha, date, ...rest] = line.split('|');
  return { sha, date, subject: rest.join('|') };
});
console.log(`commits touching ${LOG}: ${logCommits.length}`);

const found = new Map();
for (const id of ids) found.set(id, { rows: [], mentions: [] });
for (const commit of [...logCommits].reverse()) {
  let text;
  try { text = run(`git show ${commit.sha}:${LOG}`); } catch { continue; }
  const lines = text.split(/\r?\n/);
  for (const id of ids) {
    const entry = found.get(id);
    const rowLine = lines.find(line => line.startsWith(`| ${id} |`));
    if (rowLine && !entry.rows.some(item => item.sha === commit.sha)) entry.rows.push({ ...commit, text: rowLine });
    const mentionLines = lines.filter(line => line.includes(id) && !line.startsWith(`| ${id} |`));
    if (mentionLines.length && !entry.mentions.some(item => item.sha === commit.sha)) entry.mentions.push({ ...commit, text: mentionLines[0] });
  }
}

const wpNow = fs.readFileSync(`${ROOT}/${WP}`, 'utf8').split(/\r?\n/);
const wpCommits = run(`git log --format=%H|%ad|%s --date=short -- ${WP}`).trim().split('\n').filter(Boolean);
console.log(`commits touching the workplan: ${wpCommits.length}`);

const cellsOf = line => {
  const cells = line.replace(/\\\|/g, '\u0001').split('|').slice(1, -1).map(c => c.trim().replace(/\u0001/g, '\\|'));
  return cells;
};
for (const id of ids) {
  const entry = found.get(id);
  const wpLines = wpNow.filter(line => line.includes(id));
  console.log(`\n### ${id} — rows in history: ${entry.rows.length} | other mentions: ${entry.mentions.length} | workplan lines now: ${wpLines.length}`);
  if (entry.rows.length) {
    const oldest = entry.rows[0];
    const cells = cellsOf(oldest.text);
    console.log(`  ROW (oldest ${oldest.date}, ${oldest.sha.slice(0, 8)}) cells=${cells.length}`);
    console.log(`   id/date/phase/severity/title: ${cells.slice(0, 5).map(c => c.slice(0, 90)).join(' ~~ ')}`);
    if (cells[6]) console.log(`   status: ${cells[6].slice(0, 40)} | tasks: ${(cells[7] || '').slice(0, 40)}`);
    if (cells[5]) console.log(`   description: ${cells[5].slice(0, 240)}`);
    if (cells[8]) console.log(`   resolution: ${cells[8].slice(0, 240)}`);
    if (entry.rows.length > 1) console.log(`   last seen in row form: ${entry.rows[entry.rows.length - 1].date} (${entry.rows[entry.rows.length - 1].sha.slice(0, 8)})`);
  } else if (entry.mentions.length) {
    const first = entry.mentions[0];
    console.log(`  no row ever; first mention ${first.date} (${first.sha.slice(0, 8)}): ${first.text.slice(0, 300)}`);
  } else {
    console.log('  no row and no mention in any commit of the log');
  }
  for (const line of wpLines.slice(0, 2)) console.log(`   workplan: ${line.slice(0, 260)}`);
}
