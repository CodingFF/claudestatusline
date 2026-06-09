// Minimal Claude Code statusline: advisor state | context % | usage until reset
// Reads session JSON from stdin (see https://code.claude.com/docs/en/statusline)
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');

let raw = '';
process.stdin.on('data', (d) => (raw += d));
process.stdin.on('end', () => {
  let j = {};
  try { j = JSON.parse(raw.replace(/^\uFEFF/, '')); } catch {}

  const color = (c, s) => `\x1b[${c}m${s}\x1b[0m`;
  const dim = (s) => color(2, s);
  const pctColor = (p) => (p < 60 ? 32 : p < 85 ? 33 : 31); // green/yellow/red

  // Advisor: /advisor persists "advisorModel" in ~/.claude/settings.json (absent = off)
  let advisorModel = null;
  try {
    const s = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.claude', 'settings.json'), 'utf8'));
    if (s.advisorModel) advisorModel = s.advisorModel;
  } catch {}
  const parts = [advisorModel ? color(32, 'advisor on') : dim('advisor off')];

  // Context window usage
  const ctxPct = j.context_window && j.context_window.used_percentage;
  if (ctxPct != null) {
    const p = Math.round(ctxPct);
    parts.push(color(pctColor(p), `ctx ${p}%`));
  } else {
    parts.push(dim('context -'));
  }

  // Rate limits (only present for Pro/Max after first API response)
  const rl = j.rate_limits || {};
  if (rl.five_hour && rl.five_hour.used_percentage != null) {
    const p = Math.round(rl.five_hour.used_percentage);
    let reset = '';
    if (rl.five_hour.resets_at) {
      const d = new Date(rl.five_hour.resets_at * 1000);
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      reset = dim(` resets ${hh}:${mm}`);
    }
    parts.push(color(pctColor(p), `5h ${p}%`) + reset);
  }
  if (rl.seven_day && rl.seven_day.used_percentage != null) {
    parts.push(dim(`weekly ${Math.round(rl.seven_day.used_percentage)}%`));
  }

  process.stdout.write(parts.join(dim(' | ')));
});
