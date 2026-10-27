import {readFile,readdir,stat} from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
async function walk(p){const files=[];for(const e of await readdir(p,{withFileTypes:true})){const f=path.join(p,e.name);if(e.isDirectory())files.push(...await walk(f));else files.push(f);}return files;}
const files=await walk(root);let links=0;let pages=0;
for(const file of files.filter(f=>f.endsWith('.html'))){const s=await readFile(file,'utf8');pages++;assert.equal((s.match(/<h1[ >]/g)||[]).length,1,`Exactly one H1: ${file}`);assert.match(s,/<html lang="en">/);assert.match(s,/<meta name="description" content="[^"]+">/);assert.match(s,/<title>[^<]+<\/title>/);
 const ids=[...s.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,`Unique IDs: ${file}`);
 for(const match of s.matchAll(/<(?:a|link|script|img)\b[^>]*?\b(?:href|src)="([^"]*)"/g)){
  const href=match[1];if(!href||/^(?:https?:|mailto:|tel:|data:)/.test(href))continue;links++;const url=new URL(href,'https://prototype.test/'+path.relative(root,file));let target=path.join(root,decodeURIComponent(url.pathname));if((await stat(target)).isDirectory())target=path.join(target,'index.html');assert.ok((await stat(target)).isFile(),`${href} exists from ${file}`);
  if(url.hash&&target.endsWith('.html')){const html=await readFile(target,'utf8');assert.ok(html.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),`Fragment ${href} exists from ${file}`);}
 }
 for(const img of s.matchAll(/<img\b[^>]*>/g))assert.match(img[0],/\balt="[^"]*"/,`Image has alt: ${file}`);
}
const css=await readFile(path.join(root,'assets/styles.css'),'utf8');assert.ok(css.includes('prefers-reduced-motion'));assert.ok(css.includes(':focus-visible'));
for(const m of (await readFile(path.join(root,'assets/fonts.css'),'utf8')).matchAll(/url\('([^']+)'\)/g))await stat(path.resolve(root,'assets',m[1]));
const visit=await readFile(path.join(root,'visit/index.html'),'utf8');assert.ok(visit.includes('Nothing has been sent yet.'));assert.ok(visit.includes('name="name"'));assert.ok(visit.includes('name="age"'));
console.log(`PASS: ${pages} pages; ${links} local link, image, script and stylesheet references; fragment targets; unique IDs; titles; descriptions; image alt text; local fonts; reduced motion; focus styles; enquiry safeguards.`);
