import { readdir, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const target = process.argv[2];
if (!['client','server'].includes(target)) throw new Error('Choose client or server');
const require = createRequire(path.join(root, 'client/package.json'));
const { parse } = require('@babel/parser');
async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.filter(e => e.name !== 'node_modules' && e.name !== 'dist').map(e => e.isDirectory() ? files(path.join(dir,e.name)) : path.join(dir,e.name)))).flat();
}
let count = 0;
for (const file of await files(path.join(root,target))) {
  if (!/\.(?:js|jsx|mjs)$/.test(file)) continue;
  const source = await readFile(file,'utf8');
  parse(source, { sourceType: 'module', plugins: ['jsx'] });
  if (target === 'server') {
    const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (result.status) throw new Error(result.stderr);
  }
  if (/href=["']#["']|javascript:/i.test(source) && !file.includes(`${path.sep}test${path.sep}`)) throw new Error(`Unsafe placeholder link in ${file}`);
  count++;
}
console.log(`Syntax and link checks passed for ${count} ${target} files. This is not a full ESLint rule set.`);
