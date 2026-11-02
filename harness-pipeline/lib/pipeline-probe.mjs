// pipeline-probe.mjs — loads a sub-project's REAL pipeline (and optional render) so the
// harness tests the shipped code, never a copy. Mirrors harness-layout's "import the real
// module" philosophy. Resolves paths against the repo root (parent of harness-pipeline),
// overridable with WORKBUDDY_ROOT for local verification.
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

export function repoRoot(here){
  return process.env.WORKBUDDY_ROOT || path.resolve(here, '..');
}

export async function loadProject(cfg, root){
  const out = { pipeline:null, pipelineErr:null, render:null, renderErr:null };
  const ps = path.resolve(root, cfg.pipelineSrc);
  if (fs.existsSync(ps)) {
    try { out.pipeline = await import(pathToFileURL(ps).href); }
    catch (e) { out.pipelineErr = 'import failed: ' + e.message; }
  } else {
    out.pipelineErr = `pipeline not found at ${ps} (run on the full repo)`;
  }
  if (cfg.renderSrc) {
    const rs = path.resolve(root, cfg.renderSrc);
    if (fs.existsSync(rs)) {
      try { out.render = await import(pathToFileURL(rs).href); }
      catch (e) { out.renderErr = 'render import failed: ' + e.message; }
    } else {
      out.renderErr = `render not found at ${rs} (design-behavior assertions become MANUAL)`;
    }
  }
  return out;
}
