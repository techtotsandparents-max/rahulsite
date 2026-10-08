import { access, cp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, '.next/standalone');

await access(path.join(output, 'server.js'));
await cp(path.join(root, 'public'), path.join(output, 'public'), { recursive: true });
await cp(path.join(root, '.next/static'), path.join(output, '.next/static'), { recursive: true });
await cp(path.join(root, 'data'), path.join(output, 'data'), { recursive: true });

for (const entry of await readdir(output)) {
  if (entry === '.env' || entry.startsWith('.env.')) {
    await rm(path.join(output, entry), { force: true });
  }
}

const packagePath = path.join(output, 'package.json');
const manifest = JSON.parse(await readFile(packagePath, 'utf8'));
manifest.scripts = { start: 'node server.js' };
delete manifest.devDependencies;
await writeFile(packagePath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log('Deployment package ready: .next/standalone');
console.log('Start with node server.js; configure secrets in App Service, not in the package.');