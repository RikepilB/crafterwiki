// Optimize only publicly observed Hall of Hacks preview URLs; never fetch browser credentials.
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
const require = createRequire(resolve('web/package.json'));
const sharp = require('sharp');
const input = JSON.parse(await readFile(process.argv[2] || 'web/src/data/hall-of-hacks.json', 'utf8'));
const projects = Array.isArray(input) ? input : input.projects;
const output = 'web/public/media/hall';
await mkdir(output, { recursive: true });
const manifest = {};
for (const p of projects) {
  const slug = p.slug || new URL(p.url).pathname.split('/').pop();
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error('Invalid slug');
  const source = new URL(p.imageSource || p.image);
  if (source.protocol !== 'https:' || !['i.ytimg.com', 'd112y698adiu2z.cloudfront.net'].includes(source.hostname)) throw new Error('Unapproved image host');
  try {
    let response;
    for (let attempt=0; attempt<3; attempt++) {
      try { response = await fetch(source, { redirect: 'error', signal: AbortSignal.timeout(20000) }); break; }
      catch(error) { if (attempt === 2) throw error; }
    }
    if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error(`HTTP ${response.status}`);
    const input = Buffer.from(await response.arrayBuffer());
    if (input.length > 5_000_000) throw new Error('Oversized source');
    const meta = await sharp(input).metadata();
    const widths = [...new Set([Math.min(320,meta.width),Math.min(640,meta.width)])];
    const variants=[];
    for (const width of widths) {
      const {data,info}=await sharp(input).resize({width,withoutEnlargement:true}).webp({quality:75,effort:5}).toBuffer({resolveWithObject:true});
      const path=`${output}/${slug}-${width}.webp`;
      await writeFile(path,data);
      variants.push({src:path.replace('web/public',''),width:info.width,height:info.height,bytes:data.length});
    }
    manifest[slug]={source:source.href,sourceBytes:input.length,variants};
  } catch(error) { manifest[slug]={source:source.href,error:error.message,variants:[]}; }
}
await mkdir('web/src/data',{recursive:true});
await writeFile('web/src/data/hall-media.json',JSON.stringify(manifest));
console.log(JSON.stringify({projects:projects.length,optimized:Object.values(manifest).filter(p=>p.variants.length).length,errors:Object.entries(manifest).filter(([,p])=>p.error),originalBytes:Object.values(manifest).reduce((s,p)=>s+(p.sourceBytes||0),0),largestBytes:Object.values(manifest).reduce((s,p)=>s+(p.variants.at(-1)?.bytes||0),0)}));
