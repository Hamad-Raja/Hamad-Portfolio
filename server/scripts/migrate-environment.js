import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
export async function migrateEnvironment(source) {
  const env=dotenv.parse(source);
  if(env.ADMIN_PASSWORD_HASH) throw new Error('ADMIN_PASSWORD_HASH already exists; no changes made.');
  if(!env.ADMIN_PASSWORD) throw new Error('No existing ADMIN_PASSWORD found; no changes made.');
  if(Buffer.byteLength(env.ADMIN_PASSWORD,'utf8')>72) throw new Error('Password exceeds bcrypt 72-byte limit; migrate manually.');
  if((source.match(/^(?:export\s+)?ADMIN_PASSWORD\s*=/gm)||[]).length!==1) throw new Error('Expected one ADMIN_PASSWORD entry; no changes made.');
  const legacyHash=/^\$2[aby]\$(?:1[0-5])\$[./A-Za-z0-9]{53}$/.test(env.ADMIN_PASSWORD);
  if(env.ADMIN_PASSWORD.startsWith('$2')&&!legacyHash) throw new Error('Unsupported bcrypt hash; no changes made.');
  const hash=legacyHash?env.ADMIN_PASSWORD:await bcrypt.hash(env.ADMIN_PASSWORD,12);
  const cleaned=source.replace(/^(?:export\s+)?ADMIN_PASSWORD_HASH\s*=.*(?:\r?\n|$)/gm,'');
  return cleaned.replace(/^(?:export\s+)?ADMIN_PASSWORD\s*=.*$/m,`ADMIN_PASSWORD_HASH='${hash}'`);
}
