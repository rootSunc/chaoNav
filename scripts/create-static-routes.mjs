import { copyFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = join(scriptDir, '..');
const distDir = join(rootDir, 'dist');
const routes = ['projects'];

for (const route of routes) {
  const routeDir = join(distDir, route);

  mkdirSync(routeDir, { recursive: true });
  copyFileSync(join(distDir, 'index.html'), join(routeDir, 'index.html'));
}
