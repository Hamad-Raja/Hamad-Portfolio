import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { migrateEnvironment } from '../scripts/migrate-environment.js';
test('migration preserves the existing password and other configuration',async()=>{
  const migrated=await migrateEnvironment("ADMIN_PASSWORD='existing-test-password'\nADMIN_EMAIL=admin@example.test\nADMIN_PASSWORD_HASH=\nMONGO_URI=not-a-real-database\n");
  const env=dotenv.parse(migrated);
  assert.ok(await bcrypt.compare('existing-test-password',env.ADMIN_PASSWORD_HASH));
  assert.equal(env.ADMIN_PASSWORD,undefined);
  assert.equal(env.MONGO_URI,'not-a-real-database');
  assert.equal(env.ADMIN_EMAIL,'admin@example.test');
});
test('migration preserves an existing bcrypt hash without rehashing',async()=>{
  const hash=await bcrypt.hash('existing-test-password',10);
  assert.equal(dotenv.parse(await migrateEnvironment(`ADMIN_PASSWORD='${hash}'`)).ADMIN_PASSWORD_HASH,hash);
});
test('migration refuses ambiguous inputs and existing destination hashes',async()=>{
  for(const source of ['ADMIN_PASSWORD=a\nADMIN_PASSWORD=b','ADMIN_PASSWORD_HASH=existing','ADMIN_EMAIL=admin@example.test','ADMIN_PASSWORD='+ 'a'.repeat(73),'ADMIN_PASSWORD=$2bad']) await assert.rejects(()=>migrateEnvironment(source));
});
