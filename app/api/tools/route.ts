import {profile,useAllowance} from '@/lib/account';
import {env} from 'cloudflare:workers';
import {safeFetch,readHTML} from '@/lib/safe-fetch';
import {inspectHTML,extractLinks} from '@/lib/web-tools';
const json=(data:any,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function POST(request:Request){try{
 if(Number(request.headers.get('content-length')||0)>8192)return json({error:'Request too large.'},413);
 const raw=await request.text();if(raw.length>8192)return json({error:'Request too large.'},413);const {tool,url,device}=JSON.parse(raw);
 if(typeof url!=='string'||url.length>2048)return json({error:'Enter a valid URL.'},400);
 const config=env as unknown as Record<string,string>;
 if(tool==='screenshot'||tool==='downloader'){
 const base=config[tool==='screenshot'?'SCREENSHOT_API_URL':'DOWNLOADER_API_URL'];const token=config[tool==='screenshot'?'SCREENSHOT_API_TOKEN':'DOWNLOADER_API_TOKEN'];
 if(!base||!token)return json({error:tool==='screenshot'?'Screenshot service is not connected yet. This tool will be available after the VPS service is configured.':'Your downloader API is not connected yet. The downloader will be enabled after your existing service is linked.'},503);
 const target=new URL(base);if(target.protocol!=='https:')return json({error:'The service requires a secure connection.'},503);
 const ip=request.headers.get('cf-connecting-ip');if(!ip)return json({error:'A verified client address is required for this service.'},503);
 const response=await fetch(target,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json','X-Client-IP':ip},body:JSON.stringify({url,device:device==='mobile'?'mobile':'desktop'}),signal:AbortSignal.timeout(55000)});
 const result:any=await response.json();if(!response.ok)return json({error:result.error||result.detail||'The connected service could not complete the request.'},response.status);
 const download=new URL(result.download_url);if(download.protocol!=='https:'||download.username||download.password)return json({error:'The service returned an invalid download link.'},502);
 return json({download_url:download.href,expires_at:result.expires_at||null});
 }
 if(!['seo','links'].includes(tool))return json({error:'Unknown tool.'},400);
 const account=await profile(request); if(!account)return json({error:'Create a free account to run website checks.'},401); await useAllowance(account,'checks');
 const {response,url:finalURL}=await safeFetch(url);const html=await readHTML(response);
 if(tool==='seo')return json(inspectHTML(html,finalURL));
 const links=extractLinks(html,finalURL);const results=[];
 for(let i=0;i<Math.min(links.length,20);i+=4){results.push(...await Promise.all(links.slice(i,Math.min(i+4,20)).map(async link=>{try{let {response:r}=await safeFetch(link,'HEAD');if(r.status===405||r.status===501){await r.body?.cancel();r=(await safeFetch(link)).response}const status=r.status;await r.body?.cancel();return {url:link,status,label:status>=200&&status<400?'Reachable':status===401||status===403?'Access restricted':status===429?'Rate limited':'Review response'}}catch(e:any){return {url:link,status:0,error:e.message}}})));}
 return json({url:finalURL,checked:results.length,total:links.length,scope:'First 20 unique HTTP(S) links on this page. JavaScript-generated links are not included.',links:results});
 }catch(e:any){return json({error:e.name==='TimeoutError'?'The website took too long to respond.':e instanceof SyntaxError?'Invalid request.':e.message||'Unable to process this request.'},400)}}
