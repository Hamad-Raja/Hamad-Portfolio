import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'node:crypto';
import { createApp } from '../src/app.js';
import { authConfig, allowedOrigins } from '../src/config.js';
import Project from '../src/models/Project.js';
import Message from '../src/models/Message.js';
import { contactPayload, projectPayload } from '../src/validation.js';
const password = 'test-password-only';
const id = '0123456789abcdef01234567';
const project = { title: 'Test project', description: 'A database-backed test project.', tech: ['React'], liveUrl: 'https://example.test/demo' };
let server, origin, token;
const projects = new Map();
const messages = [];
const originals = {};
function mock(model, key, value) { originals[`${model.modelName}.${key}`] = model[key]; model[key] = value; }
const chain = value => ({ sort() { return this; }, limit() { return this; }, lean: async () => value });
before(async () => {
  Object.assign(process.env, { NODE_ENV: 'test', ADMIN_EMAIL: 'admin@example.test', ADMIN_PASSWORD_HASH: await bcrypt.hash(password, 10), JWT_SECRET: randomBytes(32).toString('hex'), CLIENT_ORIGIN: 'https://portfolio.example.test' });
  delete process.env.TRUST_PROXY_HOPS;
  mock(Project,'find', query => chain([...projects.values()].filter(p => !query.featured || p.featured)));
  mock(Project,'findById', key => ({ lean: async () => projects.get(key) || null }));
  mock(Project,'create', async payload => { const item = { ...payload, _id: id }; projects.set(id,item); return item; });
  mock(Project,'findByIdAndUpdate', async (key, update, options) => { assert.equal(options.runValidators,true); if (!projects.has(key)) return null; const item = { ...projects.get(key), ...update.$set }; projects.set(key,item); return item; });
  mock(Project,'findByIdAndDelete', async key => { const item = projects.get(key); projects.delete(key); return item; });
  mock(Message,'create', async payload => { messages.push(payload); return { _id: id }; });
  mock(Message,'find', () => chain(messages));
  mock(Message,'findByIdAndDelete', async () => messages.pop() || null);
  server = createApp().listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  await new Promise(resolve => server.close(resolve));
  for (const model of [Project,Message]) for (const key of Object.keys(originals).filter(k => k.startsWith(model.modelName+'.'))) model[key.split('.')[1]] = originals[key];
});
async function request(path, { method = 'GET', body, auth = false, headers = {} } = {}) {
  const response = await fetch(origin + path, { method, headers: { ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(auth ? { Authorization: `Bearer ${token}` } : {}), ...headers }, body: body === undefined ? undefined : JSON.stringify(body) });
  return { status: response.status, headers: response.headers, data: await response.json() };
}
test('validation rejects insecure configuration and malformed payloads', () => {
  assert.throws(() => authConfig({ ADMIN_EMAIL:'admin@example.test', ADMIN_PASSWORD:password, JWT_SECRET:'x'.repeat(32) }));
  assert.throws(() => allowedOrigins({ NODE_ENV:'production', CLIENT_ORIGIN:'*' }));
  assert.throws(() => allowedOrigins({ NODE_ENV:'production', CLIENT_ORIGIN:'http://example.test' }));
  assert.throws(() => contactPayload({ name: {}, email:'a@example.test', message:'message text' }));
  assert.throws(() => projectPayload({ ...project, $set: { featured:true } }));
  assert.throws(() => projectPayload({ ...project, liveUrl:'javascript:alert(1)' }));
  assert.throws(() => projectPayload({ ...project, order:'1' }));
});
test('CORS permits only configured browser origins', async () => {
  assert.equal((await request('/health',{headers:{Origin:'https://portfolio.example.test'}})).headers.get('access-control-allow-origin'),'https://portfolio.example.test');
  assert.equal((await request('/health',{headers:{Origin:'https://untrusted.example.test'}})).headers.get('access-control-allow-origin'),null);
});
test('admin login checks bcrypt and returns generic failures', async () => {
  for (const body of [{email:'wrong@example.test',password}, {email:process.env.ADMIN_EMAIL,password:'wrong'}, {email:{$ne:null},password}]) {
    const result = await request('/api/auth/login',{method:'POST',body});
    assert.equal(result.status,401); assert.deepEqual(result.data,{message:'Invalid credentials'});
  }
  const login = await request('/api/auth/login',{method:'POST',body:{email:process.env.ADMIN_EMAIL,password}});
  assert.equal(login.status,200); token=login.data.token;
  const claims=jwt.verify(token,process.env.JWT_SECRET);
  assert.equal(claims.role,'admin'); assert.equal(claims.exp-claims.iat,3600);
  assert.equal(login.headers.get('cache-control'),'no-store');
});
test('project CRUD remains protected and supports the admin workflow', async () => {
  assert.equal((await request('/api/projects',{method:'POST',body:project})).status,401);
  assert.equal((await request('/api/messages')).status,401);
  const user=jwt.sign({role:'viewer',email:process.env.ADMIN_EMAIL},process.env.JWT_SECRET);
  assert.equal((await request('/api/projects',{method:'POST',body:project,headers:{Authorization:`Bearer ${user}`}})).status,401);
  const expired=jwt.sign({role:'admin',email:process.env.ADMIN_EMAIL},process.env.JWT_SECRET,{expiresIn:-1});
  assert.equal((await request('/api/messages',{headers:{Authorization:`Bearer ${expired}`}})).status,401);
  assert.equal((await request('/api/projects',{method:'POST',body:project,auth:true})).status,201);
  assert.equal((await request('/api/projects')).data.length,1);
  assert.equal((await request(`/api/projects/${id}`)).data.title,project.title);
  assert.equal((await request(`/api/projects/${id}`,{method:'PUT',auth:true,body:{...project,featured:true}})).data.featured,true);
  assert.equal((await request('/api/projects?featured=true')).data.length,1);
  assert.equal((await request('/api/projects/not-an-id')).status,400);
  assert.equal((await request('/api/messages/not-an-id',{method:'DELETE',auth:true})).status,400);
  assert.equal((await request(`/api/projects/${id}`,{method:'DELETE',auth:true})).status,200);
  assert.equal((await request(`/api/projects/${id}`)).status,404);
});
test('contact stores validated messages, ignores honeypot and limits spam', async () => {
  assert.equal((await request('/api/contact',{method:'POST',body:{name:' ',email:'bad',message:'x'}})).status,400);
  assert.equal((await request('/api/contact',{method:'POST',body:{name:'Visitor',email:'visitor@example.test',message:'Please discuss a web project.'}})).status,201);
  assert.equal(messages.length,1);
  assert.equal((await request('/api/messages',{auth:true})).data.length,1);
  assert.equal((await request('/api/contact',{method:'POST',body:{website:'spam'}})).status,201);
  assert.equal(messages.length,1);
  assert.equal((await request(`/api/messages/${id}`,{method:'DELETE',auth:true})).status,200);
  for (let i=0;i<3;i++) await request('/api/contact',{method:'POST',body:{}});
  assert.equal((await request('/api/contact',{method:'POST',body:{}})).status,429);
});
test('malformed JSON, oversized requests and database errors are safe', async () => {
  const malformed=await fetch(origin+'/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:'{'});
  assert.equal(malformed.status,400);
  assert.equal((await request('/api/contact',{method:'POST',body:{message:'x'.repeat(40000)}})).status,413);
  const saved=Project.find;
  Project.find=() => { throw new Error('private database details'); };
  const response=await request('/api/projects');
  Project.find=saved;
  assert.equal(response.status,500); assert.ok(!JSON.stringify(response.data).includes('private'));
});
test('login attempts are rate limited', async () => {
  let result;
  for (let i=0;i<8;i++) result=await request('/api/auth/login',{method:'POST',body:{email:'wrong@example.test',password:'bad'}});
  assert.equal(result.status,429);
});
