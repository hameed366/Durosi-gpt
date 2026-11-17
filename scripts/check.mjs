import fs from 'node:fs';
import assert from 'node:assert/strict';
const dir = new URL('../www/', import.meta.url);
const read = f => fs.readFileSync(new URL(f, dir), 'utf8');
const manifest = JSON.parse(read('manifest.json'));
const content = JSON.parse(read('content.json'));
const html = read('index.html');
const sw = read('sw.js');
for (const f of ['index.html','privacy.html','manifest.json','sw.js','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png','content.json']) {
  assert.ok(fs.statSync(new URL(f,dir)).size > 0, `${f} missing or empty`);
}
assert.equal(manifest.display, 'standalone');
assert.ok(manifest.icons.length >= 2);
assert.ok(html.includes("const KEY='durusi_v1'"), 'existing user storage key changed');
assert.ok(html.includes('data-skin="gold"'), 'gold skin missing');
assert.ok(html.includes('data-skin="ocean"'), 'ocean skin missing');
assert.ok(html.includes('data-skin="aurora"'), 'aurora skin missing');
assert.ok(html.includes('data-skin="royal"'), 'royal skin missing');
assert.ok(html.includes('data-skin="sunset"'), 'sunset skin missing');
assert.ok(content.custom && content.teachers, 'content schema incomplete');
assert.ok(sw.includes('content.json'), 'offline lesson cache missing');
assert.ok(html.includes('https://hameed366.github.io/Durosi-gpt/'), 'GitHub Pages URL not configured');
assert.ok(!html.includes('USERNAME.github.io'), 'placeholder URL still present');
assert.ok(!html.includes("SITE+'player.html'"), 'missing player.html referenced');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
for (const [,code] of scripts) { if (code.trim()) new (await import('node:vm')).Script(code); }
new (await import('node:vm')).Script(sw);
console.log(`PASS: ${scripts.length} inline scripts, PWA assets, 5 themes, storage compatibility, offline content`);
console.warn('NOTICE: teacher PIN is client-side; do not use as secure authentication.');
