// workplan-extract.mjs — parse a sub-project workplan so each Tier-1 assertion can cite its
// source section (workplan §3 functions / §5 design / §8 conformance, etc.). Used for the
// traceability report; the harness never guesses a requirement, it reads it from the workplan.
import fs from 'node:fs';

export function extractSections(mdPath){
  if (!mdPath || !fs.existsSync(mdPath)) return null;
  const txt = fs.readFileSync(mdPath, 'utf8');
  const out = {};
  const re = /^##\s+(\d+(?:\.\d+)*)\s+(.*)$/gm;
  let m;
  while ((m = re.exec(txt))) out[m[1]] = { title: m[2].trim(), line: m.index };
  return out;
}

export function hasSection(mdPath, num){
  const s = extractSections(mdPath);
  return !!(s && s[num]);
}
