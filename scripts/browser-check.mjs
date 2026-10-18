// Production-bundle browser checks using Chrome DevTools Protocol; no added dependencies.
// API fixtures are isolated in memory. This does not verify a live MongoDB/deployment.
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, mkdtemp } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = path.resolve(import.meta.dirname, '..');
const configured=process.env.QA_CONFIGURED==='1';
const dist=path.resolve(root,process.env.QA_DIST||'client/dist');
const reportName=configured?'configured-browser-report.json':'browser-report.json';
const artifacts = path.join(root,'artifacts');
await mkdir(artifacts,{recursive:true});
const profile = await mkdtemp(path.join(artifacts,'chrome-profile-'));
const browserPath = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
let chrome, ws;
let mode = 'success', contactMode = 'success', contacts = 0, writes = 0, unauthorized = false;
let projects = [];
const fixture = { _id:'0123456789abcdef01234567', title:'Browser QA application', description:'A web application used to verify project presentation and interactions.', tech:['React','Express','MongoDB'], imageUrl:'/my.jpg', liveUrl:'https://example.test/demo', githubUrl:'https://github.com/example/test', featured:true };
projects=[fixture];
const json = (res,status,data) => { res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(data)); };
const server=createServer(async (req,res) => {
  try {
    const url=new URL(req.url,'http://localhost');
    let body=''; for await(const part of req) body+=part;
    if(url.pathname==='/api/projects' && req.method==='GET') {
      if(mode==='fail') return json(res,503,{message:'Unavailable'});
      if(mode==='empty') return json(res,200,[]);
      if(mode==='slow') await new Promise(resolve=>setTimeout(resolve,700));
      return json(res,200,projects);
    }
    if(url.pathname==='/api/contact') {
      contacts++; await new Promise(resolve=>setTimeout(resolve,300));
      return json(res,contactMode==='fail'?503:201,contactMode==='fail'?{message:'Unavailable'}:{ok:true});
    }
    if(url.pathname==='/api/auth/login') {
      const claims=Buffer.from(JSON.stringify({exp:Math.floor(Date.now()/1000)+3600})).toString('base64url');
      return json(res,200,{token:`test.${claims}.signature`});
    }
    if(url.pathname==='/api/messages' && unauthorized) return json(res,401,{message:'Authentication required'});
    if(url.pathname==='/api/messages' && req.method==='GET') return json(res,200,[{_id:fixture._id,name:'Test visitor',email:'visitor@example.test',message:'Browser fixture message',createdAt:new Date().toISOString()}]);
    if(url.pathname.startsWith('/api/projects') && req.method!=='GET') {
      writes++;
      if(req.method==='POST') projects.push({...JSON.parse(body),_id:'fedcba987654321001234567'});
      if(req.method==='PUT') projects=projects.map(p=>p._id===url.pathname.split('/').at(-1)?{...p,...JSON.parse(body)}:p);
      if(req.method==='DELETE') projects=projects.filter(p=>p._id!==url.pathname.split('/').at(-1));
      return json(res,200,{ok:true});
    }
    if(url.pathname.startsWith('/api/messages') && req.method==='DELETE') return json(res,200,{ok:true});
    let filename=path.resolve(dist,'.'+decodeURIComponent(url.pathname));
    if(!filename.startsWith(dist+path.sep)) filename=path.join(dist,'index.html');
    let data;
    try { data=await readFile(filename); } catch { filename=path.join(dist,'index.html');data=await readFile(filename); }
    const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.pdf':'application/pdf','.txt':'text/plain'};
    res.writeHead(200,{'Content-Type':types[path.extname(filename)]||'application/octet-stream'});res.end(data);
  } catch { json(res,500,{message:'Fixture error'}); }
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=`http://127.0.0.1:${server.address().port}`;
const pending=new Map(); let sequence=0; const exceptions=[];
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(fn,timeout=7000) { const start=Date.now();while(Date.now()-start<timeout){const result=await fn();if(result)return result;await delay(50);}throw new Error('Timed out waiting for browser state'); }
function cdp(method,params={}) { return new Promise((resolve,reject)=>{ const id=++sequence; const timeout=setTimeout(()=>{pending.delete(id);reject(new Error(`CDP timed out: ${method}`));},10000);pending.set(id,{resolve:value=>{clearTimeout(timeout);resolve(value);},reject});ws.send(JSON.stringify({id,method,params})); }); }
async function evaluate(expression) { const result=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true}); if(result.exceptionDetails)throw new Error(JSON.stringify(result.exceptionDetails));return result.result.value; }
async function navigate(route) { await cdp('Page.navigate',{url:origin+route});await until(()=>evaluate('document.readyState === "complete" && !!document.querySelector("main h1")')); }
async function waitText(text) { await until(()=>evaluate(`document.body.innerText.includes(${JSON.stringify(text)})`)); }
async function click(selector) { assert.equal(await evaluate(`!!document.querySelector(${JSON.stringify(selector)})`),true,selector);await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`); }
async function fill(selector,value) { await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});const proto=e.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value').set.call(e,${JSON.stringify(value)});e.dispatchEvent(new Event('input',{bubbles:true}));})()`); }
const report={viewports:[],flows:[],exceptions};
try {
  chrome=spawn(browserPath,['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{windowsHide:true,stdio:'ignore'});
  chrome.on('error',error=>exceptions.push(error.message));
  const port=await until(async()=>{try{return (await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0];}catch{return null;}},15000);
  const page=await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`,{method:'PUT'})).json();
  ws=new WebSocket(page.webSocketDebuggerUrl);await once(ws,'open');
  ws.addEventListener('message',event=>{const message=JSON.parse(event.data);if(message.id){const task=pending.get(message.id);if(task){pending.delete(message.id);message.error?task.reject(new Error(JSON.stringify(message.error))):task.resolve(message.result);}}else if(message.method==='Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.text);else if(message.method==='Runtime.consoleAPICalled' && message.params.type==='error')exceptions.push(JSON.stringify(message.params.args));});
  await cdp('Page.enable');await cdp('Runtime.enable');
  await cdp('Page.addScriptToEvaluateOnNewDocument',{source:'window.confirm = () => true;'});
  for(const width of [320,375,430,768,1024,1440]) {
    await cdp('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
    for(const route of ['/','/about','/services','/projects','/contact','/admin']) {
      await navigate(route); if(route==='/'||route==='/projects')await waitText(fixture.title);
      const checks=await evaluate(`({overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelectorAll('h1').length,footer:!!document.querySelector('footer'),emptyLinks:[...document.querySelectorAll('a')].filter(a=>!a.getAttribute('href')||a.getAttribute('href')==='#').length,unlabelled:[...document.querySelectorAll('input:not([tabindex="-1"]),textarea')].filter(e=>!e.labels?.length).length,brokenImages:[...document.images].filter(img=>img.complete&&!img.naturalWidth).length})`);
      assert.equal(checks.overflow,false,`Overflow ${width} ${route}`);assert.equal(checks.h1,1,`Heading ${route}`);assert.equal(checks.footer,route!=='/admin');assert.equal(checks.emptyLinks,0);assert.equal(checks.unlabelled,0);assert.equal(checks.brokenImages,0);
      report.viewports.push({width,route,...checks});
      if(!configured && route==='/' && [375,1440].includes(width)) { const screenshot=await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});await writeFile(path.join(artifacts,`home-${width}.png`),Buffer.from(screenshot.data,'base64')); }
    }
  }
  await cdp('Emulation.setDeviceMetricsOverride',{width:375,height:900,deviceScaleFactor:1,mobile:false});
  await navigate('/');
  if(configured) {
    for(const label of ['GitHub','LinkedIn','X / Twitter','Facebook','Instagram','WhatsApp','Upwork','Fiverr','Email','Phone']) assert.equal(await evaluate(`document.querySelectorAll('a[aria-label="${label}"]').length`),2,`Configured ${label} hero/footer`);
    assert.equal(await evaluate(`document.querySelector('meta[property="og:title"]').content.includes('"Safe" <profile>')`),true);
    assert.equal(await evaluate(`document.querySelector('link[rel="canonical"]').href`),'https://portfolio.example.test/');
    const sitemap=await(await fetch(origin+'/sitemap.xml')).text();assert.ok(sitemap.includes('https://portfolio.example.test/projects'));assert.ok(!sitemap.includes('/admin'));
    assert.ok((await(await fetch(origin+'/robots.txt')).text()).includes('Sitemap: https://portfolio.example.test/sitemap.xml'));
    report.flows.push('all configured social/contact actions, escaped metadata, canonical URL and sitemap');
  } else assert.equal(await evaluate(`document.querySelectorAll('a[aria-label="GitHub"],a[aria-label="LinkedIn"],a[aria-label="Email"]').length`),0,'Unconfigured social links');
  await click('button[aria-controls="mobile-navigation"]');assert.equal(await evaluate(`document.querySelector('button[aria-controls="mobile-navigation"]').getAttribute('aria-expanded')`),'true');
  await click('#mobile-navigation a[href="/projects"]');await waitText('My Work');assert.equal(await evaluate(`!!document.querySelector('#mobile-navigation')`),false);
  report.flows.push('mobile menu and navigation; social configuration verified');
  const pdf=await fetch(origin+'/CV.pdf');assert.equal(pdf.status,200);assert.equal((await pdf.text()).slice(0,5),'%PDF-');
  report.flows.push('CV served as PDF');
  mode='slow';await navigate('/projects');await waitText('Loading projects');await waitText(fixture.title);
  mode='fail';await navigate('/projects');await waitText('Projects are temporarily unavailable');
  mode='success';await click('main button');await waitText(fixture.title);
  assert.equal(await evaluate(`document.querySelector('a[aria-label="Live demo of Browser QA application"]').rel`),'noopener noreferrer');
  mode='empty';await navigate('/projects');await waitText('There are no published projects');
  mode='success';projects=[{...fixture,liveUrl:'javascript:alert(1)',githubUrl:''}];await navigate('/projects');await waitText(fixture.title);assert.equal(await evaluate(`document.querySelectorAll('main article a').length`),0);
  projects=[fixture];report.flows.push('project loading, failure, retry, empty state and unsafe/missing URL hiding');
  await navigate('/contact');await click('button[type="submit"]');await waitText('Please enter at least two characters');
  for(const [selector,value] of [['#contact-name','Test Visitor'],['#contact-email','visitor@example.test'],['#contact-message','A test message about a new application.']]) await fill(selector,value);
  contactMode='fail';await click('button[type="submit"]');await waitText('Your message could not be sent');assert.equal(await evaluate(`document.querySelector('#contact-message').value`),'A test message about a new application.');
  contactMode='success';const previous=contacts;await evaluate(`document.querySelector('form').requestSubmit();document.querySelector('form').requestSubmit();`);await waitText('Thank you. Your message has been received');assert.equal(contacts-previous,1);
  report.flows.push('contact field validation, failure preserves text, success, duplicate submission prevention');
  await navigate('/admin');await fill('#admin-email','admin@example.test');await fill('#admin-password','fixture-only');await click('button[type="submit"]');await waitText('Manage projects and contact messages.');
  assert.equal(await evaluate(`!!document.querySelector('footer')`),false);
  await evaluate(`[...document.querySelectorAll('button')].find(b=>b.innerText.includes('New Project')).click()`);await until(()=>evaluate(`!!document.querySelector('dialog[open]')`));
  const fields=await evaluate(`([...document.querySelectorAll('dialog input')].map(e=>({id:e.id,label:e.labels?.[0]?.innerText})))`);
  await fill('#'+CSSescape(fields.find(f=>f.label==='Title').id),'Created from browser');await fill('#project-description','A clear description for the browser test project.');await click('dialog button[type="submit"]');await waitText('Created from browser');assert.equal(writes,1);
  await evaluate(`[...document.querySelectorAll('button')].find(b=>b.innerText.includes('Edit')).click()`);await until(()=>evaluate(`!!document.querySelector('dialog[open]')`));
  await fill('#project-description','Updated description from the browser.');await click('dialog button[type="submit"]');await waitText('Updated description from the browser.');assert.equal(writes,2);
  await evaluate(`[...document.querySelectorAll('button')].find(b=>b.innerText.includes('Delete')).click()`);await until(()=>writes===3);
  await evaluate(`[...document.querySelectorAll('button')].find(b=>b.innerText==='Messages').click()`);await waitText('Browser fixture message');
  unauthorized=true;
  await evaluate(`[...document.querySelectorAll('button')].find(b=>b.innerText.includes('Refresh')).click()`);await waitText('Dashboard Login');assert.equal(await evaluate(`sessionStorage.getItem('portfolio_admin_token')`),null);
  unauthorized=false;
  await fill('#admin-email','admin@example.test');await fill('#admin-password','fixture-only');await click('button[type="submit"]');await waitText('Manage projects and contact messages.');
  await evaluate(`[...document.querySelectorAll('button')].find(b=>b.innerText.includes('Logout')).click()`);await waitText('Dashboard Login');assert.equal(await evaluate(`sessionStorage.getItem('portfolio_admin_token')`),null);
  report.flows.push('admin login, create, edit, delete, inbox, unauthorized-session clearing and logout using isolated API fixtures');
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await navigate('/about');assert.equal(await evaluate(`getComputedStyle(document.querySelector('.animate-reveal')).animationName`),'none');
  report.flows.push('reduced motion preference');
  assert.deepEqual(exceptions,[]);
  await writeFile(path.join(artifacts,reportName),JSON.stringify(report,null,2));
  console.log(`Browser checks passed: ${report.viewports.length} route/viewport combinations; ${report.flows.length} flow groups; no runtime exceptions.`);
} finally {
  if(ws?.readyState===1){try{await cdp('Browser.close');}catch{}ws.close();}
  chrome?.kill();
  server.closeAllConnections();await new Promise(resolve=>server.close(resolve));
}
function CSSescape(value) { return value.replace(/[^a-zA-Z0-9_-]/g,char=>'\\'+char); }
