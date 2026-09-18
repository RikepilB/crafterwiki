// Broad browsing shelves sit above the controlled domain taxonomy; they do not change corpus facts.
export const referenceTopics = [
  { id:'ai-agents', label:'AI & agents', domains:['ai-security','agent-infrastructure','agentic-payments','data-extraction','identity-provenance'] },
  { id:'health-access', label:'Health & accessibility', domains:['health','accessibility'] },
  { id:'climate-earth', label:'Climate & Earth', domains:['climate-sustainability','earth-observation','agriculture-food'] },
  { id:'space', label:'Space', domains:['space-science','space-operations','connectivity-telecom'] },
  { id:'hardware', label:'Hardware & robotics', domains:['robotics-hardware'] },
  { id:'dev-infra', label:'Developer tools', domains:['dev-tools','cloud-native-infra','security-networking'] },
  { id:'games-media', label:'Games & media', domains:['games-entertainment','creative-media'] },
  { id:'public-social', label:'Public & social impact', domains:['govtech-transparency','legal-access','emergencies-disaster','education','social-connection'] },
  { id:'business-work', label:'Business & work', domains:['fintech','careers-hr','productivity','commerce-retail','marketing-growth','due-diligence-risk','real-estate','simulation-forecasting','memory-journaling'] },
];

const sourceTopic = {
  'ai/ml':'ai-agents', health:'health-access', games:'games-media', 'social good':'public-social',
  'dev tools':'dev-infra', 'ar/vr':'games-media', sustainability:'climate-earth', software:'dev-infra', hardware:'hardware',
};
const topicsFor = (domains=[], category='') => {
  const topics = referenceTopics.filter(topic=>topic.domains.some(domain=>domains.includes(domain))).map(topic=>topic.id);
  if (sourceTopic[category.toLowerCase()]) topics.push(sourceTopic[category.toLowerCase()]);
  return [...new Set(topics)];
};
const editorialLesson = lesson => ({
  en:lesson.en.replace(/^From Hall of Hacks' account:\s*/,'From the editorial source: '),
  es:lesson.es.replace(/^Del relato de Hall of Hacks:\s*/,'Según la fuente editorial: '),
});

// Build a single browsing collection without changing source verification or winner statistics.
export function mergeReferences(corpus, editorial, media, editorialMedia) {
  const safe = value => typeof value === 'string' && /^https?:\/\//.test(value) ? value : null;
  const canonical = value => { try { const u = new URL(value); return u.origin + u.pathname.replace(/\/$/, ''); } catch { return null; } };
  const projects = new Map(corpus.projects.map(p => [p.slug, p]));
  const records = corpus.items.map(item => {
    const project = projects.get(item.slug);
    return {...item, origin:'corpus', roster:!item.analyzed, eventLabel:`${item.event} ${String(item.event).includes(String(item.year)) ? '' : item.year}`.trim(),
      eventId:item.hackathon, url:item.analyzed ? `/projects/${item.slug}/` : `/hackathons/${item.hackathon}/#roster`,
      summary:{en:item.tagline}, lesson:project?.analysis?.lessons?.[0] || '',
      sourceUrl:safe(project?.sources?.[0]?.url) || safe(item.links?.submission),
      links:Object.fromEntries(Object.entries(item.links || {}).filter(([,v])=>safe(v))),
      variants:media[item.slug]?.variants || [], topics:topicsFor(item.domains), editorial:null};
  });
  for (const p of editorial) {
    const duplicate = records.find(r=>canonical(r.links.devpost || r.links.submission) && canonical(r.links.devpost || r.links.submission)===canonical(p.links.devpost));
    if (duplicate) {
      duplicate.editorial={...p,lesson:editorialLesson(p.lesson)};
      duplicate.variants=duplicate.variants.length ? duplicate.variants : (editorialMedia[p.slug]?.variants || []);
      duplicate.links={...p.links,...duplicate.links};
      duplicate.topics=[...new Set([...duplicate.topics,...topicsFor([],p.event.split(' · ')[2] || '')])];
      continue;
    }
    const rawEvent=p.event.split(' · ')[0]+' '+p.event.match(/\b20\d{2}\b/)?.[0];
    const matchingEvent=records.find(r=>r.eventLabel.toLowerCase()===rawEvent.toLowerCase());
    const eventLabel=matchingEvent?.eventLabel || rawEvent;
    records.push({slug:`editorial-${p.slug}`,name:p.name,origin:'editorial',roster:false,analyzed:false,event:eventLabel,eventLabel,eventId:matchingEvent?.eventId || eventLabel,
      year:Number(p.event.match(/\b20\d{2}\b/)?.[0]),status:'reported-winner',reportedAward:p.reportedAward,
      domains:[],mechanisms:[],lenses:[],event_kind:'',summary:p.summary,lesson:editorialLesson(p.lesson),sourceUrl:p.sourceUrl,url:p.sourceUrl,
      links:Object.fromEntries(Object.entries(p.links).filter(([,v])=>safe(v))),variants:editorialMedia[p.slug]?.variants || [],
      topics:topicsFor([],p.event.split(' · ')[2] || ''),editorial:{...p,lesson:editorialLesson(p.lesson)}});
  }
  // Media-backed references lead the gallery; source order is stable within each group.
  return records.sort((a,b)=>Number(b.variants.length>0)-Number(a.variants.length>0));
}
