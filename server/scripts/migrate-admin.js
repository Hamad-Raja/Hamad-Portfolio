import { readFile, writeFile, chmod } from 'node:fs/promises';
import { migrateEnvironment } from './migrate-environment.js';
const path=new URL('../.env',import.meta.url);
try {
  const updated=await migrateEnvironment(await readFile(path,'utf8'));
  await writeFile(path,updated,{mode:0o600});
  await chmod(path,0o600);
  console.log('Migrated the existing password to ADMIN_PASSWORD_HASH. No database changes.');
} catch(error) { console.error(error.code?'Unable to read/write server/.env':error.message);process.exitCode=1; }
