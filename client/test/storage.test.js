import test from 'node:test';
import assert from 'node:assert/strict';
const values=new Map();
let persistentRemoved=false;
globalThis.localStorage={removeItem(){persistentRemoved=true;}};
globalThis.sessionStorage={getItem:key=>values.get(key),setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};
const {getToken,setToken,clearToken}=await import('../src/lib/storage.js');
const token=exp=>`header.${Buffer.from(JSON.stringify({exp})).toString('base64url')}.signature`;
test('previous persistent tokens are removed during migration',()=>assert.equal(persistentRemoved,true));
test('tab session stores valid tokens and logout clears them',()=>{
  const valid=token(Math.floor(Date.now()/1000)+3600);setToken(valid);assert.equal(getToken(),valid);clearToken();assert.equal(getToken(),'');
});
test('expired and malformed sessions are cleared',()=>{
  for(const value of [token(1),'invalid','header.invalid.signature']){setToken(value);assert.equal(getToken(),'');assert.equal(values.size,0);}
});
