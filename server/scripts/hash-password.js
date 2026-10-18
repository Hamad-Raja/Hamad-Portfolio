import bcrypt from 'bcryptjs';
import { createInterface } from 'node:readline/promises';
import { Writable } from 'node:stream';
if (!process.stdin.isTTY) {
  console.error('Run this command in an interactive terminal. Password input is hidden.');
  process.exitCode=1;
} else {
  let hidden=true;
  const output=new Writable({ write(chunk,encoding,callback) { if(!hidden) process.stdout.write(chunk);callback(); } });
  const reader=createInterface({input:process.stdin,output,terminal:true});
  try {
    process.stdout.write('Admin password (hidden; 12+ characters, at most 72 UTF-8 bytes): ');
    const password=await reader.question('');
    reader.close();hidden=false;process.stdout.write('\n');
    if(password.length<12 || Buffer.byteLength(password,'utf8')>72) throw new Error('Choose a password with at least 12 characters and at most 72 UTF-8 bytes.');
    console.log(`ADMIN_PASSWORD_HASH='${await bcrypt.hash(password,12)}'`);
  } catch(error) { reader.close();console.error(error.message);process.exitCode=1; }
}
