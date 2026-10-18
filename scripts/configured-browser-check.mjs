// Exercise the optional public configuration in a separate ignored build.
import { spawnSync } from 'node:child_process';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const env={...process.env,VITE_API_URL:'',VITE_PORTFOLIO_NAME:'QA & "Safe" <profile>',VITE_PORTFOLIO_ROLE:'Full-Stack Developer',VITE_CONTACT_EMAIL:'hello@example.test',VITE_CONTACT_PHONE:'+1 (555) 123-4567',VITE_CONTACT_LOCATION:'Test location',VITE_SITE_URL:'https://portfolio.example.test',VITE_CV_URL:'/CV.pdf',QA_CONFIGURED:'1',QA_DIST:'artifacts/configured-dist'};
for(const key of ['GITHUB','LINKEDIN','TWITTER','FACEBOOK','INSTAGRAM','WHATSAPP','UPWORK','FIVERR'])env[`VITE_${key}_URL`]=`https://example.test/${key.toLowerCase()}`;
for(const [args,cwd] of [[[path.join(root,'client/node_modules/vite/bin/vite.js'),'build','--outDir',path.join(root,'artifacts/configured-dist')],path.join(root,'client')],[[path.join(root,'scripts/browser-check.mjs')],root]]){
  const result=spawnSync(process.execPath,args,{cwd,env,stdio:'inherit',windowsHide:true});
  if(result.status!==0){process.exitCode=result.status||1;break;}
}
