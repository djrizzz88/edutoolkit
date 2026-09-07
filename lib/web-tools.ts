// Basic on-page inspection, not a search ranking model.
export function inspectHTML(html:string,url:string){
 const plain=(s:string)=>s.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
 const attr=(tag:string,key:string)=>{const m=tag.match(new RegExp('(?:^|\\s)'+key+'\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\'|([^\\s>]+))','i'));return m?.[1]??m?.[2]??m?.[3]??''};
 const meta=(key:string)=>(html.match(/<meta\b[^>]*>/gi)||[]).map(t=>({name:attr(t,'name').toLowerCase(),content:attr(t,'content')})).find(x=>x.name===key)?.content||'';
 const title=plain(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]||'');
 const description=meta('description');const h1=(html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi)||[]).map(plain);
 const images=html.match(/<img\b[^>]*>/gi)||[];const missingAlt=images.filter(t=>!/(?:\s)alt\s*=/i.test(t)).length;
 const canon=(html.match(/<link\b[^>]*>/gi)||[]).find(t=>attr(t,'rel').toLowerCase().split(/\s+/).includes('canonical'));
 const robots=meta('robots');
 const checks=[
 {name:'Page title',pass:title.length>0&&title.length<=65,detail:title?`${title} (${title.length} characters). Keep it descriptive and concise.`:'Add a descriptive <title> element.'},
 {name:'Meta description',pass:description.length>=50&&description.length<=170,detail:description?`${description} (${description.length} characters).`:'Add a useful meta description summarising this page.'},
 {name:'Primary heading',pass:h1.length===1,detail:`${h1.length} H1 headings found. Use one clear primary heading.`},
 {name:'Image alternative text',pass:missingAlt===0,detail:images.length?`${missingAlt} of ${images.length} images lack an alt attribute. Describe meaningful images; use empty alt for decorative ones.`:'No image tags found in the returned HTML.'},
 {name:'Canonical URL',pass:!!canon&&!!attr(canon,'href'),detail:canon?`Canonical: ${attr(canon,'href')}`:'Add a canonical link to identify the preferred URL.'},
 {name:'Mobile viewport',pass:!!meta('viewport'),detail:meta('viewport')||'Add a viewport meta tag for responsive rendering.'},
 {name:'Indexing directive',pass:!/(?:^|[,\s])noindex(?:$|[,\s])/i.test(robots),detail:robots?`Robots directive: ${robots}. Confirm it matches your intent.`:'No noindex meta directive found. This does not guarantee indexing.'},
 {name:'HTTPS',pass:new URL(url).protocol==='https:',detail:new URL(url).protocol==='https:'?'The final page uses HTTPS.':'Serve your page over HTTPS.'},
 {name:'Document language',pass:!!attr(html.match(/<html\b[^>]*>/i)?.[0]||'','lang'),detail:attr(html.match(/<html\b[^>]*>/i)?.[0]||'','lang')||'Set the document language on the HTML element.'},
 {name:'Social title',pass:/(?:property|name)\s*=\s*["']og:title["']/i.test(html),detail:'An Open Graph title helps control link previews.'}
 ];const passed=checks.filter(x=>x.pass).length;return {url,title,score:Math.round(passed/checks.length*100),passed,checks};
}
export function extractLinks(html:string,url:string){const links=new Set<string>();for(const t of html.match(/<a\b[^>]*>/gi)||[]){const m=t.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);if(!m)continue;try{const u=new URL((m[1]??m[2]??m[3]).replace(/&amp;/g,'&'),url);u.hash='';if(['http:','https:'].includes(u.protocol))links.add(u.href)}catch{}}return [...links];}
