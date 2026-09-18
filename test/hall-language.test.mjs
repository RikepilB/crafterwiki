import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { translateInterface } from '../web/src/scripts/language.js';
const projects=JSON.parse(readFileSync(new URL('../web/src/data/hall-of-hacks.json',import.meta.url)));
const media=JSON.parse(readFileSync(new URL('../web/src/data/hall-media.json',import.meta.url)));
test('Hall collection keeps 51 unique attributed records with safe original links',()=>{
 assert.equal(projects.length,51); assert.equal(new Set(projects.map(p=>p.sourceUrl)).size,51);
 for(const p of projects){
  assert.match(p.slug,/^[a-z0-9-]+$/);assert.equal(new URL(p.sourceUrl).hostname,'hallofhackss.com');
  for(const lang of ['en','es']){assert.ok(p.summary[lang].length>30);assert.match(p.lesson[lang],/Hall of Hacks/);}
  for(const url of Object.values(p.links))assert.match(url,/^https:\/\//);
  assert.equal('counts_as_winner' in p,false);
 }
});
test('Every Hall preview has local responsive assets tied to its observed source',()=>{
 for(const p of projects){const item=media[p.slug];assert.equal(item.source,p.imageSource);assert.ok(item.variants.length>=1);
 for(const v of item.variants){assert.ok(v.width>0&&v.height>0);assert.ok(existsSync(new URL('../web/public'+v.src,import.meta.url)));}}
});
test('Spanish interface translates dynamic counts and retains names and input-like text',()=>{
 assert.equal(translateInterface('36 results · showing 12'),'36 resultados · mostrando 12');
 assert.equal(translateInterface('Connected Earth Museum'),'Connected Earth Museum');
 assert.equal(translateInterface('My personal idea 123'),'My personal idea 123');
 assert.equal(translateInterface('Builder brief'),'Crear plan');
});
