import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';

const readJson = async (path) =>
  JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'));

const pkg = await readJson('package.json');
const lock = await readJson('package-lock.json');
if (pkg.name !== '@wasnaker/module-equipment' || lock.name !== pkg.name) {
  throw new Error('Package identity is inconsistent');
}
if (lock.version !== pkg.version) {
  throw new Error('package-lock version does not match package.json');
}

const requiredExports = [
  './api',
  './api/manifest',
  './api/migrations',
  './api/entities',
  './api/definition',
  './api/seeds',
  './web',
  './manifest',
  './locales/en',
  './locales/id',
  './locales/ja',
  './locales/ko',
  './locales/zh',
];
for (const key of requiredExports) {
  if (!pkg.exports[key]) throw new Error(`Missing package export: ${key}`);
}

const exportTargets = Object.values(pkg.exports).flatMap((entry) =>
  typeof entry === 'string'
    ? [entry]
    : Object.values(entry).filter((value) => typeof value === 'string'),
);
for (const target of exportTargets) {
  if (target.startsWith('./api/dist/')) continue;
  await access(new URL(`../${target.slice(2)}`, import.meta.url), constants.R_OK);
}

for (const path of [
  'api/dist/index.js',
  'api/dist/index.d.ts',
  'api/dist/equipment/equipment.manifest.js',
  'api/dist/equipment/equipment.entities.js',
  'api/dist/equipment/equipment.definition.js',
  'api/dist/equipment/equipment.seeds.js',
  'api/dist/equipment/database/migrations/index.js',
  'api/dist/equipment/database/migrations/1793710214000000000-ConvertProvinceRegencyToEquipmentGroups.js',
]) {
  await access(new URL(`../${path}`, import.meta.url), constants.R_OK);
}

const webTsconfig = await readFile(new URL('../web/tsconfig.check.json', import.meta.url), 'utf8');
if (!webTsconfig.includes('src/modules/equipment/**/*.ts') ||
    !webTsconfig.includes('src/modules/equipment/**/*.tsx') ||
    webTsconfig.includes('src/modules/region/')) {
  throw new Error('Frontend typecheck config does not target the Equipment module');
}

const apiGuide = await readFile(new URL('../api/INTEGRATION.md', import.meta.url), 'utf8');
if (/copy source files|MySQL|Mongoose|document database/i.test(apiGuide)) {
  throw new Error('API integration guide contains legacy copy/database instructions');
}
console.log('Equipment package identity, exports, frontend paths, and API build artifacts verified.');
